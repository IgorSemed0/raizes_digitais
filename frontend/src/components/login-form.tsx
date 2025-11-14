"use client"
import { ReutilizavelForm } from "@/components/form/reutilizavel"
import { CampoFormulario } from "@/components/form/campos"
import { loginSchema, type LoginFormData } from "@/lib/validacao"
import { useLoginMutation , useGoogleLoginMutation } from "@/hooks/use-auth-mutation"
import { Button } from "./ui/button"
import Link from "next/link"

import { TreePine } from "lucide-react"
export function LoginForm() {
  const loginMutation = useLoginMutation()
  const { mutate: loginWithGoogle, isPending } = useGoogleLoginMutation()
  const handleLogin = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data)
    } 
    catch (error) {
      alert(error)
    }
  }

  return (
    <div className="w-full text-white p-6 rounded-xl  space-y-6">
        
      <Link href="/" className="flex items-center justify-center gap-3 group">
                  <div className="bg-linear-to-br from-emerald-600 to-green-600 p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-lg">
                    <TreePine className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xl text-gray-900 dark:text-white leading-tight">
                      Raízes<span className="text-emerald-600 dark:text-emerald-400">Digitais</span>
                    </span>
                    <span className="text-xs text-gray-500 dark:text-slate-400 -mt-1">Sua história, eternizada</span>
                  </div>
                </Link>
      <ReutilizavelForm
        schema={loginSchema}
        onSubmit={handleLogin}
        isLoading={loginMutation.isPending}
        className="space-y-4"
      >
        {(form) => (
          <div className="space-y-4 ">
            <CampoFormulario
              rotulo="Email"
              type="email"
              placeholder="seu.email@exemplo.com"
              {...form.register("email")}
              erro={form.formState.errors.email?.message}
            />
            <div>
            </div>
            <CampoFormulario
              rotulo="Senha"
              type="password"
              placeholder="••••••••"
              {...form.register("password")}
              erro={form.formState.errors.password?.message}
            />
            <span className="flex justify-end hover:text-emerald-400 cursor-pointer">Esqueceu a senha?</span>

          
           
          </div>
        )}
        
      </ReutilizavelForm>
        <Button 
        type="button"
      variant="outline"
      onClick={() => loginWithGoogle()}
      disabled={isPending}
        className="gsi-material-button cursor-pointer hover:transition-transform flex flex-col items-center justify-center w-full">
            <div className="gsi-material-button-state"></div>
            <div className="gsi-material-button-content-wrapper flex gap-5 items-center justify-center">
              <div className="gsi-material-button-icon">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" className="display: block w-6 h-6">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                  <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
              </div>
              <span className="my-10" >Iniciar sessão com  Google</span>
            </div>
          </Button>
          <Link href={"/cadastro"} className="flex justify-center">
            <span className="hover:text-emerald-500  cursor-pointer">Ainda não tenho uma Conta</span>
          </Link>
    </div>
  )
}