'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Users, UserPlus, MailQuestion, Settings, TreePine, Heart, Shield, Send } from 'lucide-react'
import { DashboardBackground, DashboardContainer, DashboardHeader } from '@/components/dashboard/Page'
import { Card } from '@/components/ui/card'

interface FamilyStats {
  members: number
  pendingInvites: number
  generations: number
  branches: number
}

export default function Familia() {
  const [stats, setStats] = useState<FamilyStats>({
    members: 0,
    pendingInvites: 0,
    generations: 0,
    branches: 0
  })

  useEffect(() => {
    // Carregar dados do localStorage
    // Use setState em callbacks assíncronos para evitar renders em cascata
    const loadStats = () => {
      const savedStats = localStorage.getItem('family-stats')
      if (savedStats) {
        setStats(JSON.parse(savedStats))
      } else {
        // Dados iniciais
        const initialStats = {
          members: 0,
          pendingInvites: 0,
          generations: 0,
          branches: 0
        }
        setStats(initialStats)
        localStorage.setItem('family-stats', JSON.stringify(initialStats))
      }
    }
    // Pequeno timeout para simular async/load e evitar render síncrono
    setTimeout(loadStats, 0)
  }, [])

  const features = [
    {
      icon: Users,
      title: 'Membros',
      description: 'Veja e gerencie todos os membros da família',
      href: '/dashboard/familia/membros',
      color: 'from-blue-500 to-cyan-500',
      count: stats.members
    },
    {
      icon: MailQuestion,
      title: 'Convites',
      description: 'Gerencie convites pendentes e enviados',
      href: '/dashboard/familia/convites-pendentes',
      color: 'from-amber-500 to-orange-500',
      count: stats.pendingInvites
    },
    {
      icon: Settings,
      title: 'Configurar',
      description: 'Personalize as configurações da família',
      href: '/dashboard/familia/configurar-familia',
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: TreePine,
      title: 'Árvore Genealógica',
      description: 'Explore e edite sua árvore familiar',
      href: '/dashboard/arvore-genealogica',
      color: 'from-purple-500 to-pink-500',
      count: stats.generations
    },
    {
      icon: Heart,
      title: 'Memórias',
      description: 'Compartilhe e visualize memórias familiares',
      href: '/dashboard/feed',
      color: 'from-rose-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'Privacidade',
      description: 'Controle a privacidade dos dados familiares',
      href: '/dashboard/familia/privacidade',
      color: 'from-slate-500 to-gray-500'
    }
  ]

  return (
    <DashboardBackground>
      <DashboardContainer className="max-w-6xl">
        <DashboardHeader
          title="Família"
          subtitle="Gerencie membros, convites e configurações da família"
          actions={
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/dashboard/familia/membros">
                <Button 
                  variant="outline" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Membros
                </Button>
              </Link>
              <Link href="/dashboard/familia/convites-pendentes">
                <Button className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/25 transition-all duration-300">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Convite
                </Button>
              </Link>
            </div>
          }
        />

        {/* Grade de Funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700 shadow-xl hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 group cursor-pointer h-full hover:scale-105">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold group-hover:text-emerald-400 transition-colors">
                        {feature.title}
                      </h3>
                      {feature.count !== undefined && (
                        <span className="bg-slate-700 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full">
                          {feature.count}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Membros</p>
                <p className="text-2xl font-bold text-white">{stats.members}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-400 text-sm font-medium">Convites</p>
                <p className="text-2xl font-bold text-white">{stats.pendingInvites}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <MailQuestion className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-400 text-sm font-medium">Gerações</p>
                <p className="text-2xl font-bold text-white">{stats.generations}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <TreePine className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Ramos</p>
                <p className="text-2xl font-bold text-white">{stats.branches}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <TreePine className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </Card>
        </div>
      </DashboardContainer>
    </DashboardBackground>
  )
}