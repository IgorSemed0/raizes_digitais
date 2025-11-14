"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Search, RotateCw, Plus, Edit2, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import FormularioMembro from "./formulario-membro"
import FiltrosArvore from "./filtros-arvore"

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

interface No {
  id: string
  x: number
  y: number
  membro: MembroFamilia
  geracao: number
}

interface Ligacao {
  source: No
  target: No
  tipo: "filho" | "conjuge"
}

export default function VisualizacaoArvoreD3() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [membroSelecionado, setMembroSelecionado] = useState<string | null>(null)
  const [termoBusca, setTermoBusca] = useState("")
  const [nivelZoom, setNivelZoom] = useState(1)
  const [dados, setDados] = useState<{ [key: string]: MembroFamilia }>({})
  const [geracao, setGeracao] = useState<number | null>(null)
  const [dialogAberto, setDialogAberto] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [membroEditando, setMembroEditando] = useState<MembroFamilia | null>(null)

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return

    const svg = d3.select(svgRef.current)
    const container = containerRef.current

    svg.selectAll("*").remove()

    const width = container.clientWidth
    const height = container.clientHeight

    svg.attr("width", width).attr("height", height)

    const grupo = svg.append("g").attr("transform", `translate(${width / 2},100)`)

    // Calculate generations
    const calcularGeracao = (id: string, visitados: Set<string> = new Set()): number => {
      if (visitados.has(id)) return 0
      visitados.add(id)

      const membro = dados[id]
      if (!membro?.pais || membro.pais.length === 0) return 0

      const geracaoPais = Math.max(...membro.pais.map((paiId) => calcularGeracao(paiId, visitados)))
      return geracaoPais + 1
    }

    const geracoes = new Map<string, number>()
    Object.keys(dados).forEach((id) => {
      geracoes.set(id, calcularGeracao(id))
    })

    // Filter by generation if selected
    let idsVisiveis = Array.from(geracoes.keys())
    if (geracao !== null) {
      idsVisiveis = idsVisiveis.filter((id) => geracoes.get(id) === geracao)
    }

    // Organize by generation
    const porGeracao = new Map<number, string[]>()
    geracoes.forEach((gen, id) => {
      if (!porGeracao.has(gen)) porGeracao.set(gen, [])
      if (idsVisiveis.includes(id)) {
        porGeracao.get(gen)!.push(id)
      }
    })

    // Create nodes
    const nos: No[] = []
    const mapaNos = new Map<string, No>()

    const espacoVertical = width < 768 ? 200 : 280
    const espacoHorizontal = width < 768 ? 200 : 320

    porGeracao.forEach((membros, gen) => {
      membros.forEach((id, index) => {
        const total = membros.length
        const x = (index - total / 2) * espacoHorizontal
        const y = gen * espacoVertical

        const no: No = {
          id,
          x,
          y,
          membro: dados[id],
          geracao: gen,
        }
        nos.push(no)
        mapaNos.set(id, no)
      })
    })

    // Create links
    const ligacoes: Ligacao[] = []
    const casaisProcessados = new Set<string>()

    Object.values(dados).forEach((membro) => {
      membro.filhos?.forEach((filhoId) => {
        const source = mapaNos.get(membro.id)
        const target = mapaNos.get(filhoId)
        if (source && target) {
          ligacoes.push({ source, target, tipo: "filho" })
        }
      })

      if (membro.conjuge_id) {
        const chave = [membro.id, membro.conjuge_id].sort().join("-")
        if (!casaisProcessados.has(chave)) {
          casaisProcessados.add(chave)
          const source = mapaNos.get(membro.id)
          const target = mapaNos.get(membro.conjuge_id)
          if (source && target) {
            ligacoes.push({ source, target, tipo: "conjuge" })
          }
        }
      }
    })

    // Draw links
    grupo
      .selectAll("line")
      .data(ligacoes)
      .enter()
      .append("line")
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)
      .attr("stroke", (d) => (d.tipo === "filho" ? "#8b5cf6" : "#ec4899"))
      .attr("stroke-width", 2.5)
      .attr("stroke-dasharray", (d) => (d.tipo === "conjuge" ? "5,5" : "0"))
      .attr("opacity", 0.6)

    // Gradients
    const defs = svg.append("defs")

    defs
      .append("linearGradient")
      .attr("id", "gradienteM")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "#3b82f6" },
        { offset: "100%", color: "#1e40af" },
      ])
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color)

    defs
      .append("linearGradient")
      .attr("id", "gradienteF")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "#f43f5e" },
        { offset: "100%", color: "#be123c" },
      ])
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color)

    // Create node groups
    const gruposNos = grupo
      .selectAll("g")
      .data(nos)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer")

    // Node cards
    gruposNos
      .append("rect")
      .attr("x", -90)
      .attr("y", -50)
      .attr("width", 180)
      .attr("height", 100)
      .attr("rx", 12)
      .attr("fill", (d) => (d.membro.genero === "M" ? "url(#gradienteM)" : "url(#gradienteF)"))
      .attr("opacity", 0.9)
      .attr("stroke", (d) => (d.membro.genero === "M" ? "#3b82f6" : "#f43f5e"))
      .attr("stroke-width", 2)
      .attr("class", "fundo-no")

    // Name text
    gruposNos
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", -15)
      .attr("fill", "#ffffff")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text((d) => d.membro.nome)

    // Birth year
    gruposNos
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", 5)
      .attr("fill", "#e2e8f0")
      .attr("font-size", "12px")
      .text((d) => (d.membro.ano_nascimento ? `${d.membro.ano_nascimento}` : ""))

    // Age
    gruposNos
      .append("text")
      .attr("text-anchor", "middle")
      .attr("y", 22)
      .attr("fill", "#cbd5e1")
      .attr("font-size", "11px")
      .text((d) => {
        if (!d.membro.ano_nascimento) return ""
        const idade = new Date().getFullYear() - d.membro.ano_nascimento
        return `${idade} anos`
      })

    // Interactions
    gruposNos.on("click", (event: MouseEvent, d: No) => {
      event.stopPropagation()
      setMembroSelecionado(d.id === membroSelecionado ? null : d.id)
    })

    gruposNos.on("mouseenter", function (event: MouseEvent, d: No) {
      d3.select(this).select(".fundo-no").transition().duration(300).attr("stroke-width", 3).attr("opacity", 1)

      d3.select(this).transition().duration(300).attr("transform", `translate(${d.x},${d.y}) scale(1.1)`)
    })

    gruposNos.on("mouseleave", function (event: MouseEvent, d: No) {
      const estaSelecionado = membroSelecionado === d.id

      d3.select(this)
        .select(".fundo-no")
        .transition()
        .duration(300)
        .attr("stroke-width", estaSelecionado ? 3 : 2)
        .attr("opacity", estaSelecionado ? 1 : 0.9)

      d3.select(this)
        .transition()
        .duration(300)
        .attr("transform", `translate(${d.x},${d.y})${estaSelecionado ? " scale(1.15)" : ""}`)
    })

    // Apply selection
    gruposNos.each(function (d: No) {
      if (d.id === membroSelecionado) {
        const elemento = d3.select(this)
        elemento.select(".fundo-no").attr("stroke", "#fbbf24").attr("stroke-width", 3).attr("opacity", 1)
        elemento.attr("transform", `translate(${d.x},${d.y}) scale(1.15)`)
      }
    })

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>().on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
      grupo.attr("transform", event.transform.toString())
      setNivelZoom(event.transform.k)
    })

    svg.call(zoom)

    // Apply search
    gruposNos.style("opacity", (d) => {
      if (!termoBusca) return 1
      return d.membro.nome.toLowerCase().includes(termoBusca.toLowerCase()) ? 1 : 0.2
    })
  }, [membroSelecionado, termoBusca, dados, geracao])

  const reiniciarVisualizacao = () => {
    if (svgRef.current && containerRef.current) {
      const svg = d3.select(svgRef.current)
      svg
        .transition()
        .duration(750)
        .call(
          d3.zoom<SVGSVGElement, unknown>().transform,
          d3.zoomIdentity.translate(containerRef.current.clientWidth / 2, 100),
        )
    }
    setMembroSelecionado(null)
    setNivelZoom(1)
    setGeracao(null)
  }

  const adicionarMembro = (novoMembro: MembroFamilia) => {
    const id = Math.random().toString(36).substring(7)
    setDados({
      ...dados,
      [id]: { ...novoMembro, id },
    })
    setDialogAberto(false)
  }

  const atualizarMembro = (membroAtualizado: MembroFamilia) => {
    setDados({
      ...dados,
      [membroAtualizado.id]: membroAtualizado,
    })
    setModalEditar(false)
    setMembroEditando(null)
  }

  const deletarMembro = (id: string) => {
    const novosDados = { ...dados }
    delete novosDados[id]
    setDados(novosDados)
    setMembroSelecionado(null)
  }

  const dadosMembroSelecionado = membroSelecionado ? dados[membroSelecionado] : null

  return (
    <div className="flex flex-col h-screen mx-auto">
        <div className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm px-4  w-fit md:px-6 py-4">
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Árvore Genealógica</h1>
            <p className="text-slate-300 text-sm">Visualize e explore suas conexões familiares</p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:flex-none w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar membro..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              />
            </div>

            {/* Filters */}
            <FiltrosArvore dados={dados} geracaoSelecionada={geracao} onGeracaoChange={setGeracao} />

            {/* Reset Button */}
            <Button
              onClick={reiniciarVisualizacao}
              variant="outline"
              size="sm"
              className="gap-2 w-full md:w-auto bg-transparent"
            >
              <RotateCw size={18} />
              Resetar
            </Button>

            {/* Add Member */}
            <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 w-full md:w-auto">
                  <Plus size={18} />
                  Novo Membro
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Membro</DialogTitle>
                </DialogHeader>
                <FormularioMembro onSubmit={adicionarMembro} membrosExistentes={Object.values(dados)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* SVG Container */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden bg-slate-900">
        <svg ref={svgRef} className="w-full h-full" />
      </div>

      {/* Info Panel */}
      {dadosMembroSelecionado && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-slate-700 bg-slate-800/80 backdrop-blur-sm overflow-y-auto"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4 flex-1">
              <div
                className={`w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center text-lg md:text-xl font-bold text-white flex-shrink-0 ${
                  dadosMembroSelecionado.genero === "M"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600"
                    : "bg-gradient-to-br from-pink-500 to-pink-600"
                }`}
              >
                {dadosMembroSelecionado.nome.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-bold text-white">{dadosMembroSelecionado.nome}</h3>
                {dadosMembroSelecionado.profissao && (
                  <p className="text-slate-400 text-sm">{dadosMembroSelecionado.profissao}</p>
                )}
                <p className="text-slate-300 text-sm">
                  {dadosMembroSelecionado.ano_nascimento && `${dadosMembroSelecionado.ano_nascimento}`}
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button
                onClick={() => {
                  setMembroEditando(dadosMembroSelecionado)
                  setModalEditar(true)
                }}
                size="sm"
                variant="ghost"
              >
                <Edit2 size={16} />
              </Button>
              <Button onClick={() => deletarMembro(dadosMembroSelecionado.id)} size="sm" variant="ghost">
                <Trash2 size={16} />
              </Button>
              <Button onClick={() => setMembroSelecionado(null)} size="sm" variant="ghost">
                ✕
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dadosMembroSelecionado.pais && dadosMembroSelecionado.pais.length > 0 && (
              <div>
                <h4 className="text-blue-400 font-semibold mb-2 text-sm">Pais</h4>
                <div className="space-y-1">
                  {dadosMembroSelecionado.pais.map((idPai) => (
                    <button
                      key={idPai}
                      onClick={() => setMembroSelecionado(idPai)}
                      className="w-full text-left text-xs md:text-sm text-slate-200 bg-slate-700/50 px-3 py-2 rounded hover:bg-slate-700 transition-colors"
                    >
                      {dados[idPai]?.nome}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {dadosMembroSelecionado.conjuge_id && (
              <div>
                <h4 className="text-pink-400 font-semibold mb-2 text-sm">Cônjuge</h4>
                <button
                  onClick={() => setMembroSelecionado(dadosMembroSelecionado.conjuge_id!)}
                  className="w-full text-left text-xs md:text-sm text-slate-200 bg-slate-700/50 px-3 py-2 rounded hover:bg-slate-700 transition-colors"
                >
                  {dados[dadosMembroSelecionado.conjuge_id]?.nome}
                </button>
              </div>
            )}

            {dadosMembroSelecionado.filhos && dadosMembroSelecionado.filhos.length > 0 && (
              <div>
                <h4 className="text-green-400 font-semibold mb-2 text-sm">Filhos</h4>
                <div className="space-y-1">
                  {dadosMembroSelecionado.filhos.map((idFilho) => (
                    <button
                      key={idFilho}
                      onClick={() => setMembroSelecionado(idFilho)}
                      className="w-full text-left text-xs md:text-sm text-slate-200 bg-slate-700/50 px-3 py-1 rounded hover:bg-slate-700 transition-colors"
                    >
                      {dados[idFilho]?.nome}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Legend and Zoom */}
      <div className="bg-slate-800 border-t border-slate-700 px-4 md:px-6 py-3 flex flex-wrap gap-4 md:gap-6 justify-center text-xs md:text-sm overflow-x-auto">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-gradient-to-br from-blue-500 to-blue-600" />
          <span className="text-slate-300">Masculino</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded bg-gradient-to-br from-pink-500 to-pink-600" />
          <span className="text-slate-300">Feminino</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="h-0.5 w-6 bg-purple-500" />
          <span className="text-slate-300">Filiação</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="h-0.5 w-6 border-t-2 border-dashed border-pink-500" />
          <span className="text-slate-300">Cônjuge</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-slate-400">Zoom: {nivelZoom.toFixed(1)}x</span>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={modalEditar} onOpenChange={setModalEditar}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Membro</DialogTitle>
          </DialogHeader>
          {membroEditando && (
            <FormularioMembro
              membro={membroEditando}
              onSubmit={atualizarMembro}
              membrosExistentes={Object.values(dados)}
              isEditing
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
