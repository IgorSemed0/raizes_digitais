"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface MembroFamilia {
  id: string
  nome: string
  ano_nascimento?: number
  ano_morte?: number
  genero: "M" | "F"
  pais?: string[]
  conjuge_id?: string
  filhos?: string[]
  profissao?: string
  descricao?: string
}

interface FormularioMembroProps {
  membro?: MembroFamilia
  onSubmit: (membro: MembroFamilia) => void
  membrosExistentes: MembroFamilia[]
  isEditing?: boolean
}

export default function FormularioMembro({ membro, onSubmit, membrosExistentes, isEditing }: FormularioMembroProps) {
  const [nome, setNome] = useState(membro?.nome || "")
  const [genero, setGenero] = useState<"M" | "F">(membro?.genero || "M")
  const [anoNascimento, setAnoNascimento] = useState(membro?.ano_nascimento?.toString() || "")
  const [anoMorte, setAnoMorte] = useState(membro?.ano_morte?.toString() || "")
  const [profissao, setProfissao] = useState(membro?.profissao || "")
  const [paisSelecionados, setPaisSelecionados] = useState<string[]>(membro?.pais || [])
  const [filhosSelecionados, setFilhosSelecionados] = useState<string[]>(membro?.filhos || [])
  const [conjugueSelecionado, setConjugueSelecionado] = useState(membro?.conjuge_id || "")

  const outrosMembros = membrosExistentes.filter((m) => m.id !== membro?.id)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome.trim()) {
      alert("Por favor, preencha o nome")
      return
    }

    const novoMembro: MembroFamilia = {
      id: membro?.id || "",
      nome,
      genero,
      ano_nascimento: anoNascimento ? Number.parseInt(anoNascimento) : undefined,
      ano_morte: anoMorte ? Number.parseInt(anoMorte) : undefined,
      profissao: profissao || undefined,
      pais: paisSelecionados.length > 0 ? paisSelecionados : undefined,
      filhos: filhosSelecionados.length > 0 ? filhosSelecionados : undefined,
      conjuge_id: conjugueSelecionado || undefined,
    }

    onSubmit(novoMembro)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nome */}
      <div className="space-y-2">
        <Label htmlFor="nome">Nome *</Label>
        <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" />
      </div>

      {/* Gênero */}
      <div className="space-y-2">
        <Label htmlFor="genero">Gênero</Label>
        <Select value={genero} onValueChange={(value) => setGenero(value as "M" | "F")}>
          <SelectTrigger id="genero">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="M">Masculino</SelectItem>
            <SelectItem value="F">Feminino</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Ano Nascimento */}
      <div className="space-y-2">
        <Label htmlFor="anoNascimento">Ano de Nascimento</Label>
        <Input
          id="anoNascimento"
          type="number"
          value={anoNascimento}
          onChange={(e) => setAnoNascimento(e.target.value)}
          placeholder="1990"
        />
      </div>

      {/* Ano Morte */}
      <div className="space-y-2">
        <Label htmlFor="anoMorte">Ano de Morte (opcional)</Label>
        <Input
          id="anoMorte"
          type="number"
          value={anoMorte}
          onChange={(e) => setAnoMorte(e.target.value)}
          placeholder="2020"
        />
      </div>

      {/* Profissão */}
      <div className="space-y-2">
        <Label htmlFor="profissao">Profissão (opcional)</Label>
        <Input
          id="profissao"
          value={profissao}
          onChange={(e) => setProfissao(e.target.value)}
          placeholder="Ex: Advogado"
        />
      </div>

      {/* Pais */}
      {outrosMembros.length > 0 && (
        <div className="space-y-2">
          <Label>Pais (opcional)</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto bg-slate-100 dark:bg-slate-900 p-2 rounded">
            {outrosMembros.map((membro) => (
              <div key={membro.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`pai-${membro.id}`}
                  checked={paisSelecionados.includes(membro.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setPaisSelecionados([...paisSelecionados, membro.id])
                    } else {
                      setPaisSelecionados(paisSelecionados.filter((id) => id !== membro.id))
                    }
                  }}
                />
                <Label htmlFor={`pai-${membro.id}`} className="cursor-pointer text-sm font-normal">
                  {membro.nome}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cônjuge */}
      {outrosMembros.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="conjuge">Cônjuge (opcional)</Label>
          <Select value={conjugueSelecionado} onValueChange={setConjugueSelecionado}>
            <SelectTrigger id="conjuge">
              <SelectValue placeholder="Selecione um cônjuge" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nenhum</SelectItem>
              {outrosMembros.map((membro) => (
                <SelectItem key={membro.id} value={membro.id}>
                  {membro.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Filhos */}
      {outrosMembros.length > 0 && (
        <div className="space-y-2">
          <Label>Filhos (opcional)</Label>
          <div className="space-y-2 max-h-40 overflow-y-auto bg-slate-100 dark:bg-slate-900 p-2 rounded">
            {outrosMembros.map((membro) => (
              <div key={membro.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`filho-${membro.id}`}
                  checked={filhosSelecionados.includes(membro.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilhosSelecionados([...filhosSelecionados, membro.id])
                    } else {
                      setFilhosSelecionados(filhosSelecionados.filter((id) => id !== membro.id))
                    }
                  }}
                />
                <Label htmlFor={`filho-${membro.id}`} className="cursor-pointer text-sm font-normal">
                  {membro.nome}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2 justify-end pt-4">
        <Button type="submit" className="w-full">
          {isEditing ? "Atualizar" : "Adicionar"}
        </Button>
      </div>
    </form>
  )
}
