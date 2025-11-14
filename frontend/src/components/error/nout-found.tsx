"use client"

import { Search, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface NotFoundProps {
  title?: string
  description?: string
  context?: string
}

export function NotFoundComponent({
  title = "Página Não Encontrada",
  description = "Desculpe, a página que você está procurando não existe ou foi removida.",
  context = "404",
}: NotFoundProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 text-center space-y-6">
          <div className="space-y-2">
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-400">404</div>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          </div>

          <div className="flex justify-center">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-4">
              <Search className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            </div>
          </div>

          <p className="text-muted-foreground">{description}</p>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 text-left text-sm space-y-2">
            <p className="font-semibold text-foreground">Dicas:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>Verifique a URL digitada</li>
              <li>Tente voltar e navegar novamente</li>
              <li>Use a busca para encontrar o conteúdo</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button
              onClick={() => router.back()}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <Button
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center gap-2"
              size="lg"
            >
              <Home className="w-4 h-4" />
              Ir para o Início
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">{context}</p>
        </div>
      </div>
    </div>
  )
}
