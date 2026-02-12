import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Plus, StickyNote } from "lucide-react";

const mockNotes = [
  {
    id: 1,
    title: "Reunión con cliente",
    description: "Revisar avances del proyecto de arquitectura",
    date: "11 Feb 2026",
  },
  {
    id: 2,
    title: "Materiales pendientes",
    description: "Solicitar cotización de concreto y acero",
    date: "10 Feb 2026",
  },
  {
    id: 3,
    title: "Planos estructurales",
    description: "Actualizar planos del segundo nivel",
    date: "9 Feb 2026",
  },
];

export const Notes = () => {
  return (
    <Card className="flex h-full w-full flex-col rounded-none border-8 bg-purple-50/50 dark:bg-purple-950/50 py-0">
      <CardHeader className="border-b border-purple-200 dark:border-purple-800 bg-purple-100/50 dark:bg-purple-900/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <StickyNote className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <CardTitle className="text-lg text-purple-800 dark:text-purple-200">Notas</CardTitle>
        </div>
        <CardAction>
          <Button
            size="icon"
            variant="ghost"
            className="text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        {mockNotes.map((note) => (
          <div
            key={note.id}
            className="cursor-pointer border-b border-purple-100 dark:border-purple-900 px-4 py-3 transition-colors hover:bg-purple-100/50 dark:hover:bg-purple-900/50"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-purple-900 dark:text-purple-100">{note.title}</h3>
              <span className="text-xs text-purple-400 dark:text-purple-600">{note.date}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-purple-600 dark:text-purple-400">
              {note.description}
            </p>
          </div>
        ))}

        {mockNotes.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-purple-400 dark:text-purple-600">
            <Plus className="mb-2 h-10 w-10" />
            <p>No hay notas</p>
            <p className="text-sm">Presiona + para agregar una nota</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
