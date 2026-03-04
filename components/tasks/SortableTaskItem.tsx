"use client";

import { useSortable } from "@dnd-kit/react/sortable";
import { GripVertical } from "lucide-react";
import { Task, TaskPriority } from "./task-types";

type ColorScheme = "blue" | "amber" | "green";

interface SortableTaskItemProps {
  task: Task;
  index: number;
  colorScheme: ColorScheme;
}

const priorityClasses: Record<TaskPriority, string> = {
  Alta: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
  Media: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
  Baja: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300",
};

const borderClasses: Record<ColorScheme, string> = {
  blue: "border-blue-100 dark:border-blue-900 hover:bg-blue-100/50 dark:hover:bg-blue-900/50",
  amber: "border-amber-100 dark:border-amber-900 hover:bg-amber-100/50 dark:hover:bg-amber-900/50",
  green: "border-green-100 dark:border-green-900 hover:bg-green-100/50 dark:hover:bg-green-900/50",
};

const subtextClasses: Record<ColorScheme, string> = {
  blue: "text-blue-600 dark:text-blue-400",
  amber: "text-amber-600 dark:text-amber-400",
  green: "text-green-600 dark:text-green-400",
};

const titleClasses: Record<ColorScheme, string> = {
  blue: "text-blue-900 dark:text-blue-100",
  amber: "text-amber-900 dark:text-amber-100",
  green: "text-green-900 dark:text-green-100",
};

const mutedClasses: Record<ColorScheme, string> = {
  blue: "text-blue-400 dark:text-blue-600",
  amber: "text-amber-400 dark:text-amber-600",
  green: "text-green-400 dark:text-green-600",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function SortableTaskItem({ task, index, colorScheme }: SortableTaskItemProps) {
  const { ref, handleRef, isDragging } = useSortable({
    id: task.id,
    index,
  });

  return (
    <div
      ref={ref}
      className={`flex items-start gap-2 border-b px-4 py-3 transition-all ${borderClasses[colorScheme]} ${
        isDragging ? "opacity-50 shadow-lg ring-2 ring-offset-1" : ""
      }`}
    >
      <button
        ref={handleRef as React.Ref<HTMLButtonElement>}
        className={`cursor-grab touch-none active:cursor-grabbing ${mutedClasses[colorScheme]} shrink-0 p-2 -m-2`}
        aria-label="Drag to reorder"
        tabIndex={-1}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className={`font-medium leading-snug ${titleClasses[colorScheme]}`}>
            {task.title}
          </h3>
          {task.priority && (
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${priorityClasses[task.priority]}`}>
              {task.priority}
            </span>
          )}
        </div>

        {task.assignedTo && (
          <p className={`mt-1 text-sm ${subtextClasses[colorScheme]}`}>
            Asignado a: {task.assignedTo}
          </p>
        )}
        {task.dueDate && (
          <p className={`text-xs ${mutedClasses[colorScheme]}`}>
            Vence: {task.dueDate}
          </p>
        )}

        {task.from && (
          <p className={`mt-1 text-sm ${subtextClasses[colorScheme]}`}>
            De: {task.from}
          </p>
        )}
        {task.receivedDate && (
          <p className={`text-xs ${mutedClasses[colorScheme]}`}>
            Recibido: {formatDate(task.receivedDate)}
          </p>
        )}

        {task.completedBy && (
          <p className={`mt-1 text-sm ${subtextClasses[colorScheme]}`}>
            Por: {task.completedBy}
          </p>
        )}
        {task.completedDate && (
          <p className={`text-xs ${mutedClasses[colorScheme]}`}>
            Completado: {formatDate(task.completedDate)}
          </p>
        )}
      </div>
    </div>
  );
}
