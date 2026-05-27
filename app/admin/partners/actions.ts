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
    assignedBy: string
    createdAt: Date
  }>
}

// ===========================
// AUTH GUARDS
// ===========================

async function assertSuperAdmin(): Promise<string> {
  const { userId, sessionClaims } = await auth()
  if (!userId) throw new Error('Unauthenticated')
  const role = (sessionClaims?.metadata as Record<string, unknown> | undefined)?.role
  if (role !== 'SUPER_ADMIN') throw new Error('Forbidden: SUPER_ADMIN required.')
  return userId
}

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

export async function getMyPartnerWorkspaceAction(): Promise<ActionResult<PartnerProfileWithData>> {
  try {
    const { userId, role } = await assertPartnerOrAdmin()

    let profile

    if (role === 'SUPER_ADMIN') {
      // Super admins preview the first *active* profile for the workspace view
      profile = await prisma.partnerProfile.findFirst({
        where: { isActive: true },
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

export async function updateTaskStatusAction(taskId: string, newStatus: TaskStatus): Promise<ActionResult> {
  try {
    const { userId, role } = await assertPartnerOrAdmin()

    if (role !== 'SUPER_ADMIN') {
      const user = await prisma.user.findUnique({ where: { clerkUserId: userId }, select: { id: true } })
      if (!user) return { success: false, error: 'User record not found.' }

      const profile = await prisma.partnerProfile.findUnique({ where: { userId: user.id }, select: { id: true } })
      if (!profile) return { success: false, error: 'Partner profile not found.' }

      const task = await prisma.partnerTask.findUnique({ where: { id: taskId }, select: { partnerProfileId: true } })
      if (!task || task.partnerProfileId !== profile.id) {
        return { success: false, error: 'Forbidden: task does not belong to your profile.' }
      }
    }

    await prisma.partnerTask.update({ where: { id: taskId }, data: { status: newStatus } })

    revalidatePath('/admin/mi-gestion')
    revalidatePath('/admin/partners')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function toggleMilestoneAction(milestoneId: string, isCompleted: boolean): Promise<ActionResult> {
  try {
    const { userId, role } = await assertPartnerOrAdmin()

    if (role !== 'SUPER_ADMIN') {
      const user = await prisma.user.findUnique({ where: { clerkUserId: userId }, select: { id: true } })
      if (!user) return { success: false, error: 'User record not found.' }

      const profile = await prisma.partnerProfile.findUnique({ where: { userId: user.id }, select: { id: true } })
      if (!profile) return { success: false, error: 'Partner profile not found.' }

      const ms = await prisma.milestone.findUnique({ where: { id: milestoneId }, select: { partnerProfileId: true } })
      if (!ms || ms.partnerProfileId !== profile.id) {
        return { success: false, error: 'Forbidden: milestone does not belong to your profile.' }
      }
    }

    await prisma.milestone.update({
      where: { id: milestoneId },
      data: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
    })

    revalidatePath('/admin/mi-gestion')
    revalidatePath('/admin/partners')
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

export async function updateGoalProgressAction(goalId: string, newProgress: number): Promise<ActionResult> {
  try {
    const { userId, role } = await assertPartnerOrAdmin()

    let goalOwnerId: string | undefined

    if (role !== 'SUPER_ADMIN') {
      const user = await prisma.user.findUnique({ where: { clerkUserId: userId }, select: { id: true } })
      if (!user) return { success: false, error: 'User record not found.' }

      const profile = await prisma.partnerProfile.findUnique({ where: { userId: user.id }, select: { id: true } })
      if (!profile) return { success: false, error: 'Partner profile not found.' }

      goalOwnerId = profile.id
    }

    const goal = await prisma.partnerGoal.findUnique({ where: { id: goalId }, select: { partnerProfileId: true, targetValue: true } })
    if (!goal) return { success: false, error: 'Goal not found.' }
    if (goalOwnerId && goal.partnerProfileId !== goalOwnerId) {
      return { success: false, error: 'Forbidden: goal does not belong to your profile.' }
    }

    const clampedProgress = Math.max(0, Math.min(newProgress, goal.targetValue))
    const newStatus: GoalStatus = clampedProgress >= goal.targetValue
      ? 'ACHIEVED'
      : clampedProgress > 0
      ? 'IN_PROGRESS'
      : 'NOT_STARTED'

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
