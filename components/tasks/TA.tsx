import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Plus, UserCheck } from "lucide-react";

const mockTareasAsignadas = [
  {
    id: 1,
    title: "Revisar planos estructurales",
    assignedTo: "Carlos Mendoza",
    dueDate: "15 Feb 2026",
    priority: "Alta",
  },
  {
    id: 2,
    title: "Cotizar materiales",
    assignedTo: "Ana García",
    dueDate: "12 Feb 2026",
    priority: "Media",
  },
  {
    id: 3,
    title: "Supervisar cimentación",
    assignedTo: "Luis Torres",
    dueDate: "18 Feb 2026",
    priority: "Alta",
  },
];

export const TareasAsignadasComponent = () => {
  return (
    <Card className="flex h-full w-full flex-col rounded-none border-8 border-r bg-blue-50/50 py-0">
      <CardHeader className="border-b border-blue-200 bg-blue-100/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg text-blue-800">
            Tareas Asignadas
          </CardTitle>
        </div>
        <CardAction>
          <Button
            size="icon"
            variant="ghost"
            className="text-blue-600 hover:bg-blue-200"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        {mockTareasAsignadas.map((tarea) => (
          <div
            key={tarea.id}
            className="cursor-pointer border-b border-blue-100 px-4 py-3 transition-colors hover:bg-blue-100/50"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-blue-900">{tarea.title}</h3>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  tarea.priority === "Alta"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {tarea.priority}
              </span>
            </div>
            <p className="mt-1 text-sm text-blue-600">
              Asignado a: {tarea.assignedTo}
            </p>
            <p className="text-xs text-blue-400">Vence: {tarea.dueDate}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
