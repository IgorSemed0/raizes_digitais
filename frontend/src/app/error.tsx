"use client"

import { ErrorBoundary } from "@/components/error/error-boundary"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function RootError({ error, reset }: ErrorPageProps) {
  return <ErrorBoundary error={error} reset={reset} context="Erro Global da Aplicação" />
}
