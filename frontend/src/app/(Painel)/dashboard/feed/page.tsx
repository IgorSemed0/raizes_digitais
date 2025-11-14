"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Image as ImageIcon, UserPlus, Calendar, Cake, MoreHorizontal, Send, MapPin, Trophy, Star, Users, Music } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FeedPost {
  id: number;
  type: "photo" | "member" | "event" | "birthday" | "memory" | "achievement" | "location" | "milestone";
  user: string;
  userAvatar: string;
  action: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  liked?: boolean;
  tags?: string[];
  mood?: string;
  music?: string;
  location?: string;
}

const iconsByType = {
  photo: ImageIcon,
  member: UserPlus,
  event: Calendar,
  birthday: Cake,
  memory: Star,
  achievement: Trophy,
  location: MapPin,
  milestone: Users,
};

const typeColors = {
  photo: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  member: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  event: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  birthday: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  memory: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  achievement: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  location: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  milestone: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
};

const typeActions = {
  photo: "compartilhou uma foto",
  member: "adicionou um novo membro",
  event: "criou um evento",
  birthday: "comemorou um aniversário",
  memory: "compartilhou uma memória",
  achievement: "conquistou uma conquista",
  location: "compartilhou uma localização",
  milestone: "completou um marco"
};

const LOCAL_STORAGE_KEY = "family-feed-posts";

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedType, setSelectedType] = useState<FeedPost["type"]>("photo");
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Carregar posts do localStorage ao inicializar
  useEffect(() => {
    const savedPosts = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedPosts) {
      try {
        // Usar uma função auxiliar para evitar setState síncrono, recomendado pelo React
        const posts = JSON.parse(savedPosts);
        setPosts(posts);
      } catch (error) {
        console.error("Erro ao carregar posts:", error);
        setPosts([]);
      }
    }
  }, []);

  // Salvar posts no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Em uma implementação real, aqui você faria upload para um servidor
      // Por enquanto, vamos usar URL.createObjectURL para preview local
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
      toast({
        title: "Imagem carregada!",
        description: "A imagem foi preparada para publicação.",
        variant: "default",
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleNewPost = () => {
    if (newPost.trim()) {
      const newPostObj: FeedPost = {
        id: Date.now(),
        type: selectedType,
        user: "Você",
        userAvatar: "VC",
        action: typeActions[selectedType],
        content: newPost,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: "Agora mesmo",
        tags: ["NovaPublicação"],
        ...(imageUrl && { image: imageUrl })
      };
      
      setPosts([newPostObj, ...posts]);
      setNewPost("");
      setImageUrl("");
      setSelectedType("photo");
      
      toast({
        title: "Publicação criada com sucesso!",
        description: "Sua publicação foi adicionada ao feed familiar.",
        variant: "default",
      });
    }
  };

  const filteredPosts = activeTab === "all" 
    ? posts 
    : posts.filter(post => post.type === activeTab);

  return (
    <div className="w-full h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-6 space-y-2">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-3">
            Feed da Família
          </h1>
          <p className="text-slate-400 mb-6">
            Conectando gerações através de memórias e momentos especiais
          </p>

          {/* Estatísticas Reais */}
          {posts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-2xl mx-auto"
            >
              <Card className="p-4 bg-slate-800 border-slate-700 text-center">
                <div className="text-2xl font-bold text-emerald-400">{posts.length}</div>
                <div className="text-slate-400 text-sm">Publicações</div>
              </Card>
              <Card className="p-4 bg-slate-800 border-slate-700 text-center">
                <div className="text-2xl font-bold text-cyan-400">
                  {posts.reduce((acc, post) => acc + post.likes, 0)}
                </div>
                <div className="text-slate-400 text-sm">Curtidas</div>
              </Card>
              <Card className="p-4 bg-slate-800 border-slate-700 text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {posts.reduce((acc, post) => acc + post.comments, 0)}
                </div>
                <div className="text-slate-400 text-sm">Comentários</div>
              </Card>
              <Card className="p-4 bg-slate-800 border-slate-700 text-center">
                <div className="text-2xl font-bold text-amber-400">
                  {posts.filter(post => post.type === 'memory').length}
                </div>
                <div className="text-slate-400 text-sm">Memórias</div>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Abas de Filtro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 p-1 bg-slate-800 border border-slate-700 rounded-xl">
              <TabsTrigger value="all" className="text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Todos</TabsTrigger>
              <TabsTrigger value="photo" className="text-xs data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">Fotos</TabsTrigger>
              <TabsTrigger value="event" className="text-xs data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">Eventos</TabsTrigger>
              <TabsTrigger value="memory" className="text-xs data-[state=active]:bg-rose-500/20 data-[state=active]:text-rose-400">Memórias</TabsTrigger>
              <TabsTrigger value="birthday" className="text-xs data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">Aniversários</TabsTrigger>
              <TabsTrigger value="achievement" className="text-xs data-[state=active]:bg-yellow-500/20 data-[state=active]:text-yellow-400">Conquistas</TabsTrigger>
              <TabsTrigger value="milestone" className="text-xs data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">Marcos</TabsTrigger>
              <TabsTrigger value="member" className="text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">Membros</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Criar Nova Publicação - Agora Funcional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6 bg-slate-800 border-slate-700 shadow-2xl">
            <div className="flex gap-4">
              <Avatar className="w-12 h-12 flex-shrink-0 border-2 border-emerald-500/20">
                <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-cyan-600 text-white font-semibold">
                  VC
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Input
                  placeholder="Compartilhe algo com sua família..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="mb-4 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                />
                
                {/* Seletor de Tipo */}
                <div className="flex items-center gap-1 flex-wrap mb-4">
                  {Object.entries(iconsByType).map(([type, Icon]) => (
                    <Button
                      key={type}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedType(type as FeedPost["type"])}
                      className={`flex items-center gap-2 transition-all ${
                        selectedType === type 
                          ? typeColors[type as FeedPost["type"]]
                          : "text-slate-400 hover:text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </Button>
                  ))}
                </div>

                {/* Upload de Imagem */}
                <div className="mb-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={triggerFileInput}
                    className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <ImageIcon className="w-4 h-4" />
                    {imageUrl ? "Imagem Selecionada" : "Adicionar Foto"}
                  </Button>
                  {imageUrl && (
                    <div className="mt-2 relative">
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="rounded-lg max-h-32 object-cover border border-slate-600"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageUrl("")}
                        className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white p-1 h-6 w-6"
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-slate-400 text-sm">
                    Tipo: <span className="capitalize">{selectedType}</span>
                  </div>
                  <Button
                    onClick={handleNewPost}
                    disabled={!newPost.trim()}
                    className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-emerald-500/25"
                    size="sm"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Publicar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Feed de Publicações Reais */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Card className="p-8 bg-slate-800 border-slate-700 max-w-md mx-auto">
                <div className="text-slate-400 mb-4">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                </div>
                <h3 className="text-white font-semibold mb-2">Nenhuma publicação ainda</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Seja o primeiro a compartilhar algo com sua família!
                </p>
              </Card>
            </motion.div>
          ) : (
            filteredPosts.map((post, index) => {
              const TypeIcon = iconsByType[post.type];
              const typeColor = typeColors[post.type];

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="bg-slate-800 border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-slate-600 group">
                    {/* Cabeçalho do Post */}
                    <div className="p-6 pb-4 flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <Avatar className="w-12 h-12 flex-shrink-0 border-2 border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
                          <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-cyan-600 text-white font-semibold">
                            {post.userAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <h3 className="text-white font-semibold truncate">{post.user}</h3>
                            <Badge 
                              variant="outline" 
                              className={`text-xs border ${typeColor} px-2 py-0 flex items-center gap-1`}
                            >
                              <TypeIcon className="w-3 h-3" />
                              {post.type === 'memory' && 'Memória'}
                              {post.type === 'achievement' && 'Conquista'}
                              {post.type === 'milestone' && 'Marco'}
                              {post.type === 'photo' && 'Foto'}
                              {post.type === 'member' && 'Membro'}
                              {post.type === 'event' && 'Evento'}
                              {post.type === 'birthday' && 'Aniversário'}
                              {post.type === 'location' && 'Local'}
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-sm mb-1">{post.action}</p>
                          <p className="text-slate-500 text-xs">{post.timestamp}</p>
                        </div>
                      </div>
                    </div>

                    {/* Conteúdo do Post */}
                    <div className="px-6 pb-4">
                      <p className="text-slate-200 leading-relaxed">{post.content}</p>
                      
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Imagem (se houver) */}
                    {post.image && (
                      <div className="px-6 pb-4">
                        <div className="rounded-xl overflow-hidden border border-slate-700 shadow-lg group-hover:shadow-xl transition-all">
                          <img
                            src={post.image}
                            alt="Post"
                            className="w-full h-auto max-h-96 object-cover transition-transform group-hover:scale-105 duration-700"
                          />
                        </div>
                      </div>
                    )}

                    {/* Estatísticas */}
                    <div className="px-6 py-3 border-t border-slate-700 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-slate-400">
                        <span>{post.likes} curtidas</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-400">
                        <span>{post.comments} comentários</span>
                        {post.shares > 0 && <span>{post.shares} compartilhamentos</span>}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="px-6 py-2 border-t border-slate-700 flex items-center justify-around">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-all ${
                          post.liked 
                            ? "text-red-500 hover:text-red-400" 
                            : "text-slate-400 hover:text-red-500"
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 transition-all ${
                            post.liked ? "fill-red-500" : ""
                          }`}
                        />
                        Curtir
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-all"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Comentar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-all"
                      >
                        <Share2 className="w-5 h-5" />
                        Compartilhar
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Rodapé do Feed */}
        {posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-slate-500 text-sm">
              Você chegou ao final do feed • {filteredPosts.length} publicações
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}