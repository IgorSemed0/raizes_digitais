"use client"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface MembroFamilia {
  id: string
  nome: string
  ano_nascimento?: number
  genero: "M" | "F"
  pais?: string[]
  conjuge_id?: string
  filhos?: string[]
}

interface FiltrosArvoreProps {
  dados: { [key: string]: MembroFamilia }
  geracaoSelecionada: number | null
  onGeracaoChange: (geracao: number | null) => void
}

export default function FiltrosArvore({ dados, geracaoSelecionada, onGeracaoChange }: FiltrosArvoreProps) {
  // Calculate max generation
  const calcularGeracao = (id: string, visitados: Set<string> = new Set()): number => {
    if (visitados.has(id)) return 0
    visitados.add(id)

    const membro = dados[id]
    if (!membro?.pais || membro.pais.length === 0) return 0

    const geracaoPais = Math.max(...membro.pais.map((paiId) => calcularGeracao(paiId, visitados)))
    return geracaoPais + 1
  }

  const geracoes = new Set<number>()
  Object.keys(dados).forEach((id) => {
    geracoes.add(calcularGeracao(id))
  })

  const maxGeracao = Math.max(...geracoes, 0)

  const rotulos: { [key: number]: string } = {
    0: "Raiz (Sem pais)",
    1: "Filhos",
    2: "Netos",
    3: "Bisnetos",
    4: "Tataranetos",
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 w-full md:w-auto bg-transparent">
          Gerações
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Filtrar por Geração</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onGeracaoChange(null)}>Todas as Gerações</DropdownMenuItem>
        {Array.from(geracoes)
          .sort((a, b) => a - b)
          .map((geracao) => (
            <DropdownMenuItem
              key={geracao}
              onClick={() => onGeracaoChange(geracao)}
              className={geracaoSelecionada === geracao ? "bg-slate-100 dark:bg-slate-800" : ""}
            >
              {rotulos[geracao] || `Geração ${geracao}`}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
