import { useEffect, useRef } from "react";
import type { EditTaskModalProps } from "../../types/componentProps";
import { TaskForm } from "../TaskForm";

export const EditTaskModal = ({ task, onSave, onClose }: EditTaskModalProps) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  if (!task) return null;

  const handleSave = async (values: { title: string; description: string }) => {
    await onSave(task._id, values);
    onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1050,
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        className="card border-0 shadow-lg"
        style={{ width: "100%", maxWidth: 480, borderRadius: 16 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-header bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-pencil-square text-primary me-2" />
            Edit Task
          </h5>
          <button className="btn btn-sm btn-outline-secondary border-0" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="card-body pt-3">
          <TaskForm
            onSubmit={handleSave}
            initialValues={{ title: task.title, description: task.description }}
            submitLabel="Save Changes"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};
