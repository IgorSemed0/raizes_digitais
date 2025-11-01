"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { LoginForm } from "./login-form"
import { Button } from "./ui/button"
import { TreeDeciduous,  Users, Heart } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function Hero() {
  const [aberto, setAberto] = useState(false)

  return (
    <main className="w-full bg-slate-950">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950/20" />

        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
        />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Preserve Sua História
            <span className="block bg-linear-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Familiar para Sempre
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Crie sua árvore genealógica interativa, compartilhe álbuns familiares e conecte gerações em uma plataforma
            segura
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              onClick={() => setAberto(true)}
              size="lg"
              className="bg-emerald-600 cursor-pointer hover:bg-emerald-700 text-white font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25"
            >
              <TreeDeciduous className="w-5 h-5 mr-2" />
              Criar Minha Árvore
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 cursor-pointer border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300 backdrop-blur-sm bg-transparent"
            >
              Ver Como Funciona
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {[
              { icon: Users, label: "Famílias Conectadas", value: 0 },
              { icon: Heart, label: "Memórias Preservadas", value: 0 },
              { icon: TreeDeciduous, label: "Gerações Mapeadas", value: 0},
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-slate-900/50 cursor-pointer backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-colors"
              >
                <stat.icon className="w-8 h-8 text-emerald-400 mb-3 mx-auto" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogTrigger />
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Bem-vindo de volta</DialogTitle>
            <DialogDescription className="text-slate-400">
              Entre na sua conta para continuar preservando sua história familiar
            </DialogDescription>
          </DialogHeader>
          <LoginForm />
        </DialogContent>
      </Dialog>
    </main>
  )
}
