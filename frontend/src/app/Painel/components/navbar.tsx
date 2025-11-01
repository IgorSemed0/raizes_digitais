
"use client"
import React from 'react'
import { TreePine, Home, Plus, Search, User, Bell, MessageCircle } from 'lucide-react'
import { motion } from "framer-motion"
import Link from 'next/link'
import { Input } from '@/components/ui/input'

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-3 bg-white z-50 top-0 w-full fixed border-b border-gray-100">
      <Link href="/" className="flex items-center gap-2">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          whileHover={{ scale: 0.95 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-br from-emerald-500 to-green-600 w-10 h-10 flex items-center justify-center text-white p-2 rounded-lg"
        >
          <TreePine className="w-6 h-6" />
        </motion.div>
        <div className="flex font-extrabold">
          <h1 className="text-lg text-slate-800">Raízes</h1>
          <h1 className="text-lg text-emerald-500">Digitais</h1>
        </div>
      </Link>

      <div className="flex-1 max-w-2xl mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Pesquisar..."
            className="w-full pl-10 focus:bg-emerald-50 border-gray-300 focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NavIcon href="/" icon={<MessageCircle/>} label="Mensagem"/>
        <motion.div whileHover={{ scale: 1.05 }}>
        
          <Link href="/perfil" className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
            <div className="border-2 border-emerald-400 rounded-lg p-1">
              <User className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="hidden md:block text-sm font-medium">Perfil</span>
          </Link>
        </motion.div>
      </div>
    </nav>
  )
}

function NavIcon({href,icon,label}:{href:string, icon:React.ReactNode, label:string}){
    return(
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <Link 
        href={href} 
        className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-emerald-50 text-gray-600 hover:text-emerald-600 transition-colors"
        title={label}
      >
        {icon}
      </Link>
</motion.div>
    )

}

