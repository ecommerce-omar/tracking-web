"use client";

import { RefreshCw, BarChart3, AlertCircle } from "lucide-react";
import { ChartRadialText } from "@/components/chart-radial-text";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { useDashboardRealtime } from "@/hooks/use-dashboard-realtime";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FadeInWrapper } from "@/components/fade-in-wrapper";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function DashboardPage() {
  const { data, loading, error, refetch } = useDashboardRealtime("30d");

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-68" />
          <Skeleton className="h-68" />
          <Skeleton className="h-68" />
          <Skeleton className="h-68" />
        </div>
        <Skeleton className="h-82" />
      </div>
    );
  }

  if (error) {
    return (
      <FadeInWrapper>
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertCircle className="text-red-500" />
            </EmptyMedia>
            <EmptyTitle>Falha ao carregar dashboard</EmptyTitle>
            <EmptyDescription>
              {error?.message?.includes("404")
                ? "Serviço não encontrado. Verifique se a API está funcionando."
                : error?.message?.includes("fetch")
                  ? "Não foi possível conectar com o servidor. Verifique sua conexão."
                  : error?.message ||
                  "Ocorreu um erro inesperado ao carregar os dados."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw />
              Tentar novamente
            </Button>
          </EmptyContent>
        </Empty>
      </FadeInWrapper>
    );
  }

  if (!data || data.metrics.total_orders === 0) {
    return (
      <FadeInWrapper>
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BarChart3 />
            </EmptyMedia>
            <EmptyTitle>Nenhum envio encontrado</EmptyTitle>
            <EmptyDescription>
              Não há dados de envios para o período selecionado.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </FadeInWrapper>
    );
  }

  const { dailyShipments } = data;

  return (
    <FadeInWrapper className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ChartRadialText
          total={data.metrics.total_orders}
          value={data.metrics.delivered_orders}
          title="Objetos Entregues"
          description="Objetos que chegaram ao destinatário"
          chart="1"
        />

        <ChartRadialText
          total={data.metrics.total_orders}
          value={data.metrics.in_transit_orders}
          title="Em trânsito"
          description="Objetos em processo de entrega"
          chart="2"
        />

        <ChartRadialText
          total={data.metrics.total_orders}
          value={data.metrics.awaiting_pickup_orders}
          title="Aguardando Retirada"
          description="Objetos disponíveis para retirada na agência"
          chart="3"
        />

        <ChartRadialText
          total={data.metrics.total_orders}
          value={data.metrics.not_collected_orders}
          title="Não coletados"
          description="Objetos aguardando coleta"
          chart="4"
        />
      </div>

      <div>
        <ChartAreaInteractive title="Envios Diários" data={dailyShipments} />
      </div>
    </FadeInWrapper>
  );
}
