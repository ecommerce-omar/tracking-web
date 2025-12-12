"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  EmailTemplate,
  useUpdateEmailTemplate,
} from "@/hooks/use-email-templates";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

const isActiveSchema = z.object({
  is_active: z.boolean(),
});

type IsActiveFormData = z.infer<typeof isActiveSchema>;

interface IsActiveEmailTemplateFormProps {
  template: EmailTemplate;
}

export function IsActiveEmailTemplateForm({
  template,
}: IsActiveEmailTemplateFormProps) {
  const updateTemplate = useUpdateEmailTemplate();

  const form = useForm<IsActiveFormData>({
    resolver: zodResolver(isActiveSchema),
    defaultValues: {
      is_active: template.is_active,
    },
  });

  const onSubmit = (data: IsActiveFormData) => {
    updateTemplate.mutate(
      {
        id: template.id,
        is_active: data.is_active,
      },
      {
        onSuccess: () => {
          toast.success(
            data.is_active
              ? "Template ativado com sucesso!"
              : "Template desativado com sucesso!"
          );
        },
        onError: (error) => {
          console.error("Erro ao atualizar template:", error);
          toast.error("Erro ao atualizar status do template. Tente novamente.");
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Status do Template</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    form.handleSubmit(onSubmit)();
                  }}
                  disabled={updateTemplate.isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
