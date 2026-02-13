"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TaskFilterValues {
  searchName: string;
  person: string;
  dateFrom: string;
  dateTo: string;
}

interface TaskFilterProps {
  title: string;
  description: string;
  people: { id: string; name: string }[];
  personLabel: string;
  colorScheme: "green" | "amber";
  onFilter: (filters: TaskFilterValues) => void;
  onClear: () => void;
  activeFilters: number;
}

export function TaskFilter({
  title,
  description,
  people,
  personLabel,
  colorScheme,
  onFilter,
  onClear,
  activeFilters,
}: TaskFilterProps) {
  const [open, setOpen] = useState(false);
  const [openPerson, setOpenPerson] = useState(false);
  const [filters, setFilters] = useState<TaskFilterValues>({
    searchName: "",
    person: "",
    dateFrom: "",
    dateTo: "",
  });

  const colorClasses = {
    green: {
      button:
        "text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800",
      badge: "bg-green-600 text-white",
    },
    amber: {
      button:
        "text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800",
      badge: "bg-amber-600 text-white",
    },
  };

  const handleApplyFilters = () => {
    onFilter(filters);
    setOpen(false);
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      searchName: "",
      person: "",
      dateFrom: "",
      dateTo: "",
    };
    setFilters(emptyFilters);
    onClear();
  };

  const getSelectedPersonName = () => {
    if (!filters.person) return "Seleccionar...";
    const person = people.find((p) => p.id === filters.person);
    return person?.name || "Seleccionar...";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className={cn("relative", colorClasses[colorScheme].button)}
        >
          <Search className="h-5 w-5" />
          {activeFilters > 0 && (
            <Badge
              className={cn(
                "absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] flex items-center justify-center",
                colorClasses[colorScheme].badge,
              )}
            >
              {activeFilters}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <FieldGroup>
          {/* Buscar por nombre de tarea */}
          <Field>
            <FieldLabel htmlFor="filter-name">Nombre de la tarea</FieldLabel>
            <Input
              id="filter-name"
              placeholder="Buscar por nombre..."
              value={filters.searchName}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchName: e.target.value }))
              }
            />
          </Field>

          {/* Filtrar por persona */}
          <Field>
            <FieldLabel>{personLabel}</FieldLabel>
            <Popover open={openPerson} onOpenChange={setOpenPerson}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openPerson}
                  className="w-full justify-between font-normal"
                >
                  {getSelectedPersonName()}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar persona..." />
                  <CommandList className="max-h-48">
                    <CommandEmpty>No se encontró.</CommandEmpty>
                    <CommandGroup>
                      {people.map((person) => (
                        <CommandItem
                          key={person.id}
                          value={person.name}
                          onSelect={() => {
                            setFilters((prev) => ({
                              ...prev,
                              person:
                                prev.person === person.id ? "" : person.id,
                            }));
                            setOpenPerson(false);
                          }}
                        >
                          {person.name}
                          {filters.person === person.id && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </Field>

          {/* Rango de fechas */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="filter-date-from">Desde</FieldLabel>
              <Input
                id="filter-date-from"
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="filter-date-to">Hasta</FieldLabel>
              <Input
                id="filter-date-to"
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                }
              />
            </Field>
          </div>
        </FieldGroup>

        <DialogFooter className="flex gap-2 pt-4">
          {activeFilters > 0 && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleClearFilters}
              className="mr-auto"
            >
              <X className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
          )}
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleApplyFilters}>
            Aplicar filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
