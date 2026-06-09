'use client'

import { useState, useTransition, useOptimistic, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
          {(task.goalId || task.milestoneId) && (
            <div className="mt-2 flex flex-wrap gap-1">
              {task.goalId && <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-[#1A6B78]/20 text-[#8CB4BC]"><Target className="w-2.5 h-2.5"/> Vinculado a objetivo</span>}
              {task.milestoneId && <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400"><BarChart3 className="w-2.5 h-2.5"/> Vinculado a hito</span>}
            </div>
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
  activePartners?: { id: string; name: string }[]
}

export default function PartnerWorkspaceClient({ profile, isSuperAdmin, activePartners = [] }: Props) {
  const router = useRouter()
  const [tasks, setTasks] = useState(profile.tasks)
  const [goals, setGoals] = useState(profile.goals)
  const [milestones, setMilestones] = useState(profile.milestones)
  const [taskFilter, setTaskFilter] = useState<TaskStatus | 'ALL'>('ALL')
  const [tab, setTab] = useState<'overview' | 'timeline'>('overview')

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
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-sm text-[#8CB4BC]">
              {profile.displayName}
            </p>
            {isSuperAdmin && (
              <>
                <span className="ml-1 text-xs px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full">Vista Super Admin</span>
                <select
                  value={profile.id}
                  onChange={(e) => router.push(`/admin/mi-gestion?partnerId=${e.target.value}`)}
                  className="ml-2 px-2 py-1 bg-[#0A3A43] border border-[#1A6B78]/50 rounded-lg text-xs text-[#8CB4BC] focus:outline-none cursor-pointer"
                >
                  {activePartners.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-3 text-center">
          <div className="px-4 py-2 bg-[#0E4D58] rounded-xl border border-[#1A6B78]/30">
            <p className="text-lg font-bold text-[#D8DA00]">{totalGoals > 0 ? `${achievedGoals}/${totalGoals}` : '0'}</p>
            <p className="text-xs text-[#8CB4BC]">{totalGoals > 0 ? 'Objetivos' : 'Asignados'}</p>
          </div>
          <div className="px-4 py-2 bg-[#0E4D58] rounded-xl border border-[#1A6B78]/30">
            <p className="text-lg font-bold text-blue-400">{totalTasks > 0 ? `${doneTasks}/${totalTasks}` : '0'}</p>
            <p className="text-xs text-[#8CB4BC]">{totalTasks > 0 ? 'Tareas' : 'Asignados'}</p>
          </div>
          <div className="px-4 py-2 bg-[#0E4D58] rounded-xl border border-[#1A6B78]/30">
            <p className="text-lg font-bold text-[#8CB4BC]">{milestones.length > 0 ? `${completedMilestones}/${milestones.length}` : '0'}</p>
            <p className="text-xs text-[#8CB4BC]">{milestones.length > 0 ? 'Hitos' : 'Asignados'}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 bg-[#0A3A43]/60 p-1 rounded-xl w-fit">
        {(['overview', 'timeline'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-[#D8DA00] text-[#0D4651]' : 'text-[#8CB4BC] hover:text-[#FFFDF0]'}`}>
            {t === 'overview' ? 'Resumen' : 'Línea de Tiempo'}
          </button>
        ))}
      </div>

      {tab === 'timeline' && (
        <SectionCard>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#D8DA00]/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#D8DA00]" />
            </div>
            <h2 className="text-base font-semibold text-[#FFFDF0]">Línea de Tiempo Operativa</h2>
          </div>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#1A6B78]/50 before:to-transparent">
            {(() => {
              type TimelineItem = { id: string; type: 'goal' | 'milestone' | 'task'; date: Date; title: string; subtitle: string; status: string; completed: boolean }
              
              const timelineItems: TimelineItem[] = []
              
              goals.forEach(g => {
                if (g.deadline) {
                  timelineItems.push({ id: `goal-${g.id}`, type: 'goal', date: new Date(g.deadline), title: g.title, subtitle: `Objetivo: ${g.targetMetric}`, status: g.status, completed: g.status === 'ACHIEVED' })
                }
              })
              
              milestones.forEach(m => {
                if (m.dueDate) {
                  timelineItems.push({ id: `ms-${m.id}`, type: 'milestone', date: new Date(m.dueDate), title: m.title, subtitle: m.goalId ? `Hito vinculado` : 'Hito general', status: m.isCompleted ? 'Completado' : 'Pendiente', completed: m.isCompleted })
                }
              })
              
              tasks.forEach(t => {
                if (t.dueDate) {
                  timelineItems.push({ id: `task-${t.id}`, type: 'task', date: new Date(t.dueDate), title: t.title, subtitle: `Tarea: ${PRIORITY_MAP[t.priority]?.label}`, status: TASK_STATUS_STYLES[t.status as TaskStatus]?.label || '', completed: t.status === 'DONE' })
                }
              })

              timelineItems.sort((a, b) => a.date.getTime() - b.date.getTime())

              if (timelineItems.length === 0) {
                return (
                  <div className="flex flex-col items-center py-8 text-center relative z-10">
                    <p className="text-[#8CB4BC]">No hay elementos con fecha límite para mostrar.</p>
                  </div>
                )
              }

              return timelineItems.map((item) => (
                <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center rounded-full shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${
                    item.type === 'goal' ? 'w-12 h-12 border-4 border-[#D8DA00]/30 bg-[#0A3A43] text-[#D8DA00] shadow-[0_0_15px_rgba(216,218,0,0.3)]' :
                    item.type === 'milestone' ? 'w-10 h-10 border-4 border-blue-500/30 bg-blue-500/10 text-blue-400' :
                    'w-6 h-6 border-[3px] border-[#1A6B78] bg-[#0E4D58] text-[#8CB4BC]'
                  }`}>
                    {item.type === 'goal' && <Target className="w-5 h-5" />}
                    {item.type === 'milestone' && <MilestoneIcon className="w-4 h-4" />}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#0A3A43]/50 p-4 rounded-xl border border-[#1A6B78]/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#8CB4BC] tracking-wide uppercase">
                        {item.date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.completed ? 'bg-[#D8DA00]/10 text-[#D8DA00]' : 'bg-[#1A6B78]/20 text-[#8CB4BC]'}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-[#FFFDF0]">{item.title}</p>
                    <p className="text-xs text-[#8CB4BC]/70 mt-1">{item.subtitle}</p>
                  </div>
                </div>
              ))
            })()}
          </div>
        </SectionCard>
      )}

      {tab === 'overview' && (
        <div className="space-y-6">
          {goals.length === 0 && milestones.length === 0 && tasks.length === 0 ? (
            <SectionCard className="py-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#1A6B78]/20 flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-[#8CB4BC]" />
              </div>
              {isSuperAdmin ? (
                <>
                  <h2 className="text-xl font-bold text-[#FFFDF0] mb-2">Esta cuenta no tiene objetivos</h2>
                  <p className="text-[#8CB4BC] text-sm mb-6 max-w-md">
                    El centro operativo está vacío. Inicia asignando el primer objetivo estratégico para activar la jerarquía.
                  </p>
                  <button className="px-4 py-2 bg-[#D8DA00] text-[#0D4651] font-semibold rounded-lg hover:bg-[#D8DA00]/90 transition-colors shadow-lg">
                    + Crear primer Objetivo para este Partner
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-[#FFFDF0] mb-2">Bienvenido a tu centro operativo</h2>
                  <p className="text-[#8CB4BC] text-sm max-w-md">
                    Tu asesor asignará tus objetivos estratégicos pronto. Mantente al tanto.
                  </p>
                </>
              )}
            </SectionCard>
          ) : (
            <>
              {/* ── Hierarchical Goals ── */}
              {goals.length > 0 && (
                <SectionCard>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-[#D8DA00]/10 flex items-center justify-center">
                      <Target className="w-4 h-4 text-[#D8DA00]" />
                    </div>
                    <h2 className="text-base font-semibold text-[#FFFDF0]">Jerarquía de Objetivos</h2>
                  </div>

                  <div className="space-y-4">
                    {goals.map((goal) => {
                      const st = goal.status as GoalStatus
                      const style = GOAL_STATUS_STYLES[st] ?? GOAL_STATUS_STYLES.NOT_STARTED
                      const pct = goal.targetValue > 0 ? Math.min(100, (goal.currentProgress / goal.targetValue) * 100) : 0
                      const goalMilestones = milestones.filter((m) => m.goalId === goal.id)
                      const directTasks = tasks.filter((t) => t.goalId === goal.id && !t.milestoneId)
                      const hasChildren = goalMilestones.length > 0 || directTasks.length > 0

                      return (
                        <details key={goal.id} className="group bg-[#0A3A43]/60 rounded-xl border border-[#1A6B78]/20 [&_summary::-webkit-details-marker]:hidden overflow-hidden transition-all duration-300">
                          <summary className="flex items-start justify-between gap-3 p-4 cursor-pointer hover:bg-[#0E4D58]/40 transition-colors">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.badge}`}>
                                  {style.icon} {style.label}
                                </span>
                                <span className="text-xs text-[#8CB4BC]/60">{goal.targetMetric}</span>
                              </div>
                              <p className="text-sm font-semibold text-[#FFFDF0]">{goal.title}</p>
                            </div>
                            <div className="flex items-center gap-4 flex-shrink-0">
                              <div className="text-right">
                                <span className={`text-lg font-bold block leading-none mb-1 ${pct >= 100 ? 'text-[#D8DA00]' : 'text-blue-400'}`}>
                                  {pct.toFixed(1)}%
                                </span>
                                <div className="w-20 bg-[#0A3A43] rounded-full h-1.5 overflow-hidden">
                                  <div className={`h-full rounded-full transition-all duration-700 ${pct >= 100 ? 'bg-[#D8DA00]' : 'bg-blue-400'}`} style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                              {hasChildren && (
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1A6B78]/20 group-hover:bg-[#1A6B78]/40 transition-colors">
                                  <ChevronDown className="w-4 h-4 text-[#8CB4BC] transition-transform duration-300 group-open:rotate-180" />
                                </div>
                              )}
                            </div>
                          </summary>
                          
                          {hasChildren && (
                            <div className="p-4 pt-0 border-t border-[#1A6B78]/20 bg-[#0A3A43]/30 space-y-4">
                              {/* Direct Tasks inside Goal */}
                              {directTasks.length > 0 && (
                                <div className="space-y-2 mt-4 pl-2">
                                  <p className="text-xs font-medium text-[#8CB4BC] mb-1">Tareas Directas</p>
                                  {directTasks.map(t => (
                                    <TaskCard key={t.id} task={t} onStatusUpdate={handleTaskUpdate} />
                                  ))}
                                </div>
                              )}
                              {/* Milestones inside Goal */}
                              {goalMilestones.map(ms => {
                                const msTasks = tasks.filter(t => t.milestoneId === ms.id)
                                return (
                                  <details key={ms.id} className="group/ms bg-[#0E4D58]/50 rounded-lg border border-[#1A6B78]/20 [&_summary::-webkit-details-marker]:hidden overflow-hidden mt-4 pl-2">
                                    <summary className="p-3 cursor-pointer hover:bg-[#1A6B78]/20 transition-colors">
                                      <MilestoneRow milestone={ms} onToggle={handleMilestoneToggle} />
                                      {msTasks.length > 0 && (
                                        <div className="mt-1 ml-9 text-xs text-[#8CB4BC]/60 flex items-center gap-1">
                                          <CheckSquare className="w-3 h-3" /> {msTasks.length} Tarea{msTasks.length !== 1 ? 's' : ''} anidada{msTasks.length !== 1 ? 's' : ''}
                                          <ChevronDown className="w-3 h-3 transition-transform duration-300 group-open/ms:rotate-180 ml-auto" />
                                        </div>
                                      )}
                                    </summary>
                                    {msTasks.length > 0 && (
                                      <div className="p-3 pt-0 border-t border-[#1A6B78]/20 bg-[#0A3A43]/40 space-y-2 pl-12">
                                        {msTasks.map(t => (
                                          <TaskCard key={t.id} task={t} onStatusUpdate={handleTaskUpdate} />
                                        ))}
                                      </div>
                                    )}
                                  </details>
                                )
                              })}
                            </div>
                          )}
                        </details>
                      )
                    })}
                  </div>
                </SectionCard>
              )}

              {/* ── Standalone Shelf ── */}
              {(milestones.some((m) => !m.goalId) || tasks.some(t => !t.goalId && !t.milestoneId)) && (
                <SectionCard>
                  <h2 className="text-base font-semibold text-[#FFFDF0] mb-5 border-b border-[#1A6B78]/20 pb-3">Elementos Independientes</h2>
                  
                  {milestones.some((m) => !m.goalId) && (
                    <div className="space-y-3 mb-6">
                      <p className="text-xs font-medium text-[#8CB4BC]">Hitos sin Objetivo Asociado</p>
                      {milestones.filter(m => !m.goalId).map(ms => {
                        const msTasks = tasks.filter(t => t.milestoneId === ms.id)
                        return (
                          <details key={ms.id} className="group/ms bg-[#0A3A43]/60 rounded-xl border border-[#1A6B78]/20 [&_summary::-webkit-details-marker]:hidden overflow-hidden">
                            <summary className="p-3 cursor-pointer hover:bg-[#0E4D58]/40 transition-colors">
                              <MilestoneRow milestone={ms} onToggle={handleMilestoneToggle} />
                              {msTasks.length > 0 && (
                                <div className="mt-1 ml-9 text-xs text-[#8CB4BC]/60 flex items-center gap-1">
                                  <CheckSquare className="w-3 h-3" /> {msTasks.length} Tarea{msTasks.length !== 1 ? 's' : ''} anidada{msTasks.length !== 1 ? 's' : ''}
                                  <ChevronDown className="w-3 h-3 transition-transform duration-300 group-open/ms:rotate-180 ml-auto" />
                                </div>
                              )}
                            </summary>
                            {msTasks.length > 0 && (
                              <div className="p-3 pt-0 border-t border-[#1A6B78]/20 bg-[#0A3A43]/40 space-y-2 pl-12">
                                {msTasks.map(t => (
                                  <TaskCard key={t.id} task={t} onStatusUpdate={handleTaskUpdate} />
                                ))}
                              </div>
                            )}
                          </details>
                        )
                      })}
                    </div>
                  )}

                  {tasks.some(t => !t.goalId && !t.milestoneId) && (
                    <div className="space-y-3">
                      <p className="text-xs font-medium text-[#8CB4BC]">Tareas Sueltas</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tasks.filter(t => !t.goalId && !t.milestoneId).map(t => (
                          <TaskCard key={t.id} task={t} onStatusUpdate={handleTaskUpdate} />
                        ))}
                      </div>
                    </div>
                  )}
                </SectionCard>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
