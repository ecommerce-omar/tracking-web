"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Search } from "lucide-react";
import { cpfSearchSchema, type CpfSearchFormData } from "@/schemas/cpf-search-schema";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

interface TrackingCpfFormProps {
  onSearch: (cpf: string) => void;
  onClear?: () => void;
  isLoading?: boolean;
  showClearButton?: boolean;
}

export function TrackingCpfForm({
  onSearch,
  isLoading = false,
}: TrackingCpfFormProps) {
  const form = useForm<CpfSearchFormData>({
    resolver: zodResolver(cpfSearchSchema),
    defaultValues: {
      cpf: "",
    },
  });

  const onSubmit = (data: CpfSearchFormData) => {
    onSearch(data.cpf);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="cpf"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name} className="sr-only">
              CPF do cliente
            </FieldLabel>
            <InputGroup className="max-w-sm">
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                {...field}
                id={field.name}
                placeholder="Digite o CPF"
                required
                type="search"
                disabled={isLoading}
                aria-invalid={fieldState.invalid}
              />
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
}
