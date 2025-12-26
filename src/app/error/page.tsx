'use client'

import Link from "next/link"

import { AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TypographyH1, TypographyP } from "@/components/ui/typography"

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <AlertCircle className="h-16 w-16 text-destructive" />
        </div>
        <div>
          <TypographyH1>
            Ops! Algo deu errado
          </TypographyH1>
          <TypographyP>
            Desculpe, ocorreu um erro inesperado. Tente novamente ou entre em contato com o suporte.
          </TypographyP>
        </div>
        <Button asChild>
          <Link href="/login">
            <ArrowLeft />
            Voltar ao Login
          </Link>
        </Button>
      </div>
    </div>
  )
}