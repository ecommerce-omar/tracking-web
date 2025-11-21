import { z } from "zod";
import { isValidCpf } from "@/utils/is-valid-cpf";

export const cpfSearchSchema = z.object({
  cpf: z
    .string()
    .nonempty({ message: "CPF é obrigatório" })
    .refine((value) => isValidCpf(value), {
      message: "CPF inválido",
    }),
});

export type CpfSearchFormData = z.infer<typeof cpfSearchSchema>;
