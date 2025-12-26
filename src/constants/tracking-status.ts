import { TrackingStatus, TrackingStatusType } from "@/schemas/tracking-schema";

export const statusColorMap: Record<string, string> = {
  // Cinza
  "Etiqueta emitida": "bg-gray-500",
  "Carteiro saiu para coleta do objeto": "bg-gray-500",

  // Azul
  "Objeto coletado": "bg-sky-500",
  "Objeto postado": "bg-sky-500",
  "Objeto em transferência - por favor aguarde": "bg-sky-500",

  // Verde

  "Direcionado para entrega em unidade dos Correios a pedido do cliente":
    "bg-emerald-500",
  Devolvido: "bg-emerald-500",
  "Objeto saiu para entrega ao destinatário": "bg-emerald-500",
  "Objeto entregue ao destinatário": "bg-emerald-500",
  "Objeto entregue ao remetente": "bg-emerald-500",
  "Objeto entregue na Caixa de Correios Inteligente": "bg-emerald-500",

  // Amarelo
  "Objeto em correção de rota": "bg-yellow-500",
  "Objeto postado após o horário limite da unidade": "bg-yellow-500",
  "Objeto aguardando retirada no endereço indicado": "bg-yellow-500",
  "Objeto encaminhado para retirada no endereço indicado": "bg-yellow-500",
  "Objeto saiu para entrega ao remetente": "bg-yellow-500",

  // Laranja
  Cancelado: "bg-orange-500",
  "Etiqueta cancelada pelo emissor": "bg-orange-500",
  "Etiqueta expirada": "bg-orange-500",

  // Vermelho
  "Tentativa de entrega não efetuada": "bg-red-500",
  "Solicitação de suspensão de entrega ao destinatário": "bg-red-500",
  "Objeto não entregue - carteiro não atendido": "bg-red-500",
  "Objeto não entregue": "bg-red-500",
  "Objeto não entregue - endereço insuficiente": "bg-red-500",
  "Objeto não entregue - endereço incorreto": "bg-red-500",
  "Objeto não entregue - cliente desconhecido no local": "bg-red-500",
  "Objeto não entregue - prazo de retirada encerrado": "bg-red-500",
  "Saída para entrega cancelada": "bg-red-500",
  "Objeto não encontrado": "bg-red-500",
  "Favor desconsiderar a informação anterior": "bg-red-500",
  "Inconsistências no endereçamento do objeto": "bg-red-500",
  "Inconsistências no endereçamento do objeto.": "bg-red-500",
  "Objeto será devolvido por solicitação do contratante/remetente": "bg-red-500",
  "Objeto ainda não chegou à unidade": "bg-red-500",
};

export const statusLabelMap: Record<string, string> = {
  // Status de entrada
  "Etiqueta emitida": "Etiqueta emitida",
  "Carteiro saiu para coleta do objeto": "Carteiro saiu para coleta",
  "Etiqueta cancelada pelo emissor": "Etiqueta cancelada",
  "Etiqueta expirada": "Etiqueta expirada",
  "Objeto coletado": "Objeto coletado",
  "Objeto postado": "Objeto postado",
  "Objeto postado após o horário limite da unidade":
    "Postado após horário limite",

  // Status de trânsito
  "Objeto em transferência - por favor aguarde": "Objeto em transferência",
  "Objeto em correção de rota": "Objeto em correção de rota",

  // Status de entrega
  "Objeto saiu para entrega ao destinatário": "Objeto saiu para entrega",
  "Objeto saiu para entrega ao remetente":
    "Objeto saiu para entrega ao remetente",
  "Objeto encaminhado para retirada no endereço indicado":
    "Encaminhado para retirada",
  "Objeto aguardando retirada no endereço indicado": "Aguardando retirada",
  "Tentativa de entrega não efetuada": "Tentativa de entrega não efetuada",
  "Solicitação de suspensão de entrega ao destinatário": "Suspensão de entrega solicitada",
  "Objeto não entregue": "Não entregue",
  "Objeto não entregue - endereço insuficiente": "Endereço insuficiente",
  "Objeto não entregue - endereço incorreto": "Endereço incorreto",
  "Objeto não entregue - cliente desconhecido no local": "Cliente desconhecido no local",
  "Objeto não entregue - carteiro não atendido": "Carteiro não atendido",
  "Objeto não entregue - prazo de retirada encerrado":
    "Prazo de retirada encerrado",
  "Saída para entrega cancelada": "Saída para entrega cancelada",
  "Direcionado para entrega em unidade dos Correios a pedido do cliente":
    "Direcionado para unidade dos Correios",
  "Objeto não encontrado": "Objeto não encontrado",
  "Favor desconsiderar a informação anterior": "Desconsiderar informação anterior",
  "Inconsistências no endereçamento do objeto": "Inconsistências no endereçamento",
  "Inconsistências no endereçamento do objeto.": "Inconsistências no endereçamento",
  "Objeto será devolvido por solicitação do contratante/remetente": "Será devolvido por solicitação",
  "Objeto ainda não chegou à unidade": "Não chegou à unidade",

  // Status completados
  "Objeto entregue ao destinatário": "Objeto entregue ao destinatário",
  "Objeto entregue na Caixa de Correios Inteligente":
    "Objeto entregue na Caixa de Correios",
  "Objeto entregue ao remetente": "Objeto entregue ao remetente",
  Cancelado: "Pedido cancelado",
  Devolvido: "Pedido devolvido",
};

// Define os status exatos que podem aparecer na tabela
export const statusGroups = {
  LABEL_CREATED: "Etiqueta emitida",
  LABEL_CANCELLED: "Etiqueta cancelada pelo emissor",
  LABEL_EXPIRED: "Etiqueta expirada",
  COLLECTED: "Objeto coletado",
  POSTED: "Objeto postado",
  POSTED_AFTER_LIMIT: "Objeto postado após o horário limite da unidade",
  IN_TRANSIT: "Objeto em transferência - por favor aguarde",
  ROUTE_CORRECTION: "Objeto em correção de rota",
  OUT_FOR_DELIVERY: "Objeto saiu para entrega ao destinatário",
  OUT_FOR_RETURN: "Objeto saiu para entrega ao remetente",
  DELIVERY_CANCELED: "Saída para entrega cancelada",
  FORWARDED_TO_PICKUP: "Objeto encaminhado para retirada no endereço indicado",
  AWAITING_PICKUP: "Objeto aguardando retirada no endereço indicado",
  DIRECTED_TO_POST_OFFICE:
    "Direcionado para entrega em unidade dos Correios a pedido do cliente",
  DELIVERY_ATTEMPT_FAILED: "Tentativa de entrega não efetuada",
  DELIVERY_SUSPENSION_REQUEST: "Solicitação de suspensão de entrega ao destinatário",
  NOT_DELIVERED: "Objeto não entregue",
  NOT_DELIVERED_INSUFFICIENT_ADDRESS:
    "Objeto não entregue - endereço insuficiente",
  NOT_DELIVERED_WRONG_ADDRESS: "Objeto não entregue - endereço incorreto",
  NOT_DELIVERED_UNKNOWN_CUSTOMER: "Objeto não entregue - cliente desconhecido no local",
  NOT_DELIVERED_NO_ANSWER: "Objeto não entregue - carteiro não atendido",
  NOT_DELIVERED_PICKUP_EXPIRED:
    "Objeto não entregue - prazo de retirada encerrado",
  NOT_FOUND: "Objeto não encontrado",
  DISREGARD_PREVIOUS: "Favor desconsiderar a informação anterior",
  ADDRESS_INCONSISTENCIES: "Inconsistências no endereçamento do objeto",
  ADDRESS_INCONSISTENCIES_WITH_DOT: "Inconsistências no endereçamento do objeto.",
  WILL_BE_RETURNED: "Objeto será devolvido por solicitação do contratante/remetente",
  NOT_ARRIVED_AT_UNIT: "Objeto ainda não chegou à unidade",
  DELIVERED: "Objeto entregue ao destinatário",
  DELIVERED_SMART_BOX: "Objeto entregue na Caixa de Correios Inteligente",
  DELIVERED_TO_SENDER: "Objeto entregue ao remetente",
  CANCELLED: "Cancelado",
  RETURNED: "Devolvido",
} as const;

// Mapeia os status usando exatamente as mesmas labels (sem agrupamento)
export const statusFilterMap: Record<string, string> = {
  "Etiqueta emitida": statusGroups.LABEL_CREATED,
  "Etiqueta cancelada pelo emissor": statusGroups.LABEL_CANCELLED,
  "Etiqueta expirada": statusGroups.LABEL_EXPIRED,
  "Direcionado para entrega em unidade dos Correios a pedido do cliente":
    statusGroups.DIRECTED_TO_POST_OFFICE,
  "Objeto coletado": statusGroups.COLLECTED,
  "Objeto postado": statusGroups.POSTED,
  "Objeto postado após o horário limite da unidade":
    statusGroups.POSTED_AFTER_LIMIT,
  "Objeto em transferência - por favor aguarde": statusGroups.IN_TRANSIT,
  "Objeto em correção de rota": statusGroups.ROUTE_CORRECTION,
  "Objeto saiu para entrega ao destinatário": statusGroups.OUT_FOR_DELIVERY,
  "Objeto saiu para entrega ao remetente": statusGroups.OUT_FOR_RETURN,
  "Objeto encaminhado para retirada no endereço indicado":
    statusGroups.FORWARDED_TO_PICKUP,
  "Objeto aguardando retirada no endereço indicado":
    statusGroups.AWAITING_PICKUP,
  "Saída para entrega cancelada": statusGroups.DELIVERY_CANCELED,
  "Tentativa de entrega não efetuada": statusGroups.DELIVERY_ATTEMPT_FAILED,
  "Solicitação de suspensão de entrega ao destinatário": statusGroups.DELIVERY_SUSPENSION_REQUEST,
  "Objeto não entregue": statusGroups.NOT_DELIVERED,
  "Objeto não entregue - endereço insuficiente":
    statusGroups.NOT_DELIVERED_INSUFFICIENT_ADDRESS,
  "Objeto não entregue - endereço incorreto":
    statusGroups.NOT_DELIVERED_WRONG_ADDRESS,
  "Objeto não entregue - cliente desconhecido no local":
    statusGroups.NOT_DELIVERED_UNKNOWN_CUSTOMER,
  "Objeto não entregue - carteiro não atendido":
    statusGroups.NOT_DELIVERED_NO_ANSWER,
  "Objeto não entregue - prazo de retirada encerrado":
    statusGroups.NOT_DELIVERED_PICKUP_EXPIRED,
  "Objeto não encontrado": statusGroups.NOT_FOUND,
  "Favor desconsiderar a informação anterior": statusGroups.DISREGARD_PREVIOUS,
  "Inconsistências no endereçamento do objeto": statusGroups.ADDRESS_INCONSISTENCIES,
  "Inconsistências no endereçamento do objeto.": statusGroups.ADDRESS_INCONSISTENCIES_WITH_DOT,
  "Objeto será devolvido por solicitação do contratante/remetente": statusGroups.WILL_BE_RETURNED,
  "Objeto ainda não chegou à unidade": statusGroups.NOT_ARRIVED_AT_UNIT,
  "Objeto entregue ao destinatário": statusGroups.DELIVERED,
  "Objeto entregue na Caixa de Correios Inteligente":
    statusGroups.DELIVERED_SMART_BOX,
  "Objeto entregue ao remetente": statusGroups.DELIVERED_TO_SENDER,
  Cancelado: statusGroups.CANCELLED,
  Devolvido: statusGroups.RETURNED,
};

// Mapeia os status detalhados para o status agrupado
export const statusGroupMap: Record<string, string> = {
  // Status de não entregue (agrupa todos os motivos de não entrega em um único status)
  "Objeto não entregue": "Não entregue",
  "Objeto não entregue - endereço insuficiente": "Objeto não entregue",
  "Objeto não entregue - endereço incorreto": "Objeto não entregue",
  "Objeto não entregue - cliente desconhecido no local": "Objeto não entregue",
  "Objeto não entregue - carteiro não atendido": "Objeto não entregue",
  "Objeto não entregue - prazo de retirada encerrado": "Objeto não entregue",
};

// Define os grupos de status para o filtro
const notDeliveredStatuses = [
  TrackingStatus.NAO_ENTREGUE,
  TrackingStatus.NAO_ENTREGUE_ENDERECO_INSUFICIENTE,
  TrackingStatus.NAO_ENTREGUE_ENDERECO_INCORRETO,
  TrackingStatus.NAO_ENTREGUE_CLIENTE_DESCONHECIDO,
  TrackingStatus.NAO_ENTREGUE_CARTEIRO,
  TrackingStatus.NAO_ENTREGUE_PRAZO_ENCERRADO,
] as const;

export const statusFilterGroups = {
  notDelivered: {
    label: "Não entregue",
    statuses: notDeliveredStatuses,
  },
} as const;

type NotDeliveredStatus = (typeof notDeliveredStatuses)[number];

// Função auxiliar para verificar se um status está no grupo de não entregue
export const isNotDeliveredStatus = (
  status: TrackingStatusType
): status is NotDeliveredStatus => {
  return notDeliveredStatuses.includes(status as NotDeliveredStatus);
};

// Grupos de status para organizar o filtro
export const statusCategories = [
  {
    id: "preparation",
    label: "Em preparação",
    statuses: ["Etiqueta emitida", "Carteiro saiu para coleta do objeto", "Etiqueta cancelada pelo emissor", "Etiqueta expirada"],
  },
  {
    id: "in_transit",
    label: "Em trânsito",
    statuses: [
      "Objeto coletado",
      "Objeto postado",
      "Objeto postado após o horário limite da unidade",
      "Objeto em transferência - por favor aguarde",
      "Objeto em correção de rota",
      "Direcionado para entrega em unidade dos Correios a pedido do cliente",
    ],
  },
  {
    id: "out_for_delivery",
    label: "Saiu para entrega",
    statuses: [
      "Objeto saiu para entrega ao destinatário",
      "Objeto saiu para entrega ao remetente",
    ],
  },
  {
    id: "awaiting_pickup",
    label: "Aguardando retirada",
    statuses: [
      "Objeto aguardando retirada no endereço indicado",
      "Objeto encaminhado para retirada no endereço indicado",
    ],
  },
  {
    id: "delivery_issues",
    label: "Problemas na entrega",
    statuses: [
      "Tentativa de entrega não efetuada",
      "Solicitação de suspensão de entrega ao destinatário",
      "Saída para entrega cancelada",
      "Objeto não entregue - carteiro não atendido",
      "Objeto não entregue",
      "Objeto não entregue - endereço insuficiente",
      "Objeto não entregue - endereço incorreto",
      "Objeto não entregue - cliente desconhecido no local",
      "Objeto não entregue - prazo de retirada encerrado",
      "Objeto não encontrado",
      "Favor desconsiderar a informação anterior",
      "Inconsistências no endereçamento do objeto",
      "Inconsistências no endereçamento do objeto.",
      "Objeto será devolvido por solicitação do contratante/remetente",
      "Objeto ainda não chegou à unidade",
    ],
  },
  {
    id: "completed",
    label: "Concluídos",
    statuses: [
      "Objeto entregue ao destinatário",
      "Objeto entregue na Caixa de Correios Inteligente",
      "Objeto entregue ao remetente",
      "Cancelado",
      "Devolvido",
    ],
  },
] as const;

export const deliveryChannelLabelMap: Record<string, string> = {
  delivery: "Delivery",
  "pickup-in-point": "Pickup in point",
};
