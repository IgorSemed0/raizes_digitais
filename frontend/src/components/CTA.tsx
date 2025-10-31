"use client"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { TreeDeciduous, Sparkles } from "lucide-react"

export default function CTA() {
  return (
    <section className="w-full py-20 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-green-500/10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-size:4rem_4rem opacity-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Comece Hoje Mesmo
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Pronto para Preservar
            <span className="block bg-linear-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Sua História Familiar?
            </span>
          </h2>

          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Junte-se a milhares de famílias que já estão construindo suas árvores genealógicas e preservando memórias
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-10 py-7 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25"
            >
              <TreeDeciduous className="w-5 h-5 mr-2" />
              Começar Minha Árvore
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-semibold px-10 py-7 text-lg rounded-xl transition-all duration-300 bg-transparent"
            >
              Saiba Mais
            </Button>
          </div>

          <p className="text-sm text-slate-500 mt-8">
            Sem cartão de crédito necessário • Cancele quando quiser • 100% gratuito
          </p>
        </motion.div>
      </div>
    </section>
  )
}
