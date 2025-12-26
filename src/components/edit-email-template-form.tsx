"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  EmailTemplate,
  useUpdateEmailTemplate,
} from "@/hooks/use-email-templates";
import { EmailTemplateEditor } from "@/components/email-template-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";

const emailTemplateSchema = z.object({
  subject: z.string().min(1, "Assunto é obrigatório"),
  body_html: z.string().min(1, "Conteúdo HTML é obrigatório"),
});

type EmailTemplateFormData = z.infer<typeof emailTemplateSchema>;

interface EditEmailTemplateFormProps {
  template: EmailTemplate;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditEmailTemplateForm({
  template,
  onSuccess,
  onCancel,
}: EditEmailTemplateFormProps) {
  const updateTemplate = useUpdateEmailTemplate();
  const form = useForm<EmailTemplateFormData>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      subject: template.subject,
      body_html: template.body_html,
    },
  });

  const onSubmit = (data: EmailTemplateFormData) => {
    updateTemplate.mutate(
      {
        id: template.id,
        subject: data.subject,
        body_html: data.body_html,
      },
      {
        onSuccess: () => {
          form.reset();
          onSuccess?.();
        },
      }
    );
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form
        id="edit-template-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="overflow-y-auto"
      >
        <div className="px-6 pt-4 pb-6">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel>Assunto:</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex-1 px-6 pb-6">
          <FormField
            control={form.control}
            name="body_html"
            render={({ field }) => (
              <FormItem className="flex flex-col h-full">
                <FormControl>
                  <EmailTemplateEditor
                    value={field.value}
                    onChange={field.onChange}
                    height="350px"
                    className="h-full"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="border-t px-6 py-4 w-full flex flex-col md:flex-row md:justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={updateTemplate.isPending}>
            {updateTemplate.isPending ? (
              <>
                <Spinner /> Salvando
              </>
            ) : (
              "Salvar"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
