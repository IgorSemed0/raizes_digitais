'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DashboardBackground, DashboardContainer, DashboardHeader } from '@/components/dashboard/Page'
import { Card } from '@/components/ui/card'
import { Save, Users, Globe, Mail, Shield, Bell } from 'lucide-react'

interface FamilyConfig {
  familyName: string
  description: string
  surname: string
  country: string
  language: string
  privacy: 'public' | 'private' | 'family-only'
  notifications: boolean
}

export default function ConfigurarFamilia() {
  const [config, setConfig] = useState<FamilyConfig>({
    familyName: '',
    description: '',
    surname: '',
    country: 'Brasil',
    language: 'Português',
    privacy: 'family-only',
    notifications: true
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Carregar configurações do localStorage
    setTimeout(() => {
      const savedConfig = localStorage.getItem('family-config')
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig))
      }
      setIsLoading(false)
    }, 800)
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    localStorage.setItem('family-config', JSON.stringify(config))
    
    // Atualizar nome da família nas estatísticas se necessário
    const stats = JSON.parse(localStorage.getItem('family-stats') || '{}')
    localStorage.setItem('family-stats', JSON.stringify(stats))
    
    setIsSaving(false)
  }

  const handleChange = (field: keyof FamilyConfig, value: FamilyConfig[keyof FamilyConfig]) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <DashboardBackground >
        <DashboardContainer className="max-w-4xl">
          <DashboardHeader title="Configurar Família" />
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="p-6 bg-slate-800/50 border-slate-700 animate-pulse">
                <div className="h-4 bg-slate-700 rounded w-1/4 mb-4"></div>
                <div className="h-10 bg-slate-700 rounded"></div>
              </Card>
            ))}
          </div>
        </DashboardContainer>
      </DashboardBackground>
    )
  }

  return (
    <DashboardBackground >
      <DashboardContainer className="max-w-4xl">
        <DashboardHeader 
          title="Configurar Família"
          subtitle="Personalize as informações e preferências da sua família"
          
        />

        <div className="grid gap-6">
          {/* Informações Básicas */}
          <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Informações Básicas</h3>
                <p className="text-slate-400 text-sm">Dados principais da família</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Nome da Família *</label>
                <Input 
                  value={config.familyName} 
                  onChange={(e) => handleChange('familyName', e.target.value)}
                  placeholder="Ex: Família Silva" 
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Sobrenome</label>
                <Input 
                  value={config.surname} 
                  onChange={(e) => handleChange('surname', e.target.value)}
                  placeholder="Ex: Silva" 
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-slate-300 font-medium">Descrição</label>
                <Textarea 
                  value={config.description} 
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Conte um pouco sobre sua família..."
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500 min-h-24"
                />
              </div>
            </div>
          </Card>

          {/* Localização e Idioma */}
          <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Localização</h3>
                <p className="text-slate-400 text-sm">Localização principal da família</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">País</label>
                <Input 
                  value={config.country} 
                  onChange={(e) => handleChange('country', e.target.value)}
                  placeholder="Ex: Brasil" 
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Idioma</label>
                <Input 
                  value={config.language} 
                  onChange={(e) => handleChange('language', e.target.value)}
                  placeholder="Ex: Português" 
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-emerald-500"
                />
              </div>
            </div>
          </Card>

          {/* Configurações de Privacidade */}
          <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Privacidade</h3>
                <p className="text-slate-400 text-sm">Controle quem pode ver suas informações</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">Privacidade da Árvore</p>
                  <p className="text-slate-400 text-sm">Quem pode visualizar sua árvore genealógica</p>
                </div>
                <select 
                  value={config.privacy}
                  onChange={(e) => handleChange('privacy', e.target.value)}
                  className="bg-slate-600 border-slate-500 text-white rounded px-3 py-2 focus:border-emerald-500"
                >
                  <option value="private">Privado</option>
                  <option value="family-only">Apenas Família</option>
                  <option value="public">Público</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">Notificações por Email</p>
                  <p className="text-slate-400 text-sm">Receber notificações sobre atividades da família</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={config.notifications}
                    onChange={(e) => handleChange('notifications', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-600 peer-focus:ring-4 peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </Card>

          {/* Botão Salvar */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={!config.familyName || isSaving}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/25 px-8 py-2 h-12 transition-all duration-300 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </div>
      </DashboardContainer>
    </DashboardBackground>
  )
}