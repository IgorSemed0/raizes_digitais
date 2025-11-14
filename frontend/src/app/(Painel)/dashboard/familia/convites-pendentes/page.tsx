'use client'
import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DashboardBackground, DashboardContainer, DashboardHeader } from '@/components/dashboard/Page'
import { MailQuestion, X, Clock, User, Calendar } from 'lucide-react'

interface Invite {
  id: string
  email: string
  relation?: string
  sentAt: string
  status: 'pending' | 'accepted' | 'cancelled'
}

export default function ConvitesPendentes() {
  const [invites, setInvites] = useState<Invite[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      const savedInvites = localStorage.getItem('family-invites')
      if (savedInvites) {
        setInvites(JSON.parse(savedInvites))
      } else {
        // Dados iniciais
        const initialInvites: Invite[] = [
          {
            id: '1',
            email: 'maria.silva@email.com',
            relation: 'Prima',
            sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
          },
          {
            id: '2',
            email: 'carlos.santos@email.com',
            relation: 'Tio',
            sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending'
          }
        ]
        setInvites(initialInvites)
        localStorage.setItem('family-invites', JSON.stringify(initialInvites))
      }
      setIsLoading(false)
    }, 1000)
  }, [])

  const cancelInvite = (id: string) => {
    const updatedInvites = invites.map(invite => 
      invite.id === id ? { ...invite, status: 'cancelled' } : invite
    )
    setInvites(updatedInvites as Invite[])
    localStorage.setItem('family-invites', JSON.stringify(updatedInvites))
    
    // Atualizar estatísticas
    const stats = JSON.parse(localStorage.getItem('family-stats') || '{}')
    localStorage.setItem('family-stats', JSON.stringify({
      ...stats,
      pendingInvites: Math.max(0, (stats.pendingInvites || 0) - 1)
    }))
  }

  const pendingInvites = invites.filter(invite => invite.status === 'pending')

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}h atrás`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} dia${diffInDays > 1 ? 's' : ''} atrás`
    }
  }

  return (
    <DashboardBackground >
      <DashboardContainer className="max-w-4xl">
        <DashboardHeader 
          title="Convites Pendentes"
          subtitle="Gerencie os convites enviados para novos membros"
        />
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 bg-slate-800/50 border-slate-700 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-700 rounded w-48"></div>
                    <div className="h-3 bg-slate-700 rounded w-32"></div>
                  </div>
                  <div className="h-9 bg-slate-700 rounded w-24"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : pendingInvites.length === 0 ? (
          <Card className="p-8 bg-slate-800/50 border-slate-700 text-center">
            <div className="bg-slate-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MailQuestion className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum convite pendente</h3>
            <p className="text-slate-400 mb-6">Todos os convites foram respondidos ou não há convites enviados.</p>
            <Button className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white">
              <User className="w-4 h-4 mr-2" />
              Convidar Membro
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingInvites.map((invite) => (
              <Card 
                key={invite.id} 
                className="p-6 bg-slate-800/50 border-l-4 border-amber-500 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-amber-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="text-white font-semibold truncate">{invite.email}</p>
                        <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getTimeAgo(invite.sentAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {invite.relation || 'Parentesco não informado'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(invite.sentAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => cancelInvite(invite.id)}
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-600/20 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Convites Recentes (Histórico) */}
        {!isLoading && invites.some(inv => inv.status !== 'pending') && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-white mb-4">Histórico de Convites</h3>
            <div className="space-y-3">
              {invites
                .filter(invite => invite.status !== 'pending')
                .map((invite) => (
                  <Card key={invite.id} className="p-4 bg-slate-800/30 border-slate-700 opacity-75">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{invite.email}</p>
                        <p className="text-slate-400 text-sm">
                          {invite.status === 'accepted' ? 'Aceito' : 'Cancelado'} • {new Date(invite.sentAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        invite.status === 'accepted' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {invite.status === 'accepted' ? 'Aceito' : 'Cancelado'}
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </DashboardContainer>
    </DashboardBackground>
  )
}