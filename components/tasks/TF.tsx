"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { TaskFilter, TaskFilterValues } from "./TaskFilter";

const mockTareasFinalizadas = [
  {
    id: 1,
    title: "Diseño de fachada principal",
    completedBy: "María López",
    completedDate: "2026-02-08",
  },
  {
    id: 2,
    title: "Aprobación de permisos",
    completedBy: "Juan Pérez",
    completedDate: "2026-02-05",
  },
  {
    id: 3,
    title: "Instalación eléctrica fase 1",
    completedBy: "Roberto Sánchez",
    completedDate: "2026-02-03",
  },
  {
    id: 4,
    title: "Revisión de planos",
    completedBy: "María López",
    completedDate: "2026-01-28",
  },
  {
    id: 5,
    title: "Entrega de documentos",
    completedBy: "Ana García",
    completedDate: "2026-01-25",
  },
];

// Extraer personas únicas para el filtro
const uniquePeople = Array.from(
  new Set(mockTareasFinalizadas.map((t) => t.completedBy)),
).map((name, index) => ({ id: `person-${index}`, name }));

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const TareasFinalizadasComponent = () => {
  const [filters, setFilters] = useState<TaskFilterValues>({
    searchName: "",
    person: "",
    dateFrom: "",
    dateTo: "",
  });

  const filteredTareas = useMemo(() => {
    return mockTareasFinalizadas.filter((tarea) => {
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
        if (personName && tarea.completedBy !== personName) {
          return false;
        }
      }

      // Filtrar por fecha desde
      if (filters.dateFrom && tarea.completedDate < filters.dateFrom) {
        return false;
      }

      // Filtrar por fecha hasta
      if (filters.dateTo && tarea.completedDate > filters.dateTo) {
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
    <Card className="flex h-full w-full flex-col rounded-none border-4 border-r-4 lg:border-8 lg:border-r-8 bg-green-50/50 dark:bg-green-950/50 py-0">
      <CardHeader className="border-b border-green-200 dark:border-green-800 bg-green-100/50 dark:bg-green-900/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          <CardTitle className="text-lg text-green-800 dark:text-green-200">
            Tareas Finalizadas
          </CardTitle>
        </div>
        <CardAction>
          <TaskFilter
            title="Filtrar Tareas Finalizadas"
            description="Busca tareas por nombre, persona que completó o fecha."
            people={uniquePeople}
            personLabel="Completado por"
            colorScheme="green"
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
          <div className="flex flex-col items-center justify-center py-8 text-green-600 dark:text-green-400">
            <p className="text-sm">No se encontraron tareas</p>
            {activeFiltersCount > 0 && (
              <p className="text-xs mt-1">Intenta ajustar los filtros</p>
            )}
          </div>
        ) : (
          filteredTareas.map((tarea) => (
            <div
              key={tarea.id}
              className="cursor-pointer border-b border-green-100 dark:border-green-900 px-4 py-3 transition-colors hover:bg-green-100/50 dark:hover:bg-green-900/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                  <h3 className="font-medium text-green-900 dark:text-green-100">
                    {tarea.title}
                  </h3>
                </div>
              </div>
              <p className="mt-1 pl-6 text-sm text-green-600 dark:text-green-400">
                Por: {tarea.completedBy}
              </p>
              <p className="pl-6 text-xs text-green-400 dark:text-green-600">
                Completado: {formatDate(tarea.completedDate)}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
