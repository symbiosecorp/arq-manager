export type TaskStatus = "assigned" | "received" | "completed";
export type TaskPriority = "Alta" | "Media" | "Baja";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  order: number;
  priority?: TaskPriority;
  // Assigned column fields
  assignedTo?: string;
  dueDate?: string;
  // Received column fields
  from?: string;
  receivedDate?: string;
  // Completed column fields
  completedBy?: string;
  completedDate?: string;
}
