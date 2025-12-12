import { z } from "zod";
import { isValidCpf } from "@/utils/is-valid-cpf";

export const createShipmentProductSchema = z.object({
  id: z.string().min(1, "ID do produto é obrigatório"),
  name: z.string().min(1, "Nome do produto é obrigatório"),
  quantity: z
    .number({ message: "Quantidade é obrigatória" })
    .min(1, "Quantidade deve ser pelo menos 1")
    .int("Quantidade deve ser um número inteiro"),
  price: z
    .number({ message: "Preço é obrigatório" })
    .min(0, "Preço deve ser positivo"),
});

export const trackingCategorySchema = z.enum(["sedex", "pac"], {
  message: "Categoria é obrigatória",
});

export const trackingDeliveryChannelSchema = z.enum(
  ["delivery", "pickup-in-point"],
  {
    message: "Canal de entrega é obrigatório",
  }
);

export const senderSchema = z.enum(
  [
    "L02 OMAR XV236",
    "L03 OMAR XV354",
    "L04 OMAR XV270",
    "L05 OMAR SHOP.COLOMBO",
    "L09 OMAR SJP1",
    "L10 OMAR PINHEIRINHO",
    "L11 OMAR IZAAC",
    "L12 OMAR BOQUEIRAO",
    "L13 OMAR SJP2",
    "L14 OMAR XV573",
    "L15 LOGISTICA",
    "L17 OMAR SHOP.CIDADE",
    "L18 OMAR WESTPHALEN",
    "L19 OMAR RUI BARBOSA",
    "L21 OMAR FRG3",
    "L23 OMAR ALTO MARACANA",
    "L25 OMAR ECOMMERCE",
    "L26 OMAR ARAUCARIA",
    "L27 OMAR FRG4",
    "L28 OMAR FRG1",
    "L29 OMAR CAMPO LARGO",
    "L30 OMAR PINHAIS",
    "L31 OMAR TELEMACO BORBA",
    "L32 OMAR SHOP.JARDIM",
    "L33 OMAR PONTA GROSSA",
    "L34 OMAR ALM.TAMANDARE",
    "L35 OMAR CASCAVEL",
    "L36 OMAR PATO BRANCO",
    "L38 OMAR SHOP.JOCKEY",
    "L39 OMAR SHOPPALLADIUM",
    "L40 OMAR SHOP.PATO BCO",
    "L41 OMAR PIRAQUARA",
  ],
  {
    message: "Remetente é obrigatório",
  }
);

// Schema para validação do formulário (input)
export const createShipmentFormSchema = z.object({
  name: z.string().min(1, "Nome do cliente é obrigatório"),
  cpf: z
    .string()
    .min(1, "CPF é obrigatório")
    .refine((value) => isValidCpf(value), {
      message: "CPF inválido",
    }),
  email: z.string().email("Email inválido"),
  contact: z
    .number({ message: "Número de contato é obrigatório" })
    .int("Número de contato deve ser um número inteiro")
    .min(1000000000, "Número de contato deve conter 11 dígitos")
    .max(99999999999, "Número de contato inválido"),
  order_id: z
    .string()
    .min(6, "Número do pedido deve conter no mínimo 6 dígitos"),
  tracking_code: z
    .string()
    .min(1, "Código de rastreio é obrigatório")
    .regex(
      /^[A-Z0-9]+$/,
      "Código deve conter apenas letras maiúsculas e números"
    ),
  sender: senderSchema,
  category: trackingCategorySchema,
  delivery_channel: trackingDeliveryChannelSchema,
  products: z
    .array(createShipmentProductSchema)
    .min(1, "Pelo menos um produto é obrigatório"),
});

// Schema com transformação para API (output)
export const createShipmentSchema = createShipmentFormSchema.transform((data) => ({
  ...data,
  order_id: Number(data.order_id),
}));

export type CreateShipmentFormData = z.infer<typeof createShipmentFormSchema>;
export type CreateShipmentProduct = z.infer<typeof createShipmentProductSchema>;
export type Sender = z.infer<typeof senderSchema>;
