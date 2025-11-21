"use client";

import axios from "axios";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2, Package, UserCircle2 } from "lucide-react";
import { toast } from "sonner";

import {
  EditShipmentFormData,
  editShipmentSchema,
} from "@/schemas/edit-shipment-schema";
import { Tracking } from "@/schemas/tracking-schema";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";

interface EditShipmentDialogProps {
  tracking: Tracking;
  asDropdownItem?: boolean;
}

export function EditShipmentDialog({ tracking, asDropdownItem = false }: EditShipmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<EditShipmentFormData>({
    resolver: zodResolver(editShipmentSchema),
    defaultValues: {
      name: tracking.name,
      cpf: tracking.cpf,
      email: tracking.email,
      contact: tracking.contact,
      products: tracking.products,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const onSubmit = async (data: EditShipmentFormData) => {
    // Prevenir submit se não estiver no último step
    if (currentStep < 1) {
      return;
    }

    try {
      await axios.patch(`/api/shipments/${tracking.id}`, data);

      toast.success("Envio atualizado com sucesso!");

      // Fechar o dialog - o realtime do Supabase atualizará os dados automaticamente
      setOpen(false);
      setCurrentStep(0);
    } catch (error) {
      console.error("Erro ao salvar:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Erro ao atualizar envio";
        toast.error(errorMessage);
      } else {
        toast.error("Erro ao atualizar envio. Tente novamente.");
      }
    }
  };

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevenir qualquer comportamento de submit
    e.stopPropagation(); // Prevenir propagação do evento

    let isValid = false;

    // Validar campos baseado no step atual
    if (currentStep === 0) {
      isValid = await trigger(["name", "cpf", "email", "contact"]);
    }

    // Avançar para o próximo step se válido após uma pequena pausa
    if (isValid && currentStep < 1) {
      // Adicionar um pequeno delay para evitar que o clique seja capturado pelo próximo botão
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 50);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setCurrentStep(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {asDropdownItem ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Pencil />
            Editar
          </DropdownMenuItem>
        ) : (
          <Button variant="ghost" size="icon-sm">
            <Pencil />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="border-b p-6">
          <DialogTitle>Editar envio</DialogTitle>
          <DialogDescription>
            Edite as informações do envio #{tracking.order_id}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6">
          {/* Stepper */}
          <Stepper value={currentStep} onValueChange={setCurrentStep}>
            <StepperItem step={0} className="relative flex-1 flex-col!">
              <StepperTrigger className="flex-col gap-3 rounded">
                <StepperIndicator asChild>
                  <UserCircle2 size={14} aria-hidden="true" />
                </StepperIndicator>
                <StepperTitle>Dados do cliente</StepperTitle>
              </StepperTrigger>
              <StepperSeparator className="absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
            </StepperItem>

            <StepperItem step={1} className="relative flex-1 flex-col!">
              <StepperTrigger className="flex-col gap-3 rounded">
                <StepperIndicator asChild>
                  <Package size={14} aria-hidden="true" />
                </StepperIndicator>
                <StepperTitle>Objetos</StepperTitle>
              </StepperTrigger>
            </StepperItem>
          </Stepper>
        </div>

        <div className="p-6">
          <form id="edit-shipment-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="min-h-[400px]">
              {/* Step 0: Dados do cliente */}
              {currentStep === 0 && (
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Nome do cliente</FieldLabel>
                    <FieldContent>
                      <Input
                        id="name"
                        placeholder="Digite o nome do cliente"
                        aria-invalid={!!errors.name}
                        {...register("name")}
                      />
                      <FieldError errors={[errors.name]} />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="cpf">CPF</FieldLabel>
                    <FieldContent>
                      <Input
                        id="cpf"
                        placeholder="00000000000"
                        aria-invalid={!!errors.cpf}
                        {...register("cpf")}
                      />
                      <FieldError errors={[errors.cpf]} />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <FieldContent>
                      <Input
                        id="email"
                        type="email"
                        placeholder="cliente@exemplo.com"
                        aria-invalid={!!errors.email}
                        {...register("email")}
                      />
                      <FieldError errors={[errors.email]} />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="contact">Contato</FieldLabel>
                    <FieldContent>
                      <Input
                        id="contact"
                        type="tel"
                        placeholder="51995638460"
                        aria-invalid={!!errors.contact}
                        {...register("contact", {
                          setValueAs: (value) => value === "" ? undefined : Number(value)
                        })}
                      />
                      <FieldError errors={[errors.contact]} />
                    </FieldContent>
                  </Field>
                </FieldGroup>
              )}

              {/* Step 1: Objetos (Produtos) */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border rounded-md space-y-4 relative"
                    >
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="absolute top-1 right-1 hover:text-red-500 rounded-full"
                          onClick={() => remove(index)}
                        >
                          <Trash2 />
                        </Button>
                      )}

                      <Field>
                        <FieldLabel htmlFor={`products.${index}.id`}>
                          Código do produto
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            id={`products.${index}.id`}
                            placeholder="Digite o código"
                            aria-invalid={!!errors.products?.[index]?.id}
                            {...register(`products.${index}.id`)}
                          />
                          <FieldError errors={[errors.products?.[index]?.id]} />
                        </FieldContent>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor={`products.${index}.name`}>
                          Nome do produto
                        </FieldLabel>
                        <FieldContent>
                          <Input
                            id={`products.${index}.name`}
                            placeholder="Digite o nome"
                            aria-invalid={!!errors.products?.[index]?.name}
                            {...register(`products.${index}.name`)}
                          />
                          <FieldError
                            errors={[errors.products?.[index]?.name]}
                          />
                        </FieldContent>
                      </Field>

                      <div className="grid grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel htmlFor={`products.${index}.quantity`}>
                            Quantidade
                          </FieldLabel>
                          <FieldContent>
                            <Input
                              id={`products.${index}.quantity`}
                              type="number"
                              min="1"
                              placeholder="1"
                              aria-invalid={
                                !!errors.products?.[index]?.quantity
                              }
                              {...register(`products.${index}.quantity`, {
                                valueAsNumber: true,
                              })}
                            />
                            <FieldError
                              errors={[errors.products?.[index]?.quantity]}
                            />
                          </FieldContent>
                        </Field>

                        <Field>
                          <FieldLabel htmlFor={`products.${index}.price`}>
                            Preço
                          </FieldLabel>
                          <FieldContent>
                            <InputGroup>
                              <InputGroupAddon>
                                <InputGroupText>R$</InputGroupText>
                              </InputGroupAddon>
                              <InputGroupInput
                                id={`products.${index}.price`}
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                aria-invalid={!!errors.products?.[index]?.price}
                                {...register(`products.${index}.price`, {
                                  valueAsNumber: true,
                                })}
                              />
                              <InputGroupAddon align="inline-end">
                                <InputGroupText>BRL</InputGroupText>
                              </InputGroupAddon>
                            </InputGroup>
                            <FieldError
                              errors={[errors.products?.[index]?.price]}
                            />
                          </FieldContent>
                        </Field>
                      </div>
                    </div>
                  ))}

                  {errors.products &&
                    typeof errors.products.message === "string" && (
                      <FieldError>
                        <span>{errors.products.message}</span>
                      </FieldError>
                    )}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      append({
                        id: "",
                        name: "",
                        quantity: 1,
                        price: 0,
                      })
                    }
                  >
                    <Plus />
                    Adicionar produto
                  </Button>
                </div>
              )}
            </div>
          </form>
        </div>

        <DialogFooter className="border-t">
          <div className="flex items-center justify-end gap-2 w-full p-6">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
              >
                Voltar
              </Button>
            )}

            {currentStep < 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Próximo
              </Button>
            ) : (
              <Button type="submit" form="edit-shipment-form" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner /> Salvando...
                  </>
                ) : (
                  "Salvar alterações"
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
