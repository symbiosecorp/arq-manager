"use client";

import React, { useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Datos mock de áreas y usuarios
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

const priorities = [
  { value: "alta", label: "Alta", color: "bg-red-500" },
  { value: "media", label: "Media", color: "bg-yellow-500" },
  { value: "baja", label: "Baja", color: "bg-green-500" },
];

const formSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres.")
    .max(50, "El título debe tener máximo 50 caracteres."),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres.")
    .max(300, "La descripción debe tener máximo 300 caracteres."),
  assignedUsers: z
    .array(z.string())
    .min(1, "Debes asignar al menos un usuario."),
  priority: z.string().min(1, "Selecciona una prioridad."),
  dueDate: z.string().min(1, "Selecciona una fecha de vencimiento."),
});

export function NewTask() {
  const [openUsers, setOpenUsers] = useState(false);
  const [openPriority, setOpenPriority] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      assignedUsers: [],
      priority: "",
      dueDate: "",
    },
  });

  const selectedUsers = form.watch("assignedUsers");
  const selectedPriority = form.watch("priority");

  function getSelectedUsersLabel() {
    if (selectedUsers.length === 0) return "Seleccionar usuarios...";
    if (selectedUsers.length === 1) {
      const user = areasWithUsers
        .flatMap((a) => a.users)
        .find((u) => u.id === selectedUsers[0]);
      return user?.name || "1 usuario seleccionado";
    }
    return `${selectedUsers.length} usuarios seleccionados`;
  }

  function toggleUser(userId: string) {
    const current = form.getValues("assignedUsers");
    if (current.includes(userId)) {
      form.setValue(
        "assignedUsers",
        current.filter((id) => id !== userId),
        { shouldValidate: true },
      );
    } else {
      form.setValue("assignedUsers", [...current, userId], {
        shouldValidate: true,
      });
    }
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    const assignedNames = data.assignedUsers.map((id) => {
      const user = areasWithUsers
        .flatMap((a) => a.users)
        .find((u) => u.id === id);
      return user?.name;
    });

    toast.success("Tarea creada exitosamente", {
      description: `"${data.title}" asignada a ${assignedNames.join(", ")}`,
      position: "bottom-right",
    });
    form.reset();
  }

  return (
    <>
      <form id="new-task-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Título */}
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="new-task-title">Título</FieldLabel>
                <Input
                  {...field}
                  id="new-task-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Título de la tarea"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Descripción */}
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="new-task-description">
                  Descripción
                </FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="new-task-description"
                    placeholder="Describe los detalles de la tarea..."
                    rows={3}
                    className="min-h-20 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.value.length}/300 caracteres
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Selector de Usuarios por Área */}
          <Controller
            name="assignedUsers"
            control={form.control}
            render={({ fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Asignar a</FieldLabel>
                <Popover open={openUsers} onOpenChange={setOpenUsers}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openUsers}
                      className="w-full justify-between font-normal"
                    >
                      {getSelectedUsersLabel()}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-75 p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar usuario..." />
                      <CommandList>
                        <CommandEmpty>No se encontraron usuarios.</CommandEmpty>
                        <ScrollArea className="h-64">
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
                                    checked={selectedUsers.includes(user.id)}
                                    className="mr-2"
                                  />
                                  {user.name}
                                  {selectedUsers.includes(user.id) && (
                                    <Check className="ml-auto h-4 w-4" />
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          ))}
                        </ScrollArea>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FieldDescription>
                  Selecciona los usuarios a los que asignarás esta tarea.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Prioridad y Fecha */}
          <div className="grid grid-cols-2 gap-4">
            {/* Prioridad */}
            <Controller
              name="priority"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Prioridad</FieldLabel>
                  <Popover open={openPriority} onOpenChange={setOpenPriority}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openPriority}
                        className="w-full justify-between font-normal"
                      >
                        {selectedPriority ? (
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "h-2 w-2 rounded-full",
                                priorities.find(
                                  (p) => p.value === selectedPriority,
                                )?.color,
                              )}
                            />
                            {
                              priorities.find(
                                (p) => p.value === selectedPriority,
                              )?.label
                            }
                          </div>
                        ) : (
                          "Seleccionar..."
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-0" align="start">
                      <Command>
                        <CommandList>
                          {priorities.map((priority) => (
                            <CommandItem
                              key={priority.value}
                              value={priority.value}
                              onSelect={() => {
                                field.onChange(priority.value);
                                setOpenPriority(false);
                              }}
                            >
                              <div
                                className={cn(
                                  "mr-2 h-2 w-2 rounded-full",
                                  priority.color,
                                )}
                              />
                              {priority.label}
                              {selectedPriority === priority.value && (
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

            {/* Fecha de vencimiento */}
            <Controller
              name="dueDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="new-task-duedate">
                    Vencimiento
                  </FieldLabel>
                  <Input
                    {...field}
                    id="new-task-duedate"
                    type="date"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </FieldGroup>
      </form>
      <DialogFooter className="pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" form="new-task-form">
          Crear Tarea
        </Button>
      </DialogFooter>
    </>
  );
}
