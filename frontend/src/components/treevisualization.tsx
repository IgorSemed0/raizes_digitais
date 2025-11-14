"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Search, RotateCw } from "lucide-react"
import { motion } from "framer-motion"

interface MembroFamilia {
  id: string
  nome: string
  ano_nascimento?: number
  genero: "M" | "F"
  pais?: string[]
  conjuge_id?: string
  filhos?: string[]
}

const DADOS_EXEMPLO: { [key: string]: MembroFamilia } = {
  "1": { id: "1", nome: "João Silva", ano_nascimento: 1945, genero: "M", filhos: ["3", "4"] },
  "2": { id: "2", nome: "Maria Santos", ano_nascimento: 1948, genero: "F", filhos: ["3", "4"] },
  "3": { id: "3", nome: "Carlos Silva", ano_nascimento: 1970, genero: "M", pais: ["1", "2"], filhos: ["5", "6"], conjuge_id: "7" },
  "4": { id: "4", nome: "Ana Silva", ano_nascimento: 1972, genero: "F", pais: ["1", "2"], filhos: ["8"] },
  "5": { id: "5", nome: "Pedro Silva", ano_nascimento: 1995, genero: "M", pais: ["3", "7"] },
  "6": { id: "6", nome: "Lucia Silva", ano_nascimento: 1998, genero: "F", pais: ["3", "7"] },
  "7": { id: "7", nome: "Fernanda Costa", ano_nascimento: 1971, genero: "F", conjuge_id: "3", filhos: ["5", "6"] },
  "8": { id: "8", nome: "Bruno Silva", ano_nascimento: 2000, genero: "M", pais: ["4"] },
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

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return

    const svg = d3.select(svgRef.current)
    const container = containerRef.current
    
    svg.selectAll("*").remove()

    const width = container.clientWidth
    const height = container.clientHeight
    
    svg.attr("width", width).attr("height", height)

    const grupo = svg.append("g")

    // Calcular gerações
    const calcularGeracao = (id: string, visitados: Set<string> = new Set()): number => {
      if (visitados.has(id)) return 0
      visitados.add(id)
      
      const membro = DADOS_EXEMPLO[id]
      if (!membro?.pais || membro.pais.length === 0) return 0
      
      const geracaoPais = Math.max(...membro.pais.map(paiId => calcularGeracao(paiId, visitados)))
      return geracaoPais + 1
    }

    const geracoes = new Map<string, number>()
    Object.keys(DADOS_EXEMPLO).forEach(id => {
      geracoes.set(id, calcularGeracao(id))
    })

    // Organizar por geração
    const porGeracao = new Map<number, string[]>()
    geracoes.forEach((geracao, id) => {
      if (!porGeracao.has(geracao)) porGeracao.set(geracao, [])
      porGeracao.get(geracao)!.push(id)
    })

    // Criar nós
    const nos: No[] = []
    const mapaNos = new Map<string, No>()

    porGeracao.forEach((membros, geracao) => {
      membros.forEach((id, index) => {
        const total = membros.length
        const x = (index - total / 2) * 320
        const y = geracao * 280
        
        const no: No = { 
          id, 
          x, 
          y, 
          membro: DADOS_EXEMPLO[id], 
          geracao 
        }
        nos.push(no)
        mapaNos.set(id, no)
      })
    })

    const ligacoes: Ligacao[] = []
    const casaisProcessados = new Set<string>()

    Object.values(DADOS_EXEMPLO).forEach(membro => {
      membro.filhos?.forEach(filhoId => {
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

    // Desenhar ligações
    grupo.selectAll("line")
      .data(ligacoes)
      .enter()
      .append("line")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke", d => d.tipo === "filho" ? "#8b5cf6" : "#ec4899")
      .attr("stroke-width", 2.5)
      .attr("stroke-dasharray", d => d.tipo === "conjuge" ? "5,5" : "0")
      .attr("opacity", 0.6)

    // Gradientes
    const defs = svg.append("defs")
    
    // Gradiente masculino
    defs.append("linearGradient")
      .attr("id", "gradienteM")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "100%").attr("y2", "100%")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "#3b82f6" },
        { offset: "100%", color: "#1e40af" }
      ])
      .enter().append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color)

    // Gradiente feminino
    defs.append("linearGradient")
      .attr("id", "gradienteF")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "100%").attr("y2", "100%")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "#f43f5e" },
        { offset: "100%", color: "#be123c" }
      ])
      .enter().append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color)

    // Criar nós visuais
    const gruposNos = grupo.selectAll("g")
      .data(nos)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .style("cursor", "pointer")

    // Cartão do membro
    gruposNos.append("rect")
      .attr("x", -90)
      .attr("y", -50)
      .attr("width", 180)
      .attr("height", 100)
      .attr("rx", 12)
      .attr("fill", d => d.membro.genero === "M" ? "url(#gradienteM)" : "url(#gradienteF)")
      .attr("opacity", 0.9)
      .attr("stroke", d => d.membro.genero === "M" ? "#3b82f6" : "#f43f5e")
      .attr("stroke-width", 2)
      .attr("class", "fundo-no")

    // Textos
    gruposNos.append("text")
      .attr("text-anchor", "middle")
      .attr("y", -15)
      .attr("fill", "#ffffff")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text(d => d.membro.nome)

    gruposNos.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 5)
      .attr("fill", "#e2e8f0")
      .attr("font-size", "12px")
      .text(d => d.membro.ano_nascimento ? `${d.membro.ano_nascimento}` : "")

    gruposNos.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 22)
      .attr("fill", "#cbd5e1")
      .attr("font-size", "11px")
      .text(d => {
        if (!d.membro.ano_nascimento) return ""
        const idade = new Date().getFullYear() - d.membro.ano_nascimento
        return `${idade} anos`
      })

    // Interações
    gruposNos.on("click", (event: MouseEvent, d: No) => {
      event.stopPropagation()
      setMembroSelecionado(d.id === membroSelecionado ? null : d.id)
    })

    gruposNos.on("mouseenter", function(event: MouseEvent, d: No) {
      d3.select(this).select(".fundo-no")
        .transition().duration(300)
        .attr("stroke-width", 3)
        .attr("opacity", 1)

      d3.select(this)
        .transition().duration(300)
        .attr("transform", `translate(${d.x},${d.y}) scale(1.1)`)
    })

    gruposNos.on("mouseleave", function(event: MouseEvent, d: No) {
      const estaSelecionado = membroSelecionado === d.id
      
      d3.select(this).select(".fundo-no")
        .transition().duration(300)
        .attr("stroke-width", estaSelecionado ? 3 : 2)
        .attr("opacity", estaSelecionado ? 1 : 0.9)

      d3.select(this)
        .transition().duration(300)
        .attr("transform", `translate(${d.x},${d.y})${estaSelecionado ? " scale(1.15)" : ""}`)
    })

    // Aplicar seleção inicial
    gruposNos.each(function(d: No) {
      if (d.id === membroSelecionado) {
        const elemento = d3.select(this)
        elemento.select(".fundo-no")
          .attr("stroke", "#fbbf24")
          .attr("stroke-width", 3)
          .attr("opacity", 1)
        elemento.attr("transform", `translate(${d.x},${d.y}) scale(1.15)`)
      }
    })

    // Configurar zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        grupo.attr("transform", event.transform.toString())
        setNivelZoom(event.transform.k)
      })

    svg.call(zoom)

    // Aplicar busca
    gruposNos.style("opacity", d => {
      if (!termoBusca) return 1
      return d.membro.nome.toLowerCase().includes(termoBusca.toLowerCase()) ? 1 : 0.2
    })

  }, [membroSelecionado, termoBusca])

  const reiniciarVisualizacao = () => {
    if (svgRef.current && containerRef.current) {
      const svg = d3.select(svgRef.current)
      svg.transition()
        .duration(750)
        .call(
          d3.zoom<SVGSVGElement, unknown>().transform, 
          d3.zoomIdentity.translate(containerRef.current.clientWidth / 2, 100)
        )
    }
    setMembroSelecionado(null)
    setNivelZoom(1)
  }

  const dadosMembroSelecionado = membroSelecionado ? DADOS_EXEMPLO[membroSelecionado] : null

  return (
    <div className="flex flex-col h-full  bg-linear-to-b from-slate-950 to-slate-900">
      {/* Cabeçalho */}
      <div className="">
        <div className=" flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Árvore Genealógica</h1>
            <p className="text-slate-300 text-sm">Visualize e explore suas conexões familiares</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar membro..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <button
              onClick={reiniciarVisualizacao}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-colors border border-indigo-500/50 font-medium"
            >
              <RotateCw size={18} />
              Resetar
            </button>
          </div>
        </div>
      </div>

      {/* Container SVG */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden bg-slate-900">
        <svg
          ref={svgRef}
          className="w-full h-full"
        />
      </div>

      {/* Painel de Informações */}
      {dadosMembroSelecionado && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-slate-700 bg-slate-800/80 backdrop-blur-sm px-6 py-4"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-lg flex items-center justify-center text-xl font-bold text-white ${
                    dadosMembroSelecionado.genero === "M" 
                      ? "bg-gradient-to-br from-blue-500 to-blue-600" 
                      : "bg-gradient-to-br from-pink-500 to-pink-600"
                  }`}
                >
                  {dadosMembroSelecionado.nome.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{dadosMembroSelecionado.nome}</h3>
                  <p className="text-slate-300 text-sm">
                    {dadosMembroSelecionado.ano_nascimento && `Nascido em ${dadosMembroSelecionado.ano_nascimento}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMembroSelecionado(null)}
                className="text-slate-400 hover:text-white transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            {/* Grade de Relações */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dadosMembroSelecionado.pais && dadosMembroSelecionado.pais.length > 0 && (
                <div>
                  <h4 className="text-blue-400 font-semibold mb-2">Pais</h4>
                  <div className="space-y-1">
                    {dadosMembroSelecionado.pais.map((idPai) => (
                      <button
                        key={idPai}
                        onClick={() => setMembroSelecionado(idPai)}
                        className="w-full text-left text-sm text-slate-200 bg-slate-700/50 px-3 py-2 rounded hover:bg-slate-700 transition-colors"
                      >
                        {DADOS_EXEMPLO[idPai]?.nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {dadosMembroSelecionado.conjuge_id && (
                <div>
                  <h4 className="text-pink-400 font-semibold mb-2">Cônjuge</h4>
                  <button
                    onClick={() => setMembroSelecionado(dadosMembroSelecionado.conjuge_id!)}
                    className="w-full text-left text-sm text-slate-200 bg-slate-700/50 px-3 py-2 rounded hover:bg-slate-700 transition-colors"
                  >
                    {DADOS_EXEMPLO[dadosMembroSelecionado.conjuge_id]?.nome}
                  </button>
                </div>
              )}

              {dadosMembroSelecionado.filhos && dadosMembroSelecionado.filhos.length > 0 && (
                <div>
                  <h4 className="text-green-400 font-semibold mb-2">Filhos</h4>
                  <div className="space-y-1">
                    {dadosMembroSelecionado.filhos.map((idFilho) => (
                      <button
                        key={idFilho}
                        onClick={() => setMembroSelecionado(idFilho)}
                        className="w-full text-left text-sm text-slate-200 bg-slate-700/50 px-3 py-1 rounded hover:bg-slate-700 transition-colors"
                      >
                        {DADOS_EXEMPLO[idFilho]?.nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Legenda */}
      <div className="bg-slate-800 border-t border-slate-700 px-6 py-3 flex flex-wrap gap-6 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-blue-600" />
          <span className="text-slate-300">Masculino</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-pink-500 to-pink-600" />
          <span className="text-slate-300">Feminino</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 bg-purple-500" />
          <span className="text-slate-300">Filiação</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 border-t-2 border-dashed border-pink-500" />
          <span className="text-slate-300">Cônjuge</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs">Zoom: {nivelZoom.toFixed(1)}x</span>
        </div>
      </div>
    </div>
  )
}