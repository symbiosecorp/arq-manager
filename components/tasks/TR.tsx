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
import { Inbox } from "lucide-react";
import { TaskFilter, TaskFilterValues } from "./TaskFilter";
import { Task } from "./task-types";
import { SortableTaskItem } from "./SortableTaskItem";

interface TareasRecibidasProps {
  tasks: Task[];
}

export const TareasRecibidasComponent = ({ tasks }: TareasRecibidasProps) => {
  const { ref } = useDroppable({ id: "received" });

  const [filters, setFilters] = useState<TaskFilterValues>({
    searchName: "",
    person: "",
    dateFrom: "",
    dateTo: "",
  });

  const uniquePeople = useMemo(
    () =>
      Array.from(new Set(tasks.map((t) => t.from).filter(Boolean))).map(
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
        if (personName && task.from !== personName) return false;
      }
      if (filters.dateFrom && task.receivedDate && task.receivedDate < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && task.receivedDate && task.receivedDate > filters.dateTo) {
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

      <CardContent ref={ref} className="flex-1 overflow-y-auto p-0 min-h-16">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-amber-600 dark:text-amber-400">
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
              colorScheme="amber"
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};
