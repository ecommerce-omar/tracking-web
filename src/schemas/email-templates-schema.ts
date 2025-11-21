import { z } from "zod";

export const validTemplateStatuses = z.enum([
  "Objeto entregue",
  "Saiu para entrega",
  "Aguardando retirada",
  "Não entregue",
  "Saída cancelada",
  "Em transferência",
  "Postado",
  "Coletado",
  "Etiqueta emitida",
]);

export const templateVariablesSchema = z.object({
  detail: z.string().describe("detalhes"),
  products: z.string().describe("lista de produtos"),
  origin_unit: z.string().describe("unidade de origem"),
  customer_name: z.string().describe("nome do cliente"),
  tracking_code: z.string().describe("código de rastreamento"),
  destination_unit: z.string().describe("unidade de destino"),
  unit_address: z.string().describe("endereço da unidade"),
  unit_cep: z.string().describe("CEP da unidade"),
  status: z.string().describe("status do rastreamento"),
});

export const emailTemplateSchema = z.object({
  name: validTemplateStatuses,
  subject: z.string().min(1, "Assunto é obrigatório"),
  body_html: z.string().min(1, "Corpo HTML é obrigatório"),
  body_text: z.string().min(1, "Corpo texto é obrigatório"),
  variables: z.record(z.string(), z.string()).default({
    detail: "{{detail}}",
    products: "{{products}}",
    origin_unit: "{{origin_unit}}",
    customer_name: "{{customer_name}}",
    tracking_code: "{{tracking_code}}",
    destination_unit: "{{destination_unit}}",
    unit_address: "{{unit_address}}",
    unit_cep: "{{unit_cep}}",
    status: "{{status}}",
  }),
  is_active: z.boolean().default(true),
  category: z.string().optional(),
});

export const updateEmailTemplateSchema = emailTemplateSchema.partial();

export const testEmailSchema = z.object({
  email: z.string().email("Email deve ter um formato válido"),
});

export type EmailTemplateFormData = z.infer<typeof emailTemplateSchema>;
export type UpdateEmailTemplateFormData = z.infer<
  typeof updateEmailTemplateSchema
>;
