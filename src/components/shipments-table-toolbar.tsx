"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  ChevronDown,
  Columns2,
  Search,
  SlidersHorizontal,
  FileSpreadsheet,
  X,
} from "lucide-react";

import { ptBR } from "date-fns/locale";
import { DateRange } from "react-day-picker";

import {
  Table as ReactTable,
  Column,
} from "@tanstack/react-table";

import {
  deliveryChannelLabelMap,
  statusCategories,
} from "@/constants/tracking-status";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CreateShipmentDialog } from "@/components/create-shipment-dialog";
import { exportShipmentsToExcel } from "@/utils/export-to-excel";
import { Tracking } from "@/schemas/tracking-schema";

const columnsLabel: Record<string, string> = {
  order_id: "Nº do pedido",
  name: "Cliente",
  cpf: "CPF",
  tracking_code: "Código de rastreio",
  products: "Objetos",
  created_at: "Criado em",
  dt_expected: "Previsão de entrega",
  current_status: "Status",
  delivery_channel: "Canal de entrega",
  category: "Categoria",
  sender: "Remetente",
  actions: "Ações",
};

export interface ShipmentsTableToolbarProps<TData> {
  table: ReactTable<TData>;
  activeFiltersCount: number;
  range: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
  deliveryChannel: string;
  setDeliveryChannel: (channel: string) => void;
  currentStatus: string[];
  setCurrentStatus: (status: string[]) => void;
  deliveryForecastRange: DateRange | undefined;
  setDeliveryForecastRange: (range: DateRange | undefined) => void;
  applyDateFilter: () => void;
  clearFilters: () => void;
}

interface FilterDialogProps {
  activeFiltersCount: number;
  range: DateRange | undefined;
  setRange: (range: DateRange | undefined) => void;
  deliveryChannel: string;
  setDeliveryChannel: (channel: string) => void;
  currentStatus: string[];
  setCurrentStatus: (status: string[]) => void;
  deliveryForecastRange: DateRange | undefined;
  setDeliveryForecastRange: (range: DateRange | undefined) => void;
  applyDateFilter: () => void;
  clearFilters: () => void;
}

interface ColumnVisibilityProps<TData> {
  table: ReactTable<TData>;
}

interface StatusCategoryProps {
  category: {
    id: string;
    label: string;
    statuses: readonly string[];
  };
  currentStatus: string[];
  setCurrentStatus: (status: string[]) => void;
}

function StatusCategory({ category, currentStatus, setCurrentStatus }: StatusCategoryProps) {
  const categoryStatuses = [...category.statuses];

  // Verifica quantos status da categoria estão selecionados
  const selectedCount = categoryStatuses.filter((status) =>
    currentStatus.includes(status)
  ).length;

  const allSelected = selectedCount === categoryStatuses.length;

  const handleCategoryToggle = (checked: boolean) => {
    if (checked) {
      // Adiciona todos os status da categoria
      const newStatuses = [...new Set([...currentStatus, ...categoryStatuses])];
      setCurrentStatus(newStatuses);
    } else {
      // Remove todos os status da categoria
      const newStatuses = currentStatus.filter(
        (status) => !categoryStatuses.includes(status)
      );
      setCurrentStatus(newStatuses);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={category.id}
        checked={allSelected}
        onCheckedChange={handleCategoryToggle}
      />
      <Label htmlFor={category.id} className="font-medium">
        {category.label}
        {selectedCount > 0 && ` (${selectedCount})`}
      </Label>
    </div>
  );
}

function FilterDialog({
  activeFiltersCount,
  range,
  setRange,
  deliveryChannel,
  setDeliveryChannel,
  currentStatus,
  setCurrentStatus,
  deliveryForecastRange,
  setDeliveryForecastRange,
  applyDateFilter,
  clearFilters,
}: FilterDialogProps) {
  const isMobile = useIsMobile();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal />
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
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 max-w-[95vw] sm:max-w-xl max-h-[90vh] [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Filtros
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Filtre os resultados por data de criação, previsão de entrega, canais
          de entrega ou status. Use as abas para selecionar a categoria de
          filtro desejada.
        </DialogDescription>

        <div className="px-4 py-2 overflow-y-auto min-h-[320px] sm:min-h-[380px] lg:min-h-[424px]">
          <Tabs defaultValue="created_at">
            <TabsList className="w-full overflow-x-auto flex-nowrap justify-start">
              <TabsTrigger value="created_at" className="whitespace-nowrap">
                Criados em
              </TabsTrigger>
              <TabsTrigger value="dt_expected" className="whitespace-nowrap">
                Previsão entrega
              </TabsTrigger>
              <TabsTrigger
                value="delivery_channel"
                className="whitespace-nowrap"
              >
                Canais entrega
              </TabsTrigger>
              <TabsTrigger value="current_status" className="whitespace-nowrap">
                Status
              </TabsTrigger>
            </TabsList>
            <TabsContent value="created_at">
              <div suppressHydrationWarning>
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={setRange}
                  numberOfMonths={isMobile ? 1 : 2}
                  defaultMonth={range?.from || new Date()}
                  locale={ptBR}
                  disabled={(date) => date >= new Date()}
                  showOutsideDays={false}
                  className="py-4 rounded-lg border shadow-sm w-full"
                />
              </div>
            </TabsContent>
            <TabsContent value="dt_expected">
              <div suppressHydrationWarning>
                <Calendar
                  mode="range"
                  selected={deliveryForecastRange}
                  onSelect={setDeliveryForecastRange}
                  numberOfMonths={isMobile ? 1 : 2}
                  defaultMonth={deliveryForecastRange?.from || new Date()}
                  locale={ptBR}
                  showOutsideDays={false}
                  className="py-4 rounded-lg border shadow-sm w-full"
                />
              </div>
            </TabsContent>
            <TabsContent value="delivery_channel">
              <RadioGroup
                className="py-4"
                value={deliveryChannel}
                onValueChange={setDeliveryChannel}
              >
                {Object.entries(deliveryChannelLabelMap).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <RadioGroupItem value={key} id={key} />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </TabsContent>
            <TabsContent value="current_status">
              <div className="py-4 space-y-3">
                {statusCategories.map((category) => (
                  <StatusCategory
                    key={category.id}
                    category={category}
                    currentStatus={currentStatus}
                    setCurrentStatus={setCurrentStatus}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <Button type="button" variant="outline" onClick={clearFilters}>
            Limpar filtros
          </Button>
          <DialogClose asChild>
            <Button type="button" onClick={applyDateFilter}>
              Aplicar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ColumnVisibilityDropdown<TData>({
  table,
}: ColumnVisibilityProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <Columns2 />
          <span className="hidden lg:inline">Personalizar colunas</span>
          <span className="lg:hidden">Colunas</span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column: Column<TData, unknown>) => column.getCanHide())
          .map((column: Column<TData, unknown>) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {columnsLabel[column.id]}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ShipmentsTableToolbar<TData>({
  table,
  activeFiltersCount,
  range,
  setRange,
  deliveryChannel,
  setDeliveryChannel,
  currentStatus,
  setCurrentStatus,
  deliveryForecastRange,
  setDeliveryForecastRange,
  applyDateFilter,
  clearFilters,
}: ShipmentsTableToolbarProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelectedRows = selectedRows.length > 0;

  const handleExportToExcel = () => {
    const trackingsToExport = selectedRows.map((row) => row.original as Tracking);
    exportShipmentsToExcel(trackingsToExport);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Lado esquerdo: Input e Filtros */}
      <div className="flex items-center gap-3 flex-1">
        <InputGroup className="max-w-md flex-1">
          <InputGroupInput type="search" placeholder="Filtre por nº do pedido, CPF, nome do cliente..."
            onChange={(event) => table.setGlobalFilter(event.target.value.trim())} />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <FilterDialog
          activeFiltersCount={activeFiltersCount}
          range={range}
          setRange={setRange}
          deliveryChannel={deliveryChannel}
          setDeliveryChannel={setDeliveryChannel}
          currentStatus={currentStatus}
          setCurrentStatus={setCurrentStatus}
          deliveryForecastRange={deliveryForecastRange}
          setDeliveryForecastRange={setDeliveryForecastRange}
          applyDateFilter={applyDateFilter}
          clearFilters={clearFilters}
        />
        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={clearFilters}>
            <X />
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Lado direito: Exportar, Personalizar colunas e Criar envio */}
      <div className="flex items-center gap-3 ml-auto">
        {hasSelectedRows && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <FileSpreadsheet />
                Exportar
                <Badge
                  variant="secondary"
                  className="bg-muted-foreground/30 size-5 rounded-full px-1"
                >
                  {selectedRows.length}
                </Badge>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Exportar envios para Excel</AlertDialogTitle>
                <AlertDialogDescription>
                  Você está prestes a exportar {selectedRows.length} {selectedRows.length === 1 ? 'envio' : 'envios'} selecionado{selectedRows.length === 1 ? '' : 's'} para um arquivo Excel (.xlsx).
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleExportToExcel}>
                  Exportar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <ColumnVisibilityDropdown<TData> table={table} />
        <CreateShipmentDialog />
      </div>
    </div>
  );
}
