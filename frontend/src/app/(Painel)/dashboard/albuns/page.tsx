'use client'
import React, { useMemo, useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { Plus, Lock, Globe, Users, Loader2, Calendar, User, MoreHorizontal } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { DashboardBackground, DashboardContainer, DashboardHeader } from '@/components/dashboard/Page'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

type AlbumVisibility = 'public' | 'family' | 'private'

type Album = {
  id: string
  title: string
  coverUrl?: string
  visibility: AlbumVisibility
  mediaCount: number
  createdAt: string
  description?: string
  createdBy: string
}

// API Local sem dados fictícios
const albumsApi = {
  getAlbums: (): Album[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem('user-albums')
    return stored ? JSON.parse(stored) : []
  },

  createAlbum: (album: Omit<Album, 'id' | 'createdAt' | 'mediaCount'>): Album => {
    const albums = albumsApi.getAlbums()
    const newAlbum: Album = {
      ...album,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      mediaCount: 0
    }
    const updatedAlbums = [...albums, newAlbum]
    localStorage.setItem('user-albums', JSON.stringify(updatedAlbums))
    return newAlbum
  },

  updateAlbum: (albumId: string, updates: Partial<Album>): void => {
    const albums = albumsApi.getAlbums()
    const updatedAlbums = albums.map(album => 
      album.id === albumId ? { ...album, ...updates } : album
    )
    localStorage.setItem('user-albums', JSON.stringify(updatedAlbums))
  },

  deleteAlbum: (albumId: string): void => {
    const albums = albumsApi.getAlbums()
    const updatedAlbums = albums.filter(album => album.id !== albumId)
    localStorage.setItem('user-albums', JSON.stringify(updatedAlbums))
  }
}

const visibilityConfig = {
  public: { icon: Globe, label: 'Público', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  family: { icon: Users, label: 'Família', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  private: { icon: Lock, label: 'Privado', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }
}

function VisibilityBadge({ visibility }: { visibility: AlbumVisibility }) {
  const config = visibilityConfig[visibility]
  const Icon = config.icon
  return (
    <Badge variant="outline" className={config.color}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}

export default function Albums() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<AlbumVisibility>('family')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  // Carregar álbuns do localStorage
  useEffect(() => {
    const loadAlbums = () => {
      try {
        const userAlbums = albumsApi.getAlbums()
        setAlbums(userAlbums)
      } catch (error) {
        console.error('Erro ao carregar álbuns:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os álbuns.',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadAlbums()
  }, [toast])

  const handleCreateAlbum = async () => {
    if (!title.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'O título do álbum é obrigatório.',
        variant: 'destructive'
      })
      return
    }

    setIsCreating(true)
    try {
      // Upload da capa real
      let coverUrl: string | undefined
      if (coverFile) {
        // Em produção, aqui você faria upload para um servidor
        // Por enquanto, vamos usar URL.createObjectURL para preview local
        coverUrl = URL.createObjectURL(coverFile)
      }

      const newAlbum = albumsApi.createAlbum({
        title: title.trim(),
        description: description.trim() || undefined,
        visibility,
        coverUrl,
        createdBy: 'Você'
      })

      setAlbums(prev => [...prev, newAlbum])
      setDialogOpen(false)
      resetForm()

      toast({
        title: 'Álbum criado!',
        description: 'Seu álbum foi criado com sucesso.',
        variant: 'default'
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o álbum.',
        variant: 'destructive'
      })
    } finally {
      setIsCreating(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setVisibility('family')
    setCoverFile(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const totalMedia = useMemo(() => 
    albums.reduce((sum, album) => sum + album.mediaCount, 0), 
    [albums]
  )

  // Função para lidar com exclusão de álbum
  const handleDeleteAlbum = (albumId: string, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (confirm('Tem certeza que deseja excluir este álbum?')) {
      try {
        albumsApi.deleteAlbum(albumId)
        setAlbums(prev => prev.filter(album => album.id !== albumId))
        toast({
          title: 'Álbum excluído',
          description: 'O álbum foi removido com sucesso.',
          variant: 'default'
        })
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir o álbum.',
          variant: 'destructive'
        })
      }
    }
  }

  return (
    <DashboardBackground>
      <DashboardContainer className="max-w-7xl">
        <DashboardHeader
          title="Meus Álbuns"
          subtitle="Organize memórias em coleções privadas ou compartilhadas"
          actions={
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/25">
                  <Plus className="w-5 h-5 mr-2" />
                  Novo Álbum
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Criar Novo Álbum
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300 font-medium">Título *</label>
                    <Input 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="Ex: Férias 2024" 
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300 font-medium">Descrição</label>
                    <Textarea 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      placeholder="Descreva o conteúdo do álbum..."
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300 font-medium">Visibilidade</label>
                    <Select value={visibility} onValueChange={(v) => setVisibility(v as AlbumVisibility)}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Selecione a visibilidade" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        <SelectItem value="public">Público</SelectItem>
                        <SelectItem value="family">Apenas família</SelectItem>
                        <SelectItem value="private">Privado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-300 font-medium">Capa (opcional)</label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                      className="bg-slate-700 border-slate-600 text-white file:text-slate-300"
                    />
                    {coverFile && (
                      <p className="text-xs text-emerald-400">
                        Imagem selecionada: {coverFile.name}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setDialogOpen(false)
                        resetForm()
                      }}
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCreateAlbum}
                      disabled={!title.trim() || isCreating}
                      className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/25 min-w-32"
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Criando...
                        </>
                      ) : (
                        'Criar Álbum'
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          }
        />

        {/* Estatísticas Reais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-slate-800 border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total de Álbuns</p>
                <p className="text-2xl font-bold text-white">{albums.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800 border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total de Mídias</p>
                <p className="text-2xl font-bold text-emerald-400">{totalMedia}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <ImageWithFallback className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-slate-800 border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Públicos</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {albums.filter(a => a.visibility === 'public').length}
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
                <p className="text-slate-400 text-sm">Privados</p>
                <p className="text-2xl font-bold text-slate-400">
                  {albums.filter(a => a.visibility === 'private').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-slate-500/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </Card>
        </div>

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
        ) : albums.length === 0 ? (
          <Card className="p-8 bg-slate-800 border-slate-700 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400 mb-2">Nenhum álbum criado</h3>
            <p className="text-slate-500 mb-4">Comece criando seu primeiro álbum para organizar suas memórias.</p>
            <Button 
              onClick={() => setDialogOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Álbum
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div key={album.id} className="group relative">
                <Link href={`/dashboard/albuns/${album.id}`}>
                  <Card className="bg-slate-800 border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden h-full">
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
                          <span>{album.createdBy}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(album.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
                
                {/* Menu de ações flutuante */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-black/50 text-white hover:bg-black/70"
                      onClick={(e) => handleDeleteAlbum(album.id, e)}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardContainer>
    </DashboardBackground>
  )
}