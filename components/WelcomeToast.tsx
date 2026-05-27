'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Zap } from 'lucide-react'

/**
 * Renders nothing — fires a welcome toast once when ?welcome=1 is in the URL.
 * Drop this into any layout or page that is the post-sign-up landing destination.
 */
export default function WelcomeToast() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('welcome') === '1') {
      toast.success('¡Bienvenido a Good Energy!', {
        description: 'Tu cuenta de inversionista ha sido inicializada. Explora tu dashboard.',
        duration: 6000,
        icon: <Zap className="w-4 h-4 text-[#D8DA00]" />,
      })

      // Remove the param from URL without triggering a navigation
      const url = new URL(window.location.href)
      url.searchParams.delete('welcome')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])

  return null
}
