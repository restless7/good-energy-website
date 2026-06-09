'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

// ===========================
// SHARED TYPES (re-exported for UI consumption)
// ===========================

export type GoalStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ACHIEVED' | 'AT_RISK'
export type TaskStatus = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface ActionResult<T = undefined> {
  success: boolean
  data?: T
  error?: string
}

export interface CreateGoalInput {
  partnerProfileId: string
  title: string
  description?: string
  targetMetric: string
  targetValue: number
  deadline?: string
  startDate?: string
}

export interface CreateTaskInput {
  partnerProfileId: string
  title: string
  description?: string
  priority?: TaskPriority
  dueDate?: string
  status?: TaskStatus
  goalId?: string
  milestoneId?: string
}

export interface AddMilestoneInput {
  partnerProfileId: string
  goalId?: string
  title: string
  description?: string
  dueDate?: string
}

export interface PartnerProfileWithData {
  id: string
  userId: string
  displayName: string
  bio: string | null
  createdAt: Date
  goals: Array<{
    id: string
    title: string
    description: string | null
    targetMetric: string
    currentProgress: number
    targetValue: number
    status: string
    startDate: Date
    deadline: Date | null
    milestones: Array<{
      id: string
      title: string
      description: string | null
      dueDate: Date | null
      isCompleted: boolean
      completedAt: Date | null
    }>
  }>
  milestones: Array<{
    id: string
    goalId: string | null
    title: string
    description: string | null
    dueDate: Date | null
    isCompleted: boolean
    completedAt: Date | null
  }>
  tasks: Array<{
    id: string
    title: string
    description: string | null
    status: string
    priority: string
    dueDate: Date | null
    goalId: string | null
    milestoneId: string | null
    assignedBy: string
    createdAt: Date
  }>
}

// ===========================
// AUTH GUARDS
// ===========================

async function assertOwner(): Promise<string> {
  const { userId, sessionClaims } = await auth()
  if (!userId) throw new Error('Unauthenticated')
  const role = (sessionClaims?.metadata as Record<string, unknown> | undefined)?.role
  // Owners: SUPER_ADMIN and PARTNER have full admin access
  if (role !== 'SUPER_ADMIN' && role !== 'PARTNER') {
    throw new Error('Forbidden: Owner access required (SUPER_ADMIN or PARTNER).')
  }
  return userId
}

// Legacy alias for backward compatibility
const assertSuperAdmin = assertOwner

async function assertPartnerOrAdmin(): Promise<{ userId: string; role: string }> {
  const { userId, sessionClaims } = await auth()
  if (!userId) throw new Error('Unauthenticated')
  const role = ((sessionClaims?.metadata as Record<string, unknown> | undefined)?.role as string) ?? 'USER'
  if (role !== 'SUPER_ADMIN' && role !== 'PARTNER') throw new Error('Forbidden: PARTNER or SUPER_ADMIN required.')
  return { userId, role }
}

// ===========================
// SUPER ADMIN — READ
// ===========================

export async function getAllPartnerProfilesAction(): Promise<ActionResult<PartnerProfileWithData[]>> {
  try {
    await assertSuperAdmin()

    const profiles = await prisma.partnerProfile.findMany({
      include: {
        goals: { include: { milestones: true } },
        milestones: true,
        tasks: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return { success: true, data: profiles as PartnerProfileWithData[] }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// ===========================
// SUPER ADMIN — CREATE / MUTATE
// ===========================

export async function createPartnerProfileAction(
  userId: string,
  displayName: string,
  bio?: string
): Promise<ActionResult<{ id: string }>> {
  try {
    await assertSuperAdmin()

    const existing = await prisma.partnerProfile.findUnique({ where: { userId } })
    if (existing) return { success: false, error: 'Profile already exists for this user.' }

    const profile = await prisma.partnerProfile.create({
      data: { userId, displayName, bio },
    })

    revalidatePath('/admin/partners')
    return { success: true, data: { id: profile.id } }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function createPartnerGoalAction(input: CreateGoalInput): Promise<ActionResult<{ id: string }>> {
  try {
    await assertSuperAdmin()

    const goal = await prisma.partnerGoal.create({
      data: {
        partnerProfileId: input.partnerProfileId,
        title: input.title,
        description: input.description,
        targetMetric: input.targetMetric,
        targetValue: input.targetValue,
        deadline: input.deadline ? new Date(input.deadline) : undefined,
        startDate: input.startDate ? new Date(input.startDate) : new Date(),
        status: 'NOT_STARTED',
        currentProgress: 0,
      },
    })

    revalidatePath('/admin/partners')
    return { success: true, data: { id: goal.id } }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function createPartnerTaskAction(input: CreateTaskInput): Promise<ActionResult<{ id: string }>> {
  try {
    const actorId = await assertSuperAdmin()

    const task = await prisma.partnerTask.create({
      data: {
        partnerProfileId: input.partnerProfileId,
        title: input.title,
        description: input.description,
        priority: input.priority ?? 'MEDIUM',
        status: input.status ?? 'TODO',
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        assignedBy: actorId,
        goalId: input.goalId,
        milestoneId: input.milestoneId,
      },
    })

    revalidatePath('/admin/partners')
    revalidatePath('/admin/mi-gestion')
    return { success: true, data: { id: task.id } }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function addMilestoneAction(input: AddMilestoneInput): Promise<ActionResult<{ id: string }>> {
  try {
    await assertSuperAdmin()

    const milestone = await prisma.milestone.create({
      data: {
        partnerProfileId: input.partnerProfileId,
        goalId: input.goalId,
        title: input.title,
        description: input.description,
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        isCompleted: false,
      },
    })

    revalidatePath('/admin/partners')
    revalidatePath('/admin/mi-gestion')
    return { success: true, data: { id: milestone.id } }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function deleteOperationalItemAction(
  id: string,
  type: 'goal' | 'task' | 'milestone'
): Promise<ActionResult> {
  try {
    await assertSuperAdmin()

    if (type === 'goal') await prisma.partnerGoal.delete({ where: { id } })
    else if (type === 'task') await prisma.partnerTask.delete({ where: { id } })
    else if (type === 'milestone') await prisma.milestone.delete({ where: { id } })

    revalidatePath('/admin/partners')
    revalidatePath('/admin/mi-gestion')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function updateGoalStatusAction(
  goalId: string,
  status: GoalStatus
): Promise<ActionResult> {
  try {
    await assertSuperAdmin()
    await prisma.partnerGoal.update({ where: { id: goalId }, data: { status } })
    revalidatePath('/admin/partners')
    revalidatePath('/admin/mi-gestion')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// ===========================
// PARTNER ACTIONS (self-service)
// ===========================

export async function getMyPartnerWorkspaceAction(
  overridePartnerId?: string
): Promise<ActionResult<PartnerProfileWithData>> {
  try {
    const { userId, role } = await assertPartnerOrAdmin()

    let profile

    if (role === 'SUPER_ADMIN') {
      const whereClause = overridePartnerId ? { id: overridePartnerId } : { isActive: true }
      profile = await prisma.partnerProfile.findFirst({
        where: whereClause,
        include: {
          goals: { include: { milestones: true } },
          milestones: true,
          tasks: { orderBy: { createdAt: 'desc' } },
        },
        orderBy: { createdAt: 'desc' },
      })
    } else {
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
        select: { id: true },
      })
      if (!user) return { success: false, error: 'User record not found. Ensure webhook sync is complete.' }

      profile = await prisma.partnerProfile.findUnique({
        where: { userId: user.id },
        include: {
          goals: { include: { milestones: true } },
          milestones: true,
          tasks: { orderBy: { createdAt: 'desc' } },
        },
      })

      // Reject demoted partners whose profile has been soft-deactivated
      if (profile && !profile.isActive) {
        return { success: false, error: 'Tu perfil de partner ha sido desactivado. Contacta al administrador.' }
      }
    }

    if (!profile) return { success: false, error: 'No partner profile found.' }

    return { success: true, data: profile as PartnerProfileWithData }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function updateTaskStatusAction(taskId: string, newStatus: TaskStatus, targetPartnerProfileId?: string): Promise<ActionResult> {
  try {
    const { userId, role } = await assertPartnerOrAdmin()

    let effectiveProfileId = targetPartnerProfileId

    if (role !== 'SUPER_ADMIN') {
      const user = await prisma.user.findUnique({ where: { clerkUserId: userId }, select: { id: true } })
      if (!user) return { success: false, error: 'User record not found.' }

      const profile = await prisma.partnerProfile.findUnique({ where: { userId: user.id }, select: { id: true } })
      if (!profile) return { success: false, error: 'Partner profile not found.' }
      
      effectiveProfileId = profile.id
    }

    await prisma.$transaction(async (tx) => {
      const taskCheck = await tx.partnerTask.findUnique({ where: { id: taskId }, select: { partnerProfileId: true } })
      if (!taskCheck) throw new Error('Task not found.')
      
      if (effectiveProfileId && taskCheck.partnerProfileId !== effectiveProfileId) {
        throw new Error('Forbidden: task does not belong to the authorized profile.')
      }

      await tx.partnerTask.update({ where: { id: taskId }, data: { status: newStatus } })

      const task = await tx.partnerTask.findUnique({ where: { id: taskId }, select: { milestoneId: true, goalId: true } })
      
      let actualGoalId = task?.goalId

      // 1. Recalculate Milestone if it belongs to one
      if (task?.milestoneId) {
        const milestoneTasks = await tx.partnerTask.findMany({ where: { milestoneId: task.milestoneId } })
        const allDone = milestoneTasks.length > 0 && milestoneTasks.every(t => t.status === 'DONE')
        const ms = await tx.milestone.update({
          where: { id: task.milestoneId },
          data: { isCompleted: allDone, completedAt: allDone ? new Date() : null },
          select: { goalId: true }
        })
        if (ms.goalId) actualGoalId = ms.goalId
      }

      // 2. Recalculate Goal if it belongs to one
      if (actualGoalId) {
        await recalculateGoalProgress(tx, actualGoalId)
      }
    })

    revalidatePath('/admin/mi-gestion')
    revalidatePath('/admin/partners')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function toggleMilestoneAction(milestoneId: string, isCompleted: boolean, targetPartnerProfileId?: string): Promise<ActionResult> {
  try {
    const { userId, role } = await assertPartnerOrAdmin()

    let effectiveProfileId = targetPartnerProfileId

    if (role !== 'SUPER_ADMIN') {
      const user = await prisma.user.findUnique({ where: { clerkUserId: userId }, select: { id: true } })
      if (!user) return { success: false, error: 'User record not found.' }

      const profile = await prisma.partnerProfile.findUnique({ where: { userId: user.id }, select: { id: true } })
      if (!profile) return { success: false, error: 'Partner profile not found.' }
      
      effectiveProfileId = profile.id
    }

    await prisma.$transaction(async (tx) => {
      const msCheck = await tx.milestone.findUnique({ where: { id: milestoneId }, select: { partnerProfileId: true } })
      if (!msCheck) throw new Error('Milestone not found.')
      
      if (effectiveProfileId && msCheck.partnerProfileId !== effectiveProfileId) {
        throw new Error('Forbidden: milestone does not belong to the authorized profile.')
      }

      const ms = await tx.milestone.update({
        where: { id: milestoneId },
        data: {
          isCompleted,
          completedAt: isCompleted ? new Date() : null,
        },
      })

      if (ms.goalId) {
        await recalculateGoalProgress(tx, ms.goalId)
      }
    })

    revalidatePath('/admin/mi-gestion')
    revalidatePath('/admin/partners')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function updateGoalProgressAction(goalId: string, newProgress: number, targetPartnerProfileId?: string): Promise<ActionResult> {
  try {
    const { userId, role } = await assertPartnerOrAdmin()

    let effectiveProfileId = targetPartnerProfileId

    if (role !== 'SUPER_ADMIN') {
      const user = await prisma.user.findUnique({ where: { clerkUserId: userId }, select: { id: true } })
      if (!user) return { success: false, error: 'User record not found.' }

      const profile = await prisma.partnerProfile.findUnique({ where: { userId: user.id }, select: { id: true } })
      if (!profile) return { success: false, error: 'Partner profile not found.' }

      effectiveProfileId = profile.id
    }

    const goal = await prisma.partnerGoal.findUnique({ where: { id: goalId }, select: { partnerProfileId: true, targetValue: true, deadline: true } })
    if (!goal) return { success: false, error: 'Goal not found.' }
    
    if (effectiveProfileId && goal.partnerProfileId !== effectiveProfileId) {
      return { success: false, error: 'Forbidden: goal does not belong to the authorized profile.' }
    }

    const clampedProgress = Math.max(0, Math.min(newProgress, goal.targetValue))
    let newStatus: GoalStatus = clampedProgress >= goal.targetValue
      ? 'ACHIEVED'
      : clampedProgress > 0
      ? 'IN_PROGRESS'
      : 'NOT_STARTED'

    if (newStatus !== 'ACHIEVED' && goal.deadline && new Date() > goal.deadline) {
      newStatus = 'AT_RISK'
    }

    await prisma.partnerGoal.update({
      where: { id: goalId },
      data: { currentProgress: clampedProgress, status: newStatus },
    })

    revalidatePath('/admin/mi-gestion')
    revalidatePath('/admin/partners')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// Helper for automated calculation
async function recalculateGoalProgress(tx: any, goalId: string) {
  const goal = await tx.partnerGoal.findUnique({
    where: { id: goalId },
    include: {
      tasks: true,
      milestones: { include: { tasks: true } }
    }
  })
  if (!goal) return

  // Gather all direct tasks and milestone tasks
  const allTasks = [...goal.tasks, ...goal.milestones.flatMap((m: any) => m.tasks)]
  
  let currentProgress = 0
  
  if (allTasks.length > 0) {
    const doneTasks = allTasks.filter(t => t.status === 'DONE').length
    currentProgress = (doneTasks / allTasks.length) * goal.targetValue
  } else if (goal.milestones.length > 0) {
    const completedMs = goal.milestones.filter((m: any) => m.isCompleted).length
    currentProgress = (completedMs / goal.milestones.length) * goal.targetValue
  } else {
    return // No automated items to calculate from
  }

  let newStatus: GoalStatus = currentProgress >= goal.targetValue ? 'ACHIEVED' : currentProgress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED'
  if (newStatus !== 'ACHIEVED' && goal.deadline && new Date() > goal.deadline) {
    newStatus = 'AT_RISK'
  }

  await tx.partnerGoal.update({
    where: { id: goalId },
    data: { currentProgress, status: newStatus }
  })
}
