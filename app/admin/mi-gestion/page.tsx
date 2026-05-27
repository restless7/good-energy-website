import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Shield } from 'lucide-react'
import { getMyPartnerWorkspaceAction } from '@/app/admin/partners/actions'
import PartnerWorkspaceClient from './PartnerWorkspaceClient'

function AccessDenied() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full bg-[#0E4D58] rounded-2xl border border-red-500/20 p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <Shield className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-[#FFFDF0] mb-2">Acceso Restringido</h2>
        <p className="text-[#8CB4BC] text-sm leading-relaxed">
          Esta sección es exclusiva para <strong className="text-yellow-400">Partners</strong> y Super Administradores.
        </p>
      </div>
    </div>
  )
}

function NoProfile() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full bg-[#0E4D58] rounded-2xl border border-[#1A6B78]/30 p-8 text-center shadow-xl">
        <div className="w-16 h-16 bg-[#D8DA00]/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <Shield className="h-8 w-8 text-[#D8DA00]" />
        </div>
        <h2 className="text-xl font-bold text-[#FFFDF0] mb-2">Perfil Operativo Pendiente</h2>
        <p className="text-[#8CB4BC] text-sm leading-relaxed">
          Tu perfil de partner aún no ha sido configurado. Contacta al Super Administrador para activar tu espacio de trabajo.
        </p>
      </div>
    </div>
  )
}

export default async function MiGestionPage() {
  const { userId, sessionClaims } = await auth()

  if (!userId) redirect('/sign-in?redirect_url=/admin/mi-gestion')

  const role = (sessionClaims?.metadata as Record<string, unknown> | undefined)?.role as string | undefined
  if (role !== 'SUPER_ADMIN' && role !== 'PARTNER') return <AccessDenied />

  const result = await getMyPartnerWorkspaceAction()

  if (!result.success || !result.data) return <NoProfile />

  return <PartnerWorkspaceClient profile={result.data} currentUserId={userId} isSuperAdmin={role === 'SUPER_ADMIN'} />
}
