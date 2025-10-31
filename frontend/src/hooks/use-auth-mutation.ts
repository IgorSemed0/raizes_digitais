"use client"

import { useMutation } from "@tanstack/react-query"

import { apiClient, type ApiResponse, type ApiError } from "@/lib/api"

import { useAuthStore, type User } from "@/stores/auth-store"

import type { LoginFormData, RegisterFormData } from "@/lib/validacao"

import { useToast } from "@/hooks/use-toast"

type AuthResponse = ApiResponse<{
  user: User
  token: string
}>
export function useLoginMutation() {
  const login = useAuthStore((state) => state.login)

  const { toast } = useToast()

  return useMutation<
    AuthResponse, // Tipo do sucesso
    ApiError, // Tipo do erro
    LoginFormData // Tipo dos dados de entrada
  >({
    mutationFn: async (data) => {
      return apiClient.post<AuthResponse>("/auth/login", data)
    },

    onSuccess: (response) => {
      login(response.data.user, response.data.token)

      toast({
        title: "Login realizado!",
        description: `Bem-vindo de volta, ${response.data.user.name}!`,
      })
    },

    onError: (error) => {
      toast({
        title: "Erro no login",
        description: error.error || "Não foi possível fazer login",
        variant: "destructive", 
      })
    },
  })
}

export function useRegisterMutation() {
  const login = useAuthStore((state) => state.login)
  const { toast } = useToast()

  return useMutation<AuthResponse, ApiError, RegisterFormData>({
    mutationFn: async (data) => {
      const { ...registerData } = data

      return apiClient.post<AuthResponse>("/auth/registro", registerData)
    },

    onSuccess: (response) => {
      login(response.data.user, response.data.token)

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
