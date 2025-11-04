"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { apiClient, type ApiResponse, type ApiError } from "@/lib/api"

import { useAuthStore, type User } from "@/stores/auth-store"

import type { LoginFormData ,RegisterFormData} from "@/lib/validacao"

import { useToast } from "@/hooks/use-toast"

type AuthResponseLogin = {
  message: string;
  user:User
  token_type: string;
  access_token: string;
  expires_in: number;

}
type AuthResponseRegistro = {
  message: string;
  user:User
  token:string

}
export function useLoginMutation() {
  const login = useAuthStore((state) => state.login)
  const router=useRouter()
  const { toast } = useToast()

  return useMutation<
    AuthResponseLogin, 
    ApiError, 
    LoginFormData 
  >({
    mutationFn: async (data) => {
      return apiClient.post<AuthResponseLogin>("/auth/login", data)
    },
    onSuccess: (response) => {
      login(response.user, response.access_token)
      router.push("/Painel")
      toast({
        title: "Login realizado!",
        description: `Bem-vindo de volta, ${response.user.vc_user_name}!`,
      })
    },

    onError: (error: ApiError) => {
    if (error.statusCode === 400 && error.details) {
        const Errors = error.details as Record<string, string[]>;
        
        const primeiroErrorKey = Object.keys(Errors)[0];
        const pimeiroErrorMessage = Errors[primeiroErrorKey][0];
        
        toast({
            title: "Erro de Validação",
            description: pimeiroErrorMessage, 
            variant: "destructive",
        });
        
        return; 
    }

    toast({
        title: "Erro no registro",
        description: error.error || "Não foi possível criar sua conta",
        variant: "destructive",
    });
},
  })
}

export function useRegisterMutation() {
  const login = useAuthStore((state) => state.login)
  const { toast } = useToast()

  return useMutation<AuthResponseRegistro, ApiError, RegisterFormData>({
    mutationFn: async (formData) => {

      return apiClient.post<AuthResponseRegistro>("/auth/register", formData)
    },

    onSuccess: (response) => {
      login(response.user, response.token)

      toast({
        title: "Conta criada!",
        description: "Sua conta foi criada com sucesso. Bem-vindo!",
      })
    },

    onError: (error) => {
      toast({
        title: "Erro no registro",
        description: error.error || "Não foi possível criar sua conta",
        variant: "destructive",
      })
    },
  })
}


export function useLogoutMutation() {
  const logout = useAuthStore((state) => state.logout)
  const token = useAuthStore((state) => state.token)
  const { toast } = useToast()

  return useMutation<ApiResponse<{ message: string }>, ApiError, void>({
    mutationFn: async (): Promise<ApiResponse<{ message: string }>> => {
      return apiClient.post<ApiResponse<{ message: string }>>("/auth/logout", {}, token || undefined)
    },

    onSuccess: () => {
      logout()

      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta com sucesso",
      })
    },

    onError: (error) => {
      logout()

      toast({
        title: "Erro no logout",
        description: error.error || "Erro ao fazer logout",
        variant: "destructive",
      })
    },
  })
}
