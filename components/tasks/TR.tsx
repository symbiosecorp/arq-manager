"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Inbox } from "lucide-react";
import { TaskFilter, TaskFilterValues } from "./TaskFilter";

const mockTareasRecibidas = [
  {
    id: 1,
    title: "Actualizar presupuesto",
    from: "Director de Proyecto",
    receivedDate: "2026-02-10",
    priority: "Alta",
  },
  {
    id: 2,
    title: "Entregar informe semanal",
    from: "Gerencia",
    receivedDate: "2026-02-09",
    priority: "Media",
  },
  {
    id: 3,
    title: "Coordinar con proveedores",
    from: "Compras",
    receivedDate: "2026-02-08",
    priority: "Baja",
  },
  {
    id: 4,
    title: "Revisar contratos",
    from: "Legal",
    receivedDate: "2026-02-06",
    priority: "Alta",
  },
  {
    id: 5,
    title: "Preparar presentación",
    from: "Director de Proyecto",
    receivedDate: "2026-02-04",
    priority: "Media",
  },
];

// Extraer personas únicas para el filtro
const uniquePeople = Array.from(
  new Set(mockTareasRecibidas.map((t) => t.from)),
).map((name, index) => ({ id: `person-${index}`, name }));

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const TareasRecibidasComponent = () => {
  const [filters, setFilters] = useState<TaskFilterValues>({
    searchName: "",
    person: "",
    dateFrom: "",
    dateTo: "",
  });

  const filteredTareas = useMemo(() => {
    return mockTareasRecibidas.filter((tarea) => {
      // Filtrar por nombre
      if (
        filters.searchName &&
        !tarea.title.toLowerCase().includes(filters.searchName.toLowerCase())
      ) {
        return false;
      }

      // Filtrar por persona
      if (filters.person) {
        const personName = uniquePeople.find(
          (p) => p.id === filters.person,
        )?.name;
        if (personName && tarea.from !== personName) {
          return false;
        }
      }

      // Filtrar por fecha desde
      if (filters.dateFrom && tarea.receivedDate < filters.dateFrom) {
        return false;
      }

      // Filtrar por fecha hasta
      if (filters.dateTo && tarea.receivedDate > filters.dateTo) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const activeFiltersCount = [
    filters.searchName,
    filters.person,
    filters.dateFrom,
    filters.dateTo,
  ].filter(Boolean).length;

  return (
    <Card className="flex h-full w-full flex-col rounded-none border-4 border-r-4 lg:border-8 lg:border-r-8 bg-amber-50/50 dark:bg-amber-950/50 py-0">
      <CardHeader className="border-b border-amber-200 dark:border-amber-800 bg-amber-100/50 dark:bg-amber-900/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Inbox className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <CardTitle className="text-lg text-amber-800 dark:text-amber-200">
            Tareas Recibidas
          </CardTitle>
        </div>
        <CardAction>
          <TaskFilter
            title="Filtrar Tareas Recibidas"
            description="Busca tareas por nombre, remitente o fecha de recepción."
            people={uniquePeople}
            personLabel="Recibido de"
            colorScheme="amber"
            onFilter={setFilters}
            onClear={() =>
              setFilters({
                searchName: "",
                person: "",
                dateFrom: "",
                dateTo: "",
              })
            }
            activeFilters={activeFiltersCount}
          />
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        {filteredTareas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-amber-600 dark:text-amber-400">
            <p className="text-sm">No se encontraron tareas</p>
            {activeFiltersCount > 0 && (
              <p className="text-xs mt-1">Intenta ajustar los filtros</p>
            )}
          </div>
        ) : (
          filteredTareas.map((tarea) => (
            <div
              key={tarea.id}
              className="cursor-pointer border-b border-amber-100 dark:border-amber-900 px-4 py-3 transition-colors hover:bg-amber-100/50 dark:hover:bg-amber-900/50"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-amber-900 dark:text-amber-100">
                  {tarea.title}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    tarea.priority === "Alta"
                      ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                      : tarea.priority === "Media"
                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {tarea.priority}
                </span>
              </div>
              <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                De: {tarea.from}
              </p>
              <p className="text-xs text-amber-400 dark:text-amber-600">
                Recibido: {formatDate(tarea.receivedDate)}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
