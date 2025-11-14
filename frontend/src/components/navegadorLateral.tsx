"use client"
import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { 
  LayoutDashboard, 
  TreePine, 
  Album, 
  Users, 
  Calendar, 
  MessageCircle, 
  Bell, 
  Settings,
  Palette,
  Moon,
  Sun,
  Edit,
  HelpCircle,
  Info,
  Key,
  LogOut,
  Mail,
  Monitor,
  Phone,
  User,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub
} from "@/components/ui/dropdown-menu"
import { DropdownMenuGroup, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@radix-ui/react-dropdown-menu';
export default function NavegadorLateral() {
  const { setTheme, theme } = useTheme()
  const navItems = [
    { icon: LayoutDashboard, label: 'Feed', href: '/dashboard/feed' },
    { icon: TreePine, label: 'Árvore', href: '/dashboard/arvore' },
    { icon: Album, label: 'Álbuns', href: '/dashboard/albuns' },
    { icon: Users, label: 'Família', href: '/dashboard/familia' },
    { icon: Calendar, label: 'Eventos', href: '/dashboard/eventos' },
    { icon: MessageCircle, label: 'Mensagens', href: '/dashboard/mensagens' },
    { icon: Bell, label: 'Notificações', href: '/dashboard/notificacoes' },
  ];

  

  return (
    <div className="flex flex-col h-screen absolute overflow-y-auto bg-white/90 backdrop-blur-xl border-r border-gray-200/50 dark:bg-slate-900/95 dark:border-slate-700/50">
      
      <div className="flex justify-center items-center p-3 border-b border-gray-200/50 dark:border-slate-700/50">
        <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl p-3 shadow-lg shadow-emerald-500/25">
          <TreePine className="w-6 h-6 text-white" />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 p-3 rounded-2xl text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/80 dark:text-gray-300 dark:hover:text-emerald-400 dark:hover:bg-slate-800/50 transition-all duration-200 group relative"
              title={item.label}
            >
              <Icon className="w-7 h-6 transition-transform group-hover:scale-110" />
              </Link>
          );
        })}
        <div className='flex cursor-pointer items-center gap-3 p-3 rounded-2xl text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/80 dark:text-gray-300 dark:hover:text-emerald-400 dark:hover:bg-slate-800/50 transition-all duration-200 group relative'>
        <DropdownMenu>
  <DropdownMenuTrigger className='cursor-pointer'>
    <Settings  />
  </DropdownMenuTrigger>
  
  <DropdownMenuContent className="w-64 ml-4">
    
    <DropdownMenuLabel className="flex flex-col p-3">
      <span className="font-semibold">raizes</span>
      <span className="text-sm text-gray-500">raizes@familia.com</span>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />

    <DropdownMenuGroup>
      <DropdownMenuItem className="flex items-center gap-3">
        <User className="w-4 h-4" />
        <span>Meu Perfil</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-3">
        <Edit className="w-4 h-4" />
        <span>Editar Perfil</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-3">
        <span>Alterar Foto</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-3">
        <span>Privacidade</span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />

    <DropdownMenuGroup>
      <DropdownMenuItem className="flex items-center gap-3">
        <Users className="w-4 h-4" />
        <span>Gerenciar Família</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-3">
        <TreePine className="w-4 h-4" />
        <span>Árvore Genealógica</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-3">
        <Album className="w-4 h-4" />
        <span>Configurações de Álbuns</span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />

    <DropdownMenuGroup>
      <DropdownMenuItem className="flex items-center gap-3">
        <Bell className="w-4 h-4" />
        <span>Configurações de Notificações</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-3">
        <Mail className="w-4 h-4" />
        <span>Preferências de Email</span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />

    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center gap-3">
        <Palette className="w-4 h-4" />
        <span>Tema</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem 
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}

        className="flex items-center gap-3">
          <Sun className="w-4 h-4" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}

        
        className="flex items-center gap-3">
          <Moon className="w-4 h-4" />
          <span>Escuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-3">
          <Monitor className="w-4 h-4" />
          <span>Automático</span>
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
    <DropdownMenuSeparator />

    <DropdownMenuGroup>
      <DropdownMenuItem className="flex items-center gap-3">
        <Key className="w-4 h-4" />
        <span>Alterar Senha</span>
      </DropdownMenuItem>      
    </DropdownMenuGroup>
    <DropdownMenuSeparator />

    <DropdownMenuGroup>
      <DropdownMenuItem className="flex items-center gap-3">
        <HelpCircle className="w-4 h-4" />
        <span>Ajuda</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-3">
        <Phone className="w-4 h-4" />
        <span>Contatar Suporte</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-3">
        <Info className="w-4 h-4" />
        <span>Sobre o Raízes Digitais</span>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />

    <DropdownMenuItem className="flex items-center gap-3 text-red-600 focus:text-red-700">
      <LogOut className="w-4 h-4" />
      <span>Sair</span>
    </DropdownMenuItem>

  </DropdownMenuContent>
</DropdownMenu>
        </div>
        
      </div>

      


    </div>
  );
}