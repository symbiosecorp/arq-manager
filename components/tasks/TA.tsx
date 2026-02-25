"use client";

import { useDroppable } from "@dnd-kit/react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Plus, UserCheck } from "lucide-react";
import { NewTask } from "./NewTask";
import { Task } from "./task-types";
import { SortableTaskItem } from "./SortableTaskItem";

interface TareasAsignadasProps {
  tasks: Task[];
}

export const TareasAsignadasComponent = ({ tasks }: TareasAsignadasProps) => {
  const { ref } = useDroppable({ id: "assigned" });

  return (
    <Card className="flex h-full w-full flex-col rounded-none border-4 border-r-4 lg:border-8 lg:border-r-8 bg-blue-50/50 dark:bg-blue-950/50 py-0">
      <CardHeader className="border-b border-blue-200 dark:border-blue-800 bg-blue-100/50 dark:bg-blue-900/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <CardTitle className="text-lg text-blue-800 dark:text-blue-200">
            Tareas Asignadas
          </CardTitle>
        </div>
        <CardAction>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Nueva Tarea</DialogTitle>
                <DialogDescription>
                  Crea una nueva tarea y asígnala a los usuarios
                  correspondientes.
                </DialogDescription>
              </DialogHeader>
              <NewTask />
            </DialogContent>
          </Dialog>
        </CardAction>
      </CardHeader>

      <CardContent ref={ref} className="flex-1 overflow-y-auto p-0 min-h-16">
        {tasks.map((task, index) => (
          <SortableTaskItem
            key={task.id}
            task={task}
            index={index}
            colorScheme="blue"
          />
        ))}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center py-8 text-blue-400 dark:text-blue-600">
            <p className="text-sm">No hay tareas asignadas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
