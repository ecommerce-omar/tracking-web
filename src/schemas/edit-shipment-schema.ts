import { z } from "zod";
import { isValidCpf } from "@/utils/is-valid-cpf";

export const editShipmentProductSchema = z.object({
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

export const editShipmentSchema = z.object({
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
  products: z
    .array(editShipmentProductSchema)
    .min(1, "Pelo menos um produto é obrigatório"),
});

export type EditShipmentFormData = z.infer<typeof editShipmentSchema>;
export type EditShipmentProduct = z.infer<typeof editShipmentProductSchema>;
