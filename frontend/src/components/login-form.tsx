"use client"
import { ReutilizavelForm } from "@/components/form/reutilizavel"
import { CampoFormulario } from "@/components/form/campos"
import { loginSchema, type LoginFormData } from "@/lib/validacao"
import { useLoginMutation } from "@/hooks/use-auth-mutation"

export function LoginForm() {
  const loginMutation = useLoginMutation()

  const handleLogin = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data)
    } 
    catch (error) {
      alert(error)
    }
  }

  return (
    <div className="w-full text-white p-6 rounded-xl bg-gray-800 space-y-6">
        

      <ReutilizavelForm
        schema={loginSchema}
        onSubmit={handleLogin}
        isLoading={loginMutation.isPending}
        className="space-y-4"
      >
        {(form) => (
          <div className="space-y-4">
            <CampoFormulario
              rotulo="Email"
              type="email"
              placeholder="seu.email@exemplo.com"
              {...form.register("email")}
              erro={form.formState.errors.email?.message}
            />
            
            <CampoFormulario
              rotulo="Senha"
              type="password"
              placeholder="••••••••"
              {...form.register("password")}
              erro={form.formState.errors.password?.message}
            />

           
          </div>
        )}
      </ReutilizavelForm>
    </div>
  )
}