"use client";

import { useEffect, useRef } from "react";
import { useBrowserNotifications } from "./use-browser-notifications";
import { statusLabelMap } from "@/constants/tracking-status";

interface Tracking {
  id: string;
  order_id: number;
  tracking_code: string;
  current_status: string;
  name?: string;
  delivery_channel?: string;
  category?: string;
}

interface UseTrackingNotificationsOptions {
  enabled?: boolean;
  notifyOnStatusChange?: boolean;
  notifyOnNewTracking?: boolean;
  statusFilters?: string[];
}

export function useTrackingNotifications(
  trackings: Tracking[],
  options: UseTrackingNotificationsOptions = {}
) {
  const {
    enabled = true,
    notifyOnStatusChange = true,
    notifyOnNewTracking = true,
    statusFilters = [],
  } = options;

  const { sendNotification, permission } = useBrowserNotifications();
  const previousTrackingsRef = useRef<Map<string, Tracking>>(new Map());

  useEffect(() => {
    if (!enabled || permission !== "granted" || trackings.length === 0) {
      return;
    }

    const currentTrackings = new Map(
      trackings.map((tracking) => [tracking.id, tracking])
    );

    // Verificar novos rastreamentos
    if (notifyOnNewTracking) {
      currentTrackings.forEach((tracking, id) => {
        if (!previousTrackingsRef.current.has(id)) {
          // Verificar filtro de status (se vazio, notifica todos)
          const shouldNotify =
            statusFilters.length === 0 ||
            statusFilters.includes(tracking.current_status);

          if (!shouldNotify) return;

          const statusLabel =
            statusLabelMap[tracking.current_status] || tracking.current_status;

          sendNotification({
            title: "📦 Novo Rastreamento Adicionado",
            body: `Código: ${tracking.tracking_code}\nCliente: ${
              tracking.name || "N/A"
            }\nStatus: ${statusLabel}`,
            tag: `new-tracking-${id}`,
            icon: "/favicon.ico",
            url: `/shipments/${tracking.tracking_code}`,
          });
        }
      });
    }

    // Verificar mudanças de status
    if (notifyOnStatusChange) {
      currentTrackings.forEach((tracking, id) => {
        const previousTracking = previousTrackingsRef.current.get(id);

        if (
          previousTracking &&
          previousTracking.current_status !== tracking.current_status
        ) {
          // Verificar filtro de status (se vazio, notifica todos)
          const shouldNotify =
            statusFilters.length === 0 ||
            statusFilters.includes(tracking.current_status);

          if (!shouldNotify) return;

          const statusLabel =
            statusLabelMap[tracking.current_status] || tracking.current_status;

          sendNotification({
            title: "🔄 Status do Envio Atualizado",
            body: ` Código: ${tracking.tracking_code}\nCliente: ${
              tracking.name || "N/A"
            }\nNovo Status: ${statusLabel}`,
            tag: `status-change-${id}`,
            icon: "/favicon.ico",
            requireInteraction: false,
            url: `/shipments/${tracking.tracking_code}`,
          });
        }
      });
    }

    // Atualizar referência para a próxima verificação
    previousTrackingsRef.current = currentTrackings;
  }, [
    trackings,
    enabled,
    permission,
    notifyOnStatusChange,
    notifyOnNewTracking,
    statusFilters,
    sendNotification,
  ]);
}
