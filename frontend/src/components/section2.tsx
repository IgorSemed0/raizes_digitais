"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { TreeDeciduous, Album, Calendar, Bell, Shield, Users } from "lucide-react"

export default function Section2() {
  const features = [
    {
      icon: <TreeDeciduous className="w-6 h-6" />,
      titulo: "Árvore Genealógica Interativa",
      descricao: "Construa e explore sua árvore familiar com visualização moderna e navegação intuitiva.",
      color: "from-emerald-500 to-green-600",
    },
    {
      icon: <Album className="w-6 h-6" />,
      titulo: "Álbuns Colaborativos",
      descricao: "Crie álbuns temáticos e convide familiares para adicionar fotos e memórias juntos.",
      color: "from-green-500 to-teal-600",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      titulo: "Eventos Familiares",
      descricao: "Organize reuniões, aniversários e celebrações com sistema de convites integrado.",
      color: "from-teal-500 to-cyan-600",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      titulo: "Notificações em Tempo Real",
      descricao: "Receba alertas instantâneos sobre novos membros, comentários e eventos familiares.",
      color: "from-emerald-500 to-green-600",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      titulo: "Privacidade Garantida",
      descricao: "Controle total sobre quem vê suas memórias com configurações de privacidade granulares.",
      color: "from-green-500 to-teal-600",
    },
    {
      icon: <Users className="w-6 h-6" />,
      titulo: "Conexão entre Gerações",
      descricao: "Una avós, pais e filhos em uma plataforma que preserva histórias para o futuro.",
      color: "from-teal-500 to-cyan-600",
    },
  ]

  return (
    <section className="w-full py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Recursos Poderosos
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Tudo para Sua Família</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Ferramentas completas para preservar, compartilhar e celebrar sua história familiar
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.titulo}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full cursor-pointer bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10">
                <CardHeader className="pb-4">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br ${feature.color} text-white shadow-lg mb-4`}
                  >
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-white">{feature.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 leading-relaxed">{feature.descricao}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
