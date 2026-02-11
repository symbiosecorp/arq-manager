import { Button } from "../ui/button";
import { CheckCircle2, Archive } from "lucide-react";

const mockTareasFinalizadas = [
  {
    id: 1,
    title: "Diseño de fachada principal",
    completedBy: "María López",
    completedDate: "8 Feb 2026",
  },
  {
    id: 2,
    title: "Aprobación de permisos",
    completedBy: "Juan Pérez",
    completedDate: "5 Feb 2026",
  },
  {
    id: 3,
    title: "Instalación eléctrica fase 1",
    completedBy: "Roberto Sánchez",
    completedDate: "3 Feb 2026",
  },
];

export const TareasFinalizadasComponent = () => {
  return (
    <div className="flex h-full w-full flex-col bg-green-50/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-green-200 bg-green-100/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-green-800">
            Tareas Finalizadas
          </h2>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="text-green-600 hover:bg-green-200"
        >
          <Archive className="h-5 w-5" />
        </Button>
      </div>

      {/* Lista de tareas */}
      <div className="flex-1 overflow-y-auto">
        {mockTareasFinalizadas.map((tarea) => (
          <div
            key={tarea.id}
            className="cursor-pointer border-b border-green-100 px-4 py-3 transition-colors hover:bg-green-100/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <h3 className="font-medium text-green-900">{tarea.title}</h3>
              </div>
            </div>
            <p className="mt-1 pl-6 text-sm text-green-600">
              Por: {tarea.completedBy}
            </p>
            <p className="pl-6 text-xs text-green-400">
              Completado: {tarea.completedDate}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
