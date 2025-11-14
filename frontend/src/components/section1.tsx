"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LoginForm } from "./login-form"
import { Button } from "./ui/button"
import { TreeDeciduous, Users, Heart} from "lucide-react"
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
  const [usuario, setusuarios]=useState(0)
 
  /* useEffect(() => {
  const buscar = async () => {
    try {
      const res = await fetch("http://localhost:8000/usuarios/count")
      
      if (!res.ok) {
        throw new Error('Erro ao contar usuários')
      }
      
      const data = await res.json()
      
      if (data.success) {
        setusuarios(data.total)
        console.log(data)
      } else {
        console.error('Erro na API:', data.message)
      }
    } catch (error) {
      console.error('Erro ao contar usuários:', error)
    }
  } 
  
  buscar()
}, []) */
  return (
    <main className="w-full bg-linear-to-br from-white via-gray-50 to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0  dark:from-emerald-950/20" />
        
        <motion.div
          animate={{
            y: [0, -40, 0],
            rotate: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl hidden dark:block"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            rotate: [0, -10, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/10 rounded-full blur-3xl hidden dark:block"
        />

        <motion.div
          animate={{
            y: [0, -30, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-20 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl dark:hidden"
        />
        <motion.div
          animate={{
            y: [0, 30, 0],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-20 w-80 h-80 bg-green-300/15 rounded-full blur-3xl dark:hidden"
        />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
          >
            Preserve Sua História
            <span className="block bg-linear-to-r from-emerald-600 via-green-600 to-teal-600 dark:from-emerald-400 dark:to-green-500 bg-clip-text text-transparent">
              Familiar para Sempre
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Crie sua árvore genealógica interativa, compartilhe álbuns familiares e conecte gerações em uma plataforma
            segura e moderna
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
              className="bg-linear-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 dark:shadow-emerald-500/15"
            >
              <TreeDeciduous className="w-5 h-5 mr-2" />
              Criar Minha Árvore
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 font-semibold px-8 py-6 text-lg rounded-xl transition-all duration-300 backdrop-blur-sm bg-white/50 dark:bg-transparent"
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
              { icon: Users, label: "Famílias Conectadas", value: usuario },
              { icon: Heart, label: "Memórias Preservadas", value: 0 },
              { icon: TreeDeciduous, label: "Gerações Mapeadas", value: 0 },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-gray-200 dark:border-slate-800 rounded-2xl p-6 hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="bg-emerald-100 dark:bg-emerald-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <stat.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-slate-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogTrigger />
        <DialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white"></DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-slate-400">
            </DialogDescription>
          </DialogHeader>
          <LoginForm />
        </DialogContent>
      </Dialog>
    </main>
  )
}