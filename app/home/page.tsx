import { Notes } from "@/components/notes/Notes";
import {TareasAsignadasComponent}  from "@/components/tasks/TA";
import { TareasFinalizadasComponent } from "@/components/tasks/TF";
import { TareasRecibidasComponent } from "@/components/tasks/TR";

export default function HomePage() {
  return (
    <div className="h-screen w-full overflow-auto">
      {/* Mobile: Stacked layout */}
      <div className="grid grid-cols-1 gap-4 p-4 lg:hidden">
        <div className="h-96">
          <Notes />
        </div>
        <div className="h-96">
          <TareasAsignadasComponent />
        </div>
        <div className="h-96">
          <TareasRecibidasComponent />
        </div>
        <div className="h-96">
          <TareasFinalizadasComponent />
        </div>
      </div>

      {/* Desktop: 4-column grid */}
      <div className="hidden h-full grid-cols-4 lg:grid">
        <Notes />
        <TareasAsignadasComponent />
        <TareasRecibidasComponent />
        <TareasFinalizadasComponent />
      </div>
    </div>
  );
}
