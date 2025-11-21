import { z } from "zod";

export const trackingEventSchema = z.object({
  date: z.string().optional(),
  location: z.string(),
  status: z.string(),
  description: z.string(),
  unitType: z.string().optional(),
  originUnit: z.string().optional(),
  detail: z.string().optional(),
  destinationUnit: z.string().optional(),
  unitAddress: z
    .object({
      cep: z.string().optional(),
      logradouro: z.string().optional(),
      numero: z.string().optional(),
      bairro: z.string().optional(),
      cidade: z.string().optional(),
      uf: z.string().optional(),
    })
    .optional(),
});

export const trackingProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
});

export const trackingCategorySchema = z.enum(["sedex", "pac"]);
export const trackingDeliveryChannelSchema = z.enum([
  "delivery",
  "pickup-in-point",
]);

export const trackingStatusSchema = z.enum([
  "Etiqueta emitida",
  "Etiqueta cancelada pelo emissor",
  "Objeto coletado",
  "Objeto postado",
  "Objeto postado após o horário limite da unidade",
  "Objeto em transferência - por favor aguarde",
  "Objeto saiu para entrega ao destinatário",
  "Objeto saiu para entrega ao remetente",
  "Objeto encaminhado para retirada no endereço indicado",
  "Objeto aguardando retirada no endereço indicado",
  "Objeto não entregue",
  "Objeto entregue na Caixa de Correios Inteligente",
  "Objeto entregue ao remetente",
  "Objeto não entregue - endereço insuficiente",
  "Objeto não entregue - endereço incorreto",
  "Objeto não entregue - carteiro não atendido",
  "Objeto não entregue - prazo de retirada encerrado",
  "Favor desconsiderar a informação anterior",
  "Inconsistências no endereçamento do objeto",
  "Saída para entrega cancelada",
  "Objeto entregue ao destinatário",
  "Cancelado",
  "Devolvido",
  "Objeto em correção de rota",
  "Direcionado para entrega em unidade dos Correios a pedido do cliente",
  "Objeto não encontrado",
]);

export const trackingSchema = z.object({
  id: z.string(),
  order_id: z.number(),
  name: z.string(),
  cpf: z.string(),
  email: z.string(),
  contact: z.number(),
  quantity: z.number(),
  products: z.array(trackingProductSchema),
  tracking_code: z.string(),
  category: trackingCategorySchema,
  delivery_channel: trackingDeliveryChannelSchema,
  current_status: trackingStatusSchema,
  events: z.array(trackingEventSchema),
  created_at: z.string(),
  dt_expected: z.string(),
  updated_at: z.string(),
  sender: z.string().optional(),
});

export const trackingsResponseSchema = z.object({
  trackings: z.array(trackingSchema),
});

// Tracking code schema for forms
export const trackingCodeSchema = z.object({
  trackingCode: z
    .string()
    .min(1, "Código de rastreio é obrigatório")
    .max(50, "Código muito longo")
    .regex(
      /^[A-Z0-9]+$/,
      "Código deve conter apenas letras maiúsculas e números"
    ),
});

export type TrackingCodeFormData = z.infer<typeof trackingCodeSchema>;

// Main types
export type TrackingEvent = z.infer<typeof trackingEventSchema>;
export type TrackingProduct = z.infer<typeof trackingProductSchema>;
export type TrackingCategory = z.infer<typeof trackingCategorySchema>;
export type TrackingDeliveryChannel = z.infer<
  typeof trackingDeliveryChannelSchema
>;
export type TrackingStatusType = z.infer<typeof trackingStatusSchema>;
export type Tracking = z.infer<typeof trackingSchema>;
export type TrackingsResponse = z.infer<typeof trackingsResponseSchema>;

export const TrackingStatus = {
  // 🟦 Etapas iniciais
  ETIQUETA_EMITIDA: "Etiqueta emitida" as const,
  ETIQUETA_CANCELADA: "Etiqueta cancelada pelo emissor" as const,
  POSTADO: "Objeto postado" as const,
  POSTADO_APOS_HORARIO_LIMITE: "Objeto postado após o horário limite da unidade" as const,
  COLETADO: "Objeto coletado" as const,

  // 🟨 Transporte e processamento
  EM_TRANSFERENCIA: "Objeto em transferência - por favor aguarde" as const,
  CORRECAO_ROTA: "Objeto em correção de rota" as const,
  DIRECIONADO_UNIDADE_PEDIDO_CLIENTE:
    "Direcionado para entrega em unidade dos Correios a pedido do cliente" as const,

  // 🟩 Saída para entrega
  SAIU_PARA_ENTREGA: "Objeto saiu para entrega ao destinatário" as const,
  SAIU_PARA_ENTREGA_REMETENTE: "Objeto saiu para entrega ao remetente" as const,
  SAIDA_CANCELADA: "Saída para entrega cancelada" as const,

  // 🟦 Retirada em unidade
  ENCAMINHADO_RETIRADA:
    "Objeto encaminhado para retirada no endereço indicado" as const,
  AGUARDANDO_RETIRADA:
    "Objeto aguardando retirada no endereço indicado" as const,

  // 🟥 Problemas de entrega
  DESCONSIDERAR_INFO_ANTERIOR: "Favor desconsiderar a informação anterior" as const,
  INCONSISTENCIAS_ENDERECAMENTO: "Inconsistências no endereçamento do objeto" as const,
  NAO_ENTREGUE: "Objeto não entregue" as const,
  NAO_ENTREGUE_ENDERECO_INSUFICIENTE:
    "Objeto não entregue - endereço insuficiente" as const,
  NAO_ENTREGUE_ENDERECO_INCORRETO:
    "Objeto não entregue - endereço incorreto" as const,
  NAO_ENTREGUE_CARTEIRO: "Objeto não entregue - carteiro não atendido" as const,
  NAO_ENTREGUE_PRAZO_ENCERRADO:
    "Objeto não entregue - prazo de retirada encerrado" as const,
  NAO_ENCONTRADO: "Objeto não encontrado" as const,

  // 🟩 Entregue
  ENTREGUE: "Objeto entregue ao destinatário" as const,
  ENTREGUE_CAIXA_INTELIGENTE:
    "Objeto entregue na Caixa de Correios Inteligente" as const,

  // 🟧 Devolvido / Cancelado
  ENTREGUE_REMETENTE: "Objeto entregue ao remetente" as const,
  DEVOLVIDO: "Devolvido" as const,
  CANCELADO: "Cancelado" as const,
} as const;


// Status groups
// Define a custom type for completed statuses
export type CompletedStatusesType = {
  readonly DELIVERED: readonly [
    typeof TrackingStatus.ENTREGUE,
    typeof TrackingStatus.ENTREGUE_CAIXA_INTELIGENTE
  ];
  readonly CANCELLED: readonly [
    typeof TrackingStatus.ETIQUETA_CANCELADA,
    typeof TrackingStatus.CANCELADO
  ];
  readonly RETURNED: readonly [
    typeof TrackingStatus.DEVOLVIDO,
    typeof TrackingStatus.ENTREGUE_REMETENTE
  ];
};

export const CompletedStatuses: CompletedStatusesType = {
  // Status de entrega concluída
  DELIVERED: [
    TrackingStatus.ENTREGUE,
    TrackingStatus.ENTREGUE_CAIXA_INTELIGENTE,
  ],
  // Status de cancelamento
  CANCELLED: [TrackingStatus.ETIQUETA_CANCELADA, TrackingStatus.CANCELADO],
  // Status de devolução
  RETURNED: [TrackingStatus.DEVOLVIDO, TrackingStatus.ENTREGUE_REMETENTE],
} as const;
