import { Notes } from "@/components/notes/Notes";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";

export default function HomePage() {
  return (
    <div className="h-screen w-full overflow-auto p-4 lg:p-0">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-0 lg:h-full">
        <div className="h-96 lg:h-full">
          <Notes />
        </div>
        <KanbanBoard />
      </div>
    </div>
  );
}
