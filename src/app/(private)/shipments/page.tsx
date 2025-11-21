"use client";

import { useMemo, useState, useDeferredValue } from "react";
import { RefreshCw, AlertCircle, Package } from "lucide-react";
import { useTrackingsRealtime } from "@/hooks/use-trackings-realtime";
import { useTrackingNotifications } from "@/hooks/use-tracking-notifications";
import { getCookie, getCookieJSON } from "@/lib/cookies";
import { columns } from "@/components/columns-shipments";
import { ShipmentsDataTable } from "@/components/shipments-data-table";
import { FadeInWrapper } from "@/components/fade-in-wrapper";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DateRange } from "react-day-picker";

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";

export default function ShipmentsPage() {
  const { trackings, loading, error, refetch } = useTrackingsRealtime();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const deferredQuery = useDeferredValue(searchQuery);

  // Carregar preferências de notificação do cookie
  const notificationSettings = useMemo(() => {
    const savedSettings = getCookie('notification_settings')
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings)
      } catch (error) {
        console.error('Error parsing notification settings:', error)
      }
    }
    return {
      enabled: true,
      notifyOnStatusChange: true,
      notifyOnNewTracking: false,
      statusFilters: [],
    }
  }, [])

  // Ativar notificações do navegador para mudanças de status
  useTrackingNotifications(trackings || [], {
    enabled: notificationSettings.enabled,
    notifyOnStatusChange: notificationSettings.notifyOnStatusChange,
    notifyOnNewTracking: notificationSettings.notifyOnNewTracking,
    statusFilters: notificationSettings.statusFilters || [],
  });

  // Load table preferences from cookies
  const tablePreferences = useMemo(() => {
    const columnVisibility =
      getCookieJSON<Record<string, boolean>>("shipments_table_column_visibility");
    const sorting = getCookieJSON<{ id: string; desc: boolean }[]>(
      "shipments_table_sorting"
    );
    const filters = getCookieJSON<{
      range?: DateRange;
      deliveryForecastRange?: DateRange;
      deliveryChannel?: string;
      currentStatus?: string[];
    }>("shipments_table_filters");
    const pageSize = getCookie("shipments_table_page_size");

    return {
      columnVisibility: columnVisibility || undefined,
      sorting: sorting || undefined,
      filters: filters || undefined,
      pageSize: pageSize ? parseInt(pageSize) : 10,
    };
  }, []);

  const filteredTrackings = useMemo(() => {
    let filtered = trackings || [];

    // Filter by search query
    if (deferredQuery) {
      filtered = filtered.filter(
        (tracking) =>
          tracking.name
            .toLowerCase()
            .includes(deferredQuery.toLowerCase()) ||
          tracking.email
            .toLowerCase()
            .includes(deferredQuery.toLowerCase()) ||
          tracking.tracking_code
            .toLowerCase()
            .includes(deferredQuery.toLowerCase())
      );
    }

    return filtered;
  }, [deferredQuery, trackings]);

  const getEmptyStateConfig = useMemo(() => {
    const hasSearch = !!deferredQuery;
    const clearSearch = () => setSearchQuery("");

    const configs = [
      {
        condition: hasSearch,
        description: `Não encontramos nenhum envio que corresponda à sua pesquisa por "${deferredQuery}".`,
        actionConfigs: [
          { key: "clear-search", label: "Limpar pesquisa", onClick: clearSearch },
        ],
      },
    ];

    return (
      configs.find((config) => config.condition) || {
        description: "Nenhum envio encontrado.",
        actionConfigs: [],
      }
    );
  }, [deferredQuery]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 max-w-sm w-full" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-96 w-full" />
        <div className="flex justify-end">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-4 w-32" />
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Skeleton className="hidden h-8 w-8 lg:flex" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="hidden h-8 w-8 lg:flex" />
            </div>
          </div>
        </div>
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
            <EmptyTitle>Erro ao carregar envios</EmptyTitle>
            <EmptyDescription>
              Ocorreu um erro ao buscar os envios. Tente novamente.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => refetch()} disabled={loading} variant="outline">
              <RefreshCw />
              Tentar novamente
            </Button>
          </EmptyContent>
        </Empty>
      </FadeInWrapper>
    );
  }

  if (trackings?.length === 0) {
    return (
      <FadeInWrapper>
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Package />
            </EmptyMedia>
            <EmptyTitle>Nenhum envio encontrado</EmptyTitle>
            <EmptyDescription>
              Você ainda não possui nenhum envio. Os envios aparecerão aqui quando criados.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </FadeInWrapper>
    );
  }

  return (
    <FadeInWrapper className="space-y-4">
      {filteredTrackings && filteredTrackings.length > 0 && (
        <ShipmentsDataTable
          columns={columns}
          data={filteredTrackings}
          initialPreferences={tablePreferences}
        />
      )}

      {filteredTrackings.length === 0 && deferredQuery && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Package />
            </EmptyMedia>
            <EmptyTitle>Nenhum envio encontrado</EmptyTitle>
            <EmptyDescription>
              {getEmptyStateConfig.description}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            {getEmptyStateConfig.actionConfigs.map((action) => (
              <Button key={action.key} onClick={action.onClick}>
                {action.label}
              </Button>
            ))}
          </EmptyContent>
        </Empty>
      )}
    </FadeInWrapper>
  );
}
