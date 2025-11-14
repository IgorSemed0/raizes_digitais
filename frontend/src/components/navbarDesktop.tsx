"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  MessageCircle,
  ChevronDown,
  Home,
  Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePathname } from 'next/navigation';

export default function NavbarDesktop() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  // Dados de exemplo para notificações e mensagens
  const notifications = [
{}  ];

  const messages = [
{}
];

  // Função para obter o título da página atual
  const getPageTitle = () => {
    const routes = {
      '/dashboard/feed': 'Feed da Família',
      '/dashboard/arvore': 'Árvore Genealógica',
      '/dashboard/albuns': 'Álbuns de Família',
      '/dashboard/familia': 'Membros da Família',
      '/dashboard/eventos': 'Eventos Familiares',
      '/dashboard/mensagens': 'Mensagens',
      '/dashboard/notificacoes': 'Notificações',
    };
    return routes[pathname as keyof typeof routes] || 'Raízes Digitais';
  };

  return (
    <div className="fixed top-0 left-20 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 dark:bg-slate-900/80 dark:border-slate-700/50 z-30">
      <div className="flex items-center justify-between h-full px-6">
        {/* Lado Esquerdo - Título da Página e Breadcrumb */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {getPageTitle()}
            </h1>
            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Home className="w-3 h-3" />
              <span>Dashboard</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {getPageTitle()}
              </span>
            </div>
          </div>
        </div>

        {/* Lado Direito - Ações Rápidas */}
        <div className="flex items-center gap-3">
          {/* Barra de Pesquisa Global */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar em toda a família..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-80 bg-white/50 border-gray-200 dark:bg-slate-800/50 dark:border-slate-600 focus:border-emerald-500"
            />
          </div>

          {/* Botão de Criar Conteúdo Rápido */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
                <Sparkles className="w-4 h-4 mr-2" />
                Criar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 ml-4">
              <DropdownMenuLabel>Criar Novo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-3">
                <span>📸 Publicação</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3">
                <span>📅 Evento</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3">
                <span>👥 Grupo Familiar</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3">
                <span>🖼️ Álbum</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mensagens Rápidas */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400">
                <MessageCircle className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-cyan-500">
                  {messages.filter(m => m.unread).length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 ml-4">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Mensagens Recentes</span>
                <Badge variant="secondary" className="text-xs">
                  {messages.filter(m => m.unread).length} novas
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {messages.map((message) => (
                <DropdownMenuItem key={message.id} className="flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800">
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-semibold text-sm">{message.user}</span>
                    <span className="text-xs text-gray-500">{message.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate w-full">
                    {message.text}
                  </p>
                  {message.unread && (
                    <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 self-end" />
                  )}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center justify-center text-emerald-600 dark:text-emerald-400 font-medium">
                Ver todas as mensagens
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notificações */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-amber-500">
                  {notifications.filter(n => n.unread).length}
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 ml-4">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notificações</span>
                <Badge variant="secondary" className="text-xs">
                  {notifications.filter(n => n.unread).length} novas
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id} 
                  className={`flex flex-col items-start p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 ${
                    notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between w-full mb-1">
                    <span className="text-sm flex-1">{notification.text}</span>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{notification.time}</span>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <Badge variant="outline" className="text-xs">
                      {notification.type}
                    </Badge>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center justify-center text-emerald-600 dark:text-emerald-400 font-medium">
                Ver todas as notificações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Perfil Rápido */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3 hover:bg-gray-100 dark:hover:bg-slate-800">
                <Avatar className="w-8 h-8 border-2 border-emerald-500/20">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-cyan-600 text-white text-sm font-semibold">
                    RF
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 ml-4">
              <DropdownMenuLabel className="text-center">
                Família Raízes
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-3">
                <span>👤 Meu Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3">
                <span>⚙️ Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-3 text-red-600 focus:text-red-700">
                <span>🚪 Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}