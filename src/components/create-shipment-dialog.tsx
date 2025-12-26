"use client";

import axios from "axios";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Trash2,
  ClipboardList,
  Package,
  UserCircle2,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { toast } from "sonner";

import {
  CreateShipmentFormData,
  createShipmentFormSchema,
  Sender,
} from "@/schemas/create-shipment-schema";
import { deliveryChannelLabelMap } from "@/constants/tracking-status";

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
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";

const senders = [
  { value: "L02 OMAR XV236", label: "L02 OMAR XV236" },
  { value: "L03 OMAR XV354", label: "L03 OMAR XV354" },
  { value: "L04 OMAR XV270", label: "L04 OMAR XV270" },
  { value: "L05 OMAR SHOP.COLOMBO", label: "L05 OMAR SHOP.COLOMBO" },
  { value: "L09 OMAR SJP1", label: "L09 OMAR SJP1" },
  { value: "L10 OMAR PINHEIRINHO", label: "L10 OMAR PINHEIRINHO" },
  { value: "L11 OMAR IZAAC", label: "L11 OMAR IZAAC" },
  { value: "L12 OMAR BOQUEIRAO", label: "L12 OMAR BOQUEIRAO" },
  { value: "L13 OMAR SJP2", label: "L13 OMAR SJP2" },
  { value: "L14 OMAR XV573", label: "L14 OMAR XV573" },
  { value: "L15 LOGISTICA", label: "L15 LOGISTICA" },
  { value: "L17 OMAR SHOP.CIDADE", label: "L17 OMAR SHOP.CIDADE" },
  { value: "L18 OMAR WESTPHALEN", label: "L18 OMAR WESTPHALEN" },
  { value: "L19 OMAR RUI BARBOSA", label: "L19 OMAR RUI BARBOSA" },
  { value: "L21 OMAR FRG3", label: "L21 OMAR FRG3" },
  { value: "L23 OMAR ALTO MARACANA", label: "L23 OMAR ALTO MARACANA" },
  { value: "L25 OMAR ECOMMERCE", label: "L25 OMAR ECOMMERCE" },
  { value: "L26 OMAR ARAUCARIA", label: "L26 OMAR ARAUCARIA" },
  { value: "L27 OMAR FRG4", label: "L27 OMAR FRG4" },
  { value: "L28 OMAR FRG1", label: "L28 OMAR FRG1" },
  { value: "L29 OMAR CAMPO LARGO", label: "L29 OMAR CAMPO LARGO" },
  { value: "L30 OMAR PINHAIS", label: "L30 OMAR PINHAIS" },
  { value: "L31 OMAR TELEMACO BORBA", label: "L31 OMAR TELEMACO BORBA" },
  { value: "L32 OMAR SHOP.JARDIM", label: "L32 OMAR SHOP.JARDIM" },
  { value: "L33 OMAR PONTA GROSSA", label: "L33 OMAR PONTA GROSSA" },
  { value: "L34 OMAR ALM.TAMANDARE", label: "L34 OMAR ALM.TAMANDARE" },
  { value: "L35 OMAR CASCAVEL", label: "L35 OMAR CASCAVEL" },
  { value: "L36 OMAR PATO BRANCO", label: "L36 OMAR PATO BRANCO" },
  { value: "L38 OMAR SHOP.JOCKEY", label: "L38 OMAR SHOP.JOCKEY" },
  { value: "L39 OMAR SHOPPALLADIUM", label: "L39 OMAR SHOPPALLADIUM" },
  { value: "L40 OMAR SHOP.PATO BCO", label: "L40 OMAR SHOP.PATO BCO" },
  { value: "L41 OMAR PIRAQUARA", label: "L41 OMAR PIRAQUARA" },
] as const;

export function CreateShipmentDialog() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [senderOpen, setSenderOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
    trigger,
  } = useForm<CreateShipmentFormData>({
    resolver: zodResolver(createShipmentFormSchema),
    defaultValues: {
      name: "",
      cpf: "",
      email: "",
      contact: undefined,
      order_id: "",
      tracking_code: "",
      sender: "L25 OMAR ECOMMERCE",
      delivery_channel: "delivery",
      category: "sedex",
      products: [
        {
          id: "",
          name: "",
          quantity: 1,
          price: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const onSubmit = async (data: CreateShipmentFormData) => {
    // Prevenir submit se não estiver no último step
    if (currentStep < 2) {
      return;
    }

    try {
      await axios.post("/api/shipments", data);

      toast.success("Envio criado com sucesso!");

      // Resetar o formulário e fechar o dialog
      reset();
      setOpen(false);
      setCurrentStep(0);
    } catch (error) {
      console.error("Erro ao criar envio:", error);

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error || "Erro ao criar envio";
        toast.error(errorMessage);
      } else {
        toast.error("Erro ao criar envio. Tente novamente.");
      }
    }
  };

  const deliveryChannel = watch("delivery_channel");
  const category = watch("category");

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevenir qualquer comportamento de submit
    e.stopPropagation(); // Prevenir propagação do evento

    let isValid = false;

    // Validar campos baseado no step atual
    if (currentStep === 0) {
      isValid = await trigger(["name", "cpf", "email", "contact"]);
    } else if (currentStep === 1) {
      isValid = await trigger([
        "order_id",
        "tracking_code",
        "sender",
        "delivery_channel",
        "category",
      ]);
    }

    // Avançar para o próximo step se válido após uma pequena pausa
    if (isValid && currentStep < 2) {
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
        <Button variant="outline">
          <Plus />
          Criar envio
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="border-b p-6">
          <DialogTitle>Criar novo envio</DialogTitle>
          <DialogDescription>
            Preencha as informações para criar um novo envio.
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
                    <ClipboardList size={14} aria-hidden="true" />
                  </StepperIndicator>
                  <StepperTitle>Informações do pedido</StepperTitle>
                </StepperTrigger>
                <StepperSeparator className="absolute inset-x-0 top-3 left-[calc(50%+0.75rem+0.125rem)] -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
              </StepperItem>

              <StepperItem step={2} className="relative flex-1 flex-col!">
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
          <form id="create-shipment-form" onSubmit={handleSubmit(onSubmit)}>
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

              {/* Step 1: Informações do pedido */}
              {currentStep === 1 && (
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="order_id">Número do pedido</FieldLabel>
                    <FieldContent>
                      <Input
                        id="order_id"
                        placeholder="Digite o número do pedido"
                        aria-invalid={!!errors.order_id}
                        {...register("order_id")}
                      />
                      <FieldError errors={[errors.order_id]} />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="tracking_code">
                      Código de rastreio
                    </FieldLabel>
                    <FieldContent>
                      <Input
                        id="tracking_code"
                        placeholder="Digite o código de rastreio"
                        aria-invalid={!!errors.tracking_code}
                        {...register("tracking_code")}
                      />
                      <FieldError errors={[errors.tracking_code]} />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="sender">Remetente</FieldLabel>
                    <FieldContent>
                      <Popover open={senderOpen} onOpenChange={setSenderOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            id="sender"
                            variant="outline"
                            role="combobox"
                            aria-expanded={senderOpen}
                            aria-invalid={!!errors.sender}
                            className="w-full justify-between font-normal"
                          >
                            {watch("sender")
                              ? senders.find(
                                  (sender) => sender.value === watch("sender")
                                )?.label
                              : "Selecione o remetente..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                          <Command>
                            <CommandInput
                              placeholder="Buscar remetente..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                Nenhum remetente encontrado.
                              </CommandEmpty>
                              <CommandGroup>
                                {senders.map((sender) => (
                                  <CommandItem
                                    key={sender.value}
                                    value={sender.value}
                                    onSelect={(currentValue) => {
                                      setValue(
                                        "sender",
                                        currentValue as Sender
                                      );
                                      setSenderOpen(false);
                                    }}
                                  >
                                    {sender.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        watch("sender") === sender.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FieldError errors={[errors.sender]} />
                    </FieldContent>
                  </Field>

                  <FieldSet>
                    <FieldTitle>Canal de entrega</FieldTitle>
                    <RadioGroup
                      value={deliveryChannel}
                      onValueChange={(value) =>
                        setValue(
                          "delivery_channel",
                          value as "delivery" | "pickup-in-point"
                        )
                      }
                      aria-invalid={!!errors.delivery_channel}
                      className="w-full"
                    >
                      <FieldLabel htmlFor="delivery">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>
                              {deliveryChannelLabelMap.delivery}
                            </FieldTitle>
                          </FieldContent>
                          <RadioGroupItem value="delivery" id="delivery" />
                        </Field>
                      </FieldLabel>
                      <FieldLabel htmlFor="pickup-in-point">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>
                              {deliveryChannelLabelMap["pickup-in-point"]}
                            </FieldTitle>
                          </FieldContent>
                          <RadioGroupItem
                            value="pickup-in-point"
                            id="pickup-in-point"
                          />
                        </Field>
                      </FieldLabel>
                    </RadioGroup>
                    <FieldError errors={[errors.delivery_channel]} />
                  </FieldSet>

                  <FieldSet>
                    <FieldTitle>Categoria</FieldTitle>
                    <RadioGroup
                      value={category}
                      onValueChange={(value) =>
                        setValue("category", value as "sedex" | "pac")
                      }
                      aria-invalid={!!errors.category}
                      className="w-full"
                    >
                      <FieldLabel htmlFor="sedex">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>SEDEX</FieldTitle>
                          </FieldContent>
                          <RadioGroupItem value="sedex" id="sedex" />
                        </Field>
                      </FieldLabel>
                      <FieldLabel htmlFor="pac">
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>PAC</FieldTitle>
                          </FieldContent>
                          <RadioGroupItem value="pac" id="pac" />
                        </Field>
                      </FieldLabel>
                    </RadioGroup>
                    <FieldError errors={[errors.category]} />
                  </FieldSet>
                </FieldGroup>
              )}

              {/* Step 2: Objetos (Produtos) */}
              {currentStep === 2 && (
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
                          size="icon"
                          className="absolute top-2 right-2 hover:text-red-500"
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

            {currentStep < 2 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Próximo
              </Button>
            ) : (
              <Button type="submit" form="create-shipment-form" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner /> Criando...
                  </>
                ) : (
                  "Criar envio"
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
