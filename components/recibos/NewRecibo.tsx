"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { generarReciboPDF } from "@/lib/pdf-generator";

// Función para convertir números a letras
function numeroALetras(num: number): string {
  const unidades = [
    "",
    "UN",
    "DOS",
    "TRES",
    "CUATRO",
    "CINCO",
    "SEIS",
    "SIETE",
    "OCHO",
    "NUEVE",
  ];
  const decenas = [
    "",
    "DIEZ",
    "VEINTE",
    "TREINTA",
    "CUARENTA",
    "CINCUENTA",
    "SESENTA",
    "SETENTA",
    "OCHENTA",
    "NOVENTA",
  ];
  const especiales = [
    "DIEZ",
    "ONCE",
    "DOCE",
    "TRECE",
    "CATORCE",
    "QUINCE",
    "DIECISÉIS",
    "DIECISIETE",
    "DIECIOCHO",
    "DIECINUEVE",
  ];
  const centenas = [
    "",
    "CIENTO",
    "DOSCIENTOS",
    "TRESCIENTOS",
    "CUATROCIENTOS",
    "QUINIENTOS",
    "SEISCIENTOS",
    "SETECIENTOS",
    "OCHOCIENTOS",
    "NOVECIENTOS",
  ];

  if (num === 0) return "CERO";

  const parteEntera = Math.floor(num);
  const centavos = Math.round((num - parteEntera) * 100);

  function convertirGrupo(n: number): string {
    if (n === 0) return "";
    if (n === 1) return "UN";
    if (n === 100) return "CIEN";

    let resultado = "";

    // Centenas
    const c = Math.floor(n / 100);
    if (c > 0) resultado += centenas[c];

    const resto = n % 100;

    if (resto >= 10 && resto < 20) {
      resultado += (resultado ? " " : "") + especiales[resto - 10];
    } else {
      const d = Math.floor(resto / 10);
      const u = resto % 10;

      if (d > 0) {
        resultado += (resultado ? " " : "") + decenas[d];
        if (u > 0) {
          resultado += d === 2 ? "" : " Y";
        }
      }

      if (u > 0) {
        resultado += (resultado ? " " : "") + unidades[u];
      }
    }

    return resultado;
  }

  function convertirNumero(n: number): string {
    if (n === 0) return "CERO";

    const miles = Math.floor(n / 1000);
    const cientos = n % 1000;

    let resultado = "";

    if (miles > 0) {
      if (miles === 1) {
        resultado = "MIL";
      } else {
        resultado = convertirGrupo(miles) + " MIL";
      }
    }

    if (cientos > 0) {
      resultado +=
        (resultado ? " " : "") + convertirGrupo(cientos).replace(/^UN$/, "UNO");
    }

    return resultado;
  }

  const letras = convertirNumero(parteEntera);
  const centavosStr = centavos.toString().padStart(2, "0");

  // Capitalizar primera letra y resto en minúsculas
  const resultado = letras.charAt(0) + letras.slice(1).toLowerCase();

  return `${resultado} pesos ${centavosStr}/100 M.N.`;
}

// Datos mock de formas de pago
const formasPago = [
  { value: "efectivo", label: "Efectivo" },
  { value: "transferencia", label: "Transferencia" },
  { value: "cheque", label: "Cheque" },
  { value: "tarjeta", label: "Tarjeta de Crédito/Débito" },
];

// Datos mock de receptores (usuarios que pueden recibir pagos)
const receptores = [
  { id: "rec-1", name: "MIGUEL GUTIERREZ" },
  { id: "rec-2", name: "PATRICIA MORALES" },
  { id: "rec-3", name: "CARLOS MENDOZA" },
  { id: "rec-4", name: "JORGE HERNÁNDEZ" },
  { id: "rec-5", name: "MIGUEL ÁNGEL CASTRO" },
];

const formSchema = z.object({
  recibiDe: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(100, "El nombre debe tener máximo 100 caracteres."),
  cantidad: z
    .string()
    .min(1, "La cantidad es requerida.")
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
      "Ingresa una cantidad válida mayor a 0",
    ),
  concepto: z
    .string()
    .min(5, "El concepto debe tener al menos 5 caracteres.")
    .max(200, "El concepto debe tener máximo 200 caracteres."),
  formaPago: z.string().min(1, "Selecciona una forma de pago."),
  fechaPago: z.string().min(1, "Selecciona una fecha de pago."),
  observaciones: z
    .string()
    .max(300, "Las observaciones deben tener máximo 300 caracteres.")
    .optional(),
  receptorId: z.string().min(1, "Selecciona el receptor del pago."),
});

export function NewRecibo() {
  const [openFormaPago, setOpenFormaPago] = useState(false);
  const [openReceptor, setOpenReceptor] = useState(false);
  const [totalLetras, setTotalLetras] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recibiDe: "",
      cantidad: "",
      concepto: "",
      formaPago: "",
      fechaPago: new Date().toISOString().split("T")[0],
      observaciones: "",
      receptorId: "",
    },
  });

  const selectedFormaPago = form.watch("formaPago");
  const selectedReceptor = form.watch("receptorId");
  const cantidad = form.watch("cantidad");

  // Actualizar total en letras cuando cambia la cantidad
  useEffect(() => {
    if (cantidad && !isNaN(parseFloat(cantidad))) {
      const letras = numeroALetras(parseFloat(cantidad));
      setTotalLetras(letras);
    } else {
      setTotalLetras("");
    }
  }, [cantidad]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    const formaPago = formasPago.find((f) => f.value === data.formaPago);
    const receptor = receptores.find((r) => r.id === data.receptorId);

    // Generar número de recibo
    const numeroRecibo = `REC-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    // Generar PDF
    generarReciboPDF({
      numero: numeroRecibo,
      recibiDe: data.recibiDe,
      cantidad: parseFloat(data.cantidad),
      concepto: data.concepto,
      formaPago: formaPago?.label || data.formaPago,
      fechaPago: data.fechaPago,
      totalLetras,
      observaciones: data.observaciones,
      receptor: receptor?.name || "",
    });

    toast.success("Recibo generado exitosamente", {
      description: `Recibo ${numeroRecibo} de ${data.recibiDe} por $${parseFloat(data.cantidad).toLocaleString("es-MX")}`,
      position: "bottom-right",
    });

    form.reset();
    setTotalLetras("");
  }

  return (
    <>
      <form id="new-recibo-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Recibí de */}
          <Controller
            name="recibiDe"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="new-recibo-recibide">Recibí de</FieldLabel>
                <Input
                  {...field}
                  id="new-recibo-recibide"
                  aria-invalid={fieldState.invalid}
                  placeholder="Nombre de quien realiza el pago"
                  autoComplete="off"
                />
                <FieldDescription>
                  Nombre completo de la persona o empresa que realiza el pago.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Cantidad y Forma de Pago */}
          <div className="grid grid-cols-2 gap-4">
            {/* Cantidad */}
            <Controller
              name="cantidad"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-recibo-cantidad">
                    Cantidad Recibida
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <Input
                      {...field}
                      id="new-recibo-cantidad"
                      type="number"
                      step="0.01"
                      aria-invalid={fieldState.invalid}
                      placeholder="0.00"
                      autoComplete="off"
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Forma de Pago */}
            <Controller
              name="formaPago"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Forma de Pago</FieldLabel>
                  <Popover open={openFormaPago} onOpenChange={setOpenFormaPago}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openFormaPago}
                        className="w-full justify-between font-normal"
                      >
                        {selectedFormaPago
                          ? formasPago.find(
                              (f) => f.value === selectedFormaPago,
                            )?.label
                          : "Seleccionar..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-0" align="start">
                      <Command>
                        <CommandList>
                          {formasPago.map((forma) => (
                            <CommandItem
                              key={forma.value}
                              value={forma.value}
                              onSelect={() => {
                                field.onChange(forma.value);
                                setOpenFormaPago(false);
                              }}
                            >
                              {forma.label}
                              {selectedFormaPago === forma.value && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Total en letras (auto-generado) */}
          {totalLetras && (
            <div className="rounded-lg bg-muted p-3">
              <div className="text-sm font-medium text-muted-foreground">
                Total en letras:
              </div>
              <div className="mt-1 text-sm font-semibold uppercase">
                {totalLetras}
              </div>
            </div>
          )}

          {/* Concepto de pago */}
          <Controller
            name="concepto"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="new-recibo-concepto">
                  Concepto de Pago
                </FieldLabel>
                <Input
                  {...field}
                  id="new-recibo-concepto"
                  aria-invalid={fieldState.invalid}
                  placeholder="Ej: CÁLCULO ESTRUCTURAL, PLANOS ARQUITECTÓNICOS, etc."
                  autoComplete="off"
                />
                <FieldDescription>
                  Describe el servicio o concepto por el cual se realiza el
                  pago.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Fecha de Pago y Receptor */}
          <div className="grid grid-cols-2 gap-4">
            {/* Fecha de pago */}
            <Controller
              name="fechaPago"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-recibo-fecha">
                    Fecha de Pago
                  </FieldLabel>
                  <Input
                    {...field}
                    id="new-recibo-fecha"
                    type="date"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Receptor */}
            <Controller
              name="receptorId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Nombre del Receptor</FieldLabel>
                  <Popover open={openReceptor} onOpenChange={setOpenReceptor}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openReceptor}
                        className="w-full justify-between font-normal"
                      >
                        {selectedReceptor
                          ? receptores.find((r) => r.id === selectedReceptor)
                              ?.name
                          : "Seleccionar..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar receptor..." />
                        <CommandList>
                          <CommandEmpty>
                            No se encontraron receptores.
                          </CommandEmpty>
                          <CommandGroup>
                            {receptores.map((receptor) => (
                              <CommandItem
                                key={receptor.id}
                                value={receptor.name}
                                onSelect={() => {
                                  field.onChange(receptor.id);
                                  setOpenReceptor(false);
                                }}
                              >
                                {receptor.name}
                                {selectedReceptor === receptor.id && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FieldDescription>
                    Persona que recibe el pago.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Observaciones */}
          <Controller
            name="observaciones"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="new-recibo-observaciones">
                  Observaciones (Opcional)
                </FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="new-recibo-observaciones"
                    placeholder="Información adicional sobre el pago..."
                    rows={3}
                    className="min-h-20 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.value?.length || 0}/300 caracteres
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" form="new-recibo-form">
          Generar Recibo PDF
        </Button>
      </DialogFooter>
    </>
  );
}
