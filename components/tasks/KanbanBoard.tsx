"use client";

import { useState, useCallback, useRef } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import type { DragEndEvent, DragMoveEvent } from "@dnd-kit/react";
import { initialTasks } from "./task-data";
import { Task, TaskStatus } from "./task-types";
import { TareasAsignadasComponent } from "./TA";
import { TareasRecibidasComponent } from "./TR";
import { TareasFinalizadasComponent } from "./TF";

const COLUMN_IDS: TaskStatus[] = ["assigned", "received", "completed"];

function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const result = [...array];
  const [removed] = result.splice(from, 1);
  result.splice(to, 0, removed);
  return result;
}

export function KanbanBoard({ children }: { children?: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const stopScroll = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const handleDragMove = useCallback(
    (...[event]: Parameters<DragMoveEvent>) => {
      const nativeEvent = event.nativeEvent;
      if (!nativeEvent || !("clientX" in nativeEvent)) return;

      const clientX = (nativeEvent as MouseEvent).clientX;
      const el = scrollRef.current;
      if (!el) return;

      stopScroll();

      const { left, right } = el.getBoundingClientRect();
      const threshold = 80;

      if (clientX > right - threshold) {
        const scroll = () => {
          el.scrollLeft += 6;
          rafRef.current = requestAnimationFrame(scroll);
        };
        rafRef.current = requestAnimationFrame(scroll);
      } else if (clientX < left + threshold) {
        const scroll = () => {
          el.scrollLeft -= 6;
          rafRef.current = requestAnimationFrame(scroll);
        };
        rafRef.current = requestAnimationFrame(scroll);
      }
    },
    [stopScroll],
  );

  const handleDragEnd = useCallback(
    (...[event]: Parameters<DragEndEvent>) => {
      stopScroll();

      const sourceId = String(event.operation.source?.id ?? "");
      const targetId = String(event.operation.target?.id ?? "");

      if (!sourceId || !targetId) return;

      if (sourceId === targetId) return;

      setTasks((prev) => {
        const sourceTask = prev.find((t) => t.id === sourceId);
        if (!sourceTask) return prev;

        const isTargetColumn = (COLUMN_IDS as string[]).includes(targetId);

        if (isTargetColumn) {
          const targetStatus = targetId as TaskStatus;
          if (sourceTask.status === targetStatus) return prev;

          const columnTasks = prev.filter((t) => t.status === targetStatus);
          const newOrder = columnTasks.length;

          return prev.map((t) =>
            t.id === sourceId ? { ...t, status: targetStatus, order: newOrder } : t,
          );
        }

        const targetTask = prev.find((t) => t.id === targetId);
        if (!targetTask) return prev;

        if (sourceTask.status === targetTask.status) {
          const columnTasks = prev
            .filter((t) => t.status === sourceTask.status)
            .sort((a, b) => a.order - b.order);

          const fromIndex = columnTasks.findIndex((t) => t.id === sourceId);
          const toIndex = columnTasks.findIndex((t) => t.id === targetId);

          const reordered = arrayMove(columnTasks, fromIndex, toIndex).map(
            (t, i) => ({ ...t, order: i }),
          );

          const reorderedIds = new Set(reordered.map((t) => t.id));
          return [
            ...prev.filter((t) => !reorderedIds.has(t.id)),
            ...reordered,
          ];
        }

        const targetColumn = targetTask.status;
        const targetColumnTasks = prev
          .filter((t) => t.status === targetColumn && t.id !== sourceId)
          .sort((a, b) => a.order - b.order);

        const insertIndex = targetColumnTasks.findIndex((t) => t.id === targetId);
        const insertAt = insertIndex === -1 ? targetColumnTasks.length : insertIndex;

        const updatedColumnTasks = [
          ...targetColumnTasks.slice(0, insertAt),
          { ...sourceTask, status: targetColumn, order: insertAt },
          ...targetColumnTasks.slice(insertAt),
        ].map((t, i) => ({ ...t, order: i }));

        const updatedIds = new Set(updatedColumnTasks.map((t) => t.id));
        return [
          ...prev.filter((t) => !updatedIds.has(t.id) && t.id !== sourceId),
          ...updatedColumnTasks,
        ];
      });
    },
    [stopScroll],
  );

  const assignedTasks = tasks
    .filter((t) => t.status === "assigned")
    .sort((a, b) => a.order - b.order);

  const receivedTasks = tasks
    .filter((t) => t.status === "received")
    .sort((a, b) => a.order - b.order);

  const completedTasks = tasks
    .filter((t) => t.status === "completed")
    .sort((a, b) => a.order - b.order);

  return (
    <DragDropProvider onDragEnd={handleDragEnd} onDragMove={handleDragMove}>
      <div
        ref={scrollRef}
        className="flex flex-1 min-h-0 overflow-x-auto snap-x snap-proximity"
      >
        {children}
        <div className="contents">
          <TareasAsignadasComponent tasks={assignedTasks} />
          <TareasRecibidasComponent tasks={receivedTasks} />
          <TareasFinalizadasComponent tasks={completedTasks} />
        </div>
      </div>
    </DragDropProvider>
  );
}
