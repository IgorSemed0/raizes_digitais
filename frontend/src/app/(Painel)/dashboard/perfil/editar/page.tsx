'use client'
import React, { useState } from 'react'
import { useAuthStore, useAuthUser } from '@/stores/auth-store'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/ui/input'

export default function EditarPerfil() {
  const user = useAuthUser()
  const updateUser = useAuthStore((s) => s.updateUser)
  const [name, setName] = useState(user?.vc_user_name ?? '')
  const [pnome, setPnome] = useState(user?.vc_pnome ?? '')
  const [unome, setUnome] = useState(user?.vc_unome ?? '')
  const [foto, setFoto] = useState(user?.vc_foto_perfil ?? '')

  const salvar = () => {
    updateUser({
      vc_user_name: name,
      vc_pnome: pnome,
      vc_unome: unome,
      vc_foto_perfil: foto,
    })
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-(--text-primary)">Editar Perfil</h1>
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-(--text-secondary)">Nome de usuário</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-(--text-secondary)">Primeiro nome</label>
              <Input value={pnome} onChange={(e) => setPnome(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-(--text-secondary)">Último nome</label>
              <Input value={unome} onChange={(e) => setUnome(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-(--text-secondary)">Foto (URL)</label>
            <Input value={foto} onChange={(e) => setFoto(e.target.value)} placeholder="https://..." />
          </div>
          <div className="flex justify-end">
            <Button onClick={salvar}>Salvar</Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
