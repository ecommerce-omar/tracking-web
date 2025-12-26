"use client";

import { useState, useEffect } from "react";
import { Bell, Info, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { useBrowserNotifications } from "@/hooks/use-browser-notifications";
import { setCookie, getCookie } from "@/lib/cookies";
import { statusCategories } from "@/constants/tracking-status";
import { FadeInWrapper } from "@/components/fade-in-wrapper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { TypographyH3, TypographyMuted } from "@/components/ui/typography";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

interface NotificationSettings {
  enabled: boolean;
  notifyOnStatusChange: boolean;
  notifyOnNewTracking: boolean;
  statusFilters: string[];
}

export default function NotificationSettingsPage() {
  const { permission, isSupported, requestPermission } =
    useBrowserNotifications();

  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    notifyOnStatusChange: true,
    notifyOnNewTracking: false,
    statusFilters: [], // Será inicializado no useEffect
  });

  const [generalSettingsChanged, setGeneralSettingsChanged] = useState(false);
  const [statusFiltersChanged, setStatusFiltersChanged] = useState(false);

  // Carregar configurações salvas
  useEffect(() => {
    // Extrair todos os status disponíveis das categorias
    const allStatuses = statusCategories.flatMap(
      (category) => category.statuses
    );

    const savedSettings = getCookie("notification_settings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Se statusFilters estiver vazio/undefined E notifyOnStatusChange for true, inicializa com todos
        const shouldInitializeAllStatuses =
          (!parsed.statusFilters || parsed.statusFilters.length === 0) &&
          (parsed.notifyOnStatusChange ?? true);

        setSettings({
          enabled: parsed.enabled ?? true,
          notifyOnStatusChange: parsed.notifyOnStatusChange ?? true,
          notifyOnNewTracking: parsed.notifyOnNewTracking ?? false,
          statusFilters: shouldInitializeAllStatuses
            ? allStatuses
            : parsed.statusFilters ?? allStatuses,
        });
      } catch (error) {
        console.error("Error parsing notification settings:", error);
      }
    } else {
      // Se não houver configurações salvas, inicializa com todos os status
      setSettings((prev) => ({
        ...prev,
        statusFilters: allStatuses,
      }));
    }
  }, []); // Array vazio - executa apenas uma vez na montagem

  const handleToggleStatus = (statusValue: string) => {
    setSettings((prev) => {
      const statusFilters = prev.statusFilters.includes(statusValue)
        ? prev.statusFilters.filter((s) => s !== statusValue)
        : [...prev.statusFilters, statusValue];

      setStatusFiltersChanged(true);
      return { ...prev, statusFilters };
    });
  };

  const handleToggleSetting = (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setGeneralSettingsChanged(true);
  };

  const handleSelectAllInCategory = (categoryStatuses: string[]) => {
    setSettings((prev) => {
      const allSelected = categoryStatuses.every((s) =>
        prev.statusFilters.includes(s)
      );

      let statusFilters: string[];
      if (allSelected) {
        statusFilters = prev.statusFilters.filter(
          (s) => !categoryStatuses.includes(s)
        );
      } else {
        statusFilters = [
          ...new Set([...prev.statusFilters, ...categoryStatuses]),
        ];
      }

      setStatusFiltersChanged(true);
      return { ...prev, statusFilters };
    });
  };

  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setCookie("notification_settings", JSON.stringify(settings), 365);
    setGeneralSettingsChanged(false);

    // Se os filtros também foram alterados, marca como salvos também
    if (statusFiltersChanged) {
      setStatusFiltersChanged(false);
    }

    toast.success("Configurações gerais salvas", {
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };

  const handleSaveStatusFilters = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar se há pelo menos um status selecionado
    if (settings.statusFilters.length === 0 && settings.notifyOnStatusChange) {
      toast.warning("Nenhum status selecionado", {
        description:
          "Selecione pelo menos um status para receber notificações ou desative as notificações de mudança de status.",
      });
      return;
    }

    setCookie("notification_settings", JSON.stringify(settings), 365);
    setStatusFiltersChanged(false);

    // Se as configurações gerais também foram alteradas, marca como salvas também
    if (generalSettingsChanged) {
      setGeneralSettingsChanged(false);
    }

    toast.success("Filtros de status salvos", {
      description: "Suas preferências de notificação foram atualizadas.",
    });
  };

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast.success("Notificações habilitadas", {
        description:
          "Você receberá notificações do navegador conforme suas preferências.",
      });
    }
  };

  if (!isSupported) {
    return (
      <FadeInWrapper className="space-y-6">
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BellOff />
            </EmptyMedia>
            <EmptyTitle>Navegador não suporta notificações</EmptyTitle>
            <EmptyDescription>
              Seu navegador atual não possui suporte para notificações do
              sistema. Tente usar um navegador moderno como Chrome, Firefox,
              Edge ou Safari.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </FadeInWrapper>
    );
  }

  return (
    <FadeInWrapper className="space-y-6">
      {permission === "denied" && (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Notificações Bloqueadas</AlertTitle>
          <AlertDescription>
            As notificações estão bloqueadas no seu navegador. Para habilitar,
            acesse as configurações do navegador e permita notificações para
            este site.
          </AlertDescription>
        </Alert>
      )}

      {permission === "default" && (
        <Item variant="outline">
          <ItemMedia variant="icon">
            <Bell />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Permissão Necessária</ItemTitle>
            <ItemDescription>
              Para receber notificações, você precisa permitir o acesso ao
              navegador.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" onClick={handleEnableNotifications} size="sm">
              Permitir Notificações
            </Button>
          </ItemActions>
        </Item>
      )}

      <div className="grid gap-6">
        {/* Configurações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
            <CardDescription>
              Escolha quais tipos de eventos devem gerar notificações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveGeneralSettings} className="space-y-4">
              <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="enabled">Notificações Ativadas</Label>
                  <TypographyMuted>
                    Ativar ou desativar todas as notificações
                  </TypographyMuted>
                </div>
                <Switch
                  id="enabled"
                  checked={settings.enabled}
                  onCheckedChange={(checked) =>
                    handleToggleSetting("enabled", checked)
                  }
                  disabled={permission !== "granted"}
                />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="status-change">Mudanças de Status</Label>
                  <TypographyMuted>
                    Receber notificação quando o status de um envio mudar
                  </TypographyMuted>
                </div>
                <Switch
                  id="status-change"
                  checked={settings.notifyOnStatusChange}
                  onCheckedChange={(checked) =>
                    handleToggleSetting("notifyOnStatusChange", checked)
                  }
                  disabled={permission !== "granted" || !settings.enabled}
                />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="new-tracking">Novos Rastreamentos</Label>
                  <TypographyMuted>
                    Receber notificação quando um novo envio for adicionado
                  </TypographyMuted>
                </div>
                <Switch
                  id="new-tracking"
                  checked={settings.notifyOnNewTracking}
                  onCheckedChange={(checked) =>
                    handleToggleSetting("notifyOnNewTracking", checked)
                  }
                  disabled={permission !== "granted" || !settings.enabled}
                />
              </div>

              <div className="flex items-center justify-end pt-2">
                <Button
                  type="submit"
                  disabled={!generalSettingsChanged || permission !== "granted"}
                >
                  Salvar Configurações
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Filtros por Status */}
        <Card>
          <CardHeader>
            <CardTitle>Filtrar por Status</CardTitle>
            <CardDescription>
              Selecione quais status devem gerar notificações. Por padrão, todos
              os status estão marcados. Desmarque os que você não deseja
              receber.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveStatusFilters} className="space-y-6">
              {statusCategories.map((category) => {
                const categoryStatuses = [...category.statuses];
                const allSelected = categoryStatuses.every((s) =>
                  settings.statusFilters.includes(s)
                );

                return (
                  <div key={category.label} className="space-y-4 border-t pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <TypographyH3 className="text-base">
                        {category.label}
                      </TypographyH3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleSelectAllInCategory(categoryStatuses)
                        }
                        disabled={
                          permission !== "granted" ||
                          !settings.enabled ||
                          !settings.notifyOnStatusChange
                        }
                      >
                        {allSelected ? "Desmarcar Todos" : "Marcar Todos"}
                      </Button>
                    </div>

                    <div className="grid gap-3">
                      {category.statuses.map((status) => (
                        <div key={status} className="flex items-center gap-3">
                          <Checkbox
                            id={status}
                            checked={settings.statusFilters.includes(status)}
                            onCheckedChange={() => handleToggleStatus(status)}
                            disabled={
                              permission !== "granted" ||
                              !settings.enabled ||
                              !settings.notifyOnStatusChange
                            }
                          />
                          <Label
                            htmlFor={status}
                            className="text-sm font-normal cursor-pointer flex-1"
                          >
                            {status}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center justify-end border-t pt-6">
                <Button
                  type="submit"
                  disabled={
                    !statusFiltersChanged ||
                    permission !== "granted" ||
                    !settings.enabled ||
                    !settings.notifyOnStatusChange
                  }
                >
                  Salvar Filtros
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </FadeInWrapper>
  );
}
