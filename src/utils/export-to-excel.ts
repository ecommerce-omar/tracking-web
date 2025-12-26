import * as XLSX from "xlsx";
import { Tracking } from "@/schemas/tracking-schema";
import { formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { deliveryChannelLabelMap } from "@/constants/tracking-status";

export function exportShipmentsToExcel(trackings: Tracking[]) {
  // Preparar dados para exportação
  const excelData = trackings.map((tracking) => {
    return {
      "Código de Rastreio": tracking.tracking_code,
      "Remetente": tracking.sender || "",
      "Canal de Entrega": deliveryChannelLabelMap[tracking.delivery_channel] || tracking.delivery_channel,
      "Quantidade de Objetos": tracking.quantity,
      "Criado em": tracking.created_at
        ? formatDate(new Date(tracking.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
        : "",
      "Previsão de Entrega": tracking.dt_expected
        ? formatDate(new Date(tracking.dt_expected), "dd/MM/yyyy", { locale: ptBR })
        : "Ainda não há previsão",
      "Status": tracking.current_status,
    };
  });

  // Criar workbook e worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Envios");

  // Ajustar largura das colunas
  const columnWidths = [
    { wch: 20 }, // Código de Rastreio
    { wch: 30 }, // Remetente
    { wch: 20 }, // Canal de Entrega
    { wch: 25 }, // Quantidade de Objetos
    { wch: 20 }, // Criado em
    { wch: 20 }, // Previsão de Entrega
    { wch: 40 }, // Status
  ];
  worksheet["!cols"] = columnWidths;

  // Gerar arquivo e fazer download
  const fileName = `envios_${formatDate(new Date(), "yyyy-MM-dd_HH-mm", { locale: ptBR })}.xlsx`;

  // Gerar o arquivo como blob
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Criar link temporário para download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;

  // Simular click para abrir diálogo de salvar
  document.body.appendChild(link);
  link.click();

  // Limpar
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
