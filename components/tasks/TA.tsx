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
    <div className="flex h-full w-full flex-col bg-blue-50/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-blue-200 bg-blue-100/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-blue-800">
            Tareas Asignadas
          </h2>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="text-blue-600 hover:bg-blue-200"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Lista de tareas */}
      <div className="flex-1 overflow-y-auto">
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
      </div>
    </div>
  );
};
