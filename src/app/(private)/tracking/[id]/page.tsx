"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTracking } from "@/hooks/use-tracking";
import { TrackingProduct } from "@/schemas/tracking-schema";
import { formatCurrency } from "@/utils/format-currency";

import {
  ClipboardList,
  ExternalLink,
  Package,
  UserCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { FadeInWrapper } from "@/components/fade-in-wrapper";
import { TimelineEvents } from "@/components/timeline-events";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DataList,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
} from "@/components/ui/data-list";

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { CopyButton } from "@/components/ui/copy-button";

export default function TrackingDetailsPage() {
  const params = useParams();
  const trackingCode = params.id as string;
  const link = process.env.NEXT_PUBLIC_LINK_CHATPRO;
  const baseUrl = process.env.NEXT_PUBLIC_LINK_VTEX;

  const {
    data: tracking,
    isLoading,
    error,
    refetch,
  } = useTracking(trackingCode);

  // Loading state
  if (isLoading) {
    return (
      <FadeInWrapper className="grid grid-cols-2 gap-4">
        <div className="space-y-4 sticky top-4 self-start">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div>
          <Skeleton className="h-152 w-full" />
        </div>
      </FadeInWrapper>
    );
  }

  // Error state
  if (error) {
    return (
      <FadeInWrapper>
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertCircle className="text-red-500" />
            </EmptyMedia>
            <EmptyTitle>Erro ao carregar pedido</EmptyTitle>
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

  // Not found state
  if (!tracking) {
    return (
      <FadeInWrapper>
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Package />
            </EmptyMedia>
            <EmptyTitle>Rastreio não encontrado</EmptyTitle>
            <EmptyDescription>
              {`Não foi possível encontrar um rastreio com o código ${trackingCode}.`}
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

  const {
    cpf,
    created_at,
    delivery_channel,
    email,
    name,
    order_id,
    products,
    quantity,
    contact,
  } = tracking;

  const clientData = [
    { label: "Nome", value: name },
    { label: "CPF", value: cpf },
    { label: "E-mail", value: email },
    { label: "Contato", value: contact },
  ];

  const orderData = [
    { label: "Código do pedido", value: order_id },
    { label: "Quantidade de itens", value: quantity },
    {
      label: "Data de criação",
      value: new Date(created_at).toLocaleDateString(),
    },
    { label: "Canal de entrega", value: delivery_channel },
  ];

  return (
    <FadeInWrapper className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        {/* Dados do cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle2 className="w-5 h-5" />
              Dados do cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataList>
              {clientData.map((item, index) => (
                <DataListItem key={index}>
                  <DataListItemLabel className="min-w-[60px]">
                    {item.label}
                  </DataListItemLabel>
                  <DataListItemValue className="flex items-center gap-2">
                    {index !== 3 && item.value}

                    {/* Botão de copiar CPF e E-mail */}
                    {index !== 3 && <CopyButton value={item.value} />}

                    {/* Contato com link */}
                    {index === 3 && (
                      <Link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline-offset-4 hover:underline transition-all flex items-center gap-2"
                        href={`${link}${item.value}`}
                      >
                        {item.value}
                        <ExternalLink size={16} />
                      </Link>
                    )}
                  </DataListItemValue>
                </DataListItem>
              ))}
            </DataList>
          </CardContent>
        </Card>

        {/* Informações do pedido */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Informações do pedido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataList>
              {orderData.map((item, index) => (
                <DataListItem key={index}>
                  <DataListItemLabel className="min-w-[150px]">
                    {item.label}
                  </DataListItemLabel>
                  <DataListItemValue className="capitalize flex items-center gap-2">
                    {index === 0 ? (
                      <Link
                        target="_blank"
                        href={`${baseUrl}${item.value}`}
                        rel="noopener noreferrer"
                        className="underline-offset-4 hover:underline transition-all flex items-center gap-2"
                      >
                        {item.value}
                        <ExternalLink size={16} />
                      </Link>
                    ) : (
                      item.value
                    )}
                  </DataListItemValue>
                </DataListItem>
              ))}
            </DataList>
          </CardContent>
        </Card>

        {/* Objetos / Produtos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Objetos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataList className="space-y-3">
              {products.map((product: TrackingProduct) => {
                const { id, name, price, quantity } = product;

                const productData = [
                  { label: "Código", value: id },
                  {
                    label: "Descrição",
                    value: `${name} ${quantity > 1 ? ` (x${quantity})` : ""}`,
                  },
                  { label: "Preço", value: formatCurrency(price) },
                ];

                return (
                  <div
                    key={id}
                    className="border-b pb-3 last:border-none last:pb-0"
                  >
                    {productData.map((item, index) => (
                      <DataListItem key={index}>
                        <DataListItemLabel className="min-w-[72px]">
                          {item.label}
                        </DataListItemLabel>
                        <DataListItemValue className="flex items-center gap-2">
                          {item.value}

                          {/* Botão de copiar apenas no Código do produto */}
                          {index === 0 && <CopyButton value={item.value} />}
                        </DataListItemValue>
                      </DataListItem>
                    ))}
                  </div>
                );
              })}
            </DataList>
          </CardContent>
        </Card>
      </div>

      {/* Timeline de envio */}
      <Card className="md:sticky md:top-4 md:self-start">
        <CardHeader>
          <CardTitle>Informações de envio</CardTitle>
        </CardHeader>
        <CardContent>
          <TimelineEvents data={tracking} />
        </CardContent>
      </Card>
    </FadeInWrapper>
  );
}
