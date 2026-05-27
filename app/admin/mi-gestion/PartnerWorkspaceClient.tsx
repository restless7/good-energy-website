'use client'

import { useState, useTransition, useOptimistic } from 'react'
import { toast } from 'sonner'
import {
  Target,
  CheckSquare,
  Flag,
  Calendar,
  ChevronDown,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  Loader2,
  Milestone as MilestoneIcon,
  BarChart3,
} from 'lucide-react'
import type { PartnerProfileWithData, GoalStatus, TaskStatus } from '@/app/admin/partners/actions'
import {
  updateTaskStatusAction,
  toggleMilestoneAction,
  updateGoalProgressAction,
} from '@/app/admin/partners/actions'

// ===========================
// STYLE MAPS
// ===========================

const GOAL_STATUS_STYLES: Record<GoalStatus, { badge: string; label: string; icon: React.ReactNode }> = {
  NOT_STARTED: {
    badge: 'bg-[#8CB4BC]/10 text-[#8CB4BC] border border-[#8CB4BC]/20',
    label: 'Sin iniciar',
    icon: <Clock className="w-3 h-3" />,
  },
  IN_PROGRESS: {
    badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    label: 'En progreso',
    icon: <TrendingUp className="w-3 h-3" />,
  },
  ACHIEVED: {
    badge: 'bg-[#D8DA00]/10 text-[#D8DA00] border border-[#D8DA00]/20',
    label: 'Logrado',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  AT_RISK: {
    badge: 'bg-red-500/10 text-red-400 border border-red-500/20',
    label: 'En riesgo',
    icon: <AlertTriangle className="w-3 h-3" />,
  },
}

const TASK_STATUS_STYLES: Record<TaskStatus, { badge: string; label: string; color: string }> = {
  BACKLOG: { badge: 'bg-[#8CB4BC]/10 text-[#8CB4BC] border border-[#8CB4BC]/20', label: 'Backlog', color: 'text-[#8CB4BC]' },
  TODO: { badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', label: 'Por hacer', color: 'text-blue-400' },
  IN_PROGRESS: { badge: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20', label: 'En progreso', color: 'text-yellow-400' },
  REVIEW: { badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/20', label: 'En revisión', color: 'text-purple-400' },
  DONE: { badge: 'bg-[#D8DA00]/10 text-[#D8DA00] border border-[#D8DA00]/20', label: 'Completado', color: 'text-[#D8DA00]' },
}

const PRIORITY_MAP: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Baja', color: 'text-[#8CB4BC]' },
  MEDIUM: { label: 'Media', color: 'text-blue-400' },
  HIGH: { label: 'Alta', color: 'text-yellow-400' },
  CRITICAL: { label: 'Crítica', color: 'text-red-400' },
}

const TASK_STATUSES: TaskStatus[] = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']

// ===========================
// SUB-COMPONENTS
// ===========================

function ProgressBar({ value, max, showLabel = false }: { value: number; max: number; showLabel?: boolean }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const color =
    pct >= 100 ? 'bg-[#D8DA00]' : pct >= 60 ? 'bg-blue-400' : pct >= 30 ? 'bg-yellow-400' : 'bg-red-400'
  return (
    <div className="space-y-1">
      <div className="w-full bg-[#0A3A43] rounded-full h-2 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-[#8CB4BC]/60">
          <span>{value.toLocaleString('es-CO')}</span>
          <span className="font-medium text-[#FFFDF0]">{pct.toFixed(1)}%</span>
          <span>{max.toLocaleString('es-CO')}</span>
        </div>
      )}
    </div>
  )
}

function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/40 p-5 ${className}`}>
      {children}
    </div>
  )
}

// ===========================
// TASK STATUS DROPDOWN
// ===========================

interface TaskStatusDropdownProps {
  taskId: string
  currentStatus: TaskStatus
  onUpdate: (taskId: string, newStatus: TaskStatus) => void
}

function TaskStatusDropdown({ taskId, currentStatus, onUpdate }: TaskStatusDropdownProps) {
  const [open, setOpen] = useState(false)
  const [isPending, start] = useTransition()

  function select(newStatus: TaskStatus) {
    if (newStatus === currentStatus) { setOpen(false); return }
    setOpen(false)
    const toastId = toast.loading(`Moviendo a "${TASK_STATUS_STYLES[newStatus].label}"…`)
    start(async () => {
      const r = await updateTaskStatusAction(taskId, newStatus)
      if (r.success) {
        toast.success(
          newStatus === 'DONE'
            ? '¡Tarea completada! 🎉'
            : `Tarea movida a "${TASK_STATUS_STYLES[newStatus].label}"`,
          { id: toastId }
        )
        onUpdate(taskId, newStatus)
      } else {
        toast.error(r.error ?? 'Error al actualizar estado', { id: toastId })
      }
    })
  }

  const style = TASK_STATUS_STYLES[currentStatus]

  return (
    <div className="relative">
      <button
        onClick={() => !isPending && setOpen((o) => !o)}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${style.badge} ${isPending ? 'opacity-60 cursor-wait' : 'cursor-pointer hover:opacity-80'}`}
      >
        {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
        {style.label}
        {!isPending && <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-20 w-40 rounded-xl bg-[#0A3A43] border border-[#1A6B78]/60 shadow-2xl py-1 overflow-hidden">
            {TASK_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => select(s)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors
                  ${s === currentStatus ? 'bg-[#D8DA00]/5 text-[#FFFDF0]' : 'text-[#8CB4BC] hover:bg-[#0E4D58] hover:text-[#FFFDF0]'}`}
              >
                <span>{TASK_STATUS_STYLES[s].label}</span>
                {s === currentStatus && <CheckCircle2 className="w-3 h-3 text-[#D8DA00]" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ===========================
// GOAL PROGRESS INPUT
// ===========================

function GoalProgressInput({
  goalId,
  currentProgress,
  targetValue,
  onUpdate,
}: {
  goalId: string
  currentProgress: number
  targetValue: number
  onUpdate: (goalId: string, newProgress: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(String(currentProgress))
  const [isPending, start] = useTransition()

  function submit() {
    const num = parseFloat(value)
    if (isNaN(num) || num < 0) { toast.error('Ingresa un valor válido'); return }
    setEditing(false)
    const toastId = toast.loading('Actualizando progreso…')
    start(async () => {
      const r = await updateGoalProgressAction(goalId, num)
      if (r.success) {
        const pct = Math.min(100, (num / targetValue) * 100)
        toast.success(
          pct >= 100 ? '¡Objetivo alcanzado! 🎯' : `Progreso actualizado a ${pct.toFixed(1)}%`,
          { id: toastId }
        )
        onUpdate(goalId, num)
      } else {
        toast.error(r.error ?? 'Error al actualizar', { id: toastId })
      }
    })
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') setEditing(false) }}
          autoFocus
          className="w-32 px-2 py-1 bg-[#0A3A43] border border-[#D8DA00]/40 rounded-lg text-xs text-[#FFFDF0] focus:outline-none"
        />
        <button onClick={submit} disabled={isPending} className="px-2 py-1 bg-[#D8DA00] text-[#0D4651] text-xs font-semibold rounded-lg hover:bg-[#D8DA00]/90 disabled:opacity-60 flex items-center gap-1">
          {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
          OK
        </button>
        <button onClick={() => setEditing(false)} className="text-xs text-[#8CB4BC] hover:text-[#FFFDF0]">✕</button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="text-xs text-[#8CB4BC]/60 hover:text-[#D8DA00] transition-colors underline underline-offset-2"
    >
      Actualizar progreso
    </button>
  )
}

// ===========================
// MILESTONE TOGGLE
// ===========================

function MilestoneRow({
  milestone,
  onToggle,
}: {
  milestone: PartnerProfileWithData['milestones'][0]
  onToggle: (id: string, val: boolean) => void
}) {
  const [isPending, start] = useTransition()
  const [optimisticDone, setOptimisticDone] = useOptimistic(milestone.isCompleted)

  function toggle() {
    const next = !optimisticDone
    setOptimisticDone(next)
    const toastId = toast.loading(next ? 'Completando hito…' : 'Desmarcando hito…')
    start(async () => {
      const r = await toggleMilestoneAction(milestone.id, next)
      if (r.success) {
        toast.success(next ? '¡Hito completado! 🎉' : 'Hito desmarcado', { id: toastId })
        onToggle(milestone.id, next)
      } else {
        toast.error(r.error ?? 'Error', { id: toastId })
        setOptimisticDone(!next)
      }
    })
  }

  const isOverdue = milestone.dueDate && !milestone.isCompleted && new Date(milestone.dueDate) < new Date()

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl transition-colors ${optimisticDone ? 'bg-[#D8DA00]/5' : 'bg-[#0A3A43]/40'}`}
    >
      <button
        onClick={toggle}
        disabled={isPending}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          optimisticDone
            ? 'bg-[#D8DA00] border-[#D8DA00]'
            : 'border-[#1A6B78] hover:border-[#D8DA00]/60'
        } ${isPending ? 'opacity-60 cursor-wait' : 'cursor-pointer'}`}
      >
        {optimisticDone && <CheckCircle2 className="w-3 h-3 text-[#0D4651]" />}
        {isPending && <Loader2 className="w-3 h-3 animate-spin text-[#8CB4BC]" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-tight ${optimisticDone ? 'line-through text-[#8CB4BC]/50' : 'text-[#FFFDF0]'}`}>
          {milestone.title}
        </p>
        {milestone.description && (
          <p className="text-xs text-[#8CB4BC]/60 mt-0.5">{milestone.description}</p>
        )}
      </div>

      {milestone.dueDate && (
        <p className={`text-xs flex-shrink-0 flex items-center gap-1 ${isOverdue ? 'text-red-400' : 'text-[#8CB4BC]/50'}`}>
          <Calendar className="w-3 h-3" />
          {new Date(milestone.dueDate).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
        </p>
      )}
    </div>
  )
}

// ===========================
// TASK CARD (Kanban-style)
// ===========================

function TaskCard({
  task,
  onStatusUpdate,
}: {
  task: PartnerProfileWithData['tasks'][0]
  onStatusUpdate: (taskId: string, newStatus: TaskStatus) => void
}) {
  const priority = PRIORITY_MAP[task.priority] ?? PRIORITY_MAP.MEDIUM
  const isOverdue = task.dueDate && task.status !== 'DONE' && new Date(task.dueDate) < new Date()

  return (
    <div className={`bg-[#0A3A43]/60 rounded-xl p-4 space-y-3 border ${task.status === 'DONE' ? 'border-[#D8DA00]/10 opacity-70' : 'border-[#1A6B78]/30'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Flag className={`w-3.5 h-3.5 flex-shrink-0 ${priority.color}`} />
            <span className={`text-xs font-medium ${priority.color}`}>{priority.label}</span>
          </div>
          <p className={`text-sm font-medium text-[#FFFDF0] leading-tight ${task.status === 'DONE' ? 'line-through opacity-60' : ''}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-[#8CB4BC]/60 mt-1 leading-relaxed">{task.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <TaskStatusDropdown
          taskId={task.id}
          currentStatus={task.status as TaskStatus}
          onUpdate={onStatusUpdate}
        />
        {task.dueDate && (
          <p className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-400' : 'text-[#8CB4BC]/50'}`}>
            <Calendar className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
          </p>
        )}
      </div>
    </div>
  )
}

// ===========================
// MAIN COMPONENT
// ===========================

interface Props {
  profile: PartnerProfileWithData
  currentUserId: string
  isSuperAdmin: boolean
}

export default function PartnerWorkspaceClient({ profile, isSuperAdmin }: Props) {
  const [tasks, setTasks] = useState(profile.tasks)
  const [goals, setGoals] = useState(profile.goals)
  const [milestones, setMilestones] = useState(profile.milestones)
  const [taskFilter, setTaskFilter] = useState<TaskStatus | 'ALL'>('ALL')

  function handleTaskUpdate(taskId: string, newStatus: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
  }

  function handleMilestoneToggle(milestoneId: string, isCompleted: boolean) {
    setMilestones((prev) => prev.map((m) => m.id === milestoneId ? { ...m, isCompleted, completedAt: isCompleted ? new Date() : null } : m))
  }

  function handleProgressUpdate(goalId: string, newProgress: number) {
    setGoals((prev) => prev.map((g) => {
      if (g.id !== goalId) return g
      const newStatus: GoalStatus = newProgress >= g.targetValue ? 'ACHIEVED' : newProgress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED'
      return { ...g, currentProgress: newProgress, status: newStatus }
    }))
  }

  const filteredTasks = taskFilter === 'ALL' ? tasks : tasks.filter((t) => t.status === taskFilter)

  const totalGoals = goals.length
  const achievedGoals = goals.filter((g) => g.status === 'ACHIEVED').length
  const totalTasks = tasks.length
  const doneTasks = tasks.filter((t) => t.status === 'DONE').length
  const completedMilestones = milestones.filter((m) => m.isCompleted).length
  const openMilestones = milestones.filter((m) => !m.isCompleted)
  const completedMilestonesList = milestones.filter((m) => m.isCompleted)

  const TASK_STATUS_LIST: TaskStatus[] = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#FFFDF0]">Mi Gestión Operativa</h1>
          <p className="text-sm text-[#8CB4BC] mt-0.5">
            {profile.displayName}
            {isSuperAdmin && <span className="ml-2 text-xs px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full">Vista Super Admin</span>}
          </p>
        </div>
        <div className="flex gap-3 text-center">
          <div className="px-4 py-2 bg-[#0E4D58] rounded-xl border border-[#1A6B78]/30">
            <p className="text-lg font-bold text-[#D8DA00]">{achievedGoals}/{totalGoals}</p>
            <p className="text-xs text-[#8CB4BC]">Objetivos</p>
          </div>
          <div className="px-4 py-2 bg-[#0E4D58] rounded-xl border border-[#1A6B78]/30">
            <p className="text-lg font-bold text-blue-400">{doneTasks}/{totalTasks}</p>
            <p className="text-xs text-[#8CB4BC]">Tareas</p>
          </div>
          <div className="px-4 py-2 bg-[#0E4D58] rounded-xl border border-[#1A6B78]/30">
            <p className="text-lg font-bold text-[#8CB4BC]">{completedMilestones}/{milestones.length}</p>
            <p className="text-xs text-[#8CB4BC]">Hitos</p>
          </div>
        </div>
      </div>

      {/* ── Goals ── */}
      <SectionCard>
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-[#D8DA00]/10 flex items-center justify-center">
            <Target className="w-4 h-4 text-[#D8DA00]" />
          </div>
          <h2 className="text-base font-semibold text-[#FFFDF0]">Mis Objetivos</h2>
          <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-[#1A6B78]/30 text-[#8CB4BC]">{goals.length}</span>
        </div>

        {goals.length === 0 ? (
          <p className="text-sm text-[#8CB4BC]/50 italic text-center py-6">Sin objetivos asignados aún</p>
        ) : (
          <div className="space-y-5">
            {goals.map((goal) => {
              const st = goal.status as GoalStatus
              const style = GOAL_STATUS_STYLES[st] ?? GOAL_STATUS_STYLES.NOT_STARTED
              const pct = goal.targetValue > 0 ? Math.min(100, (goal.currentProgress / goal.targetValue) * 100) : 0
              const goalMilestones = milestones.filter((m) => m.goalId === goal.id)

              return (
                <div key={goal.id} className="bg-[#0A3A43]/60 rounded-xl p-4 space-y-4 border border-[#1A6B78]/20">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.badge}`}>
                          {style.icon} {style.label}
                        </span>
                        <span className="text-xs text-[#8CB4BC]/60">{goal.targetMetric}</span>
                      </div>
                      <p className="text-sm font-semibold text-[#FFFDF0]">{goal.title}</p>
                      {goal.description && (
                        <p className="text-xs text-[#8CB4BC]/70 mt-0.5 leading-relaxed">{goal.description}</p>
                      )}
                    </div>
                    {goal.deadline && (
                      <p className="text-xs text-[#8CB4BC]/50 flex items-center gap-1 flex-shrink-0">
                        <Calendar className="w-3 h-3" />
                        {new Date(goal.deadline).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <ProgressBar value={goal.currentProgress} max={goal.targetValue} showLabel />
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-bold ${pct >= 100 ? 'text-[#D8DA00]' : 'text-blue-400'}`}>
                        {pct.toFixed(1)}%
                      </span>
                      <GoalProgressInput
                        goalId={goal.id}
                        currentProgress={goal.currentProgress}
                        targetValue={goal.targetValue}
                        onUpdate={handleProgressUpdate}
                      />
                    </div>
                  </div>

                  {goalMilestones.length > 0 && (
                    <div className="pt-2 border-t border-[#1A6B78]/20 space-y-1.5">
                      <p className="text-xs font-medium text-[#8CB4BC] mb-2">Hitos de este objetivo</p>
                      {goalMilestones.map((ms) => (
                        <MilestoneRow key={ms.id} milestone={ms} onToggle={handleMilestoneToggle} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </SectionCard>

      {/* ── Milestones (standalone, not linked to a goal) ── */}
      {milestones.some((m) => !m.goalId) && (
        <SectionCard>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#1A6B78]/30 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#8CB4BC]" />
            </div>
            <h2 className="text-base font-semibold text-[#FFFDF0]">Hitos Generales</h2>
          </div>

          <div className="space-y-1.5">
            {openMilestones.filter((m) => !m.goalId).map((ms) => (
              <MilestoneRow key={ms.id} milestone={ms} onToggle={handleMilestoneToggle} />
            ))}
            {completedMilestonesList.filter((m) => !m.goalId).map((ms) => (
              <MilestoneRow key={ms.id} milestone={ms} onToggle={handleMilestoneToggle} />
            ))}
          </div>
        </SectionCard>
      )}

      {/* ── Tasks ── */}
      <SectionCard>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-base font-semibold text-[#FFFDF0]">Mis Tareas</h2>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-[#1A6B78]/30 text-[#8CB4BC]">{tasks.length}</span>
          </div>

          {/* Status filter pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setTaskFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${taskFilter === 'ALL' ? 'bg-[#D8DA00] text-[#0D4651]' : 'bg-[#0A3A43] text-[#8CB4BC] hover:text-[#FFFDF0]'}`}
            >
              Todas
            </button>
            {TASK_STATUS_LIST.map((s) => (
              <button
                key={s}
                onClick={() => setTaskFilter(s)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${taskFilter === s ? 'bg-[#D8DA00] text-[#0D4651]' : 'bg-[#0A3A43] text-[#8CB4BC] hover:text-[#FFFDF0]'}`}
              >
                {TASK_STATUS_STYLES[s].label}
              </button>
            ))}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <CheckSquare className="w-10 h-10 text-[#1A6B78] mb-2" />
            <p className="text-sm text-[#8CB4BC]">
              {taskFilter === 'ALL' ? 'Sin tareas asignadas aún' : `Sin tareas en "${TASK_STATUS_STYLES[taskFilter].label}"`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} onStatusUpdate={handleTaskUpdate} />
            ))}
          </div>
        )}

        {/* Progress bar across all tasks */}
        {totalTasks > 0 && (
          <div className="mt-5 pt-4 border-t border-[#1A6B78]/20 space-y-1.5">
            <div className="flex justify-between text-xs text-[#8CB4BC]">
              <span>Progreso general</span>
              <span>{doneTasks} de {totalTasks} completadas</span>
            </div>
            <ProgressBar value={doneTasks} max={totalTasks} />
          </div>
        )}
      </SectionCard>
    </div>
  )
}
