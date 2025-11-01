"use client"

import { type InputHTMLAttributes, forwardRef } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string 
  error?: string 
  helperText?: string 
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, "-")}`

    return (
      <div className="space-y-2">
        <Label
          htmlFor={fieldId}
          className={cn(error && "text-destructive")}
        >
          {label}
        </Label>

        <Input
          id={fieldId}
          ref={ref} 
          className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />

        {error && (
          <p
            id={`${fieldId}-error`}
            className="text-sm font-medium text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}

        {!error && helperText && <p className="text-sm text-muted-foreground">{helperText}</p>}
      </div>
    )
  },
)

FormField.displayName = "FormCampos"
