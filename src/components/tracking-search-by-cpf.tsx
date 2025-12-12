"use client";

import { useState } from "react";
import { Search, Package, AlertCircle, RefreshCw } from "lucide-react";
import { useTrackingByCpf } from "@/hooks/use-tracking-by-cpf";
import { TrackingCpfForm } from "@/components/tracking-cpf-form";
import { columnsTracking } from "@/components/columns-tracking";
import { TrackingDataTable } from "@/components/tracking-data-table";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export function TrackingSearchByCpf() {
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [searchedCpf, setSearchedCpf] = useState("");

  const { data: trackings, isLoading, error, refetch } = useTrackingByCpf(searchedCpf, searchEnabled);

  const handleSearch = (cpf: string) => {
    setSearchedCpf(cpf);
    setSearchEnabled(true);
  };

  const handleClear = () => {
    setSearchedCpf("");
    setSearchEnabled(false);
  };

  return (
    <div className="space-y-4">
      <TrackingCpfForm
        onSearch={handleSearch}
        onClear={handleClear}
        isLoading={isLoading}
        showClearButton={searchEnabled}
      />

      {/* Loading state */}
      {isLoading && (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Spinner />
            </EmptyMedia>
            <EmptyTitle>Buscando pedidos...</EmptyTitle>
            <EmptyDescription>
              Aguarde enquanto buscamos os pedidos vinculados a este CPF.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertCircle className="text-red-500" />
            </EmptyMedia>
            <EmptyTitle>Erro ao buscar pedidos</EmptyTitle>
            <EmptyDescription>
              Ocorreu um erro ao buscar os pedidos. Tente novamente.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => refetch()} disabled={isLoading} variant="outline">
              <RefreshCw />
              Tentar novamente
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {/* Empty state - no results */}
      {!isLoading && !error && searchEnabled && trackings && trackings.length === 0 && (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Package />
            </EmptyMedia>
            <EmptyTitle>Nenhum pedido encontrado</EmptyTitle>
            <EmptyDescription>
              Não encontramos pedidos vinculados ao CPF {searchedCpf}.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={handleClear} variant="outline">
              Nova consulta
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {/* Results */}
      {!isLoading && !error && trackings && trackings.length > 0 && (
        <TrackingDataTable columns={columnsTracking} data={trackings} />
      )}

      {/* Initial state - no search performed */}
      {!searchEnabled && !isLoading && (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>Digite um CPF para começar</EmptyTitle>
            <EmptyDescription>
              Insira o CPF no campo acima e clique em buscar para visualizar todos os pedidos vinculados.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
