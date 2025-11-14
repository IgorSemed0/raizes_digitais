"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TreePine, 
  MessageCircle, 
  Bell, 
  User,
  Home,
  Search,
  Plus,
  Heart
} from 'lucide-react';

export default function InstagramStyleMobileNav() {
  const [activeTab, setActiveTab] = useState('feed');

  const navItems = [
    { 
      icon: Home, 
      label: 'Feed', 
      href: '/dashboard/feed',
      id: 'feed'
    },
    { 
      icon: Search, 
      label: 'Descobrir', 
      href: '/dashboard/descobrir',
      id: 'pesquisar'
    },
    { 
      icon: Plus, 
      label: 'Criar', 
      href: '/dashboard/criar',
      id: 'criar'
    },
    { 
      icon: Heart, 
      label: 'Notificações', 
      href: '/dashboard/notificacoes',
      id: 'notificacao'
    },
    { 
      icon: User, 
      label: 'Perfil', 
      href: '/dashboard/perfil',
      id: 'perfil'
    },
  ];

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-300 dark:bg-slate-900/95 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="bg-linear-to-br from-emerald-500 to-teal-600 rounded-lg p-1">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-800 dark:text-white bg-clip-text ">
              Raízes
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-1">
              <MessageCircle className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            </button>
            <button className="p-1">
              <Bell className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            </button>
          </div>
        </div>
      </div>

      

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-300 dark:bg-slate-900/95 dark:border-gray-800">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-black dark:text-white' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {item.id === 'criar' ? (
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center -mt-2 shadow-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''}`} />
                )}
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

     

     
    </>
  );
}   