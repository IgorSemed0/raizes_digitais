"use client"

import { ReutilizavelForm } from "@/components/form/reutilizavel"
import { CampoFormulario } from "@/components/form/campos"
import SelectField from "@/components/form/select-campos"
import { registerSchema } from "@/lib/validacao"
import { useRegisterMutation } from "@/hooks/use-auth-mutation"
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Controller } from "react-hook-form"
import { X } from "lucide-react"
import { useRef } from "react"

interface CadastroProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function Cadastro({ open, onOpenChange, onSuccess }: CadastroProps) {
  const registerMutation = useRegisterMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const genderOptions = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Feminino', label: 'Feminino' },
    { value: 'Prefiro Não Informar', label: 'Prefiro Não Informar' },
  ]

  // Agora recebe FormData diretamente
  const handleRegister = async (formData: FormData) => {
    try {
      console.log("📤 Enviando FormData com arquivos...")
      
      await registerMutation.mutateAsync(formData)
      onSuccess?.()
      onOpenChange?.(false)
    } catch (error) {
      console.error("Erro no cadastro:", error)
    }
  }

  const cadastroContent = (
    <div className="w-full text-white p-6 rounded-xl bg-gray-800 space-y-6 max-h-[90vh] overflow-y-auto">
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-between">
          <div className="w-6" /> 
          <h1 className="text-2xl font-bold text-emerald-400 flex-1">
            Criar Sua Conta
          </h1>
          {onOpenChange && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-white hover:bg-gray-700"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-gray-400 text-sm">
          Insira seus dados para começar a construir sua árvore familiar.
        </p>
      </div>

      <ReutilizavelForm
        schema={registerSchema}
        onSubmit={handleRegister}
        isLoading={registerMutation.isPending}
        className="space-y-6"
      >
        {(form) => (
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">
                Seus Nomes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CampoFormulario
                  rotulo="Primeiro Nome"
                  type="text"
                  placeholder="Tomás"
                  {...form.register("vc_pnome")}
                  erro={form.formState.errors.vc_pnome?.message}
                />
                <CampoFormulario
                  rotulo="Sobrenome"
                  type="text"
                  placeholder="Pedro"
                  {...form.register("vc_unome")}
                  erro={form.formState.errors.vc_unome?.message}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">
                Detalhes de Acesso
              </h2>
              <div className="space-y-4">
                <CampoFormulario
                  rotulo="Nome de Usuário"
                  type="text"
                  placeholder="antonio1990"
                  textoAjuda="Este será seu identificador único no sistema."
                  {...form.register("vc_user_name")}
                  erro={form.formState.errors.vc_user_name?.message}
                />
                
                <CampoFormulario
                  rotulo="Email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  {...form.register("email")}
                  erro={form.formState.errors.email?.message}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CampoFormulario
                    rotulo="Data de Nascimento"
                    type="date"
                    {...form.register("dt_nascimento")}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  
                  <Controller
                    name="vc_genero"
                    control={form.control}
                    render={({ field }) => (
                      <SelectField
                        rotulo="Gênero"
                        placeholder="Selecione seu gênero"
                        options={genderOptions}
                        ValueOnChange={field.onChange}
                        erro={form.formState.errors.vc_genero?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">
                Segurança
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CampoFormulario
                  rotulo="Senha"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("password")}
                  erro={form.formState.errors.password?.message}
                  textoAjuda="Mínimo 8 caracteres."
                />

                <CampoFormulario
                  rotulo="Confirmar Senha"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("password_confirmation")}
                  erro={form.formState.errors.password_confirmation?.message}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-700 pb-2">
                Informações Opcionais
              </h2>
              
              {/* Input de arquivo corrigido */}
              <div>
                <CampoFormulario
                  rotulo="Foto de Perfil (Opcional)"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  ref={fileInputRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      form.setValue('vc_foto_perfil', file)
                      // Limpar erro se existir
                      form.clearErrors('vc_foto_perfil')
                    }
                  }}
                  textoAjuda="Aceito: JPG, PNG, GIF. Máx: 2MB."
                />
                {form.formState.errors.vc_foto_perfil && (
                  <p className="text-red-400 text-sm mt-1">
                    {form.formState.errors.vc_foto_perfil.message}
                  </p>
                )}
              </div>

              <CampoFormulario
                rotulo="Biografia (Opcional)"
                type="textarea"
                placeholder="Conte um pouco sobre você..."
                {...form.register("txt_biografia")}
                erro={form.formState.errors.txt_biografia?.message}
              />
            </div>

            {/* Botão de submit - REMOVIDO, pois já está no ReutilizavelForm */}
          </div>
        )}
      </ReutilizavelForm>

      <p className="text-center text-sm text-gray-400">
        Já tem uma conta?{" "}
        <a href="/login" className="text-emerald-500 hover:underline font-medium">
          Entrar
        </a>
      </p>
    </div>
  )

  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          className="p-0 border-0 bg-transparent max-w-md"
          aria-describedby="cadastro-description"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>Criar Conta</DialogTitle>
            <DialogDescription id="cadastro-description">
              Formulário para criação de nova conta no sistema Raízes Digitais
            </DialogDescription>
          </DialogHeader>
          {cadastroContent}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {cadastroContent}
      </div>
    </div>
  )
}