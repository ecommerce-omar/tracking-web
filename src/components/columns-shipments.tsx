"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { dateRangeFilter } from "@/utils/date-range-filter";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate, isAfter, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Tracking } from "@/schemas/tracking-schema";
import { ArrowUpDown, ExternalLink, Trash2, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteTracking } from "@/hooks/use-delete-tracking";
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
  statusFilterMap,
  deliveryChannelLabelMap,
} from "@/constants/tracking-status";
import { EditShipmentDialog } from "@/components/edit-shipment-dialog";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Tracking>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: "cpf",
    header: "CPF",
    enableGlobalFilter: true,
    enableHiding: true,
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
                            <CopyButton value={item.value} />
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
          href={`/shipments/${trackingCode}`}
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

      // Verificar se a previsão está atrasada
      const isOverdue = dateStr
        ? isAfter(startOfDay(new Date()), startOfDay(new Date(dateStr)))
        : false;

      return (
        <span className={cn(
          isOverdue && "text-destructive"
        )}>
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
    header: ({ column }) => (
      <button
        className="flex items-center"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </button>
    ),
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
      const status = row.getValue(id) as string;
      return value.includes(statusFilterMap[status]);
    },
  },
  {
    id: "actions",
    header: () => null,
    enableHiding: false,
    cell: function ActionsCell({ row }) {
      const tracking = row.original;
      const { current_status, tracking_code } = tracking;
      const { mutate: deleteTracking, isPending: isDeleting } = useDeleteTracking();

      const canDelete =
        current_status === "Etiqueta cancelada pelo emissor" ||
        current_status === "Etiqueta emitida" ||
        current_status === "Etiqueta expirada" ||
        current_status === "Objeto não encontrado";

      return (
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <MoreVertical />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <EditShipmentDialog tracking={tracking} asDropdownItem />
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  variant="destructive"
                  disabled={!canDelete || isDeleting}
                >
                  <Trash2 />
                  Excluir
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este rastreio? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteTracking(tracking_code)}
                className={cn(buttonVariants({ variant: "destructive" }))}
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
