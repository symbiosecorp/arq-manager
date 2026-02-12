import { Notes } from "@/components/notes/Notes";
import { TareasAsignadasComponent } from "@/components/tasks/TA";
import { TareasFinalizadasComponent } from "@/components/tasks/TF";
import { TareasRecibidasComponent } from "@/components/tasks/TR";

export default function HomePage() {
  return (
    <div className="h-screen w-full overflow-auto p-4 lg:p-0">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-0 lg:h-full">
        <div className="h-96 lg:h-full">
          <Notes />
        </div>
        <div className="h-96 lg:h-full">
          <TareasAsignadasComponent />
        </div>
        <div className="h-96 lg:h-full">
          <TareasRecibidasComponent />
        </div>
        <div className="h-96 lg:h-full">
          <TareasFinalizadasComponent />
        </div>
      </div>
    </div>
  );
}
