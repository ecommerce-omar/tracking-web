"use client";

import { useState } from "react";
import { Search, SearchX } from "lucide-react";
import { useTracking } from "@/hooks/use-tracking";
import { TimelineEvents } from "@/components/timeline-events";
import { TrackingCodeForm } from "@/components/tracking-code-form";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export function TrackingSearchByCode() {
  const [searchCode, setSearchCode] = useState<string>("");

  const {
    data: tracking,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useTracking(searchCode);

  function handleSearch(_result: unknown, code: string) {
    setSearchCode(code);
  }

  const hasSearched = searchCode.length > 0;
  const showNotFound = hasSearched && !isLoading && !tracking && !error;
  const showError = hasSearched && !isLoading && error;

  function handleClear() {
    setSearchCode("");
  }

  return (
    <div className="space-y-4">
      <TrackingCodeForm value={searchCode} onSearch={handleSearch} />

      {(isLoading || isFetching) && (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Spinner />
            </EmptyMedia>
            <EmptyTitle>Buscando informações do rastreio</EmptyTitle>
            <EmptyDescription>
              Por favor, aguarde enquanto buscamos as informações do código {searchCode}. Não atualize a página.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={handleClear} variant="outline">
              Cancelar
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {tracking && <TimelineEvents data={tracking} />}

      {showError && (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchX className="text-red-500" />
            </EmptyMedia>
            <EmptyTitle>Erro ao buscar rastreio</EmptyTitle>
            <EmptyDescription>
              Ocorreu um erro ao buscar o rastreio. Tente novamente.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button onClick={() => refetch()} variant="outline">
                Tentar novamente
              </Button>
              <Button onClick={handleClear}>Limpar</Button>
            </div>
          </EmptyContent>
        </Empty>
      )}

      {showNotFound && (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchX className="text-red-500" />
            </EmptyMedia>
            <EmptyTitle>Nenhum resultado encontrado</EmptyTitle>
            <EmptyDescription>
              Nenhum rastreio foi encontrado para o código{" "}
              <span className="font-medium">{searchCode}</span>. Verifique se o
              código foi digitado corretamente.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={handleClear} variant="outline">Limpar</Button>
          </EmptyContent>
        </Empty>
      )}

      {!hasSearched && (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search  />
            </EmptyMedia>
            <EmptyTitle>Busque por um código de rastreio</EmptyTitle>
            <EmptyDescription>
              Digite o código de rastreio e pressione Enter para buscar.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
