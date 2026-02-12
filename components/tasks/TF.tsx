import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="flex h-full w-full flex-col rounded-none border-4 border-r-4 lg:border-8 lg:border-r-8 bg-green-50/50 dark:bg-green-950/50 py-0">
      <CardHeader className="border-b border-green-200 dark:border-green-800 bg-green-100/50 dark:bg-green-900/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          <CardTitle className="text-lg text-green-800 dark:text-green-200">
            Tareas Finalizadas
          </CardTitle>
        </div>
        <CardAction>
          <Button
            size="icon"
            variant="ghost"
            className="text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800"
          >
            <Archive className="h-5 w-5" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        {mockTareasFinalizadas.map((tarea) => (
          <div
            key={tarea.id}
            className="cursor-pointer border-b border-green-100 dark:border-green-900 px-4 py-3 transition-colors hover:bg-green-100/50 dark:hover:bg-green-900/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 dark:text-green-400" />
                <h3 className="font-medium text-green-900 dark:text-green-100">{tarea.title}</h3>
              </div>
            </div>
            <p className="mt-1 pl-6 text-sm text-green-600 dark:text-green-400">
              Por: {tarea.completedBy}
            </p>
            <p className="pl-6 text-xs text-green-400 dark:text-green-600">
              Completado: {tarea.completedDate}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
