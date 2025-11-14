"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TreePine, UserPlus, Users, ZoomIn, ZoomOut, Download, Share2, MoreHorizontal, ChevronDown, Smartphone, Tablet, Monitor, Trash2, Edit, Calendar, MapPin, Phone, Mail, Skull } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import * as d3 from "d3";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FamilyMemberNode {
  id: string;
  name: string;
  relationship: string;
  birthDate?: string;
  deathDate?: string;
  email?: string;
  phone?: string;
  location?: string;
  notes?: string;
  isDeceased?: boolean;
  x?: number;
  y?: number;
  parentIds?: string[];
  children?: FamilyMemberNode[];
}

// API Local para gerenciar a árvore genealógica
const familyTreeApi = {
  getTree: (): FamilyMemberNode | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('family-tree');
    return stored ? JSON.parse(stored) : null;
  },

  saveTree: (tree: FamilyMemberNode): void => {
    localStorage.setItem('family-tree', JSON.stringify(tree));
  },

  addMember: (tree: FamilyMemberNode | null, newMember: FamilyMemberNode, parentId?: string): FamilyMemberNode => {
    if (!tree) {
      return newMember;
    }
    
    const updatedTree = { ...tree };
    
    if (parentId) {
      const addToParent = (node: FamilyMemberNode): FamilyMemberNode => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...(node.children || []), newMember]
          };
        }
        if (node.children) {
          return {
            ...node,
            children: node.children.map(child => addToParent(child))
          };
        }
        return node;
      };
      return addToParent(updatedTree);
    } else {
      return {
        ...updatedTree,
        children: [...(updatedTree.children || []), newMember]
      };
    }
  },

  updateMember: (tree: FamilyMemberNode, memberId: string, updates: Partial<FamilyMemberNode>): FamilyMemberNode => {
    const updateNode = (node: FamilyMemberNode): FamilyMemberNode => {
      if (node.id === memberId) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(child => updateNode(child))
        };
      }
      return node;
    };
    return updateNode(tree);
  },

  deleteMember: (tree: FamilyMemberNode, memberId: string): FamilyMemberNode => {
    const removeNode = (node: FamilyMemberNode): FamilyMemberNode => {
      if (node.children) {
        const filteredChildren = node.children
          .filter(child => child.id !== memberId)
          .map(child => removeNode(child));
        return { ...node, children: filteredChildren };
      }
      return node;
    };
    return removeNode(tree);
  }
};

const relationships = [
  "Pai", "Mãe", "Filho", "Filha", "Avô", "Avó", "Tio", "Tia", "Primo", "Prima",
  "Irmão", "Irmã", "Sogro", "Sogra", "Genro", "Nora", "Neto", "Neta", "Bisavô", "Bisavó",
  "Esposo", "Esposa", "Cônjuge"
];

export default function ArvoreGenealogicaPage() {
  const [zoom, setZoom] = useState(1);
  const [selectedMember, setSelectedMember] = useState<FamilyMemberNode | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [treeData, setTreeData] = useState<FamilyMemberNode | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState<Partial<FamilyMemberNode>>({});
  const [editMember, setEditMember] = useState<Partial<FamilyMemberNode>>({});
  const [selectedParent, setSelectedParent] = useState<string>("");
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Carregar árvore do localStorage
  useEffect(() => {
    const loadTree = () => {
      try {
        const savedTree = familyTreeApi.getTree();
        setTreeData(savedTree);
      } catch (error) {
        console.error('Erro ao carregar árvore:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar a árvore genealógica",
          variant: "destructive"
        });
      }
    };
    loadTree();
  }, [toast]);

  // Detectar tamanho da tela
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Resetar zoom quando mudar para mobile
  useEffect(() => {
    setZoom(isMobile ? 0.7 : 1);
  }, [isMobile]);

  // Renderizar árvore com D3
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !treeData) return;

    // Limpar SVG anterior
    d3.select(svgRef.current).selectAll("*").remove();

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = Math.min(600, window.innerHeight * 0.6);

    // Dimensões responsivas
    const width = isMobile ? Math.min(containerWidth - 40, 800) : 1000;
    const height = isMobile ? Math.min(containerHeight, 500) : 600;
    
    const margin = isMobile 
      ? { top: 40, right: 60, bottom: 40, left: 60 }
      : { top: 80, right: 120, bottom: 80, left: 120 };

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Criar hierarquia para D3
    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree<FamilyMemberNode>().size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

    treeLayout(root);

    const nodeRadius = isMobile ? 25 : 40;
    const fontSize = isMobile ? 10 : 14;
    const nameFontSize = isMobile ? 9 : 12;
    const relationshipFontSize = isMobile ? 8 : 11;

    // Adicionar links (linhas de conexão)
    svg.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal<d3.HierarchyPointLink<FamilyMemberNode>, d3.HierarchyPointLink<FamilyMemberNode>>()
        .x(d => d.y)
        .y(d => d.x)
      )
      .style("fill", "none")
      .style("stroke", "url(#lineGradient)")
      .style("stroke-width", isMobile ? 2 : 3)
      .style("opacity", 0.6)
      .style("filter", "drop-shadow(0px 2px 3px rgba(0,0,0,0.3))");

    // Adicionar nós
    const node = svg.selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedMember(d.data);
      });

    // Círculos dos nós - cor diferente para falecidos
    node.append("circle")
      .attr("r", nodeRadius)
      .style("fill", d => d.data.isDeceased ? "url(#deceasedGradient)" : "url(#nodeGradient)")
      .style("stroke", d => selectedMember?.id === d.data.id ? 
        (d.data.isDeceased ? "#ef4444" : "#10b981") : "rgba(255,255,255,0.2)")
      .style("stroke-width", d => selectedMember?.id === d.data.id ? 3 : 2)
      .style("filter", "drop-shadow(0px 4px 8px rgba(0,0,0,0.4))")
      .style("transition", "all 0.3s ease");

    // Iniciais do nome
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .style("fill", "white")
      .style("font-size", `${fontSize}px`)
      .style("font-weight", "bold")
      .style("pointer-events", "none")
      .text(d => {
        const names = d.data.name.split(" ");
        return (names[0][0] + (names[1]?.[0] || "")).toUpperCase();
      });

    // Nome
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", isMobile ? nodeRadius + 15 : nodeRadius + 15)
      .style("fill", d => d.data.isDeceased ? "#94a3b8" : "#e2e8f0")
      .style("font-size", `${nameFontSize}px`)
      .style("font-weight", "600")
      .style("pointer-events", "none")
      .style("text-decoration", d => d.data.isDeceased ? "line-through" : "none")
      .text(d => d.data.name.split(" ")[0]);

    // Relacionamento
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", isMobile ? nodeRadius + 28 : nodeRadius + 32)
      .style("fill", d => d.data.isDeceased ? "#64748b" : "#94a3b8")
      .style("font-size", `${relationshipFontSize}px`)
      .style("pointer-events", "none")
      .text(d => d.data.relationship);

    // Símbolo de falecido
    node.filter(d => d.data.isDeceased)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", -nodeRadius - 5)
      .style("fill", "#ef4444")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("pointer-events", "none")
      .text("†");

    // Adicionar gradientes
    const defs = d3.select(svgRef.current).append("defs");
    
    // Gradiente normal para os nós
    const nodeGradient = defs.append("linearGradient")
      .attr("id", "nodeGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    nodeGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#10b981");

    nodeGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#0ea5e9");

    // Gradiente para falecidos
    const deceasedGradient = defs.append("linearGradient")
      .attr("id", "deceasedGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    deceasedGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#6b7280");

    deceasedGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#4b5563");

    // Gradiente para as linhas
    const lineGradient = defs.append("linearGradient")
      .attr("id", "lineGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    lineGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#10b981");

    lineGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#0ea5e9");

  }, [selectedMember, isMobile, treeData]);

  // Funções para gerenciar membros
  const handleAddMember = () => {
    if (!newMember.name || !newMember.relationship) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e relacionamento são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const memberToAdd: FamilyMemberNode = {
        id: Date.now().toString(),
        name: newMember.name,
        relationship: newMember.relationship,
        birthDate: newMember.birthDate,
        deathDate: newMember.deathDate,
        email: newMember.email,
        phone: newMember.phone,
        location: newMember.location,
        notes: newMember.notes,
        isDeceased: newMember.isDeceased || false
      };

      const parentId = selectedParent || selectedMember?.id;
      const updatedTree = familyTreeApi.addMember(treeData, memberToAdd, parentId);
      
      setTreeData(updatedTree);
      familyTreeApi.saveTree(updatedTree);
      
      setNewMember({});
      setSelectedParent("");
      setIsAddDialogOpen(false);

      toast({
        title: "Membro adicionado!",
        description: `${newMember.name} foi adicionado à árvore genealógica`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o membro",
        variant: "destructive"
      });
    }
  };

  const handleEditMember = () => {
    if (!selectedMember || !editMember.name) return;

    try {
      const updatedTree = familyTreeApi.updateMember(treeData!, selectedMember.id, editMember);
      setTreeData(updatedTree);
      familyTreeApi.saveTree(updatedTree);
      setSelectedMember({ ...selectedMember, ...editMember });
      setIsEditDialogOpen(false);
      setEditMember({});

      toast({
        title: "Membro atualizado!",
        description: "As informações foram salvas com sucesso",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o membro",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMember = () => {
    if (!selectedMember || !treeData) return;

    try {
      const updatedTree = familyTreeApi.deleteMember(treeData, selectedMember.id);
      setTreeData(updatedTree);
      familyTreeApi.saveTree(updatedTree);
      setSelectedMember(null);

      toast({
        title: "Membro removido",
        description: `${selectedMember.name} foi removido da árvore`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover o membro",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    if (!treeData) return;
    
    const dataStr = JSON.stringify(treeData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `arvore-genealogica-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Árvore exportada!",
      description: "Sua árvore genealógica foi baixada com sucesso",
      variant: "default"
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedTree = JSON.parse(content);
        setTreeData(importedTree);
        familyTreeApi.saveTree(importedTree);
        
        toast({
          title: "Árvore importada!",
          description: "Sua árvore genealógica foi carregada com sucesso",
          variant: "default"
        });
      } catch (error) {
        toast({
          title: "Erro na importação",
          description: "O arquivo selecionado não é válido",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const openEditDialog = (member: FamilyMemberNode) => {
    setEditMember({ ...member });
    setIsEditDialogOpen(true);
  };

  // Estatísticas da árvore
  const getTreeStats = () => {
    if (!treeData) {
      return { totalMembers: 0, generations: 0, deceasedMembers: 0 };
    }

    let totalMembers = 0;
    let generations = 0;
    let deceasedMembers = 0;

    const countMembers = (node: FamilyMemberNode, depth: number): void => {
      totalMembers++;
      if (node.isDeceased) deceasedMembers++;
      generations = Math.max(generations, depth);
      
      if (node.children) {
        node.children.forEach(child => countMembers(child, depth + 1));
      }
    };

    countMembers(treeData, 1);
    
    return { totalMembers, generations, deceasedMembers };
  };

  const stats = getTreeStats();

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Árvore Genealógica
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Explore e expanda sua história familiar
            </p>
          </div>

          {/* Menu Mobile */}
          {isMobile ? (
            <div className="relative">
              <Button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="w-full bg-slate-800 border-slate-700 text-white flex items-center justify-between"
              >
                <span>Ações</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showMobileMenu ? 'rotate-180' : ''}`} />
              </Button>
              
              {showMobileMenu && (
                <Card className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border-slate-700 shadow-2xl z-50">
                  <div className="p-2 space-y-2">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                      id="import-file-mobile"
                    />
                    <label 
                      htmlFor="import-file-mobile"
                      className="w-full flex items-center justify-start p-2 border border-slate-600 text-slate-300 hover:bg-slate-700 rounded-lg cursor-pointer text-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Importar
                    </label>
                    <Button
                      variant="outline"
                      onClick={handleExport}
                      disabled={!treeData}
                      className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700 text-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Exportar
                    </Button>
                    <Button
                      onClick={() => setIsAddDialogOpen(true)}
                      className="w-full justify-start bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-sm"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Adicionar Membro
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <label 
                htmlFor="import-file"
                className="flex items-center gap-2 px-3 py-2 border border-slate-600 text-slate-300 hover:bg-slate-700 rounded-lg cursor-pointer text-sm"
              >
                <Download className="w-4 h-4" />
                Importar
              </label>
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={!treeData}
                className="flex items-center gap-2 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-sm"
              >
                <Download className="w-4 h-4" />
                Exportar
              </Button>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white flex items-center gap-2 shadow-lg shadow-emerald-500/25 text-sm"
              >
                <UserPlus className="w-4 h-4" />
                Adicionar Membro
              </Button>
            </div>
          )}
        </motion.div>

        {/* Indicador de Dispositivo */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          {isMobile ? (
            <>
              <Smartphone className="w-3 h-3" />
              <span>Modo Mobile</span>
            </>
          ) : window.innerWidth < 1024 ? (
            <>
              <Tablet className="w-3 h-3" />
              <span>Modo Tablet</span>
            </>
          ) : (
            <>
              <Monitor className="w-3 h-3" />
              <span>Modo Desktop</span>
            </>
          )}
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 sm:p-6 bg-slate-800 border-slate-700 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-400">Total de Membros</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-emerald-400">{stats.totalMembers}</h3>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-cyan-600 flex items-center justify-center shadow-lg">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 sm:p-6 bg-slate-800 border-slate-700 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-400">Gerações</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-cyan-400">{stats.generations}</h3>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg">
                  <TreePine className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-4 sm:p-6 bg-slate-800 border-slate-700 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-400">Membros Falecidos</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-rose-400">{stats.deceasedMembers}</h3>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-rose-600 to-red-600 flex items-center justify-center shadow-lg">
                  <Skull className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-4 sm:p-6 bg-slate-800 border-slate-700 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-slate-400">Ramos Familiares</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-amber-400">
                    {treeData?.children?.length || 0}
                  </h3>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-lg">
                  <TreePine className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Visualização da Árvore com D3.js */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-slate-800 border-slate-700 shadow-2xl overflow-hidden">
            {/* Controles */}
            <div className="p-4 sm:p-6 border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <TreePine className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm sm:text-base">Visualização Interativa</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300 border-slate-600 text-xs">
                        {stats.totalMembers} membros
                      </Badge>
                      {stats.deceasedMembers > 0 && (
                        <Badge variant="secondary" className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs">
                          {stats.deceasedMembers} falecidos
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1 sm:gap-2 bg-slate-700 rounded-lg p-1">
                    <Button
                      size={isMobile ? "icon" : "sm"}
                      variant="ghost"
                      onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}
                      className="text-slate-300 hover:text-white hover:bg-slate-600"
                    >
                      <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <span className="text-xs sm:text-sm text-slate-300 min-w-[40px] sm:min-w-[60px] text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <Button
                      size={isMobile ? "icon" : "sm"}
                      variant="ghost"
                      onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                      className="text-slate-300 hover:text-white hover:bg-slate-600"
                    >
                      <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                  {!isMobile && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Canvas da Árvore com D3.js */}
            {treeData ? (
              <div 
                ref={containerRef}
                className="relative bg-gradient-to-br from-slate-900 to-slate-800 overflow-auto flex justify-center items-center p-2 sm:p-4"
                style={{ minHeight: isMobile ? "400px" : "600px" }}
              >
                <svg
                  ref={svgRef}
                  style={{ 
                    transform: `scale(${zoom})`, 
                    transformOrigin: "center",
                    transition: "transform 0.3s ease-in-out",
                    maxWidth: "100%",
                    height: "auto"
                  }}
                  className="shadow-2xl"
                />
              </div>
            ) : (
              <div className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                <h3 className="text-white font-semibold text-lg mb-2">Nenhuma árvore genealógica</h3>
                <p className="text-slate-400 mb-6">Comece criando sua árvore genealógica adicionando o primeiro membro.</p>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Adicionar Primeiro Membro
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Painel de Detalhes do Membro Selecionado */}
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-4 sm:p-6 bg-slate-800 border-slate-700 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <Avatar className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 border-2 ${selectedMember.isDeceased ? 'border-rose-500/20' : 'border-emerald-500/20'}`}>
                    <AvatarFallback className={`${selectedMember.isDeceased ? 'bg-gradient-to-br from-rose-600 to-red-600' : 'bg-gradient-to-br from-emerald-600 to-cyan-600'} text-white font-bold text-sm sm:text-base lg:text-lg`}>
                      {selectedMember.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-lg sm:text-xl font-bold break-words ${selectedMember.isDeceased ? 'text-rose-400' : 'text-white'}`}>
                        {selectedMember.name}
                      </h3>
                      {selectedMember.isDeceased && (
                        <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30 text-xs">
                          <Skull className="w-3 h-3 mr-1" />
                          Falecido
                        </Badge>
                      )}
                    </div>
                    <Badge className={`${selectedMember.isDeceased ? 'bg-slate-500/20 text-slate-400 border-slate-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'} text-xs sm:text-sm mb-2`}>
                      {selectedMember.relationship}
                    </Badge>
                    <div className="space-y-1 text-slate-400 text-sm">
                      {selectedMember.birthDate && (
                        <p className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Nascimento: {selectedMember.birthDate}</span>
                        </p>
                      )}
                      {selectedMember.deathDate && (
                        <p className="flex items-center gap-2 text-rose-400">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Falecimento: {selectedMember.deathDate}</span>
                        </p>
                      )}
                      {selectedMember.location && (
                        <p className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{selectedMember.location}</span>
                        </p>
                      )}
                      {selectedMember.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{selectedMember.phone}</span>
                        </p>
                      )}
                      {selectedMember.email && (
                        <p className="flex items-center gap-2">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{selectedMember.email}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(selectedMember)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDeleteMember}
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedMember(null)}
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    Fechar
                  </Button>
                </div>
              </div>

              {selectedMember.notes && (
                <div className="mb-4 sm:mb-6 p-3 bg-slate-700 rounded-lg">
                  <p className="text-slate-300 text-sm">{selectedMember.notes}</p>
                </div>
              )}

              <div className="pt-4 sm:pt-6 border-t border-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2 border-slate-600 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all text-xs sm:text-sm py-2"
                    onClick={() => {
                      setSelectedParent(selectedMember.id);
                      setIsAddDialogOpen(true);
                    }}
                  >
                    <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                    Adicionar Filho(a)
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2 border-slate-600 text-slate-300 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/30 transition-all text-xs sm:text-sm py-2"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                    Adicionar Cônjuge
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2 border-slate-600 text-slate-300 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/30 transition-all text-xs sm:text-sm py-2"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                    Adicionar Irmão(ã)
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Dialog para Adicionar Membro */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 w-full max-w-[95vw] sm:max-w-lg lg:max-w-xl p-4 sm:p-6 md:p-8 overflow-y-auto flex flex-col max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-white text-base xs:text-lg sm:text-xl">
                Adicionar Novo Membro
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 xs:space-y-4 max-h-[60vh] md:max-h-[65vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Nome *</label>
                <Input
                  value={newMember.name || ''}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-xs xs:text-sm"
                  placeholder="Nome completo"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Relacionamento *</label>
                <Select
                  value={newMember.relationship}
                  onValueChange={(value) => setNewMember({ ...newMember, relationship: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white text-xs xs:text-sm">
                    <SelectValue placeholder="Selecione o relacionamento" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {relationships.map(rel => (
                      <SelectItem key={rel} value={rel} className="text-white text-xs xs:text-sm">
                        {rel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={newMember.isDeceased || false}
                  onCheckedChange={(checked) => setNewMember({ ...newMember, isDeceased: checked })}
                  id="deceased-mode"
                />
                <Label htmlFor="deceased-mode" className="text-sm text-slate-300">
                  Membro Falecido
                </Label>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Data de Nascimento</label>
                <Input
                  type="date"
                  value={newMember.birthDate || ''}
                  onChange={(e) => setNewMember({ ...newMember, birthDate: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white text-xs xs:text-sm"
                />
              </div>

              {newMember.isDeceased && (
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Data de Falecimento</label>
                  <Input
                    type="date"
                    value={newMember.deathDate || ''}
                    onChange={(e) => setNewMember({ ...newMember, deathDate: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white text-xs xs:text-sm"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Email</label>
                <Input
                  type="email"
                  value={newMember.email || ''}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-xs xs:text-sm"
                  placeholder="email@familia.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Telefone</label>
                <Input
                  value={newMember.phone || ''}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-xs xs:text-sm"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Localização</label>
                <Input
                  value={newMember.location || ''}
                  onChange={(e) => setNewMember({ ...newMember, location: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 text-xs xs:text-sm"
                  placeholder="Cidade, Estado"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Notas</label>
                <Textarea
                  value={newMember.notes || ''}
                  onChange={(e) => setNewMember({ ...newMember, notes: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[60px] xs:min-h-[80px] text-xs xs:text-sm"
                  placeholder="Informações adicionais..."
                />
              </div>

              {selectedMember && (
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Adicionar como filho de</label>
                  <div className="p-3 bg-slate-700 rounded-lg border border-slate-600">
                    <p className="text-white font-medium">{selectedMember.name}</p>
                    <p className="text-slate-400 text-xs xs:text-sm">{selectedMember.relationship}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs xs:text-sm"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddMember}
                disabled={!newMember.name || !newMember.relationship}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs xs:text-sm"
              >
                Adicionar Membro
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog para Editar Membro */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 w-full max-w-[95vw] sm:max-w-lg lg:max-w-xl p-4 sm:p-6 md:p-8 overflow-y-auto flex flex-col max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-white text-base xs:text-lg sm:text-xl">
                Editar Membro
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 xs:space-y-4 max-h-[60vh] md:max-h-[65vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Nome *</label>
                <Input
                  value={editMember.name || ''}
                  onChange={(e) => setEditMember({ ...editMember, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white text-xs xs:text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Relacionamento *</label>
                <Select
                  value={editMember.relationship}
                  onValueChange={(value) => setEditMember({ ...editMember, relationship: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white text-xs xs:text-sm">
                    <SelectValue placeholder="Selecione o relacionamento" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {relationships.map(rel => (
                      <SelectItem key={rel} value={rel} className="text-white text-xs xs:text-sm">
                        {rel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={editMember.isDeceased || false}
                  onCheckedChange={(checked) => setEditMember({ ...editMember, isDeceased: checked })}
                  id="edit-deceased-mode"
                />
                <Label htmlFor="edit-deceased-mode" className="text-sm text-slate-300">
                  Membro Falecido
                </Label>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Data de Nascimento</label>
                <Input
                  type="date"
                  value={editMember.birthDate || ''}
                  onChange={(e) => setEditMember({ ...editMember, birthDate: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white text-xs xs:text-sm"
                />
              </div>

              {editMember.isDeceased && (
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Data de Falecimento</label>
                  <Input
                    type="date"
                    value={editMember.deathDate || ''}
                    onChange={(e) => setEditMember({ ...editMember, deathDate: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white text-xs xs:text-sm"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Email</label>
                <Input
                  type="email"
                  value={editMember.email || ''}
                  onChange={(e) => setEditMember({ ...editMember, email: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white text-xs xs:text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Telefone</label>
                <Input
                  value={editMember.phone || ''}
                  onChange={(e) => setEditMember({ ...editMember, phone: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white text-xs xs:text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Localização</label>
                <Input
                  value={editMember.location || ''}
                  onChange={(e) => setEditMember({ ...editMember, location: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white text-xs xs:text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-300">Notas</label>
                <Textarea
                  value={editMember.notes || ''}
                  onChange={(e) => setEditMember({ ...editMember, notes: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white min-h-[60px] xs:min-h-[80px] text-xs xs:text-sm"
                />
              </div>
            </div>
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 text-xs xs:text-sm"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleEditMember}
                disabled={!editMember.name}
                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs xs:text-sm"
              >
                Salvar Alterações
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dica de Navegação para Mobile */}
        {isMobile && treeData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <p className="text-slate-500 text-sm">
              💡 Use dois dedos para zoom ou arraste para navegar na árvore
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}