'use client'
import React, { useMemo, useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

type Event = {
  id: string
  title: string
  date: string
  time?: string
  location?: string
  type: 'reuniao' | 'aniversario' | 'celebracao' | 'outro'
}

const eventsApi = {
  getEvents: (): Event[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('family-events')
    return stored ? JSON.parse(stored) : []
  },
}

const eventTypeColors = {
  reuniao: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  aniversario: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  celebracao: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  outro: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
}

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export default function Calendario() {
  const [current, setCurrent] = useState(() => new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadEvents = () => {
      try {
        const storedEvents = eventsApi.getEvents()
        setEvents(storedEvents)
      } catch (error) {
        console.error('Erro ao carregar eventos:', error)
      }
    }
    loadEvents()
  }, [])

  const days = useMemo(() => {
    const first = new Date(current.getFullYear(), current.getMonth(), 1)
    const last = new Date(current.getFullYear(), current.getMonth() + 1, 0)
    const startWeekday = first.getDay()
    const totalDays = last.getDate()
    
    const daysArray = []
    
    // Dias do mês anterior
    const prevMonthLast = new Date(current.getFullYear(), current.getMonth(), 0)
    for (let i = startWeekday - 1; i >= 0; i--) {
      daysArray.push(new Date(current.getFullYear(), current.getMonth() - 1, prevMonthLast.getDate() - i))
    }
    
    // Dias do mês atual
    for (let i = 1; i <= totalDays; i++) {
      daysArray.push(new Date(current.getFullYear(), current.getMonth(), i))
    }
    
    // Dias do próximo mês
    const remaining = 42 - daysArray.length
    for (let i = 1; i <= remaining; i++) {
      daysArray.push(new Date(current.getFullYear(), current.getMonth() + 1, i))
    }
    
    return daysArray
  }, [current])

  const eventsByDay = useMemo(() => {
    const map = new Map<string, Event[]>()
    events.forEach((e) => {
      const d = new Date(e.date)
      const key = d.toDateString()
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(e)
    })
    return map
  }, [events])

  const prevMonth = () => {
    setCurrent((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrent((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === current.getMonth() && date.getFullYear() === current.getFullYear()
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const monthLabel = `${months[current.getMonth()]} ${current.getFullYear()}`

  const selectedDateEvents = selectedDate ? eventsByDay.get(selectedDate.toDateString()) || [] : []

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Calendário Familiar
            </h1>
            <p className="text-slate-400">Acompanhe todos os eventos da família em um só lugar</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={prevMonth} 
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">{monthLabel}</h2>
              <p className="text-slate-400 text-sm">
                {events.length} eventos este mês
              </p>
            </div>
            
            <Button 
              onClick={nextMonth} 
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendário */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700 shadow-2xl">
              <div className="p-6">
                {/* Dias da semana */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {weekDays.map((day) => (
                    <div key={day} className="text-center text-slate-400 font-medium text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Grid de dias */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((date, idx) => {
                    const dateEvents = eventsByDay.get(date.toDateString()) || []
                    const isCurrent = isCurrentMonth(date)
                    const isTodayDate = isToday(date)
                    const isSelected = selectedDate?.toDateString() === date.toDateString()

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedDate(date)}
                        className={`
                          relative min-h-24 p-2 rounded-lg border-2 transition-all duration-200
                          ${isCurrent ? 'bg-slate-750' : 'bg-slate-800/50'}
                          ${isTodayDate ? 'border-emerald-500' : 'border-transparent'}
                          ${isSelected ? 'ring-2 ring-cyan-500' : ''}
                          hover:border-slate-500 hover:bg-slate-700
                          ${!isCurrent ? 'opacity-40' : ''}
                        `}
                      >
                        <div className={`
                          text-sm font-medium mb-1
                          ${isTodayDate ? 'text-emerald-400' : 'text-slate-300'}
                          ${!isCurrent ? 'text-slate-500' : ''}
                        `}>
                          {date.getDate()}
                        </div>

                        <div className="space-y-1">
                          {dateEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`
                                text-xs rounded px-1 py-0.5 truncate border
                                ${eventTypeColors[event.type]}
                              `}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dateEvents.length > 2 && (
                            <div className="text-xs text-slate-500">
                              +{dateEvents.length - 2} mais
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Painel de Eventos */}
          <div className="space-y-6">
            {/* Eventos do dia selecionado */}
            <Card className="bg-slate-800 border-slate-700 shadow-2xl">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CalendarIcon className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">
                    {selectedDate ? 
                      `Eventos em ${selectedDate.toLocaleDateString('pt-BR')}` : 
                      'Selecione uma data'
                    }
                  </h3>
                </div>

                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 rounded-lg bg-slate-700 border border-slate-600 hover:border-slate-500 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-white font-medium text-sm">{event.title}</h4>
                          <Badge className={`text-xs ${eventTypeColors[event.type]}`}>
                            {event.type}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-xs text-slate-400">
                          {event.time && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {event.time}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">
                      {selectedDate ? 'Nenhum evento nesta data' : 'Selecione uma data para ver os eventos'}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Estatísticas do Mês */}
            <Card className="bg-slate-800 border-slate-700 shadow-2xl">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Resumo do Mês</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Total de eventos</span>
                    <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                      {events.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Reuniões</span>
                    <span className="text-blue-400 text-sm">
                      {events.filter(e => e.type === 'reuniao').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Aniversários</span>
                    <span className="text-amber-400 text-sm">
                      {events.filter(e => e.type === 'aniversario').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Celebrações</span>
                    <span className="text-emerald-400 text-sm">
                      {events.filter(e => e.type === 'celebracao').length}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}