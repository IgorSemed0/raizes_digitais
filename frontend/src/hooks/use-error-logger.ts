"use client"

import { useCallback } from "react"

interface ErrorLogContext {
  context?: string
  userId?: string
  digest?: string
  timestamp?: string
  route?: string
  userAgent?: string
}

export function useErrorLogger() {
  const logError = useCallback((error: Error, context: ErrorLogContext = {}) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      context: context.context || "Unknown",
      digest: context.digest,
      timestamp: context.timestamp || new Date().toISOString(),
      route: context.route || typeof window !== "undefined" ? window.location.pathname : "unknown",
      userAgent: context.userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "unknown"),
    }

    if (process.env.NODE_ENV === "development") {
      console.error("[ErrorLogger]", errorData)
    }

    // Enviar para serviço de monitoramento em produção
    if (process.env.NODE_ENV === "production") {
      // Implementar integração com Sentry, LogRocket, etc.
      // await fetch('/api/errors/log', { method: 'POST', body: JSON.stringify(errorData) })
      console.error("[ErrorLogger - Production]", errorData)
    }
  }, [])

  return { logError }
}
