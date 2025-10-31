"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import Link from "next/link"
import { Button } from "./ui/button"
import { TreePine, Menu, X } from "lucide-react"
import { Cadastro } from "./cadastro"
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cadastroModal, setCadastroModal] = useState(false)

  return (
    <nav className="w-full bg-slate-950/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-linear-to-br from-emerald-500 to-green-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
            <TreePine className="w-6 h-6 text-white" />

            </div>
            <span className="font-bold text-xl text-white">
              Raízes<span className="text-emerald-400">Digitais</span>
            </span>
          </Link>

          <div className="gap-8 hidden md:flex">
            <Link href="/" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
              Explorar
            </Link>
            <Link href="/" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
              Comunidade
            </Link>
            <Link href="/explore" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">
              Coleções
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
              Entrar
            </Button>
            <Button onClick={() => setCadastroModal(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Começar
            </Button>
          </div>

          <div className="md:hidden flex items-center">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              className="text-slate-300 hover:bg-slate-800"
              size="icon"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 bg-slate-950">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className="text-slate-300 hover:text-emerald-400 py-2 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Explorar
              </Link>

              <Link
                href="/explore"
                className="text-slate-300 hover:text-emerald-400 py-2 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Comunidade
              </Link>

              <Link
                href="/upload"
                className="text-slate-300 hover:text-emerald-400 py-2 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Coleções
              </Link>

              <div className="pt-4 flex flex-col space-y-3">
                <Button onClick={() => setCadastroModal(true)} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Começar
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                >
                  Entrar
                </Button>
              </div>
            </div>
          </div>
        )}

        {cadastroModal && (
          <Dialog open={cadastroModal} onOpenChange={setCadastroModal}>
            <DialogTrigger />
            <DialogContent className=" bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="text-center text-white"></DialogTitle>
              </DialogHeader>
              <Cadastro />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </nav>
  )
}
