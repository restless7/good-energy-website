'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Users,
  Target,
  CheckSquare,
  Plus,
  ChevronDown,
  X,
  Loader2,
  Flag,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2,
  BarChart3,
} from 'lucide-react'
import type { PartnerProfileWithData, GoalStatus, TaskPriority, TaskStatus } from './actions'
import {
  createPartnerGoalAction,
  createPartnerTaskAction,
  addMilestoneAction,
  deleteOperationalItemAction,
  updateGoalStatusAction,
} from './actions'
import type { ClerkUserRow } from '@/app/actions/users'

// ===========================
// CONSTANTS & STYLE MAPS
// ===========================

const GOAL_STATUS_STYLES: Record<GoalStatus, { badge: string; label: string; icon: React.ReactNode }> = {
  NOT_STARTED: { badge: 'bg-[#8CB4BC]/10 text-[#8CB4BC] border border-[#8CB4BC]/20', label: 'Sin iniciar', icon: <Clock className="w-3 h-3" /> },
  IN_PROGRESS: { badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', label: 'En progreso', icon: <TrendingUp className="w-3 h-3" /> },
  ACHIEVED: { badge: 'bg-[#D8DA00]/10 text-[#D8DA00] border border-[#D8DA00]/20', label: 'Logrado', icon: <CheckCircle2 className="w-3 h-3" /> },
  AT_RISK: { badge: 'bg-red-500/10 text-red-400 border border-red-500/20', label: 'En riesgo', icon: <AlertTriangle className="w-3 h-3" /> },
}

const TASK_STATUS_STYLES: Record<TaskStatus, { badge: string; label: string }> = {
  BACKLOG: { badge: 'bg-[#8CB4BC]/10 text-[#8CB4BC]', label: 'Backlog' },
  TODO: { badge: 'bg-blue-500/10 text-blue-400', label: 'Por hacer' },
  IN_PROGRESS: { badge: 'bg-yellow-500/10 text-yellow-400', label: 'En progreso' },
  REVIEW: { badge: 'bg-purple-500/10 text-purple-400', label: 'Revisión' },
  DONE: { badge: 'bg-[#D8DA00]/10 text-[#D8DA00]', label: 'Hecho' },
}

const PRIORITY_STYLES: Record<TaskPriority, { badge: string; label: string }> = {
  LOW: { badge: 'text-[#8CB4BC]', label: 'Baja' },
  MEDIUM: { badge: 'text-blue-400', label: 'Media' },
  HIGH: { badge: 'text-yellow-400', label: 'Alta' },
  CRITICAL: { badge: 'text-red-400', label: 'Crítica' },
}

const TASK_STATUSES: TaskStatus[] = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']
const TASK_PRIORITIES: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const GOAL_STATUSES: GoalStatus[] = ['NOT_STARTED', 'IN_PROGRESS', 'ACHIEVED', 'AT_RISK']

// ===========================
// HELPER COMPONENTS
// ===========================

function SectionHeader({ icon, title, count }: { icon: React.ReactNode; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-[#1A6B78]/30 flex items-center justify-center text-[#D8DA00]">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[#FFFDF0]">{title}</h3>
      {count !== undefined && (
        <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-[#1A6B78]/30 text-[#8CB4BC]">{count}</span>
      )}
    </div>
  )
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const color = pct >= 100 ? 'bg-[#D8DA00]' : pct >= 60 ? 'bg-blue-400' : pct >= 30 ? 'bg-yellow-400' : 'bg-red-400'
  return (
    <div className="w-full bg-[#0A3A43] rounded-full h-1.5 overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function StatCard({ label, value, sub, color = 'text-[#D8DA00]' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-[#0E4D58] rounded-xl border border-[#1A6B78]/30 p-4">
      <p className="text-xs text-[#8CB4BC] mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-[#8CB4BC]/60 mt-1">{sub}</p>}
    </div>
  )
}

// ===========================
// MODAL PRIMITIVES
// ===========================

function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode
}) {
  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-[#0A3A43] rounded-2xl border border-[#1A6B78]/50 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1A6B78]/30">
          <h2 className="text-lg font-semibold text-[#FFFDF0]">{title}</h2>
          <button onClick={onClose} className="text-[#8CB4BC] hover:text-[#FFFDF0] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-[#8CB4BC] uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full px-3 py-2.5 bg-[#0E4D58] border border-[#1A6B78]/50 rounded-xl text-sm text-[#FFFDF0] placeholder-[#8CB4BC]/40 focus:outline-none focus:border-[#D8DA00]/50 transition-colors"
const selectCls = `${inputCls} cursor-pointer`

// ===========================
// CREATION MODALS
// ===========================

function CreateGoalModal({
  open, onClose, profiles,
}: { open: boolean; onClose: () => void; profiles: PartnerProfileWithData[] }) {
  const [isPending, start] = useTransition()
  const [form, setForm] = useState({ partnerProfileId: '', title: '', description: '', targetMetric: '', targetValue: '', deadline: '' })

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.partnerProfileId || !form.title || !form.targetValue) {
      toast.error('Completa los campos requeridos.')
      return
    }
    const id = toast.loading('Creando objetivo…')
    start(async () => {
      const r = await createPartnerGoalAction({
        partnerProfileId: form.partnerProfileId,
        title: form.title,
        description: form.description || undefined,
        targetMetric: form.targetMetric || 'General',
        targetValue: parseFloat(form.targetValue),
        deadline: form.deadline || undefined,
      })
      if (r.success) {
        toast.success('Objetivo creado exitosamente', { id })
        onClose()
        setForm({ partnerProfileId: '', title: '', description: '', targetMetric: '', targetValue: '', deadline: '' })
      } else {
        toast.error(r.error ?? 'Error al crear objetivo', { id })
      }
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Nuevo Objetivo de Partner">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Partner *">
          <select value={form.partnerProfileId} onChange={(e) => set('partnerProfileId', e.target.value)} className={selectCls} required>
            <option value="">Seleccionar partner…</option>
            {profiles.map((p) => <option key={p.id} value={p.id}>{p.displayName}</option>)}
          </select>
        </Field>
        <Field label="Título *">
          <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="ej. Recaudar 500M COP" className={inputCls} required />
        </Field>
        <Field label="Descripción">
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Descripción del objetivo…" rows={2} className={`${inputCls} resize-none`} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Métrica objetivo">
            <input value={form.targetMetric} onChange={(e) => set('targetMetric', e.target.value)} placeholder="ej. Inversiones (COP)" className={inputCls} />
          </Field>
          <Field label="Valor meta *">
            <input type="number" step="any" value={form.targetValue} onChange={(e) => set('targetValue', e.target.value)} placeholder="500000000" className={inputCls} required />
          </Field>
        </div>
        <Field label="Fecha límite">
          <input type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} className={inputCls} />
        </Field>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#1A6B78]/50 text-[#8CB4BC] hover:text-[#FFFDF0] text-sm transition-colors">Cancelar</button>
          <button type="submit" disabled={isPending} className="flex-1 py-2.5 rounded-xl bg-[#D8DA00] text-[#0D4651] font-semibold text-sm hover:bg-[#D8DA00]/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Crear Objetivo
          </button>
        </div>
      </form>
    </Modal>
  )
}

function CreateTaskModal({
  open, onClose, profiles,
}: { open: boolean; onClose: () => void; profiles: PartnerProfileWithData[] }) {
  const [isPending, start] = useTransition()
  const [form, setForm] = useState({ partnerProfileId: '', title: '', description: '', priority: 'MEDIUM' as TaskPriority, status: 'TODO' as TaskStatus, dueDate: '' })

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) { setForm((f) => ({ ...f, [k]: v })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.partnerProfileId || !form.title) { toast.error('Completa los campos requeridos.'); return }
    const id = toast.loading('Asignando tarea…')
    start(async () => {
      const r = await createPartnerTaskAction({
        partnerProfileId: form.partnerProfileId,
        title: form.title,
        description: form.description || undefined,
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate || undefined,
      })
      if (r.success) {
        toast.success('Tarea asignada exitosamente', { id })
        onClose()
        setForm({ partnerProfileId: '', title: '', description: '', priority: 'MEDIUM', status: 'TODO', dueDate: '' })
      } else {
        toast.error(r.error ?? 'Error al asignar tarea', { id })
      }
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Asignar Tarea a Partner">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Partner *">
          <select value={form.partnerProfileId} onChange={(e) => set('partnerProfileId', e.target.value)} className={selectCls} required>
            <option value="">Seleccionar partner…</option>
            {profiles.map((p) => <option key={p.id} value={p.id}>{p.displayName}</option>)}
          </select>
        </Field>
        <Field label="Título *">
          <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="ej. Presentar reporte Q2" className={inputCls} required />
        </Field>
        <Field label="Descripción">
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Descripción de la tarea…" rows={2} className={`${inputCls} resize-none`} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prioridad">
            <select value={form.priority} onChange={(e) => set('priority', e.target.value as TaskPriority)} className={selectCls}>
              {TASK_PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_STYLES[p].label}</option>)}
            </select>
          </Field>
          <Field label="Estado inicial">
            <select value={form.status} onChange={(e) => set('status', e.target.value as TaskStatus)} className={selectCls}>
              {TASK_STATUSES.map((s) => <option key={s} value={s}>{TASK_STATUS_STYLES[s].label}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Fecha límite">
          <input type="date" value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} className={inputCls} />
        </Field>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#1A6B78]/50 text-[#8CB4BC] hover:text-[#FFFDF0] text-sm transition-colors">Cancelar</button>
          <button type="submit" disabled={isPending} className="flex-1 py-2.5 rounded-xl bg-[#D8DA00] text-[#0D4651] font-semibold text-sm hover:bg-[#D8DA00]/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Asignar Tarea
          </button>
        </div>
      </form>
    </Modal>
  )
}

function AddMilestoneModal({
  open, onClose, profiles,
}: { open: boolean; onClose: () => void; profiles: PartnerProfileWithData[] }) {
  const [isPending, start] = useTransition()
  const [form, setForm] = useState({ partnerProfileId: '', goalId: '', title: '', description: '', dueDate: '' })
  const selectedProfile = profiles.find((p) => p.id === form.partnerProfileId)

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.partnerProfileId || !form.title) { toast.error('Completa los campos requeridos.'); return }
    const id = toast.loading('Creando hito…')
    start(async () => {
      const r = await addMilestoneAction({
        partnerProfileId: form.partnerProfileId,
        goalId: form.goalId || undefined,
        title: form.title,
        description: form.description || undefined,
        dueDate: form.dueDate || undefined,
      })
      if (r.success) {
        toast.success('Hito creado exitosamente', { id })
        onClose()
        setForm({ partnerProfileId: '', goalId: '', title: '', description: '', dueDate: '' })
      } else {
        toast.error(r.error ?? 'Error al crear hito', { id })
      }
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Agregar Hito">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Partner *">
          <select value={form.partnerProfileId} onChange={(e) => { set('partnerProfileId', e.target.value); set('goalId', '') }} className={selectCls} required>
            <option value="">Seleccionar partner…</option>
            {profiles.map((p) => <option key={p.id} value={p.id}>{p.displayName}</option>)}
          </select>
        </Field>
        {selectedProfile && selectedProfile.goals.length > 0 && (
          <Field label="Vincular a objetivo (opcional)">
            <select value={form.goalId} onChange={(e) => set('goalId', e.target.value)} className={selectCls}>
              <option value="">Sin objetivo vinculado</option>
              {selectedProfile.goals.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
            </select>
          </Field>
        )}
        <Field label="Título del hito *">
          <input value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="ej. Primera reunión con inversionistas" className={inputCls} required />
        </Field>
        <Field label="Descripción">
          <textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Descripción del hito…" rows={2} className={`${inputCls} resize-none`} />
        </Field>
        <Field label="Fecha límite">
          <input type="date" value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} className={inputCls} />
        </Field>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-[#1A6B78]/50 text-[#8CB4BC] hover:text-[#FFFDF0] text-sm transition-colors">Cancelar</button>
          <button type="submit" disabled={isPending} className="flex-1 py-2.5 rounded-xl bg-[#D8DA00] text-[#0D4651] font-semibold text-sm hover:bg-[#D8DA00]/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Crear Hito
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ===========================
// PARTNER PROFILE CARD
// ===========================

function PartnerCard({
  profile,
  onDelete,
}: { profile: PartnerProfileWithData; onDelete: (id: string, type: 'goal' | 'task' | 'milestone') => void }) {
  const [expanded, setExpanded] = useState(false)
  const [isPending, start] = useTransition()

  const totalTasks = profile.tasks.length
  const doneTasks = profile.tasks.filter((t) => t.status === 'DONE').length
  const criticalTasks = profile.tasks.filter((t) => t.priority === 'CRITICAL' && t.status !== 'DONE').length
  const totalGoals = profile.goals.length
  const achievedGoals = profile.goals.filter((g) => g.status === 'ACHIEVED').length
  const totalMilestones = profile.milestones.length
  const completedMilestones = profile.milestones.filter((m) => m.isCompleted).length

  function handleDeleteGoal(goalId: string) {
    const id = toast.loading('Eliminando objetivo…')
    start(async () => {
      const r = await deleteOperationalItemAction(goalId, 'goal')
      if (r.success) toast.success('Objetivo eliminado', { id })
      else toast.error(r.error ?? 'Error', { id })
      onDelete(goalId, 'goal')
    })
  }

  function handleDeleteTask(taskId: string) {
    const id = toast.loading('Eliminando tarea…')
    start(async () => {
      const r = await deleteOperationalItemAction(taskId, 'task')
      if (r.success) toast.success('Tarea eliminada', { id })
      else toast.error(r.error ?? 'Error', { id })
      onDelete(taskId, 'task')
    })
  }

  return (
    <div className="bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/40 overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between p-5 hover:bg-[#0A3A43]/40 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1A6B78] to-[#0A3A43] flex items-center justify-center flex-shrink-0">
            <span className="text-base font-bold text-[#D8DA00]">{profile.displayName.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#FFFDF0]">{profile.displayName}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-[#8CB4BC]">{totalGoals} objetivos · {totalTasks} tareas · {totalMilestones} hitos</span>
              {criticalTasks > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  {criticalTasks} crítica{criticalTasks !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex gap-3">
            <div className="text-center">
              <p className="text-xs text-[#8CB4BC]">Objetivos</p>
              <p className="text-sm font-bold text-[#D8DA00]">{achievedGoals}/{totalGoals}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#8CB4BC]">Tareas</p>
              <p className="text-sm font-bold text-blue-400">{doneTasks}/{totalTasks}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[#8CB4BC]">Hitos</p>
              <p className="text-sm font-bold text-[#8CB4BC]">{completedMilestones}/{totalMilestones}</p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-[#8CB4BC] transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#1A6B78]/30 p-5 space-y-6">
          {/* Goals */}
          <div>
            <SectionHeader icon={<Target className="w-4 h-4" />} title="Objetivos" count={profile.goals.length} />
            {profile.goals.length === 0 ? (
              <p className="text-sm text-[#8CB4BC]/50 italic">Sin objetivos asignados</p>
            ) : (
              <div className="space-y-3">
                {profile.goals.map((goal) => {
                  const st = goal.status as GoalStatus
                  const style = GOAL_STATUS_STYLES[st] ?? GOAL_STATUS_STYLES.NOT_STARTED
                  const pct = goal.targetValue > 0 ? Math.min(100, (goal.currentProgress / goal.targetValue) * 100) : 0
                  return (
                    <div key={goal.id} className="bg-[#0A3A43]/60 rounded-xl p-4 space-y-2.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#FFFDF0]">{goal.title}</p>
                          {goal.description && <p className="text-xs text-[#8CB4BC]/70 mt-0.5 truncate">{goal.description}</p>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.badge}`}>
                            {style.icon} {style.label}
                          </span>
                          <button
                            onClick={() => handleDeleteGoal(goal.id)}
                            disabled={isPending}
                            className="text-[#8CB4BC]/40 hover:text-red-400 transition-colors disabled:opacity-40"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-[#8CB4BC]/70">
                          <span>{goal.targetMetric}</span>
                          <span>{goal.currentProgress.toLocaleString('es-CO')} / {goal.targetValue.toLocaleString('es-CO')}</span>
                        </div>
                        <ProgressBar value={goal.currentProgress} max={goal.targetValue} />
                        <p className="text-xs text-right text-[#8CB4BC]/50">{pct.toFixed(1)}%</p>
                      </div>
                      {goal.deadline && (
                        <p className="text-xs text-[#8CB4BC]/50 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Vence: {new Date(goal.deadline).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Tasks */}
          <div>
            <SectionHeader icon={<CheckSquare className="w-4 h-4" />} title="Tareas" count={profile.tasks.length} />
            {profile.tasks.length === 0 ? (
              <p className="text-sm text-[#8CB4BC]/50 italic">Sin tareas asignadas</p>
            ) : (
              <div className="space-y-2">
                {profile.tasks.map((task) => {
                  const ts = task.status as TaskStatus
                  const tp = task.priority as TaskPriority
                  const tstyle = TASK_STATUS_STYLES[ts] ?? TASK_STATUS_STYLES.BACKLOG
                  const pstyle = PRIORITY_STYLES[tp] ?? PRIORITY_STYLES.MEDIUM
                  return (
                    <div key={task.id} className="flex items-center justify-between gap-3 px-3 py-2.5 bg-[#0A3A43]/50 rounded-xl">
                      <div className="flex items-center gap-2 min-w-0">
                        <Flag className={`w-3.5 h-3.5 flex-shrink-0 ${pstyle.badge}`} />
                        <p className="text-sm text-[#FFFDF0] truncate">{task.title}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${tstyle.badge}`}>{tstyle.label}</span>
                        {task.dueDate && (
                          <span className="text-xs text-[#8CB4BC]/50">{new Date(task.dueDate).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}</span>
                        )}
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={isPending}
                          className="text-[#8CB4BC]/40 hover:text-red-400 transition-colors disabled:opacity-40"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Milestones */}
          {profile.milestones.length > 0 && (
            <div>
              <SectionHeader icon={<BarChart3 className="w-4 h-4" />} title="Hitos" count={profile.milestones.length} />
              <div className="space-y-2">
                {profile.milestones.map((ms) => (
                  <div key={ms.id} className="flex items-center gap-3 px-3 py-2 bg-[#0A3A43]/40 rounded-lg">
                    <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${ms.isCompleted ? 'text-[#D8DA00]' : 'text-[#1A6B78]'}`} />
                    <p className={`text-sm flex-1 ${ms.isCompleted ? 'line-through text-[#8CB4BC]/50' : 'text-[#FFFDF0]'}`}>{ms.title}</p>
                    {ms.dueDate && <span className="text-xs text-[#8CB4BC]/50">{new Date(ms.dueDate).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ===========================
// MAIN COMPONENT
// ===========================

interface Props {
  initialProfiles: PartnerProfileWithData[]
  partnerClerkUsers: ClerkUserRow[]
  currentUserId: string
}

type ModalType = 'goal' | 'task' | 'milestone' | null

export default function PartnersMasterClient({ initialProfiles, partnerClerkUsers }: Props) {
  const [profiles, setProfiles] = useState<PartnerProfileWithData[]>(initialProfiles)
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [filterPartner, setFilterPartner] = useState('ALL')
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'ALL'>('ALL')
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'ALL'>('ALL')
  const [tab, setTab] = useState<'overview' | 'tasks' | 'goals'>('overview')

  const allTasks = profiles.flatMap((p) => p.tasks.map((t) => ({ ...t, partnerName: p.displayName, partnerProfileId: p.id })))
  const allGoals = profiles.flatMap((p) => p.goals.map((g) => ({ ...g, partnerName: p.displayName })))

  const filteredTasks = allTasks.filter((t) => {
    const mp = filterPartner === 'ALL' || t.partnerProfileId === filterPartner
    const ms = filterStatus === 'ALL' || t.status === filterStatus
    const mpr = filterPriority === 'ALL' || t.priority === filterPriority
    return mp && ms && mpr
  })

  const filteredGoals = allGoals.filter((g) => {
    return filterPartner === 'ALL' || profiles.find((p) => p.displayName === g.partnerName)?.id === filterPartner
  })

  const totalTasks = allTasks.length
  const criticalOpen = allTasks.filter((t) => t.priority === 'CRITICAL' && t.status !== 'DONE').length
  const goalCompletionRate = allGoals.length > 0 ? Math.round((allGoals.filter((g) => g.status === 'ACHIEVED').length / allGoals.length) * 100) : 0

  function handleDelete(_id: string, _type: 'goal' | 'task' | 'milestone') {
    setProfiles((prev) =>
      prev.map((p) => ({
        ...p,
        goals: p.goals.filter((g) => g.id !== _id),
        tasks: p.tasks.filter((t) => t.id !== _id),
        milestones: p.milestones.filter((m) => m.id !== _id),
      }))
    )
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#FFFDF0]">Operaciones de Partners</h1>
          <p className="text-sm text-[#8CB4BC] mt-0.5">{profiles.length} partner{profiles.length !== 1 ? 's' : ''} activo{profiles.length !== 1 ? 's' : ''} en la plataforma</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveModal('goal')} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#D8DA00]/10 border border-[#D8DA00]/20 text-[#D8DA00] text-sm font-medium hover:bg-[#D8DA00]/20 transition-colors">
            <Plus className="w-4 h-4" /> Objetivo
          </button>
          <button onClick={() => setActiveModal('task')} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/20 transition-colors">
            <Plus className="w-4 h-4" /> Tarea
          </button>
          <button onClick={() => setActiveModal('milestone')} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#8CB4BC]/10 border border-[#8CB4BC]/20 text-[#8CB4BC] text-sm font-medium hover:bg-[#8CB4BC]/20 transition-colors">
            <Plus className="w-4 h-4" /> Hito
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Partners Activos" value={profiles.length} color="text-[#D8DA00]" />
        <StatCard label="Logro de Objetivos" value={`${goalCompletionRate}%`} color="text-blue-400" />
        <StatCard label="Total Tareas" value={totalTasks} sub={`${criticalOpen} críticas abiertas`} color="text-[#8CB4BC]" />
        <StatCard label="Hitos Completados" value={profiles.reduce((a, p) => a + p.milestones.filter((m) => m.isCompleted).length, 0)} color="text-[#D8DA00]" />
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-[#0A3A43]/60 p-1 rounded-xl w-fit">
        {(['overview', 'tasks', 'goals'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-[#D8DA00] text-[#0D4651]' : 'text-[#8CB4BC] hover:text-[#FFFDF0]'}`}>
            {t === 'overview' ? 'Resumen' : t === 'tasks' ? 'Tareas' : 'Objetivos'}
          </button>
        ))}
      </div>

      {/* ── Filters (tasks/goals tabs) ── */}
      {tab !== 'overview' && (
        <div className="flex flex-wrap gap-3">
          <select value={filterPartner} onChange={(e) => setFilterPartner(e.target.value)} className="px-3 py-2 bg-[#0E4D58] border border-[#1A6B78]/50 rounded-xl text-sm text-[#8CB4BC] focus:outline-none cursor-pointer">
            <option value="ALL">Todos los partners</option>
            {profiles.map((p) => <option key={p.id} value={p.id}>{p.displayName}</option>)}
          </select>
          {tab === 'tasks' && (
            <>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'ALL')} className="px-3 py-2 bg-[#0E4D58] border border-[#1A6B78]/50 rounded-xl text-sm text-[#8CB4BC] focus:outline-none cursor-pointer">
                <option value="ALL">Todos los estados</option>
                {TASK_STATUSES.map((s) => <option key={s} value={s}>{TASK_STATUS_STYLES[s].label}</option>)}
              </select>
              <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'ALL')} className="px-3 py-2 bg-[#0E4D58] border border-[#1A6B78]/50 rounded-xl text-sm text-[#8CB4BC] focus:outline-none cursor-pointer">
                <option value="ALL">Todas las prioridades</option>
                {TASK_PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_STYLES[p].label}</option>)}
              </select>
            </>
          )}
        </div>
      )}

      {/* ── Tab Content ── */}
      {tab === 'overview' && (
        <div className="space-y-4">
          {profiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/40">
              <Users className="w-12 h-12 text-[#1A6B78] mb-3" />
              <p className="text-[#FFFDF0] font-medium">Sin partners operativos</p>
              <p className="text-sm text-[#8CB4BC] mt-1">Los partners deben ser asignados desde el módulo de Usuarios</p>
            </div>
          ) : (
            profiles.map((p) => <PartnerCard key={p.id} profile={p} onDelete={handleDelete} />)
          )}
        </div>
      )}

      {tab === 'tasks' && (
        <div className="bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/40 overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <CheckSquare className="w-10 h-10 text-[#1A6B78] mb-2" />
              <p className="text-[#8CB4BC]">Sin tareas que coincidan con los filtros</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-[#1A6B78]/30 bg-[#0A3A43]/50">
                    {['Tarea', 'Partner', 'Estado', 'Prioridad', 'Vencimiento'].map((h) => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-medium text-[#8CB4BC] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A6B78]/20">
                  {filteredTasks.map((task) => {
                    const ts = task.status as TaskStatus
                    const tp = task.priority as TaskPriority
                    return (
                      <tr key={task.id} className="hover:bg-[#0A3A43]/30 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="text-sm text-[#FFFDF0]">{task.title}</p>
                          {task.description && <p className="text-xs text-[#8CB4BC]/60 mt-0.5 truncate max-w-xs">{task.description}</p>}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-[#8CB4BC]">{task.partnerName}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs px-2.5 py-1 rounded-full ${TASK_STATUS_STYLES[ts]?.badge ?? ''}`}>
                            {TASK_STATUS_STYLES[ts]?.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <Flag className={`w-3.5 h-3.5 ${PRIORITY_STYLES[tp]?.badge ?? ''}`} />
                            <span className={`text-xs ${PRIORITY_STYLES[tp]?.badge ?? ''}`}>{PRIORITY_STYLES[tp]?.label}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-[#8CB4BC]">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'goals' && (
        <div className="space-y-3">
          {filteredGoals.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/40">
              <Target className="w-10 h-10 text-[#1A6B78] mb-2" />
              <p className="text-[#8CB4BC]">Sin objetivos registrados</p>
            </div>
          ) : (
            filteredGoals.map((goal) => {
              const st = goal.status as GoalStatus
              const style = GOAL_STATUS_STYLES[st] ?? GOAL_STATUS_STYLES.NOT_STARTED
              const pct = goal.targetValue > 0 ? Math.min(100, (goal.currentProgress / goal.targetValue) * 100) : 0
              return (
                <div key={goal.id} className="bg-[#0E4D58] rounded-xl border border-[#1A6B78]/40 p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.badge}`}>{style.icon} {style.label}</span>
                        <span className="text-xs text-[#8CB4BC]/60">{goal.partnerName}</span>
                      </div>
                      <p className="text-sm font-semibold text-[#FFFDF0]">{goal.title}</p>
                      {goal.description && <p className="text-xs text-[#8CB4BC]/70 mt-0.5">{goal.description}</p>}
                    </div>
                    {goal.deadline && (
                      <p className="text-xs text-[#8CB4BC]/50 flex items-center gap-1 flex-shrink-0">
                        <Calendar className="w-3 h-3" />
                        {new Date(goal.deadline).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-[#8CB4BC]/70">
                      <span>{goal.targetMetric}</span>
                      <span className="font-medium">{pct.toFixed(1)}%</span>
                    </div>
                    <ProgressBar value={goal.currentProgress} max={goal.targetValue} />
                    <div className="flex justify-between text-xs text-[#8CB4BC]/50">
                      <span>{goal.currentProgress.toLocaleString('es-CO')}</span>
                      <span>{goal.targetValue.toLocaleString('es-CO')}</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* ── Modals ── */}
      <CreateGoalModal open={activeModal === 'goal'} onClose={() => setActiveModal(null)} profiles={profiles} />
      <CreateTaskModal open={activeModal === 'task'} onClose={() => setActiveModal(null)} profiles={profiles} />
      <AddMilestoneModal open={activeModal === 'milestone'} onClose={() => setActiveModal(null)} profiles={profiles} />
    </div>
  )
}
