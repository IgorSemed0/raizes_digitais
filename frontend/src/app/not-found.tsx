import { NotFoundComponent } from "@/components/error/nout-found"

export const metadata = {
  title: "Página Não Encontrada",
  description: "A página solicitada não foi encontrada.",
}

export default function NotFound() {
  return <NotFoundComponent context="Global 404" />
}
