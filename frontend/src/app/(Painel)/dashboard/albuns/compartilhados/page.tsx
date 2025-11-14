'use client'
import React, { useMemo, useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { Users, LockIcon, Globe2, Filter, Calendar, User, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DashboardBackground, DashboardContainer, DashboardHeader } from '@/components/dashboard/Page'
import { Badge } from '@/components/ui/badge'

type SharedAlbum = {
  id: string
  title: string
  coverUrl?: string
  visibility: 'public' | 'family' | 'private'
  mediaCount: number
  ownerName: string
  createdAt: string
  description?: string
}

// Simulação de API local
const sharedAlbumsApi = {
  getSharedAlbums: (): SharedAlbum[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('shared-albums')
    if (stored) return JSON.parse(stored)
    
    const initialAlbums: SharedAlbum[] = [
      {
        id: '1',
        title: 'Casamento Ana & João',
        coverUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed',
        visibility: 'public',
        mediaCount: 156,
        ownerName: 'Ana Silva',
        createdAt: '2024-01-10T14:30:00Z',
        description: 'Fotos do nosso dia especial 💕'
      },
      {
        id: '2',
        title: 'Aniversário Vovó Maria',
        coverUrl: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659',
        visibility: 'family',
        mediaCount: 89,
        ownerName: 'Carlos Fernandes',
        createdAt: '2024-01-05T09:15:00Z'
      },
      {
        id: '3',
        title: 'Formatura Lucas',
        visibility: 'private',
        mediaCount: 42,
        ownerName: 'Maria Fernandes',
        createdAt: '2024-01-15T16:45:00Z'
      }
    ]
    localStorage.setItem('shared-albums', JSON.stringify(initialAlbums))
    return initialAlbums
  }
}

const visibilityConfig = {
  public: { icon: Globe, label: 'Público', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  family: { icon: Users, label: 'Família', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  private: { icon: Lock, label: 'Privado', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }
}

function Globe({ className }: { className?: string }) { return <span className={className}>🌎</span> }
function Lock({ className }: { className?: string }) { return <span className={className}>🔒</span> }

function VisibilityBadge({ visibility }: { visibility: 'public' | 'family' | 'private' }) {
  const config = visibilityConfig[visibility]
  const Icon = config.icon
  return (
    <Badge className={config.color}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}

export default function Compartilhado() {
  const [albums, setAlbums] = useState<SharedAlbum[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [visibility, setVisibility] = useState<'all' | 'public' | 'family' | 'private'>('all')

  useEffect(() => {
    const loadAlbums = () => {
      try {
        const sharedAlbums = sharedAlbumsApi.getSharedAlbums()
        setAlbums(sharedAlbums)
      } catch (error) {
        console.error('Erro ao carregar álbuns compartilhados:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadAlbums()
  }, [])

  const filteredAlbums = useMemo(() => {
    return albums.filter(album => {
      const matchesQuery = album.title.toLowerCase().includes(query.toLowerCase()) ||
                          album.ownerName.toLowerCase().includes(query.toLowerCase())
      const matchesVisibility = visibility === 'all' || album.visibility === visibility
      return matchesQuery && matchesVisibility
    })
  }, [albums, query, visibility])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <DashboardBackground >
      <DashboardContainer className="max-w-7xl">
        <DashboardHeader
          title="Álbuns Compartilhados"
          subtitle="Acesse coleções compartilhadas com você"
          actions={
            <div className="flex items-center gap-4">
              <div className="relative">
                <Input
                  placeholder="Buscar álbuns..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500 w-64"
                />
                <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <Select value={visibility} onValueChange={(v) => setVisibility(v as typeof visibility)}>
                <SelectTrigger className="min-w-40 bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Visibilidade" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="public">Público</SelectItem>
                  <SelectItem value="family">Família</SelectItem>
                  <SelectItem value="private">Privado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-slate-800 border-slate-700 overflow-hidden">
                <div className="aspect-4/3 animate-pulse bg-slate-700" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-700 rounded animate-pulse" />
                  <div className="h-3 bg-slate-700 rounded animate-pulse w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredAlbums.length === 0 ? (
          <Card className="p-8 bg-slate-800 border-slate-700 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">Nenhum álbum encontrado</h3>
            <p className="text-slate-500">
              {query || visibility !== 'all' 
                ? 'Tente ajustar os filtros de busca' 
                : 'Nenhum álbum foi compartilhado com você ainda'
              }
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlbums.map((album) => (
              <Link key={album.id} href={`/dashboard/albuns/${album.id}`}>
                <Card className="bg-slate-800 border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden">
                  <div className="relative aspect-4/3 bg-slate-700 overflow-hidden">
                    {album.coverUrl ? (
                      <ImageWithFallback
                        src={album.coverUrl}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 group-hover:text-slate-300 transition-colors">
                        <Users className="w-12 h-12" />
                      </div>
                    )}
                    
                    {/* Overlay no hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end justify-between p-3">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <VisibilityBadge visibility={album.visibility} />
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-lg bg-black/50 text-white hover:bg-black/70">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-semibold group-hover:text-emerald-400 transition-colors line-clamp-2 flex-1">
                        {album.title}
                      </h3>
                      <span className="text-slate-400 text-sm bg-slate-700 px-2 py-1 rounded-lg ml-2">
                        {album.mediaCount}
                      </span>
                    </div>
                    
                    {album.description && (
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">{album.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between text-slate-500 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        <span>por {album.ownerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(album.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Estatísticas */}
        {!isLoading && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-slate-800 border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total de Álbuns</p>
                  <p className="text-2xl font-bold text-white">{filteredAlbums.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-slate-800 border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Públicos</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    {filteredAlbums.filter(a => a.visibility === 'public').length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-slate-800 border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Familiares</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {filteredAlbums.filter(a => a.visibility === 'family').length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-slate-800 border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Privados</p>
                  <p className="text-2xl font-bold text-slate-400">
                    {filteredAlbums.filter(a => a.visibility === 'private').length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-slate-500/20 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            </Card>
          </div>
        )}
      </DashboardContainer>
    </DashboardBackground>
  )
}