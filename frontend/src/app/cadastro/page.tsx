import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Cadastro } from '@/components/cadastro'
export default function Cadastrar() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
          <Dialog>
            <DialogTrigger></DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
              
              </DialogHeader>
              <Cadastro />
            </DialogContent>
          </Dialog>
        </div>
  )
}
