"use client"
import { motion } from "framer-motion"
import { fadeIn, staggerContainer } from "@/lib/motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, TreePine, Heart, Users, ArrowRight } from "lucide-react"

const Footer = () => {
  const AnoActual = new Date().getFullYear()

  return (
    <motion.footer
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={staggerContainer(0.1, 0.2)}
      className="w-full bg-slate-900 border-t border-slate-800 pt-16 pb-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div variants={fadeIn("up", "spring", 0.2, 0.75)} className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-linear-to-br from-emerald-500 to-green-600 p-2 rounded-xl mr-3">
                <TreePine className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Raízes<span className="text-emerald-400">Digitais</span>
                </h3>
                <p className="text-slate-400 text-sm">Preserve sua história</p>
              </div>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Conecte gerações através de memórias. Construa sua árvore genealógica, compartilhe álbuns familiares e
              preserve sua história.
            </p>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Começar Agora <ArrowRight size={16} className="ml-2" />
            </Button>
          </motion.div>

          <motion.div variants={fadeIn("up", "spring", 0.3, 0.75)}>
            <h4 className="text-lg font-semibold text-white mb-6">Funcionalidades</h4>
            <ul className="space-y-3">
              {[
                "Árvore Genealógica",
                "Álbuns Familiares",
                "Eventos & Reuniões",
                "Linha do Tempo",
                "Memórias Compartilhadas",
                "Convites Familiares",
              ].map((item, index) => (
                <li key={index}>
                  <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeIn("up", "spring", 0.4, 0.75)}>
            <h4 className="text-lg font-semibold text-white mb-6">Recursos</h4>
            <ul className="space-y-3">
              {[
                { name: "Sobre Nós", href: "/sobre" },
                { name: "Blog & Dicas", href: "/blog" },
                { name: "Guia de Genealogia", href: "/guia" },
                { name: "Aplicativo Mobile", href: "/app" },
                { name: "Ajuda & Suporte", href: "/ajuda" },
                { name: "Termos de Uso", href: "/termos" },
              ].map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeIn("up", "spring", 0.5, 0.75)}>
            <h4 className="text-lg font-semibold text-white mb-6">Conecte-se</h4>
            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <Mail size={18} className="text-emerald-400 mr-3 mt-1 shrink-0" />
                <div>
                  <p className="text-slate-400 text-sm text-nowrap">onono-tecnologies@hotmail.com</p>
                  <p className="text-slate-500 text-xs">Suporte e parcerias</p>
                </div>
              </div>
              <div className="flex items-start">
                <Users size={18} className="text-emerald-400 mr-3 mt-1 shrink-0" />
                <div>
                  <p className="text-slate-400 text-sm">+0 famílias conectadas</p>
                  <p className="text-slate-500 text-xs">Junte-se à comunidade</p>
                </div>
              </div>
            </div>


          </motion.div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <motion.p
            variants={fadeIn("up", "spring", 0.6, 0.75)}
            className="text-slate-500 text-sm mb-4 md:mb-0 flex items-center gap-2"
          >
            © {AnoActual} Raízes Digitais. Todos Direitos Reservados. Feito com{" "}
            <Heart size={14} className="text-emerald-400 fill-emerald-400" /> por Onono Technologies.
          </motion.p>
          <motion.div variants={fadeIn("up", "spring", 0.7, 0.75)} className="flex space-x-6">
            {["Privacidade", "Cookies", "Diretrizes"].map((item, index) => (
              <Link key={index} href="#" className="text-slate-500 hover:text-emerald-400 text-sm transition-colors">
                {item}
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
