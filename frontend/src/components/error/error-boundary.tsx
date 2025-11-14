"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useErrorLogger } from "@/hooks/use-error-logger"

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
  context?: string
}

export function ErrorBoundary({ error, reset, context = "Componente" }: ErrorBoundaryProps) {
  const { logError } = useErrorLogger()

  useEffect(() => {
    logError(error, {
      context,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    })
  }, [error, context, logError])

  const isDevelopment = process.env.NODE_ENV === "development"

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-50 to-orange-50 dark:from-red-950 dark:to-orange-950 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-red-100 dark:bg-red-900 rounded-full p-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-300" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Algo deu errado</h1>
            <p className="text-muted-foreground">
              Desculpe, encontramos um erro inesperado. Nossa equipe foi notificada.
            </p>
          </div>

          {isDevelopment && (
            <div className="bg-slate-100 dark:bg-slate-800 rounded p-3 text-left text-sm font-mono overflow-auto max-h-32">
              <p className="font-bold text-red-600 dark:text-red-400 mb-2">Detalhes do Erro (Dev):</p>
              <p className="text-foreground wrap-break-words">{error.message}</p>
              {error.digest && <p className="text-muted-foreground text-xs mt-2">ID: {error.digest}</p>}
            </div>
          )}

          <div className="flex flex-col gap-2 pt-4">
            <Button onClick={reset} className="w-full flex items-center justify-center gap-2" size="lg">
              <RefreshCw className="w-4 h-4" />
              Tentar Novamente
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              size="lg"
              onClick={() => (window.location.href = "/")}
            >
              Voltar ao Início
            </Button>
          </div>

          {error.digest && <p className="text-xs text-muted-foreground">Referência: {error.digest}</p>}
        </div>
      </div>
    </div>
  )
}
