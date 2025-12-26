import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Check, Copy } from "lucide-react"
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"

interface CopyButtonProps {
  value: string | number
}

export function CopyButton({ value }: CopyButtonProps) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (

    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Copy"
          onClick={() => copyToClipboard(value)}
        >
          {isCopied ? <Check className="text-green-400" /> : <Copy />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Clique para copiar</p>
      </TooltipContent>
    </Tooltip>
  )
}
