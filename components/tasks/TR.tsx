import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Plus, Inbox } from "lucide-react";

const mockTareasRecibidas = [
  {
    id: 1,
    title: "Actualizar presupuesto",
    from: "Director de Proyecto",
    receivedDate: "10 Feb 2026",
    priority: "Alta",
  },
  {
    id: 2,
    title: "Entregar informe semanal",
    from: "Gerencia",
    receivedDate: "9 Feb 2026",
    priority: "Media",
  },
  {
    id: 3,
    title: "Coordinar con proveedores",
    from: "Compras",
    receivedDate: "8 Feb 2026",
    priority: "Baja",
  },
];

export const TareasRecibidasComponent = () => {
  return (
    <Card className="flex h-full w-full flex-col rounded-none border-8 border-r bg-amber-50/50 dark:bg-amber-950/50 py-0">
      <CardHeader className="border-b border-amber-200 dark:border-amber-800 bg-amber-100/50 dark:bg-amber-900/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Inbox className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <CardTitle className="text-lg text-amber-800 dark:text-amber-200">Tareas Recibidas</CardTitle>
        </div>
        <CardAction>
          <Button size="icon" variant="ghost" className="text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800">
            <Plus className="h-5 w-5" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        {mockTareasRecibidas.map((tarea) => (
          <div
            key={tarea.id}
            className="cursor-pointer border-b border-amber-100 dark:border-amber-900 px-4 py-3 transition-colors hover:bg-amber-100/50 dark:hover:bg-amber-900/50"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-amber-900 dark:text-amber-100">{tarea.title}</h3>
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
            <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">De: {tarea.from}</p>
            <p className="text-xs text-amber-400 dark:text-amber-600">Recibido: {tarea.receivedDate}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
