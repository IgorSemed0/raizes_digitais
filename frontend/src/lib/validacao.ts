
import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string() 
    .min(1, "Email é obrigatório") 
    .email("Email inválido") 
    .toLowerCase() 
    .trim(), 

  password: z
    .string()
    .min(1, "Senha é obrigatória") 
    .min(6, "Senha deve ter no mínimo 6 caracteres"), 
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  vc_pnome: z.string().min(2, "Primeiro nome deve ter pelo menos 2 caracteres"),
  vc_unome: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  vc_user_name: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  dt_nascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  vc_genero: z.string().min(1, "Gênero é obrigatório"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  password_confirmation: z.string(),
  vc_foto_perfil: z.union([
    z.instanceof(File),
    z.string(),
    z.undefined()
  ]).optional(),

  vc_mnome: z.string().optional(),
  vc_foto_perfil_capa: z.union([
    z.instanceof(File),
    z.string(),
    z.undefined()
  ]).optional(),
  txt_biografia: z.string().optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Senhas não coincidem",
  path: ["password_confirmation"],
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
