import { Button } from "../ui/button";
import { Plus } from "lucide-react";

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
    <div className="flex h-full w-full flex-col bg-yellow-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 border-b-black">
        <h2 className="text-lg font-semibold">Notas</h2>
        <Button size="icon" variant="ghost">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Lista de notas */}
      <div className="flex-1 overflow-y-auto">
        {mockNotes.map((note) => (
          <div
            key={note.id}
            className="cursor-pointer border-b border-b-black px-4 py-3 transition-colors hover:bg-muted/50"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-medium">{note.title}</h3>
              <span className="text-xs text-muted-foreground">{note.date}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {note.description}
            </p>
          </div>
        ))}
      </div>

      {/* Estado vacío (oculto por ahora) */}
      {mockNotes.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center text-muted-foreground">
          <Plus className="mb-2 h-10 w-10" />
          <p>No hay notas</p>
          <p className="text-sm">Presiona + para agregar una nota</p>
        </div>
      )}
    </div>
  );
};
