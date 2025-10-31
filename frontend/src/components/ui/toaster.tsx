"use client"

import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dismiss(toast.id)
      }, 5000)

      return () => clearTimeout(timer)
    })
  }, [toasts, dismiss])

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`mb-2 flex w-full items-center justify-between space-x-4 rounded-md border p-4 shadow-lg transition-all ${
            toast.variant === "destructive"
              ? "border-red-500 bg-red-50 text-red-900"
              : "border-gray-200 bg-white text-gray-900"
          }`}
        >
          <div className="flex-1">
            {toast.title && (
              <div className="text-sm font-semibold">{toast.title}</div>
            )}
            {toast.description && (
              <div className="text-sm opacity-90">{toast.description}</div>
            )}
            {toast.action}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dismiss(toast.id)}
            className="opacity-70 transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}