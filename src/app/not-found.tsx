import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TypographyH1, TypographyP } from '@/components/ui/typography'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <div className="flex justify-center">
          <FileQuestion className="h-16 w-16 text-muted-foreground" />
        </div>
        <div>
          <TypographyH1>404 - Página não encontrada</TypographyH1>
          <TypographyP>
            A página que você está procurando não existe ou foi movida.
          </TypographyP>
        </div>
        <Button asChild>
          <Link href="/">Voltar para o início</Link>
        </Button>
      </div>
    </div>
  )
}
