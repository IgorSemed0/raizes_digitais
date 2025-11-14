'use client'
import React, { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, ApiResponse } from '@/lib/api'
import { useAuthToken } from '@/stores/auth-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DashboardBackground, DashboardContainer, DashboardHeader, DashboardSection } from '@/components/dashboard/Page'
import { Bell, MessageCircle, Heart, UserPlus, Calendar, Check } from 'lucide-react'

type Notification = {
  id: string
  type: 'comment' | 'like' | 'invite' | 'event'
  text: string
  createdAt: string
  read: boolean
}

const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  const iconProps = { className: "w-5 h-5", size: 20 }
  
  switch (type) {
    case 'comment':
      return <MessageCircle {...iconProps} />
    case 'like':
      return <Heart {...iconProps} />
    case 'invite':
      return <UserPlus {...iconProps} />
    case 'event':
      return <Calendar {...iconProps} />
    default:
      return <Bell {...iconProps} />
  }
}

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'comment':
      return 'bg-blue-500'
    case 'like':
      return 'bg-pink-500'
    case 'invite':
      return 'bg-purple-500'
    case 'event':
      return 'bg-orange-500'
    default:
      return 'bg-emerald-600'
  }
}

export default function Notificacoes() {
  const token = useAuthToken() ?? undefined
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Notification[]>>('/notifications', token)
      return res.data
    },
    refetchInterval: 8000,
  })

  const markMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.post<ApiResponse<{ id: string }>>(`/notifications/${id}/read`, {}, token)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const notifications = useMemo(() => data ?? [], [data])

  return (
    <DashboardBackground >
      <DashboardContainer className="max-w-2xl mx-auto p-4">
        <DashboardHeader 
          title="Notificações" 
          className="mb-6 text-2xl font-bold text-white"
        />
        
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-4 bg-slate-700 border-slate-600 animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-600"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <DashboardSection className="text-center py-12">
            <div className="bg-slate-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Sem notificações</h3>
            <p className="text-slate-400">Você está em dia com todas as atualizações!</p>
          </DashboardSection>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`
                  p-4 transition-all duration-200 border-l-4
                  ${notification.read 
                    ? 'bg-slate-700 border-slate-600 opacity-60' 
                    : 'bg-slate-700 border-emerald-500 shadow-lg'
                  }
                  hover:bg-slate-600 hover:shadow-xl
                `}
              >
                <div className="flex items-start gap-4">
                  <div className={`${getNotificationColor(notification.type)} p-2 rounded-full`}>
                    <NotificationIcon type={notification.type}  />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium leading-tight">
                      {notification.text}
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      {new Date(notification.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>

                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markMutation.mutate(notification.id)}
                      disabled={markMutation.isPending}
                      className="
                        text-emerald-400 hover:text-emerald-300 
                        hover:bg-emerald-600/20 transition-colors
                        flex items-center gap-1
                      "
                    >
                      <Check size={16} />
                      <span className="hidden sm:inline">Marcar lida</span>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </DashboardContainer>
    </DashboardBackground>
  )
}