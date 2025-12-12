"use client";

import { useMemo, useState, useEffect } from "react";
import { SlidersHorizontal, RefreshCw, AlertCircle, Mail, Search } from "lucide-react";
import { getCookie, setCookie } from "@/lib/cookies";
import { useEmailTemplates } from "@/hooks/use-email-templates";
import { useIsMobile } from "@/hooks/use-mobile";

import { EmailTemplateCard } from "@/components/email-template-card";
import { FadeInWrapper } from "@/components/fade-in-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function TempletesEmailPage() {
  const { data: templates, isLoading, error, refetch } = useEmailTemplates();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showActive, setShowActive] = useState<boolean>(true);
  const [showInactive, setShowInactive] = useState<boolean>(true);
  const isMobile = useIsMobile()
  // Contagem de filtros ativos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (!showActive) count++;
    if (!showInactive) count++;
    return count;
  }, [showActive, showInactive]);

  // Carregar preferências dos filtros via cookies
  useEffect(() => {
    const activeFilter = getCookie("emailTemplatesShowActive");
    const inactiveFilter = getCookie("emailTemplatesShowInactive");

    if (activeFilter !== null) setShowActive(activeFilter === "true");
    if (inactiveFilter !== null) setShowInactive(inactiveFilter === "true");
  }, []);

  // Salvar filtros em cookies
  useEffect(() => {
    setCookie("emailTemplatesShowActive", showActive.toString());
  }, [showActive]);

  useEffect(() => {
    setCookie("emailTemplatesShowInactive", showInactive.toString());
  }, [showInactive]);

  const filteredTemplates = useMemo(() => {
    let filtered = templates || [];

    // Busca
    if (searchQuery) {
      filtered = filtered.filter((template) =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro ativo/inativo
    filtered = filtered.filter((template) => {
      if (template.is_active && showActive) return true;
      if (!template.is_active && showInactive) return true;
      return false;
    });

    // Ordenar: ativos primeiro, depois alfabético
    filtered.sort((a, b) => {
      const activeSort = Number(b.is_active) - Number(a.is_active);
      if (activeSort !== 0) return activeSort;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [searchQuery, templates, showActive, showInactive]);

  // Configuração do estado vazio
  const getEmptyStateConfig = useMemo(() => {
    const hasSearch = !!searchQuery;
    const hasActiveFilters = !showActive || !showInactive;
    const noFiltersSelected = !showActive && !showInactive;

    const clearSearch = () => setSearchQuery("");
    const clearFilters = () => {
      setShowActive(true);
      setShowInactive(true);
    };

    const configs = [
      {
        condition: hasSearch && hasActiveFilters,
        description: `Não encontramos nenhum template que corresponda à sua pesquisa por "${searchQuery}" com os filtros aplicados.`,
        actionConfigs: [
          { key: "clear-search", label: "Limpar pesquisa", onClick: clearSearch },
          { key: "clear-filters", label: "Limpar filtros", onClick: clearFilters },
        ],
      },
      {
        condition: hasSearch && !hasActiveFilters,
        description: `Não encontramos nenhum template que corresponda à sua pesquisa por "${searchQuery}".`,
        actionConfigs: [{ key: "clear-search", label: "Limpar pesquisa", onClick: clearSearch }],
      },
      {
        condition: !hasSearch && hasActiveFilters && !noFiltersSelected,
        description: "Nenhum template corresponde aos filtros aplicados.",
        actionConfigs: [{ key: "clear-filters", label: "Limpar filtros", onClick: clearFilters }],
      },
      {
        condition: noFiltersSelected,
        description: "Selecione pelo menos um filtro para visualizar os templates.",
        actionConfigs: [{ key: "show-all", label: "Mostrar todos", onClick: clearFilters }],
      },
    ];

    return (
      configs.find((config) => config.condition) || {
        description: "Nenhum template encontrado.",
        actionConfigs: [],
      }
    );
  }, [searchQuery, showActive, showInactive]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 max-w-sm w-full" />
          <Skeleton className="h-10 w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton className="h-[168px] w-full" key={i} />
          ))}
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
            <EmptyTitle>Erro ao carregar templates</EmptyTitle>
            <EmptyDescription>
              Ocorreu um erro ao buscar os templates de email. Tente novamente.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw  />
              Tentar novamente
            </Button>
          </EmptyContent>
        </Empty>
      </FadeInWrapper>
    );
  }

  if (templates?.length === 0) {
    return (
      <FadeInWrapper>
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Mail />
            </EmptyMedia>
            <EmptyTitle>Nenhum template encontrado</EmptyTitle>
            <EmptyDescription>
              Você ainda não criou nenhum template de email. Crie seu primeiro
              template para começar.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw  />
              Atualizar
            </Button>
          </EmptyContent>
        </Empty>
      </FadeInWrapper>
    );
  }

  return (
    <FadeInWrapper className="space-y-4">
      <div className="flex items-center gap-3">

        <InputGroup className="max-w-sm">
          <InputGroupInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquise..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-muted-foreground/30 size-5 rounded-full px-1"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isMobile ? "end" : "start"}>
            <DropdownMenuLabel>Status dos templates</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="px-2 py-2 space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="main-active-templates"
                  checked={showActive}
                  onCheckedChange={(checked) => setShowActive(checked === true)}
                />
                <Label
                  htmlFor="main-active-templates"
                  className="text-sm font-normal cursor-pointer"
                >
                  Ativos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="main-inactive-templates"
                  checked={showInactive}
                  onCheckedChange={(checked) => setShowInactive(checked === true)}
                />
                <Label
                  htmlFor="main-inactive-templates"
                  className="text-sm font-normal cursor-pointer"
                >
                  Inativos
                </Label>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredTemplates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <EmailTemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}

      {filteredTemplates.length === 0 &&
        (searchQuery ||
          (!showActive && !showInactive) ||
          !showActive ||
          !showInactive) && (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Mail />
              </EmptyMedia>
              <EmptyTitle>Nenhum template encontrado</EmptyTitle>
              <EmptyDescription>
                {getEmptyStateConfig.description}
              </EmptyDescription>
            </EmptyHeader>
            {getEmptyStateConfig.actionConfigs.length > 0 && (
              <EmptyContent>
                <div className="flex gap-2 flex-wrap justify-center">
                  {getEmptyStateConfig.actionConfigs.map((action) => (
                    <Button key={action.key} onClick={action.onClick} variant="outline">
                      {action.label}
                    </Button>
                  ))}
                </div>
              </EmptyContent>
            )}
          </Empty>
        )}
    </FadeInWrapper>
  );
}
