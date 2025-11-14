// components/navbar-central.tsx
"use client"

import { useState } from "react"
import { Search, Bell, User, Settings, LogOut, Menu, Home, Users, Image as ImageIcon, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useAuthStore } from "@/stores/auth-store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter, usePathname } from "next/navigation"

interface NavbarCentralProps {
  onMenuToggle?: () => void
}

export default function NavbarCentral1({ onMenuToggle }: NavbarCentralProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  const navigation = [
    { name: "Início", href: "/", icon: Home },
    { name: "Árvore", href: "/arvore", icon: Users },
    { name: "Fotos", href: "/fotos", icon: ImageIcon },
    { name: "Feed", href: "/feed", icon: MessageCircle },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar busca
    console.log("Buscar:", searchQuery)
  }

  return (
    <nav className="border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo e Menu Hamburger */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onMenuToggle}
              className="md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-emerald-600">Família</span>
            </div>
          </div>

          {/* Search Bar - Centralizada no mobile */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar familiares, fotos, memórias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-foreground placeholder-gray-500 dark:placeholder-gray-400"
              />
            </form>
          </div>

          {/* User Menu e Notificações */}
          <div className="flex items-center gap-3">
            {/* Notificações */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative text-gray-600 dark:text-gray-400">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                <div className="p-2 text-sm text-gray-500">
                  <div className="p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                    <p className="font-medium text-gray-900 dark:text-white">Novo membro adicionado</p>
                    <p className="text-xs text-gray-500">João Silva foi adicionado à árvore</p>
                  </div>
                  <div className="p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                    <p className="font-medium text-gray-900 dark:text-white">Aniversário hoje</p>
                    <p className="text-xs text-gray-500">Maria Santos faz 45 anos hoje</p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.vc_foto_perfil || "/placeholder.svg"} alt={user?.vc_user_name} />
                    <AvatarFallback className="bg-emerald-500 text-white">
                      {user?.vc_pnome?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.vc_pnome} {user?.vc_unome}
                    </p>
                    <p className="text-xs leading-none text-gray-600 dark:text-gray-400">
                      {user?.vc_user_name}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/perfil")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/configuracoes")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Navegação Mobile */}
        <div className="flex items-center justify-around mt-3 pt-3 border-t border-gray-200 dark:border-slate-800">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Button
                key={item.name}
                variant="ghost"
                size="sm"
                onClick={() => router.push(item.href)}
                className={`flex flex-col items-center gap-1 h-auto px-3 py-2 ${
                  isActive ? "text-emerald-600 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{item.name}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}