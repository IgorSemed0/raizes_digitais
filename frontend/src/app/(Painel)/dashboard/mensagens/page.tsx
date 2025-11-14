'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient, ApiResponse } from '@/lib/api'
import { useAuthToken, useAuthUser } from '@/stores/auth-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DashboardBackground, DashboardContainer, DashboardHeader } from '@/components/dashboard/Page'
import { Send, MessageSquare, Users } from 'lucide-react'

type Conversation = {
  id: string
  title: string
  lastMessage?: string
}

type Message = {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
}

export default function Mensagens() {
  const token = useAuthToken() ?? undefined
  const user = useAuthUser()
  const queryClient = useQueryClient()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [text, setText] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)

  const convsQuery = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Conversation[]>>('/messages/conversations', token)
      return res.data
    },
    refetchInterval: 10000,
  })

  const msgsQuery = useQuery({
    queryKey: ['messages', activeId],
    queryFn: async () => {
      if (!activeId) return []
      const res = await apiClient.get<ApiResponse<Message[]>>(`/messages/conversations/${activeId}`, token)
      return res.data
    },
    enabled: !!activeId,
    refetchInterval: 5000,
  })

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!activeId) return
      const res = await apiClient.post<ApiResponse<Message>>(
        `/messages/conversations/${activeId}`,
        { content: text },
        token
      )
      return res.data
    },
    onSuccess: () => {
      setText('')
      queryClient.invalidateQueries({ queryKey: ['messages', activeId] })
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })

  const conversations = useMemo(() => convsQuery.data ?? [], [convsQuery.data])
  const messages = useMemo(() => msgsQuery.data ?? [], [msgsQuery.data])
  const activeConversation = conversations.find((c) => c.id === activeId)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim() && activeId) {
      sendMutation.mutate()
    }
  }

  return (
    <DashboardBackground >
      <DashboardContainer>
        <DashboardHeader 
          title="Mensagens" 
          subtitle="Converse com seus familiares em tempo real"
        />
      </DashboardContainer>
      
      <div className="h-[calc(100vh-8rem)] mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        {/* Sidebar de Conversas */}
        <Card className="md:col-span-1 bg-slate-700 border-slate-600 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-600">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              <h2 className="text-white font-semibold">Conversas</h2>
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
            {convsQuery.isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 border-b border-slate-600 animate-pulse">
                  <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                </div>
              ))
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Nenhuma conversa encontrada</p>
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-left p-4 border-b border-slate-600 transition-all duration-200 ${
                    activeId === c.id 
                      ? 'bg-emerald-800/50 border-l-4 border-l-emerald-400' 
                      : 'hover:bg-slate-600/50'
                  }`}
                >
                  <p className="text-white font-medium truncate">{c.title}</p>
                  <p className="text-slate-300 text-sm truncate mt-1">
                    {c.lastMessage || 'Nenhuma mensagem ainda'}
                  </p>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Área de Mensagens */}
        <Card className="md:col-span-3 bg-slate-700 border-slate-600 rounded-xl flex flex-col">
          {/* Header da Conversa */}
          <div className="p-4 border-b border-slate-600">
            <h2 className="text-white font-semibold text-lg">
              {activeConversation?.title || 'Selecione uma conversa'}
            </h2>
            {activeConversation && (
              <p className="text-slate-300 text-sm">
                {conversations.length} participantes
              </p>
            )}
          </div>

          {/* Área de Mensagens */}
          <div 
            ref={listRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-600/20"
          >
            {!activeId ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-slate-400">
                <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">Selecione uma conversa para começar</p>
                <p className="text-sm mt-2">ou crie uma nova conversa</p>
              </div>
            ) : msgsQuery.isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-start animate-pulse">
                  <div className="max-w-[70%]">
                    <div className="h-4 bg-slate-600 rounded w-32 mb-1"></div>
                    <div className="h-12 bg-slate-600 rounded-lg"></div>
                  </div>
                </div>
              ))
            ) : messages.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-slate-400">
                <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
                <p>Nenhuma mensagem ainda</p>
                <p className="text-sm">Seja o primeiro a enviar uma mensagem!</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMine = m.senderId === user?.id
                return (
                  <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 transition-all duration-200 ${
                        isMine 
                          ? 'bg-emerald-800 text-emerald-50 rounded-br-none' 
                          : 'bg-slate-600 text-white rounded-bl-none'
                      }`}
                    >
                      <div className="text-sm">{m.content}</div>
                      <div className={`text-xs mt-1 ${isMine ? 'text-emerald-200' : 'text-slate-300'}`}>
                        {new Date(m.createdAt).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Input de Mensagem */}
          {activeId && (
            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-600">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Escreva sua mensagem..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={!activeId || sendMutation.isPending}
                  className="flex-1 bg-slate-600 border-slate-500 text-white placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <Button 
                  type="submit"
                  disabled={!activeId || !text.trim() || sendMutation.isPending}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </DashboardBackground>
  )
}