'use client'
import React from 'react'
import { useAuthUser } from '@/stores/auth-store'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DashboardBackground, DashboardContainer, DashboardHeader, DashboardSection } from '@/components/dashboard/Page'

export default function Perfil() {
  const user = useAuthUser()
  return (
    <DashboardBackground>
      <DashboardContainer className="max-w-3xl">
        <DashboardHeader
          title="Meu Perfil"
          actions={
            <Link href="/dashboard/perfil/editar">
              <Button>Editar</Button>
            </Link>
          }
        />
        <DashboardSection>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-(--dark-bg)">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {user?.vc_foto_perfil ? (
                <img src={user.vc_foto_perfil} alt={user.vc_user_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-(--text-secondary) text-2xl">
                  {user?.vc_user_name?.charAt(0) ?? 'U'}
                </div>
              )}
            </div>
            <div>
              <p className="text-(--text-primary) text-lg">{user?.vc_user_name ?? 'Usuário'}</p>
              <p className="text-(--text-secondary)">{user?.email}</p>
            </div>
          </div>
        </DashboardSection>
      </DashboardContainer>
    </DashboardBackground>
  )
}
