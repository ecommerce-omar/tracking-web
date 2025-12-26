"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { dateRangeFilter } from "@/utils/date-range-filter";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tracking } from "@/schemas/tracking-schema";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DataList,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
} from "@/components/ui/data-list";
import { CopyButton } from "@/components/ui/copy-button";
import {
  statusColorMap,
  statusLabelMap,
  statusGroupMap,
  deliveryChannelLabelMap,
} from "@/constants/tracking-status";

export const columnsTracking: ColumnDef<Tracking>[] = [
  {
    accessorKey: "order_id",
    header: "Nº do pedido",
    enableGlobalFilter: true,
    enableHiding: true,
    cell: ({ row }) => {
      const { order_id } = row.original;
      const baseUrl = process.env.NEXT_PUBLIC_LINK_VTEX;

      return (
        <Link
          target="_blank"
          href={`${baseUrl}${order_id}`}
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline transition-all flex items-center gap-2"
        >
          {order_id}
          <ExternalLink size={16} />
        </Link>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Cliente",
    enableGlobalFilter: true,
    enableHiding: true,
    cell: ({ row }) => {
      const { name } = row.original;
      return <span className="capitalize">{name}</span>;
    },
  },
  {
    accessorKey: "delivery_channel",
    header: "Canal de entrega",
    enableGlobalFilter: false,
    enableHiding: true,
    cell: ({ row }) => {
      const category = row.getValue("delivery_channel") as string;
      return <span>{deliveryChannelLabelMap[category]}</span>;
    },
    filterFn: (row, id, value) => {
      if (!value) return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "products",
    header: "Objetos",
    enableGlobalFilter: false,
    enableHiding: true,
    cell: ({ row }) => {
      const { products, quantity } = row.original;
      return (
        <HoverCard>
          <HoverCardTrigger className="cursor-default">
            {quantity}
          </HoverCardTrigger>
          <HoverCardContent>
            <DataList className="flex flex-col gap-1">
              {products.map((product) => {
                const { id, name, price, quantity } = product;

                const productData = [
                  {
                    label: "Código",
                    value: id,
                  },
                  {
                    label: "Descrição",
                    value: `${name} ${quantity > 1 ? ` (x${quantity})` : ""}`,
                  },
                  {
                    label: "Preço",
                    value: formatCurrency(price),
                  },
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

                          {index < 1 && (
                            <CopyButton value={item.value}/>
                          )}
                        </DataListItemValue>
                      </DataListItem>
                    ))}
                  </div>
                );
              })}
            </DataList>
          </HoverCardContent>
        </HoverCard>
      );
    },
  },
  {
    accessorKey: "tracking_code",
    header: "Código de rastreio",
    enableGlobalFilter: true,
    enableHiding: true,
    cell: ({ row }) => {
      const trackingCode = row.original.tracking_code;
      return (
        <Link
          href={`/tracking/${trackingCode}`}
          rel="noopener noreferrer"
          className="cursor-pointer underline-offset-2 hover:underline"
        >
          {trackingCode}
        </Link>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Categoria",
    enableGlobalFilter: false,
    enableHiding: true,
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return <span className="uppercase">{category}</span>;
    },
  },
  {
    accessorKey: "sender",
    header: ({ column }) => (
      <button
        className="flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Remetente
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    enableGlobalFilter: true,
    enableHiding: true,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <button
        className="flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Criado em
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const dateStr = row.getValue("created_at") as string;
      return (
        <span>
          {formatDate(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR })}
        </span>
      );
    },
    enableGlobalFilter: false,
    enableHiding: true,
    filterFn: dateRangeFilter,
  },
  {
    accessorKey: "dt_expected",
    header: ({ column }) => (
      <button
        className="flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Previsão de entrega
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const dateStr = row.getValue("dt_expected") as string;
      return (
        <span>
          {dateStr
            ? formatDate(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR })
            : "Ainda não há previsão"}
        </span>
      );
    },
    enableGlobalFilter: false,
    enableHiding: true,
    filterFn: dateRangeFilter,
  },
  {
    accessorKey: "current_status",
    header: "Status",
    enableGlobalFilter: false,
    enableHiding: true,
    cell: ({ row }) => {
      const { current_status } = row.original;

      return (
        <span>
          <Badge variant="outline" className="gap-1.5">
            <span
              className={cn(
                "size-1.5 rounded-full",
                statusColorMap[current_status]
              )}
              aria-hidden="true"
            ></span>
            {statusLabelMap[current_status]}
          </Badge>
        </span>
      );
    },
    filterFn: (row, id, value: string[]) => {
      if (!value || value.length === 0) return true;
      const rowStatus = row.getValue(id) as string;

      // Mapeia o status detalhado para o status agrupado, se existir
      const groupedStatus = statusGroupMap[rowStatus] || rowStatus;

      // Verifica se o status (original ou agrupado) está incluído nos valores selecionados
      return value.includes(rowStatus) || value.includes(groupedStatus);
    },
  },
];
