'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Loader2, Users, Share2, MoreHorizontal, Trash2, Edit, Link } from 'lucide-react'
import { DashboardBackground, DashboardContainer, DashboardHeader } from '@/components/dashboard/Page'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Event = {
  id: string
  title: string
  date: string
  time?: string
  location?: string
  description?: string
  type: 'reuniao' | 'aniversario' | 'celebracao' | 'outro'
  createdBy: string
  createdAt: string
  participants?: string[]
}

// API Local - SEM dados fictícios
const eventsApi = {
  getEvents: (): Event[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('family-events')
    return stored ? JSON.parse(stored) : []
  },

  createEvent: (event: Omit<Event, 'id' | 'createdAt'>): Event => {
    const events = eventsApi.getEvents()
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    const updatedEvents = [...events, newEvent]
    localStorage.setItem('family-events', JSON.stringify(updatedEvents))
    return newEvent
  },

  deleteEvent: (id: string): void => {
    const events = eventsApi.getEvents()
    const updatedEvents = events.filter(event => event.id !== id)
    localStorage.setItem('family-events', JSON.stringify(updatedEvents))
  },

  updateEvent: (id: string, updates: Partial<Event>): void => {
    const events = eventsApi.getEvents()
    const updatedEvents = events.map(event => 
      event.id === id ? { ...event, ...updates } : event
    )
    localStorage.setItem('family-events', JSON.stringify(updatedEvents))
  }
}

const eventTypeColors = {
  reuniao: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  aniversario: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  celebracao: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  outro: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
}

const eventTypeIcons = {
  reuniao: Users,
  aniversario: CalendarIcon,
  celebracao: Share2,
  outro: CalendarIcon
}

const eventTypeLabels = {
  reuniao: 'Reunião',
  aniversario: 'Aniversário',
  celebracao: 'Celebração',
  outro: 'Outro'
}

export default function Eventos() {
  const [events, setEvents] = useState<Event[]>([])
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  // Form state
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<Event['type']>('reuniao')

  // Carregar eventos - SEM dados fictícios
  useEffect(() => {
    const loadEvents = () => {
      setIsLoading(true)
      try {
        const storedEvents = eventsApi.getEvents()
        setEvents(storedEvents)
      } catch (error) {
        console.error('Erro ao carregar eventos:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os eventos.',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }

    // Pequeno delay para mostrar loading state
    const timer = setTimeout(loadEvents, 500)
    return () => clearTimeout(timer)
  }, [toast])

  const createEvent = async () => {
    if (!title || !date) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha pelo menos título e data do evento.',
        variant: 'destructive'
      })
      return
    }

    setIsCreating(true)
    try {
      const newEvent = eventsApi.createEvent({
        title,
        date,
        time,
        location,
        description,
        type,
        createdBy: 'Você'
      })

      setEvents(prev => [...prev, newEvent])
      setOpen(false)
      resetForm()

      toast({
        title: 'Evento criado!',
        description: 'Seu evento foi adicionado com sucesso.',
        variant: 'default'
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o evento.',
        variant: 'destructive'
      })
    } finally {
      setIsCreating(false)
    }
  }

  const deleteEvent = async (id: string) => {
    setIsDeleting(id)
    try {
      eventsApi.deleteEvent(id)
      setEvents(prev => prev.filter(event => event.id !== id))
      toast({
        title: 'Evento excluído',
        description: 'O evento foi removido com sucesso.',
        variant: 'default'
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o evento.',
        variant: 'destructive'
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDate('')
    setTime('')
    setLocation('')
    setDescription('')
    setType('reuniao')
  }

  // Calcular datas para os eventos
  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return events
      .filter(event => event.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [events])

  const pastEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return events
      .filter(event => event.date < today)
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [events])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string, timeString?: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }
    
    let formatted = date.toLocaleDateString('pt-BR', options)
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1)
    
    if (timeString) {
      formatted += ` às ${timeString}`
    }
    
    return formatted
  }

  const getEventColor = (event: Event) => {
    const eventDate = new Date(event.date)
    const today = new Date()
    const diffTime = eventDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'text-slate-500'
    if (diffDays <= 7) return 'text-amber-400'
    if (diffDays <= 30) return 'text-emerald-400'
    return 'text-blue-400'
  }

  // Gerar link para adicionar ao calendário
  const generateCalendarLink = (event: Event) => {
    const startDate = new Date(`${event.date}T${event.time || '12:00:00'}`)
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // +2 horas
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '')
    }

    const details = [
      event.title,
      event.description || '',
      `Local: ${event.location || 'A definir'}`,
      `Tipo: ${eventTypeLabels[event.type]}`
    ].filter(Boolean).join('%0A')

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${formatDate(startDate)}%2F${formatDate(endDate)}&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(event.location || '')}`
  }

  return (
    <DashboardBackground>
      <DashboardContainer className="max-w-4xl">
        <DashboardHeader
          title="Eventos Familiares"
          subtitle="Organize e acompanhe os eventos da sua família"
          actions={
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
                onClick={() => {
                  window.location.href = "/dashboard/eventos/calendario"
                }}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Ver Calendário
              </Button>
              
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/25">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Evento
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      Criar Novo Evento
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-300 font-medium">Título *</label>
                      <Input 
                        placeholder="Ex: Reunião Familiar" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300 font-medium">Data *</label>
                        <Input 
                          type="date" 
                          value={date} 
                          onChange={(e) => setDate(e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-slate-300 font-medium">Hora</label>
                        <Input 
                          type="time" 
                          value={time} 
                          onChange={(e) => setTime(e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-slate-300 font-medium">Local</label>
                      <Input 
                        placeholder="Local do evento" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-slate-300 font-medium">Tipo de Evento</label>
                      <Select value={type} onValueChange={(v) => setType(v as Event['type'])}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                          <SelectItem value="reuniao">Reunião Familiar</SelectItem>
                          <SelectItem value="aniversario">Aniversário</SelectItem>
                          <SelectItem value="celebracao">Celebração</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-slate-300 font-medium">Descrição</label>
                      <Textarea 
                        placeholder="Detalhes do evento..." 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 min-h-[100px]"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setOpen(false)
                          resetForm()
                        }}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={createEvent}
                        disabled={!title || !date || isCreating}
                        className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/25 min-w-32"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            Criando...
                          </>
                        ) : (
                          'Criar Evento'
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          }
        />

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-slate-800 border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total de Eventos</p>
                <p className="text-2xl font-bold text-white">{events.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800 border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Próximos</p>
                <p className="text-2xl font-bold text-emerald-400">{upcomingEvents.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800 border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Passados</p>
                <p className="text-2xl font-bold text-amber-400">{pastEvents.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800 border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Este Mês</p>
                <p className="text-2xl font-bold text-cyan-400">
                  {events.filter(event => {
                    const eventDate = new Date(event.date)
                    const now = new Date()
                    return eventDate.getMonth() === now.getMonth() && 
                           eventDate.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Eventos Futuros */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-white">Próximos Eventos</h2>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              {upcomingEvents.length}
            </Badge>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="h-32 bg-slate-800 border-slate-700 animate-pulse" />
              ))
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => {
                const EventIcon = eventTypeIcons[event.type]
                return (
                  <Card key={event.id} className="bg-slate-800 border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-xl ${eventTypeColors[event.type]} flex items-center justify-center`}>
                            <EventIcon className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                {event.title}
                              </h3>
                              <Badge className={eventTypeColors[event.type]}>
                                {eventTypeLabels[event.type]}
                              </Badge>
                            </div>
                            
                            <div className="mb-3">
                              <p className={`text-lg font-medium ${getEventColor(event)}`}>
                                {formatDateTime(event.date, event.time)}
                              </p>
                              {event.location && (
                                <p className="text-slate-300 text-sm mt-1 flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {event.location}
                                </p>
                              )}
                            </div>

                            {event.description && (
                              <p className="text-slate-300 text-sm mb-3">{event.description}</p>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="bg-slate-600 text-slate-300 text-xs">
                                    {event.createdBy[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-slate-400 text-sm">Criado por {event.createdBy}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-slate-400 hover:text-emerald-400"
                                  onClick={() => window.open(generateCalendarLink(event), '_blank')}
                                >
                                  <Link className="w-4 h-4 mr-1" />
                                  Adicionar ao Calendário
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-slate-400 hover:text-red-400"
                            onClick={() => deleteEvent(event.id)}
                            disabled={isDeleting === event.id}
                          >
                            {isDeleting === event.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })
            ) : (
              <Card className="p-8 bg-slate-800 border-slate-700 text-center">
                <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-400 mb-2">Nenhum evento futuro</h3>
                <p className="text-slate-500 mb-4">Crie o primeiro evento para sua família!</p>
                <Button 
                  onClick={() => setOpen(true)}
                  className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Evento
                </Button>
              </Card>
            )}
          </div>
        </div>

        {/* Eventos Passados */}
        {pastEvents.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-slate-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-white">Eventos Passados</h2>
              <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
                {pastEvents.length}
              </Badge>
            </div>

            <div className="space-y-4">
              {pastEvents.map((event) => {
                const EventIcon = eventTypeIcons[event.type]
                return (
                  <Card key={event.id} className="bg-slate-800 border-slate-700 opacity-70 hover:opacity-100 transition-opacity">
                    <div className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg ${eventTypeColors[event.type]} flex items-center justify-center`}>
                          <EventIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-slate-300 font-medium">{event.title}</h4>
                          <div className="flex items-center gap-3 text-slate-500 text-sm mt-1">
                            <span>{formatDate(event.date)}</span>
                            {event.location && <span>• {event.location}</span>}
                          </div>
                        </div>
                        <Badge variant="outline" className="border-slate-600 text-slate-500">
                          Concluído
                        </Badge>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </DashboardContainer>
    </DashboardBackground>
  )
}