import { useRef } from "react";
import type { KanbanBoardProps } from "../../types/componentProps";
import type { TaskStatus } from "@todo/shared";
import { KANBAN_COLUMNS } from "@todo/shared";
import { KanbanColumn } from "./KanbanColumn";

export const KanbanBoard = ({ tasks, onStatusChange, onEdit, onDelete }: KanbanBoardProps) => {
  const draggingId = useRef<string | null>(null);

  const tasksByStatus = (status: TaskStatus) =>
    tasks
      .filter((t) => t.status === status)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    draggingId.current = taskId;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = draggingId.current ?? e.dataTransfer.getData("text/plain");
    draggingId.current = null;
    if (!taskId) return;

    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === targetStatus) return;

    await onStatusChange(taskId, targetStatus);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1.25rem",
        alignItems: "start",
      }}
    >
      {KANBAN_COLUMNS.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          tasks={tasksByStatus(column.id)}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
