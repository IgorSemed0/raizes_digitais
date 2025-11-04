"use client"

import { type InputHTMLAttributes, forwardRef } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"


interface PropsCampoFormulario extends InputHTMLAttributes<HTMLInputElement> {
  rotulo: string 
  erro?: string 
  textoAjuda?: string 
}


export const CampoFormulario = forwardRef<HTMLInputElement, PropsCampoFormulario>(
  ({ rotulo, erro, textoAjuda, className, id, ...props }, ref) => {
    
    const idCampo = id || `campo-${rotulo.toLowerCase().replace(/\s+/g, "-")}`

    return (
      <div className="space-y-2">
        
        <Label
          htmlFor={idCampo} 
          className={cn(erro && "text-destructive")} 
        >
          {rotulo}
        </Label>

        {/* Campo de Entrada (Input) */}
        <Input
          id={idCampo}
          ref={ref} 
          className={cn(erro && "border-destructive focus-visible:ring-destructive", className)}
          aria-invalid={!!erro} 
          aria-describedby={erro ? `${idCampo}-erro` : undefined} 
          {...props} 
        />

        {erro && (
          <p
            id={`${idCampo}-erro`}
            className="text-sm font-medium text-destructive"
            role="alert"
          >
            {erro}
          </p>
        )}

        {!erro && textoAjuda && <p className="text-sm text-muted-foreground">{textoAjuda}</p>}
      </div>
    )
  },
)

CampoFormulario.displayName = "CampoFormulario"