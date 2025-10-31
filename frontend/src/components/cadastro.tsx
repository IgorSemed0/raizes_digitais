"use client"

import { ReusableForm } from "@/components/form/reutilizavel"
import { FormField } from "@/components/form/campos"
import { registerSchema, type RegisterFormData } from "@/lib/validacao"
import { useRegisterMutation } from "@/hooks/use-auth-mutation"

export function Cadastro() {
  const registerMutation = useRegisterMutation()

  const handleRegister = (data: RegisterFormData) => {
    registerMutation.mutate(data)
  }

  return (
    <div className="w-full text-white max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Criar Conta</h1>
        <p className="text-muted-foreground">Comece a preservar suas memórias familiares hoje</p>
      </div>

      <ReusableForm
        schema={registerSchema}
        onSubmit={handleRegister}
        isLoading={registerMutation.isPending}
        submitLabel="Criar Conta"
        className="space-y-4"
      >
        {(form) => (
          <>
            <FormField
              label="Nome Completo"
              type="text"
              placeholder="João Silva"
              {...form.register("name")}
              error={form.formState.errors.name?.message}
            />

            <FormField
              label="Email"
              type="email"
              placeholder="seu@email.com"
              {...form.register("email")}
              error={form.formState.errors.email?.message}
            />

            <FormField
              label="Senha"
              type="password"
              placeholder="••••••••"
              {...form.register("password")}
              error={form.formState.errors.password?.message}
              helperText="Mínimo 8 caracteres, com letras e números"
            />

            <FormField
              label="Confirmar Senha"
              type="password"
              placeholder="••••••••"
              {...form.register("confirmPassword")}
              error={form.formState.errors.confirmPassword?.message}
            />
          </>
        )}
      </ReusableForm>

      <p className="text-center text-sm text-muted-foreground">
        Já tem uma conta?{" "}
        <a href="/login" className="text-emerald-500 hover:underline">
          Entrar
        </a>
      </p>
    </div>
  )
}
