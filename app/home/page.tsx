import { Notes } from "@/components/notes/Notes";
import {TareasAsignadasComponent}  from "@/components/tasks/TA";
import { TareasFinalizadasComponent } from "@/components/tasks/TF";
import { TareasRecibidasComponent } from "@/components/tasks/TR";

export default function HomePage() {
  return (
    <div className="grid h-screen w-full grid-cols-4">
      <Notes/>
      <TareasAsignadasComponent/>
      <TareasRecibidasComponent/>
      <TareasFinalizadasComponent/>
    </div>
  );
}
