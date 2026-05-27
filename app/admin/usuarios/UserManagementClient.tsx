'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import {
  UserCog,
  Search,
  Shield,
  ChevronDown,
  Check,
  RefreshCw,
  Calendar,
  Mail,
  Users,
} from 'lucide-react'
import type { ClerkUserRow, UserRole } from '@/app/actions/users'
import { updateUserRoleAction } from '@/app/actions/users'

// ===========================
// CONSTANTS
// ===========================

const ROLES: UserRole[] = ['SUPER_ADMIN', 'PARTNER', 'INVESTOR', 'USER']

const ROLE_STYLES: Record<UserRole, { badge: string; dot: string; label: string }> = {
  SUPER_ADMIN: {
    badge: 'bg-red-500/10 text-red-400 border border-red-500/20',
    dot: 'bg-red-400',
    label: 'Super Admin',
  },
  PARTNER: {
    badge: 'bg-[#D8DA00]/10 text-[#D8DA00] border border-[#D8DA00]/20',
    dot: 'bg-[#D8DA00]',
    label: 'Partner',
  },
  INVESTOR: {
    badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    dot: 'bg-blue-400',
    label: 'Inversionista',
  },
  USER: {
    badge: 'bg-[#8CB4BC]/10 text-[#8CB4BC] border border-[#8CB4BC]/20',
    dot: 'bg-[#8CB4BC]',
    label: 'Usuario',
  },
}

// ===========================
// SUB-COMPONENTS
// ===========================

function RoleBadge({ role }: { role: UserRole }) {
  const styles = ROLE_STYLES[role] ?? ROLE_STYLES.USER
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${styles.dot}`} />
      {styles.label}
    </span>
  )
}

interface RoleDropdownProps {
  userId: string
  currentRole: UserRole
  currentUserId: string
  onUpdate: (userId: string, newRole: UserRole) => void
}

function RoleDropdown({ userId, currentRole, currentUserId, onUpdate }: RoleDropdownProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)
  const isSelf = userId === currentUserId

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function handleSelect(role: UserRole) {
    if (role === currentRole) {
      setOpen(false)
      return
    }
    setOpen(false)

    const toastId = toast.loading(`Actualizando rol a ${ROLE_STYLES[role].label}…`)

    startTransition(async () => {
      const result = await updateUserRoleAction(userId, role)

      if (result.success) {
        toast.success(`Rol actualizado a ${ROLE_STYLES[role].label}`, {
          id: toastId,
          description: 'Los cambios son efectivos de inmediato.',
        })
        onUpdate(userId, role)
      } else {
        toast.error('No se pudo actualizar el rol', {
          id: toastId,
          description: result.error ?? 'Error desconocido.',
        })
      }
    })
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => !isSelf && !isPending && setOpen((o) => !o)}
        disabled={isPending || isSelf}
        title={isSelf ? 'No puedes cambiar tu propio rol' : undefined}
        className={`
          inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-all duration-150
          ${isSelf
            ? 'opacity-40 cursor-not-allowed'
            : isPending
            ? 'opacity-60 cursor-wait'
            : 'hover:bg-[#1A6B78]/40 cursor-pointer'
          }
        `}
      >
        {isPending ? (
          <RefreshCw className="w-3 h-3 animate-spin text-[#D8DA00]" />
        ) : (
          <RoleBadge role={currentRole} />
        )}
        {!isSelf && !isPending && (
          <ChevronDown className={`w-3 h-3 text-[#8CB4BC] transition-transform ${open ? 'rotate-180' : ''}`} />
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-44 rounded-xl bg-[#0A3A43] border border-[#1A6B78]/60 shadow-2xl shadow-black/40 py-1 overflow-hidden">
          {ROLES.map((role) => (
            <button
              key={role}
              onClick={() => handleSelect(role)}
              className={`
                w-full flex items-center justify-between gap-2 px-3 py-2.5 text-xs transition-colors
                ${role === currentRole
                  ? 'bg-[#D8DA00]/5 text-[#FFFDF0]'
                  : 'text-[#8CB4BC] hover:bg-[#0E4D58] hover:text-[#FFFDF0]'
                }
              `}
            >
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${ROLE_STYLES[role].dot}`} />
                <span>{ROLE_STYLES[role].label}</span>
              </div>
              {role === currentRole && <Check className="w-3 h-3 text-[#D8DA00]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function UserAvatar({ name, imageUrl }: { name: string; imageUrl: string }) {
  const [imgError, setImgError] = useState(false)
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  if (imageUrl && !imgError) {
    return (
      <img
        src={imageUrl}
        alt={name}
        onError={() => setImgError(true)}
        className="w-9 h-9 rounded-full object-cover ring-2 ring-[#1A6B78]/40"
      />
    )
  }

  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1A6B78] to-[#0D4651] ring-2 ring-[#1A6B78]/40 flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-bold text-[#D8DA00]">{initials}</span>
    </div>
  )
}

// ===========================
// STAT MINI CARD
// ===========================

function MiniStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-[#0E4D58] rounded-xl border border-[#1A6B78]/30 px-4 py-3 flex flex-col gap-1">
      <span className="text-xs text-[#8CB4BC]">{label}</span>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
    </div>
  )
}

// ===========================
// MAIN COMPONENT
// ===========================

interface UserManagementClientProps {
  initialUsers: ClerkUserRow[]
  currentUserId: string
}

export default function UserManagementClient({
  initialUsers,
  currentUserId,
}: UserManagementClientProps) {
  const [users, setUsers] = useState<ClerkUserRow[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL')

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  function handleRoleUpdate(userId: string, newRole: UserRole) {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
  }

  const counts = users.reduce(
    (acc, u) => {
      acc[u.role] = (acc[u.role] ?? 0) + 1
      return acc
    },
    {} as Record<UserRole, number>
  )

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D8DA00]/10 flex items-center justify-center flex-shrink-0">
            <UserCog className="w-5 h-5 text-[#D8DA00]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#FFFDF0]">Gestión de Usuarios</h1>
            <p className="text-[#8CB4BC] text-sm mt-0.5">
              {users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
          <Shield className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-xs text-red-400 font-medium">Acceso Solo Super Admin</span>
        </div>
      </div>

      {/* ── Role Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MiniStat label="Super Admins" value={counts.SUPER_ADMIN ?? 0} color="text-red-400" />
        <MiniStat label="Partners" value={counts.PARTNER ?? 0} color="text-[#D8DA00]" />
        <MiniStat label="Inversionistas" value={counts.INVESTOR ?? 0} color="text-blue-400" />
        <MiniStat label="Usuarios" value={counts.USER ?? 0} color="text-[#8CB4BC]" />
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8CB4BC]" />
          <input
            type="text"
            placeholder="Buscar por nombre o email…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0E4D58] border border-[#1A6B78]/50 rounded-xl text-[#FFFDF0] placeholder-[#8CB4BC]/50 focus:outline-none focus:border-[#D8DA00]/50 text-sm transition-colors"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {(['ALL', ...ROLES] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`
                px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 border
                ${roleFilter === r
                  ? 'bg-[#D8DA00] text-[#0D4651] border-[#D8DA00]'
                  : 'bg-[#0E4D58] text-[#8CB4BC] border-[#1A6B78]/40 hover:border-[#D8DA00]/40 hover:text-[#FFFDF0]'
                }
              `}
            >
              {r === 'ALL' ? 'Todos' : ROLE_STYLES[r].label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/50 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <Users className="w-12 h-12 text-[#1A6B78] mb-3" />
            <p className="text-[#FFFDF0] font-medium">No se encontraron usuarios</p>
            <p className="text-[#8CB4BC] text-sm mt-1">Intenta ajustar el término de búsqueda o los filtros</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-[#1A6B78]/30 bg-[#0A3A43]/50">
                  <th className="text-left px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Usuario
                    </div>
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </div>
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      Rol
                    </div>
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-[#8CB4BC] uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Registro
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#1A6B78]/20">
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className={`
                      group hover:bg-[#0A3A43]/40 transition-colors
                      ${u.id === currentUserId ? 'bg-[#D8DA00]/3' : ''}
                    `}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={u.name} imageUrl={u.imageUrl} />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-[#FFFDF0] leading-tight">{u.name}</p>
                            {u.id === currentUserId && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-[#D8DA00]/10 text-[#D8DA00] rounded-full font-medium">
                                Tú
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#8CB4BC]/60 mt-0.5 font-mono">{u.id.slice(0, 12)}…</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-[#8CB4BC]">{u.email}</p>
                    </td>

                    <td className="px-6 py-4">
                      <RoleDropdown
                        userId={u.id}
                        currentRole={u.role}
                        currentUserId={currentUserId}
                        onUpdate={handleRoleUpdate}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-[#8CB4BC]">
                        {new Date(u.createdAt).toLocaleDateString('es-CO', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1A6B78]/30 bg-[#0A3A43]/30 flex items-center justify-between">
          <p className="text-xs text-[#8CB4BC]/60">
            Mostrando {filtered.length} de {users.length} usuarios
          </p>
          <p className="text-xs text-[#8CB4BC]/40">
            Datos sincronizados con Clerk · Los cambios de rol son inmediatos
          </p>
        </div>
      </div>
    </div>
  )
}
