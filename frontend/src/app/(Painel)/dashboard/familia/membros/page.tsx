'use client'
import React, { useMemo, useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { DashboardBackground, DashboardContainer, DashboardHeader } from '@/components/dashboard/Page'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Mail, Phone, MapPin, Cake, UserPlus, User } from 'lucide-react'

type Member = {
  id: string
  name: string
  relation: string
  avatar?: string
  email?: string
  phone?: string
  location?: string
  birthDate?: string
  generation: number
}

const familyApi = {
  getMembers: (): Member[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('family-members')
    if (stored) return JSON.parse(stored)
    
    // Dados iniciais
    const initialMembers: Member[] = [
      {
        id: '1', name: 'Carlos Fernandes', relation: 'Pai', 
        email: 'carlos@familia.com', phone: '(11) 99999-9999', location: 'São Paulo, SP',
        birthDate: '1970-05-15', generation: 2
      },
      {
        id: '2', name: 'Maria Fernandes', relation: 'Mãe',
        email: 'maria@familia.com', phone: '(11) 98888-8888', location: 'São Paulo, SP', 
        birthDate: '1972-08-22', generation: 2
      },
      {
        id: '3', name: 'Sofia Fernandes', relation: 'Filha',
        email: 'sofia@familia.com', phone: '(11) 97777-7777', location: 'São Paulo, SP',
        birthDate: '2000-03-10', generation: 3
      },
      {
        id: '4', name: 'Lucas Fernandes', relation: 'Filho',
        email: 'lucas@familia.com', phone: '(11) 96666-6666', location: 'São Paulo, SP',
        birthDate: '2005-11-30', generation: 3
      },
      {
        id: '5', name: 'João Silva', relation: 'Avô Paterno',
        email: 'joao@familia.com', phone: '(11) 95555-5555', location: 'Santos, SP',
        birthDate: '1945-02-14', generation: 1
      },
      {
        id: '6', name: 'Ana Silva', relation: 'Avó Paterna', 
        email: 'ana@familia.com', phone: '(11) 94444-4444', location: 'Santos, SP',
        birthDate: '1947-07-08', generation: 1
      },
    ]
    localStorage.setItem('family-members', JSON.stringify(initialMembers))
    return initialMembers
  },
}

const generationColors = {
  1: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  2: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', 
  3: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  4: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
}

export default function MembroFamiliar() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | number>('all')

  useEffect(() => {
    const loadMembers = () => {
      try {
        const storedMembers = familyApi.getMembers()
        setMembers(storedMembers)
      } catch (error) {
        console.error('Erro ao carregar membros:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadMembers()
  }, [])

  const filteredMembers = useMemo(() => {
    if (filter === 'all') return members
    return members.filter(member => member.generation === filter)
  }, [members, filter])

  const generations = useMemo(() => {
    const gens = new Set(members.map(m => m.generation))
    return Array.from(gens).sort()
  }, [members])

  const formatBirthDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (isLoading) {
    return (
      <DashboardBackground>
        <DashboardContainer className="max-w-6xl">
          <DashboardHeader title="Membros da Família" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-48 bg-slate-800 border-slate-700 animate-pulse" />
            ))}
          </div>
        </DashboardContainer>
      </DashboardBackground>
    )
  }

  return (
    <DashboardBackground >
      <DashboardContainer className="max-w-7xl">
        <DashboardHeader 
          title="Membros da Família"
          subtitle={`${members.length} membros encontrados em ${generations.length} gerações`}
          actions={
            <Button className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/25">
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar Membro
            </Button>
          }
        />

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' 
              ? 'bg-emerald-600 text-white' 
              : 'border-slate-600 text-slate-300 hover:bg-slate-700'
            }
          >
            Todos
          </Button>
          {generations.map(gen => (
            <Button
              key={gen}
              variant={filter === gen ? 'default' : 'outline'}
              onClick={() => setFilter(gen)}
              className={filter === gen 
                ? 'bg-emerald-600 text-white' 
                : 'border-slate-600 text-slate-300 hover:bg-slate-700'
              }
            >
              Geração {gen}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="p-6 bg-slate-800 border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-14 h-14 border-2 border-emerald-500/20">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-cyan-600 text-white font-bold text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-white font-semibold group-hover:text-emerald-400 transition-colors">
                      {member.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={generationColors[member.generation as keyof typeof generationColors]}>
                        Geração {member.generation}
                      </Badge>
                      <Badge variant="outline" className="border-slate-600 text-slate-400">
                        {member.relation}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-700">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-2">
                {member.email && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                )}
                {member.location && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{member.location}</span>
                  </div>
                )}
                {member.birthDate && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Cake className="w-4 h-4" />
                    <span>Nascimento: {formatBirthDate(member.birthDate)}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <Card className="p-8 bg-slate-800 border-slate-700 text-center">
            <User className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">Nenhum membro encontrado</h3>
            <p className="text-slate-500">Tente alterar os filtros de busca</p>
          </Card>
        )}
      </DashboardContainer>
    </DashboardBackground>
  )
}