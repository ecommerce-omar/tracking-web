import { Tracking, TrackingEvent, TrackingStatusType } from "@/schemas/tracking-schema";
import {
  FileText,
  Package,
  Truck,
  Clock,
  MapPin,
  MapPinOff,
  Ban,
  Undo2,
  CheckIcon,
  type LucideIcon,
  X,
  AlertTriangle,
  Info,
} from "lucide-react";
import { formatDateBR, formatDateTimeBR } from "@/utils/format-date";
import { linkifyText } from "@/utils/linkify-text";

import { TypographySmall } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export const currentStatusIconMap: Record<TrackingStatusType, LucideIcon> = {
  "Etiqueta emitida": FileText,
  "Etiqueta cancelada pelo emissor": Ban,
  "Etiqueta expirada": Ban,
  "Carteiro saiu para coleta do objeto": Truck,
  "Objeto coletado": Package,
  "Objeto postado": Package,
  "Objeto postado após o horário limite da unidade": Package,
  "Objeto em transferência - por favor aguarde": Clock,
  "Objeto saiu para entrega ao destinatário": Truck,
  "Objeto saiu para entrega ao remetente": Truck,
  "Objeto em correção de rota": Truck,
  "Direcionado para entrega em unidade dos Correios a pedido do cliente": MapPin,
  "Objeto encaminhado para retirada no endereço indicado": MapPin,
  "Objeto aguardando retirada no endereço indicado": MapPin,
  "Tentativa de entrega não efetuada": AlertTriangle,
  "Solicitação de suspensão de entrega ao destinatário": Ban,
  "Objeto não entregue": X,
  "Objeto não entregue - endereço insuficiente": MapPinOff,
  "Objeto não entregue - endereço incorreto": MapPinOff,
  "Objeto não entregue - cliente desconhecido no local": MapPinOff,
  "Objeto não entregue - carteiro não atendido": X,
  "Objeto não entregue - prazo de retirada encerrado": X,
  "Favor desconsiderar a informação anterior": Info,
  "Inconsistências no endereçamento do objeto": AlertTriangle,
  "Inconsistências no endereçamento do objeto.": AlertTriangle,
  "Objeto não encontrado": MapPinOff,
  "Objeto ainda não chegou à unidade": Clock,
  "Objeto entregue ao destinatário": CheckIcon,
  "Objeto entregue ao remetente": CheckIcon,
  "Objeto entregue na Caixa de Correios Inteligente": CheckIcon,
  "Objeto será devolvido por solicitação do contratante/remetente": Undo2,
  "Saída para entrega cancelada": Ban,
  Cancelado: Ban,
  Devolvido: Undo2,
};

export function TimelineEvents({ data }: { data: Tracking }) {
  const { category, dt_expected, events, sender, current_status } = data;

  if (events.length < 1 || current_status === "Objeto não encontrado") {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MapPinOff />
          </EmptyMedia>
          <EmptyTitle>
            {current_status === "Objeto não encontrado"
              ? "Objeto não encontrado"
              : "Nenhum evento encontrado"}
          </EmptyTitle>
          <EmptyDescription>
            {current_status === "Objeto não encontrado"
              ? "Este objeto não foi encontrado no sistema dos Correios."
              : "Este rastreio ainda não possui eventos registrados."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    data && (
      <div className="space-y-6">
        <div className="flex flex-col gap-3">
          <Badge className="capitalize" variant="secondary">
            {category}
          </Badge>
          <TypographySmall>
            Remetente:{" "}
            <span className="font-medium text-foreground">
              {sender}
            </span>
          </TypographySmall>
          <TypographySmall>
            {dt_expected ? (
              <>
                Previsão de entrega:{" "}
                <span className="font-medium text-foreground">
                  {formatDateBR(dt_expected)}
                </span>
              </>
            ) : (
              "Ainda não há previsão de entrega"
            )}
          </TypographySmall>
        </div>

        <Timeline defaultValue={events.length - 1}>
          {events.map((event: TrackingEvent, index: number) => {
            const { date, location, status, destinationUnit, originUnit, detail } = event;
            const Icon = currentStatusIconMap[status as TrackingStatusType];

            return (
              <TimelineItem
                key={index}
                step={index}
                className="group-data-[orientation=vertical]/timeline:ms-10"
              >
                <TimelineHeader>
                  <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />

                  <TimelineDate>{date && formatDateTimeBR(date)}</TimelineDate>
                  <TimelineTitle>{status}</TimelineTitle>

                  <TimelineIndicator className="group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
                    <Icon
                      className="group-not-data-completed/timeline-item:hidden"
                      size={16}
                    />
                  </TimelineIndicator>
                </TimelineHeader>
                {detail && <TimelineContent>{linkifyText(detail)}</TimelineContent>}

                {(status === "Objeto aguardando retirada no endereço indicado" || status === "Objeto encaminhado para retirada no endereço indicado") && <TimelineContent>
                  <div className="flex flex-col">
                    <span>{event.unitAddress?.logradouro}, {event.unitAddress?.numero}</span>
                    <span>{event.unitAddress?.bairro}</span>
                  </div>

                </TimelineContent>}

                {originUnit && destinationUnit && (
                  <TimelineContent>
                    <div className="flex flex-col">
                      <span>de{" "}{originUnit}</span>
                      <span>para{" "}{destinationUnit}</span>
                    </div>
                  </TimelineContent>
                )}

                {location && <TimelineContent>{location}</TimelineContent>}
              </TimelineItem>
            );
          })}
        </Timeline>
      </div>
    )
  );
}
