"use client";

import { useEffect, useState } from "react";
import { useBrowserNotifications } from "@/hooks/use-browser-notifications";
import { getCookie, setCookie } from "@/lib/cookies";

export function NotificationPermissionPrompt() {
  const { permission, isSupported, requestPermission } =
    useBrowserNotifications();
  const [hasPrompted, setHasPrompted] = useState(false);

  useEffect(() => {
    // Verifica se já perguntou antes
    const alreadyPrompted = getCookie("notification_prompt_shown");

    // Se o navegador suporta notificações, a permissão está como default (não perguntou ainda)
    // e ainda não perguntamos nesta sessão, solicita a permissão
    if (
      isSupported &&
      permission === "default" &&
      !alreadyPrompted &&
      !hasPrompted
    ) {
      // Pequeno delay para não ser muito invasivo logo ao carregar
      const timer = setTimeout(async () => {
        await requestPermission();
        // Marca que já perguntou (válido por 30 dias)
        setCookie("notification_prompt_shown", "true", 30);
        setHasPrompted(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isSupported, permission, hasPrompted, requestPermission]);

  // Este componente não renderiza nada na UI
  return null;
}
