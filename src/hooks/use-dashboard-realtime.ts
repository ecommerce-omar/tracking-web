import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Tracking,
  TrackingStatus,
  CompletedStatuses,
} from "@/schemas/tracking-schema";

interface DashboardMetrics {
  total_orders: number;
  delivered_orders: number;
  in_transit_orders: number;
  not_collected_orders: number;
  awaiting_pickup_orders: number;
}

interface DailyShipment {
  date: string;
  pac: number;
  sedex: number;
}

interface DashboardData {
  metrics: DashboardMetrics;
  dailyShipments: DailyShipment[];
}

export function useDashboardRealtime(timeRange: string = "30d") {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: orders, error: fetchError } = await supabase
          .from("tracking")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) throw fetchError;

        const processedData = processTrackingsData(orders || [], timeRange);
        setData(processedData);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch initial data
    fetchInitialData();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("dashboard-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tracking",
        },
        (payload) => {
          console.log("Dashboard realtime update:", payload);
          // Refetch data when changes occur
          fetchInitialData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [timeRange]);

  return { data, loading, error, refetch: () => setLoading(true) };
}

function processTrackingsData(
  trackings: Tracking[],
  timeRange: string
): DashboardData {
  // Filter trackings by time range
  const filteredTrackings = filterTrackingsByTimeRange(trackings, timeRange);

  // Calculate metrics
  const total_orders = filteredTrackings.length;

  const delivered_orders = filteredTrackings.filter((tracking) =>
    [
      ...CompletedStatuses.DELIVERED,
      ...CompletedStatuses.RETURNED,
    ].includes(
      tracking.current_status as (typeof CompletedStatuses.DELIVERED)[number]
    )
  ).length;

  // Status em trânsito inclui objetos em movimento/transferência e não entregues
  const in_transit_orders = filteredTrackings.filter((tracking) =>
    [
      TrackingStatus.COLETADO,
      TrackingStatus.POSTADO,
      TrackingStatus.EM_TRANSFERENCIA,
      TrackingStatus.CORRECAO_ROTA,
      TrackingStatus.SAIU_PARA_ENTREGA,
      TrackingStatus.SAIU_PARA_ENTREGA_REMETENTE,
      TrackingStatus.DIRECIONADO_UNIDADE_PEDIDO_CLIENTE,
      TrackingStatus.NAO_ENTREGUE,
      TrackingStatus.NAO_ENTREGUE_CARTEIRO,
      TrackingStatus.NAO_ENTREGUE_ENDERECO_INSUFICIENTE,
      TrackingStatus.NAO_ENTREGUE_ENDERECO_INCORRETO,
      TrackingStatus.NAO_ENTREGUE_PRAZO_ENCERRADO,
      TrackingStatus.SAIDA_CANCELADA,
    ].some((status) => status === tracking.current_status)
  ).length;

  // Status não coletados inclui etiquetas emitidas e cancelados
  const not_collected_orders = filteredTrackings.filter((tracking) =>
    [
      TrackingStatus.ETIQUETA_EMITIDA,
      TrackingStatus.ETIQUETA_CANCELADA,
      TrackingStatus.CANCELADO,
    ].some((status) => status === tracking.current_status)
  ).length;

  // Status aguardando retirada (objetos disponíveis para retirada)
  const awaiting_pickup_orders = filteredTrackings.filter((tracking) =>
    [
      TrackingStatus.AGUARDANDO_RETIRADA,
      TrackingStatus.ENCAMINHADO_RETIRADA,
    ].some((status) => status === tracking.current_status)
  ).length;

  const metrics = {
    total_orders,
    delivered_orders,
    in_transit_orders,
    not_collected_orders,
    awaiting_pickup_orders,
  };

  // Calculate daily shipments (PAC vs SEDEX) for all 90 days
  const dailyShipments = generateDailyShipmentsFromTrackings(trackings);

  return { metrics, dailyShipments };
}

function filterTrackingsByTimeRange(
  trackings: Tracking[],
  timeRange: string
): Tracking[] {
  const referenceDate = new Date();
  let daysToSubtract = 30;

  if (timeRange === "90d") {
    daysToSubtract = 90;
  } else if (timeRange === "7d") {
    daysToSubtract = 7;
  }

  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - daysToSubtract);

  return trackings.filter((tracking) => {
    const trackingDate = new Date(tracking.created_at);
    return trackingDate >= startDate;
  });
}

function generateDailyShipmentsFromTrackings(
  trackings: Tracking[]
): DailyShipment[] {
  const today = new Date();
  const data: { [key: string]: { pac: number; sedex: number } } = {};
  const days = 90; // Generate full 90 days for area chart filtering

  // Initialize all days with 0
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateKey = date.toISOString().split("T")[0];
    data[dateKey] = { pac: 0, sedex: 0 };
  }

  // Count real trackings by date and category
  trackings.forEach((tracking) => {
    const trackingDate = new Date(tracking.created_at)
      .toISOString()
      .split("T")[0];
    if (data[trackingDate]) {
      if (tracking.category === "pac") {
        data[trackingDate].pac++;
      } else if (tracking.category === "sedex") {
        data[trackingDate].sedex++;
      }
    }
  });

  // Convert to array format
  return Object.entries(data).map(([date, counts]) => ({
    date,
    pac: counts.pac,
    sedex: counts.sedex,
  }));
}
