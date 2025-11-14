"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AuthCallbackPage() {
  const searchParams = useSearchParams()
  const login = useAuthStore((state) => state.login)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const token = searchParams.get("token")
    const userParam = searchParams.get("user")
    const error = searchParams.get("error")

    console.log("Parâmetros recebidos:", { token, userParam, error })

    if (error) {
      console.error("Erro do Google OAuth:", error)
      toast({
        title: "Erro no login com Google",
        description: error || "Falha na autenticação",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(userParam)
        
        console.log("Dados do usuário:", user)
        
        // Fazer login no store
        login(user, token)
        
        toast({
          title: "Login realizado!",
          description: `Bem-vindo, ${user.vc_user_name}!`,
        })
        
        // Redirecionar para o dashboard
        router.push("/dashboard/feed")
        
      } catch (error) {
        console.error("Erro ao processar callback:", error)
        toast({
          title: "Erro na autenticação",
          description: "Não foi possível processar o login",
          variant: "destructive",
        })
        router.push("/login")
      }
    } else {
      console.error("Token ou usuário não encontrados na URL")
      toast({
        title: "Erro no login",
        description: "Dados de autenticação incompletos",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [searchParams, login, router, toast])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Processando login...</h2>
        <p className="text-muted-foreground">Aguarde enquanto redirecionamos você.</p>
      </div>
    </div>
  )
}