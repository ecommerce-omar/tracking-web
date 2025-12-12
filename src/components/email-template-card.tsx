"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import { EmailTemplate } from "@/hooks/use-email-templates";
import { EditEmailTemplateForm } from "@/components/edit-email-template-form";
import { IsActiveEmailTemplateForm } from "@/components/is-active-email-template-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


export function EmailTemplateCard({ template }: { template: EmailTemplate }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{template.name}</CardTitle>
        <CardDescription>{template.subject}</CardDescription>
        <CardAction>
          <IsActiveEmailTemplateForm template={template} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Edit className="w-4 h-4" />
              Editar Template
            </Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg max-h-[90vh] [&>button:last-child]:top-3.5 ">
            <DialogHeader className="contents space-y-0 text-left">
              <DialogTitle className="border-b px-6 py-4 text-base">
                {template.name}
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="sr-only">
              Edite o assunto e conteúdo HTML do template de email.
            </DialogDescription>
            <EditEmailTemplateForm
              template={template}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
