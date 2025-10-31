"use client"

import type { ReactNode } from "react"
import { useForm, type UseFormReturn, type FieldValues, type DefaultValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ReusableFormProps<T extends FieldValues> {
  schema: z.ZodType<T, any, any>
  onSubmit: (data: T) => void | Promise<void>
  defaultValues?: DefaultValues<T>
  children: (form: UseFormReturn<T>) => ReactNode
  submitLabel?: string
  isLoading?: boolean
  className?: string
}
export function ReusableForm<T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  children,
  submitLabel = "Enviar",
  isLoading = false,
  className,
}: ReusableFormProps<T>) {
  const form = useForm<T>({
    
      mode: "onSubmit",
    resolver: zodResolver(schema),

    defaultValues,

    reValidateMode: "onChange",
  })

 
  const handleSubmit = form.handleSubmit(async (data: T): Promise<void> => {
    try {
      await onSubmit(data)

    } catch (error) {
      console.error(" Erro:", error)
    }
  })

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children(form)}

      <Button
        
        type="submit"
        className="w-full bg-linear-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700"
        disabled={isLoading || form.formState.isSubmitting}
      >
        {isLoading || form.formState.isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Carregando...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  )
}