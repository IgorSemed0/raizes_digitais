"use client"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function Galeria() {
  const photos = [
    { id: 1, query: "Memórias para gerações", span: "col-span-2 row-span-2" },
    { id: 2, query: "Memórias Pai e Filho", span: "col-span-1 row-span-1" },
    { id: 3, query: "Memórias entre irmãos", span: "col-span-1 row-span-1" },
    { id: 4, query: "Família Linda", span: "col-span-1 row-span-2" },
    { id: 5, query: "Primeira Foto da Filha", span: "col-span-1 row-span-1" },
    { id: 6, query: "Familia Crescendo", span: "col-span-2 row-span-1" },
    { id: 7, query: "Família do Jardim", span: "col-span-1 row-span-1" },
    { id: 8, query: "Pai e Filho", span: "col-span-1 row-span-1" },
  ]

  return (
    <section className="w-full py-20 bg-linear-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Memórias que Duram para Sempre</h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
            Veja como famílias estão preservando seus momentos mais preciosos em álbuns colaborativos
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-4 auto-rows-[200px] gap-4 mb-12"
        >
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              className={`${photo.span} relative overflow-hidden rounded-xl bg-slate-800 cursor-pointer group`}
            >
              <Image
                width={600}
                height={400}
                src={`/familia${photo.id}.jpg`}
                alt={`Memória familiar ${photo.id}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 rounded-full bg-emerald-500" />
                  <div className="text-sm font-medium">{photo.query}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-xl group"
          >
            Explorar Mais Álbuns
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
