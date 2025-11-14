import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '@radix-ui/react-dropdown-menu'
import { Settings, User, Edit, Users, TreePine, Album, Bell, Mail, Palette, Sun, Moon, Monitor, Layout, Key, Shield, HelpCircle, Phone, Info, LogOut } from 'lucide-react'
import React from 'react'

export default function Dropdown() {
  return (
    <div className='flex cursor-pointer items-center gap-3 p-3 rounded-2xl text-gray-600 hover:text-emerald-600 hover:bg-emerald-50/80 dark:text-gray-300 dark:hover:text-emerald-400 dark:hover:bg-slate-800/50 transition-all duration-200 group relative'>
        <DropdownMenu>
  <DropdownMenuTrigger className='cursor-pointer'>
    <Settings className="w-5 h-5" />
  </DropdownMenuTrigger>
  
  <DropdownMenuContent className="w-64 ml-4">
    
    {/* Header do Usuário */}
    <DropdownMenuLabel className="flex flex-col p-3">
      <span className="font-semibold">Maria Silva</span>
      <span className="text-sm text-gray-500">maria@familia.com</span>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />

    {/* Seção: Perfil e Conta */}
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

    {/* Seção: Aparência com Submenus */}
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center gap-3">
        <Palette className="w-4 h-4" />
        <span>Tema</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem className="flex items-center gap-3">
          <Sun className="w-4 h-4" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-3">
          <Moon className="w-4 h-4" />
          <span>Escuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-3">
          <Monitor className="w-4 h-4" />
          <span>Automático</span>
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>

    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="flex items-center gap-3">
        <Layout className="w-4 h-4" />
        <span>Densidade</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuItem className="flex items-center gap-3">
          <span className="w-2 h-4 bg-current rounded"></span>
          <span>Compacto</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-3">
          <span className="w-4 h-4 bg-current rounded"></span>
          <span>Confortável</span>
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
    <DropdownMenuSeparator />

    <DropdownMenuGroup>
      <DropdownMenuItem className="flex items-center gap-3">
        <Key className="w-4 h-4" />
        <span>Alterar Senha</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4" />
          <span>Autenticação 2 Fatores</span>
        </div>
        <div className="w-8 h-4 bg-gray-300 rounded-full relative">
          <div className="w-3 h-3 bg-white rounded-full absolute left-1 top-0.5"></div>
        </div>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-3">
        <Monitor className="w-4 h-4" />
        <span>Sessões Ativas</span>
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
  )
}
