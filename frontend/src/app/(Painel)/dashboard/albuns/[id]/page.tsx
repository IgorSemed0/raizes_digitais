'use client'
import React, { useMemo, useRef, useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ImageWithFallback } from '@/components/figma/ImageWithFallback'
import { ArrowLeft, Heart, MessageCircle, Upload, Loader2, MoreHorizontal, Download, Share2, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users } from 'lucide-react'
import { useParams } from 'next/navigation'

type Media = {
  id: string
  url: string
  type: 'image' | 'video'
  createdAt: string
  likes: number
  isLiked?: boolean
  comments: Comment[]
}

type Comment = {
  id: string
  text: string
  author: string
  authorAvatar: string
  createdAt: string
}

type AlbumDetail = {
  id: string
  title: string
  coverUrl?: string
  visibility: 'public' | 'family' | 'private'
  media: Media[]
  mediaCount: number
  createdAt: string
  description?: string
  createdBy: string
}

// Simulação de API local
const albumApi = {
  getAlbum: (id: string): AlbumDetail | null => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(`album-${id}`)
    return stored ? JSON.parse(stored) : null
  },

  updateAlbum: (id: string, album: AlbumDetail): void => {
    localStorage.setItem(`album-${id}`, JSON.stringify(album))
  },

  likeMedia: (albumId: string, mediaId: string): void => {
    const album = albumApi.getAlbum(albumId)
    if (!album) return

    const updatedMedia = album.media.map(media => {
      if (media.id === mediaId) {
        const wasLiked = media.isLiked
        return {
          ...media,
          likes: wasLiked ? media.likes - 1 : media.likes + 1,
          isLiked: !wasLiked
        }
      }
      return media
    })

    albumApi.updateAlbum(albumId, { ...album, media: updatedMedia })
  },

  addComment: (albumId: string, mediaId: string, comment: Comment): void => {
    const album = albumApi.getAlbum(albumId)
    if (!album) return

    const updatedMedia = album.media.map(media => {
      if (media.id === mediaId) {
        return {
          ...media,
          comments: [...media.comments, comment]
        }
      }
      return media
    })

    albumApi.updateAlbum(albumId, { ...album, media: updatedMedia })
  },

  addMedia: (albumId: string, media: Media): void => {
    const album = albumApi.getAlbum(albumId)
    if (!album) return

    const updatedMedia = [...album.media, media]
    albumApi.updateAlbum(albumId, {
      ...album,
      media: updatedMedia,
      mediaCount: updatedMedia.length
    })
  }
}

// Dados iniciais para demonstração
const initialAlbum: AlbumDetail = {
  id: '1',
  title: 'Férias em Família 2024',
  description: 'Momentos incríveis das nossas férias na praia! ☀️🏖️',
  visibility: 'family',
  mediaCount: 12,
  createdAt: '2024-01-15T10:00:00Z',
  createdBy: 'Maria Fernandes',
  media: [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      type: 'image',
      createdAt: '2024-01-15T10:00:00Z',
      likes: 24,
      isLiked: true,
      comments: [
        {
          id: '1',
          text: 'Que foto linda! 🌴',
          author: 'Carlos Fernandes',
          authorAvatar: 'CF',
          createdAt: '2024-01-15T11:30:00Z'
        }
      ]
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206',
      type: 'image',
      createdAt: '2024-01-15T11:00:00Z',
      likes: 18,
      isLiked: false,
      comments: []
    }
  ]
}

const visibilityConfig = {
  public: { icon: Globe, label: 'Público', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  family: { icon: Users, label: 'Família', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  private: { icon: Lock, label: 'Privado', color: 'bg-slate-500/20 text-slate-400 border-slate-500/30' }
}

function Globe({ className }: { className?: string }) { return <span className={className}>🌎</span> }
function Lock({ className }: { className?: string }) { return <span className={className}>🔒</span> }

export default function AlbumDetalhe() {
  const { id } = useParams<{ id: string }>()
  const [album, setAlbum] = useState<AlbumDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [commentText, setCommentText] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const loadAlbum = () => {
      try {
        let albumData = albumApi.getAlbum(id!)
        if (!albumData) {
          // Criar álbum de demonstração se não existir
          albumApi.updateAlbum(id!, initialAlbum)
          albumData = initialAlbum
        }
        setAlbum(albumData)
      } catch (error) {
        console.error('Erro ao carregar álbum:', error)
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar o álbum.',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (id) loadAlbum()
  }, [id, toast])

  const handleLike = (mediaId: string) => {
    if (!album) return
    albumApi.likeMedia(album.id, mediaId)
    const updatedAlbum = albumApi.getAlbum(album.id)
    setAlbum(updatedAlbum)
  }

  const handleAddComment = () => {
    if (!album || !selectedMedia || !commentText.trim()) return

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      text: commentText,
      author: 'Você',
      authorAvatar: 'VC',
      createdAt: new Date().toISOString()
    }

    albumApi.addComment(album.id, selectedMedia.id, newComment)
    const updatedAlbum = albumApi.getAlbum(album.id)
    setAlbum(updatedAlbum)
    setCommentText('')
    
    toast({
      title: 'Comentário adicionado!',
      description: 'Seu comentário foi publicado com sucesso.',
      variant: 'default'
    })
  }

  const handleUpload = (file: File) => {
    if (!album) return

    setUploading(true)
    // Simular upload
    setTimeout(() => {
      const newMedia: Media = {
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image',
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        comments: []
      }

      albumApi.addMedia(album.id, newMedia)
      const updatedAlbum = albumApi.getAlbum(album.id)
      setAlbum(updatedAlbum)
      setUploading(false)

      toast({
        title: 'Mídia adicionada!',
        description: 'Sua foto/vídeo foi adicionado ao álbum.',
        variant: 'default'
      })
    }, 1500)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-slate-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6 bg-slate-800 border-slate-700 text-center">
            <h2 className="text-white text-xl mb-2">Álbum não encontrado</h2>
            <p className="text-slate-400 mb-4">O álbum que você está procurando não existe.</p>
            <Link href="/dashboard/albuns">
              <Button className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Álbuns
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  const VisibilityBadge = () => {
    const config = visibilityConfig[album.visibility]
    const Icon = config.icon
    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/albuns" 
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">{album.title}</h1>
              <div className="flex items-center gap-3 text-slate-400 text-sm mt-1">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {album.createdBy}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(album.createdAt)}
                </span>
                <VisibilityBadge />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleUpload(file)
              }}
            />
            <Button 
              onClick={() => fileRef.current?.click()} 
              disabled={uploading}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/25"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Adicionar Mídia
            </Button>
          </div>
        </div>

        {/* Descrição */}
        {album.description && (
          <Card className="p-6 bg-slate-800 border-slate-700 shadow-xl">
            <p className="text-slate-300 leading-relaxed">{album.description}</p>
          </Card>
        )}

        {/* Grid de Mídia */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {album.media.map((media) => (
            <button
              key={media.id}
              className="group relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700 shadow-lg hover:shadow-2xl hover:border-slate-600 transition-all duration-300"
              onClick={() => setSelectedMedia(media)}
            >
              {media.type === 'image' ? (
                <ImageWithFallback 
                  src={media.url} 
                  alt="mídia" 
                  className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <video 
                  src={media.url} 
                  className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-300"
                />
              )}
              
              {/* Overlay no hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-end">
                <div className="p-3 w-full bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <Heart className={`w-4 h-4 ${media.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      <span className="text-sm">{media.likes}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{media.comments.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Modal de Detalhes da Mídia */}
        {selectedMedia && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="max-w-6xl w-full max-h-[90vh] bg-slate-800 border-slate-700 shadow-2xl overflow-hidden">
              <div className="flex flex-col lg:flex-row h-full">
                {/* Mídia */}
                <div className="lg:w-2/3 bg-black flex items-center justify-center p-4">
                  {selectedMedia.type === 'image' ? (
                    <ImageWithFallback 
                      src={selectedMedia.url} 
                      alt="selecionado" 
                      className="max-h-[70vh] w-auto object-contain rounded-lg"
                    />
                  ) : (
                    <video 
                      src={selectedMedia.url} 
                      controls 
                      className="max-h-[70vh] w-auto object-contain rounded-lg"
                    />
                  )}
                </div>

                {/* Sidebar de Informações */}
                <div className="lg:w-1/3 flex flex-col h-full">
                  {/* Header */}
                  <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    <h3 className="text-white font-semibold">Detalhes</h3>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-400 hover:text-white"
                        onClick={() => setSelectedMedia(null)}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="p-4 border-b border-slate-700">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        onClick={() => handleLike(selectedMedia.id)}
                        className={`flex items-center gap-2 ${
                          selectedMedia.isLiked ? 'text-red-500 hover:text-red-400' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${selectedMedia.isLiked ? 'fill-current' : ''}`} />
                        {selectedMedia.likes}
                      </Button>
                      <Button variant="ghost" className="flex items-center gap-2 text-slate-400 hover:text-white">
                        <MessageCircle className="w-5 h-5" />
                        {selectedMedia.comments.length}
                      </Button>
                      <Button variant="ghost" className="flex items-center gap-2 text-slate-400 hover:text-white">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Comentários */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                      <h4 className="text-white font-semibold mb-4">Comentários</h4>
                      
                      {/* Lista de Comentários */}
                      <div className="space-y-4 mb-4">
                        {selectedMedia.comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-slate-700 text-slate-300 text-xs">
                                {comment.authorAvatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-slate-700 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-white text-sm font-medium">{comment.author}</span>
                                  <span className="text-slate-400 text-xs">
                                    {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                                <p className="text-slate-300 text-sm">{comment.text}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Adicionar Comentário */}
                      <div className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-emerald-600 text-white text-xs">VC</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Input
                            placeholder="Adicione um comentário..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && commentText.trim()) {
                                handleAddComment()
                              }
                            }}
                          />
                          <Button 
                            onClick={handleAddComment}
                            disabled={!commentText.trim()}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}