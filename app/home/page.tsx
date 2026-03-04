import { Notes } from "@/components/notes/Notes";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <div className="flex flex-col h-dvh">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <span className="text-sm font-medium">Inicio</span>
      </header>
      <KanbanBoard>
        <div className="h-full w-[90vw] shrink-0 snap-start lg:flex-1 lg:w-auto">
          <Notes />
        </div>
      </KanbanBoard>
    </div>
  );
}
