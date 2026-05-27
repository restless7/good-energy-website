import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Shield } from 'lucide-react'
import { getAllPartnerProfilesAction } from './actions'
import { getUsersAction } from '@/app/actions/users'
import PartnersMasterClient from './PartnersMasterClient'

function AccessDenied() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full bg-[#0E4D58] rounded-2xl border border-red-500/20 p-8 text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <Shield className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-[#FFFDF0] mb-2">Acceso Restringido</h2>
        <p className="text-[#8CB4BC] text-sm leading-relaxed">
          Esta sección es exclusiva para <strong className="text-red-400">Super Administradores</strong>.
        </p>
      </div>
    </div>
  )
}

export default async function PartnersPage() {
  const { userId, sessionClaims } = await auth()

  if (!userId) redirect('/sign-in?redirect_url=/admin/partners')

  const role = (sessionClaims?.metadata as Record<string, unknown> | undefined)?.role as string | undefined
  if (role !== 'SUPER_ADMIN') return <AccessDenied />

  const [profilesResult, allClerkUsers] = await Promise.all([
    getAllPartnerProfilesAction(),
    getUsersAction(100, 0).catch(() => []),
  ])

  const partnerClerkUsers = allClerkUsers.filter((u) => u.role === 'PARTNER')

  return (
    <PartnersMasterClient
      initialProfiles={profilesResult.data ?? []}
      partnerClerkUsers={partnerClerkUsers}
      currentUserId={userId}
    />
  )
}
