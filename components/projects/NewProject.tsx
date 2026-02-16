"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";

// Datos mock de tipos de obra
const tiposObra = [
  { value: "residencial", label: "Residencial" },
  { value: "comercial", label: "Comercial" },
  { value: "industrial", label: "Industrial" },
  { value: "institucional", label: "Institucional" },
  { value: "remodelacion", label: "Remodelación" },
];

// Datos mock de clientes
const clientes = [
  { id: "cli-1", name: "Juan Pérez", email: "juan.perez@email.com" },
  { id: "cli-2", name: "María González", email: "maria.gonzalez@email.com" },
  { id: "cli-3", name: "Constructora ABC S.A.", email: "contacto@abc.com" },
  { id: "cli-4", name: "Inversiones XYZ", email: "info@xyz.com" },
  { id: "cli-5", name: "Roberto Silva", email: "roberto.silva@email.com" },
];

// Datos mock de áreas y usuarios (para asignar equipo)
const areasWithUsers = [
  {
    area: "Arquitectura",
    users: [
      { id: "arq-1", name: "Carlos Mendoza" },
      { id: "arq-2", name: "María López" },
      { id: "arq-3", name: "Pedro Sánchez" },
    ],
  },
  {
    area: "Ingeniería Estructural",
    users: [
      { id: "ing-1", name: "Ana García" },
      { id: "ing-2", name: "Luis Torres" },
      { id: "ing-3", name: "Roberto Díaz" },
    ],
  },
  {
    area: "Ingeniería Eléctrica",
    users: [
      { id: "ele-1", name: "Fernando Ruiz" },
      { id: "ele-2", name: "Carmen Vega" },
    ],
  },
  {
    area: "Administración",
    users: [
      { id: "adm-1", name: "Patricia Morales" },
      { id: "adm-2", name: "Jorge Hernández" },
    ],
  },
  {
    area: "Supervisión de Obra",
    users: [
      { id: "sup-1", name: "Miguel Ángel Castro" },
      { id: "sup-2", name: "Isabel Ramírez" },
      { id: "sup-3", name: "Daniel Flores" },
    ],
  },
];

const formSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(100, "El nombre debe tener máximo 100 caracteres."),
  clienteId: z.string().min(1, "Selecciona un cliente."),
  tipoObra: z.string().min(1, "Selecciona un tipo de obra."),
  direccion: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres.")
    .max(200, "La dirección debe tener máximo 200 caracteres."),
  ciudad: z
    .string()
    .min(2, "La ciudad debe tener al menos 2 caracteres.")
    .max(50, "La ciudad debe tener máximo 50 caracteres."),
  telefono: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 caracteres.")
    .max(15, "El teléfono debe tener máximo 15 caracteres."),
  correo: z
    .string()
    .email("Ingresa un correo electrónico válido.")
    .min(1, "El correo es requerido."),
  notas: z
    .string()
    .max(500, "Las notas deben tener máximo 500 caracteres.")
    .optional(),
  equipoAsignado: z
    .array(z.string())
    .min(1, "Debes asignar al menos un miembro del equipo."),
});

export function NewProject() {
  const [openCliente, setOpenCliente] = useState(false);
  const [openTipoObra, setOpenTipoObra] = useState(false);
  const [openEquipo, setOpenEquipo] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      clienteId: "",
      tipoObra: "",
      direccion: "",
      ciudad: "",
      telefono: "",
      correo: "",
      notas: "",
      equipoAsignado: [],
    },
  });

  const selectedCliente = form.watch("clienteId");
  const selectedTipoObra = form.watch("tipoObra");
  const selectedEquipo = form.watch("equipoAsignado");

  function getSelectedEquipoLabel() {
    if (selectedEquipo.length === 0) return "Seleccionar equipo...";
    if (selectedEquipo.length === 1) {
      const user = areasWithUsers
        .flatMap((a) => a.users)
        .find((u) => u.id === selectedEquipo[0]);
      return user?.name || "1 miembro seleccionado";
    }
    return `${selectedEquipo.length} miembros seleccionados`;
  }

  function toggleUser(userId: string) {
    const current = form.getValues("equipoAsignado");
    if (current.includes(userId)) {
      form.setValue(
        "equipoAsignado",
        current.filter((id) => id !== userId),
        { shouldValidate: true },
      );
    } else {
      form.setValue("equipoAsignado", [...current, userId], {
        shouldValidate: true,
      });
    }
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    const cliente = clientes.find((c) => c.id === data.clienteId);
    const tipoObra = tiposObra.find((t) => t.value === data.tipoObra);
    const equipoNames = data.equipoAsignado.map((id) => {
      const user = areasWithUsers
        .flatMap((a) => a.users)
        .find((u) => u.id === id);
      return user?.name;
    });

    toast.success("Proyecto creado exitosamente", {
      description: `"${data.nombre}" para ${cliente?.name} - ${tipoObra?.label}. Equipo: ${equipoNames.join(", ")}`,
      position: "bottom-right",
    });
    form.reset();
  }

  return (
    <>
      <form id="new-project-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Nombre del Proyecto */}
          <Controller
            name="nombre"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="new-project-nombre">
                  Nombre del Proyecto
                </FieldLabel>
                <Input
                  {...field}
                  id="new-project-nombre"
                  aria-invalid={fieldState.invalid}
                  placeholder="Proyecto residencial Los Pinos"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Cliente y Tipo de Obra */}
          <div className="grid grid-cols-2 gap-4">
            {/* Cliente */}
            <Controller
              name="clienteId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Cliente</FieldLabel>
                  <Popover open={openCliente} onOpenChange={setOpenCliente}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCliente}
                        className="w-full justify-between font-normal"
                      >
                        {selectedCliente
                          ? clientes.find((c) => c.id === selectedCliente)?.name
                          : "Seleccionar cliente..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-75 p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar cliente..." />
                        <CommandList className="max-h-64">
                          <CommandEmpty>
                            No se encontraron clientes.
                          </CommandEmpty>
                          <CommandGroup>
                            {clientes.map((cliente) => (
                              <CommandItem
                                key={cliente.id}
                                value={cliente.name}
                                onSelect={() => {
                                  field.onChange(cliente.id);
                                  setOpenCliente(false);
                                }}
                              >
                                <div className="flex flex-col">
                                  <span>{cliente.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {cliente.email}
                                  </span>
                                </div>
                                {selectedCliente === cliente.id && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
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

            {/* Tipo de Obra */}
            <Controller
              name="tipoObra"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Tipo de Obra</FieldLabel>
                  <Popover open={openTipoObra} onOpenChange={setOpenTipoObra}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openTipoObra}
                        className="w-full justify-between font-normal"
                      >
                        {selectedTipoObra
                          ? tiposObra.find((t) => t.value === selectedTipoObra)
                              ?.label
                          : "Seleccionar tipo..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-50 p-0" align="start">
                      <Command>
                        <CommandList>
                          {tiposObra.map((tipo) => (
                            <CommandItem
                              key={tipo.value}
                              value={tipo.value}
                              onSelect={() => {
                                field.onChange(tipo.value);
                                setOpenTipoObra(false);
                              }}
                            >
                              {tipo.label}
                              {selectedTipoObra === tipo.value && (
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

          {/* Dirección del Inmueble */}
          <Controller
            name="direccion"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="new-project-direccion">
                  Dirección del Inmueble
                </FieldLabel>
                <Input
                  {...field}
                  id="new-project-direccion"
                  aria-invalid={fieldState.invalid}
                  placeholder="Calle Principal #123, Colonia Centro"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Ciudad, Teléfono y Correo */}
          <div className="grid grid-cols-3 gap-4">
            {/* Ciudad */}
            <Controller
              name="ciudad"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-project-ciudad">Ciudad</FieldLabel>
                  <Input
                    {...field}
                    id="new-project-ciudad"
                    aria-invalid={fieldState.invalid}
                    placeholder="Ciudad de México"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Teléfono */}
            <Controller
              name="telefono"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-project-telefono">
                    Teléfono
                  </FieldLabel>
                  <Input
                    {...field}
                    id="new-project-telefono"
                    aria-invalid={fieldState.invalid}
                    placeholder="5512345678"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Correo */}
            <Controller
              name="correo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-project-correo">Correo</FieldLabel>
                  <Input
                    {...field}
                    id="new-project-correo"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="proyecto@email.com"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Notas */}
          <Controller
            name="notas"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="new-project-notas">
                  Notas (Opcional)
                </FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="new-project-notas"
                    placeholder="Agrega notas o comentarios sobre el proyecto..."
                    rows={3}
                    className="min-h-20 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.value?.length || 0}/500 caracteres
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Asignar Equipo */}
          <Controller
            name="equipoAsignado"
            control={form.control}
            render={({ fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Asignar Equipo</FieldLabel>
                <Popover open={openEquipo} onOpenChange={setOpenEquipo}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openEquipo}
                      className="w-full justify-between font-normal"
                    >
                      {getSelectedEquipoLabel()}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-75 p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar miembro del equipo..." />
                      <CommandList className="max-h-64">
                        <CommandEmpty>
                          No se encontraron miembros del equipo.
                        </CommandEmpty>
                        {areasWithUsers.map((areaGroup) => (
                          <CommandGroup
                            key={areaGroup.area}
                            heading={areaGroup.area}
                          >
                            {areaGroup.users.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={user.name}
                                onSelect={() => toggleUser(user.id)}
                              >
                                <Checkbox
                                  checked={selectedEquipo.includes(user.id)}
                                  className="mr-2"
                                />
                                {user.name}
                                {selectedEquipo.includes(user.id) && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        ))}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FieldDescription>
                  Selecciona los miembros del equipo que trabajarán en este
                  proyecto.
                </FieldDescription>
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
        <Button type="submit" form="new-project-form">
          Crear Proyecto
        </Button>
      </DialogFooter>
    </>
  );
}
