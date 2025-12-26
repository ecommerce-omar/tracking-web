"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string | number) => {
    try {
      await navigator.clipboard.writeText(String(text));
      toast.success(`${text} copiado para a área de transferência!`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch (err) {
      toast.error("Não foi possível copiar o texto. Tente novamente.");
      console.error("Failed to copy text: ", err);
    }
  }, []);

  return { copyToClipboard, isCopied };
}
