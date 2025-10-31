
import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string() 
    .min(1, "Email é obrigatório") 
    .email("Email inválido") 
    .toLowerCase() 
    .trim(), 

  senha: z
    .string()
    .min(1, "Senha é obrigatória") 
    .min(6, "Senha deve ter no mínimo 6 caracteres"), 
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(3, "Nome deve ter no mínimo 3 caracteres")
      .max(100, "Nome deve ter no máximo 100 caracteres")
      .trim(),

    email: z.string().min(1, "Email é obrigatório").email("Email inválido").toLowerCase().trim(),

    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Senha deve conter letras maiúsculas, minúsculas e números"),

    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"], 
  })

export type RegisterFormData = z.infer<typeof registerSchema>


export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),

  email: z.string().min(1, "Email é obrigatório").email("Email inválido").toLowerCase().trim(),

  avatar: z.string().url("URL inválida").optional().or(z.literal("")), 
})

export type ProfileFormData = z.infer<typeof profileSchema>

export const albumSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .min(3, "Título deve ter no mínimo 3 caracteres")
    .max(100, "Título deve ter no máximo 100 caracteres")
    .trim(),

  description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),

  isPublic: z.boolean().default(false),

  tags: z.array(z.string()).max(10, "Máximo de 10 tags").optional(),
})

export type AlbumFormData = z.infer<typeof albumSchema>
