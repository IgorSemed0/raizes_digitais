"use client"
import { useState } from "react"
import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "./ui/button"
import { TreePine, Menu, X, Users, Album, Compass } from "lucide-react"
import { Cadastro } from "./cadastro"
import { motion } from "framer-motion"
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cadastroModal, setCadastroModal] = useState(false)
  const { setTheme, theme } = useTheme()

  const navigation = [
    { name: "Explorar", href: "/", icon: <Compass className="w-4 h-4" /> },
    { name: "Comunidade", href: "/comunidade", icon: <Users className="w-4 h-4" /> },
    { name: "Coleções", href: "/colecoes", icon: <Album className="w-4 h-4" /> },
  ]

  return (
    <nav className="w-full bg-white/80 dark:bg-slate-950/95 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-linear-to-br from-emerald-600 to-teal-600 p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-lg">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900 dark:text-white leading-tight">
                Raízes<span className=" text-emerald-500">Digitais</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-slate-400 -mt-1">Sua história, eternizada</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 font-medium group"
              >
                <span className="opacity-60 group-hover:opacity-100 transition-opacity">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-slate-800 font-medium transition-all duration-300"
            >
              Entrar
            </Button>
            <Button 
              onClick={() => setCadastroModal(true)} 
              className="bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 transform hover:scale-105"
            >
              Começar Agora
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-300"
                >
                  <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Alternar tema</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-gray-200 dark:border-slate-700"
              >
                <DropdownMenuItem 
                  onClick={() => setTheme("light")}
                  className="text-gray-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Modo Claro
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme("dark")}
                  className="text-gray-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  <Moon className="w-4 h-4 mr-2" />
                  Modo Escuro
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="border-gray-300 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              className="text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
              size="icon"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md"
          >
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 flex flex-col space-y-3 border-t border-gray-200 dark:border-slate-800">
                <Button 
                  variant="ghost"
                  className="w-full justify-start text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-slate-800 font-medium"
                >
                  Entrar
                </Button>
                <Button 
                  onClick={() => {
                    setCadastroModal(true)
                    setIsMenuOpen(false)
                  }} 
                  className="w-full bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium shadow-lg"
                >
                  Começar Agora
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Cadastro 
        open={cadastroModal}
        onOpenChange={setCadastroModal}
        onSuccess={() => {
          console.log("Cadastro realizado com sucesso!")
        }}
      />
    </nav>
  )
}