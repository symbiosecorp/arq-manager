"use client";

import { useMemo, useState } from "react";
import { useDroppable } from "@dnd-kit/react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { TaskFilter, TaskFilterValues } from "./TaskFilter";
import { Task } from "./task-types";
import { SortableTaskItem } from "./SortableTaskItem";

interface TareasFinalizadasProps {
  tasks: Task[];
}

export const TareasFinalizadasComponent = ({ tasks }: TareasFinalizadasProps) => {
  const { ref } = useDroppable({ id: "completed" });

  const [filters, setFilters] = useState<TaskFilterValues>({
    searchName: "",
    person: "",
    dateFrom: "",
    dateTo: "",
  });

  const uniquePeople = useMemo(
    () =>
      Array.from(new Set(tasks.map((t) => t.completedBy).filter(Boolean))).map(
        (name, index) => ({ id: `person-${index}`, name: name as string }),
      ),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (
        filters.searchName &&
        !task.title.toLowerCase().includes(filters.searchName.toLowerCase())
      ) {
        return false;
      }
      if (filters.person) {
        const personName = uniquePeople.find((p) => p.id === filters.person)?.name;
        if (personName && task.completedBy !== personName) return false;
      }
      if (filters.dateFrom && task.completedDate && task.completedDate < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && task.completedDate && task.completedDate > filters.dateTo) {
        return false;
      }
      return true;
    });
  }, [tasks, filters, uniquePeople]);

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

      <CardContent ref={ref} className="flex-1 overflow-y-auto p-0 min-h-16">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-green-600 dark:text-green-400">
            <p className="text-sm">No se encontraron tareas</p>
            {activeFiltersCount > 0 && (
              <p className="text-xs mt-1">Intenta ajustar los filtros</p>
            )}
          </div>
        ) : (
          filteredTasks.map((task, index) => (
            <SortableTaskItem
              key={task.id}
              task={task}
              index={index}
              colorScheme="green"
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};
