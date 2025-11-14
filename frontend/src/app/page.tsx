'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TreePine } from 'lucide-react'
import Image from 'next/image'

import Navbar from '@/components/navbar'
import Section1 from '@/components/section1'
import Section2 from '@/components/section2'
import Galeria from '@/components/galeria'
import CTA from '@/components/CTA'
import Footer from '@/components/footer'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 20
      })
    }, 200)

    const minLoadingTime = setTimeout(() => {
      setIsLoading(false)
      clearInterval(progressInterval)
    }, 1900)

    return () => {
      clearTimeout(minLoadingTime)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen progress={progress} />
        ) : (
          <MainContent />
        )}
      </AnimatePresence>
    </div>
  )
}

function LoadingScreen({ progress }: { progress: number }) {
  const displayProgress = Math.min(100, Math.round(progress))

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-emerald-500/10 flex flex-col items-center justify-center"
    >
      <div className="flex flex-col items-center justify-center w-full max-w-md px-4 space-y-8">
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center w-full"
        >
          <div className="flex items-center justify-center gap-2 group mb-4">
            <div className="bg-linear-to-br from-emerald-500 to-green-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <TreePine className="w-12 h-12 text-white" />
            </div>
            <span className="font-bold text-2xl text-white text-center">
              Raízes<span className="text-emerald-400">Digitais</span>
            </span>
          </div>
        </motion.div>

        <div className="w-full flex flex-col items-center justify-center">
          <div className="flex justify-between text-sm text-slate-400 mb-2 w-full max-w-xs">
            <span>Inicializando</span>
            <span>{displayProgress}%</span>
          </div>
          
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden w-full max-w-xs">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-linear-to-r from-emerald-700 to-emerald-500 rounded-full"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center justify-center w-full"
        >
          <p className="text-slate-500 text-sm text-center w-full">
            Preparando sua experiência na Plataforma...
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center justify-center w-full mt-10"
        >
          
          <div className="flex flex-col justify-center mt-20">
            <Image
              alt="Onono_Produto"
              width={200}
              height={40}
              src="/Onono.png"
              className="mx-auto"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function MainContent() {
  return (
    <motion.div
      key="content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col grow"
    >
      <main className="grow">
        <Navbar />
        <Section1 />
        <Galeria />
        <Section2 />
        <CTA />
        <Footer />
      </main>
    </motion.div>
  )
}