"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  trackingCodeSchema,
  TrackingCodeFormData,
} from "@/schemas/tracking-schema";
import { Tracking } from "@/schemas/tracking-schema";

import { Search } from "lucide-react";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

type TrackingFormProps = {
  value: string | undefined;
  onSearch: (result: Tracking | undefined, code: string) => void;
};

export function TrackingCodeForm({ onSearch, value }: TrackingFormProps) {
  const form = useForm<TrackingCodeFormData>({
    resolver: zodResolver(trackingCodeSchema),
    defaultValues: { trackingCode: value || "" },
  });

  useEffect(() => {
    form.reset({ trackingCode: value || "" }, {
      keepErrors: false,
      keepDirty: false,
      keepIsSubmitted: false,
      keepTouched: false,
      keepIsValid: false,
      keepSubmitCount: false
    });
  }, [value, form]);

  function onSubmit(formValue: TrackingCodeFormData) {
    onSearch(undefined, formValue.trackingCode.trim());
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Controller
        name="trackingCode"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="space-y-1">
            <FieldLabel htmlFor={field.name} className="sr-only">
              Código de rastreio
            </FieldLabel>
            <InputGroup className="max-w-sm">
              <InputGroupInput
                {...field}
                id={field.name}
                required
                type="search"
                placeholder="AA123456785BR"
                aria-invalid={fieldState.invalid}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </form>
  );
}
