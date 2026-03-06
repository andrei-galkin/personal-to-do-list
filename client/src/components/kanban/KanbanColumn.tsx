import { useState } from "react";
import type { KanbanColumnProps } from "../../types/componentProps";
import type { TaskStatus } from "@todo/shared";
import { TaskCard } from "./TaskCard";

export const KanbanColumn = ({ column, tasks, onDragStart, onDrop, onEdit, onDelete }: KanbanColumnProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop      = (e: React.DragEvent) => { setIsDragOver(false); onDrop(e, column.id as TaskStatus); };

  return (
    <div className="d-flex flex-column" style={{ minWidth: 0 }}>
      {/* Column header */}
      <div
        className="d-flex align-items-center justify-content-between pb-2 mb-3"
        style={{ borderBottom: `3px solid ${column.accent}` }}
      >
        <div className="d-flex align-items-center gap-2">
          <i className={`bi ${column.icon}`} style={{ color: column.accent }} />
          <span className="fw-semibold">{column.label}</span>
        </div>
        <span
          className="badge rounded-pill"
          style={{ backgroundColor: column.accent, color: "#fff", fontSize: "0.7rem" }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        className="flex-grow-1 rounded-3 p-2"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          minHeight: 200,
          background: isDragOver ? "rgba(0,0,0,0.04)" : "transparent",
          border: isDragOver ? "2px dashed #adb5bd" : "2px dashed transparent",
          transition: "background 0.15s ease, border-color 0.15s ease",
        }}
      >
        {tasks.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5">
            <i
              className={`bi ${column.icon} mb-2`}
              style={{ fontSize: "1.6rem", color: column.accent, opacity: 0.25 }}
            />
            <small className="text-muted">Drop tasks here</small>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDragStart={onDragStart}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};
