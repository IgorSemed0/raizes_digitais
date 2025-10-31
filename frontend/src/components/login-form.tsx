

"use client"

import { ReusableForm } from "@/components/form/reutilizavel"
import { FormField } from "@/components/form/campos"
import { loginSchema, type LoginFormData } from "@/lib/validacao"
import { useLoginMutation } from "@/hooks/use-auth-mutation"

export function LoginForm() {
  const loginMutation = useLoginMutation()

  const handleLogin = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="w-full text-white max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Entrar</h1>
        <p className="text-muted-foreground">Entre na sua conta para acessar suas memórias familiares</p>
      </div>

      <ReusableForm
        schema={loginSchema}
        onSubmit={handleLogin}
        isLoading={loginMutation.isPending}
        submitLabel="Entrar"
        className="space-y-4"
      >
        {(form) => (
          <>
            <FormField
              label="Email"
              type="email"
              placeholder="seu@email.com"
              {...form.register("email")}
              error={form.formState.errors.email?.message}
              helperText="Digite o email cadastrado"
            />

            <FormField
              className="mt-4 text-white border border-white"
              label="Senha"
              type="password"
              placeholder="••••••••"
              {...form.register("senha")}
              error={form.formState.errors.senha?.message}
            />
          </>
        )}
      </ReusableForm>

      <p className="text-center text-sm text-muted-foreground">
        Não tem uma conta?{" "}
        <a href="/cadastro" className="text-emerald-500 hover:underline">
          Criar conta
        </a>
      </p>
    </div>
  )
}
