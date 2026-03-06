import { useState } from "react";
import type { TaskItemProps } from "../types/component-props";
import type { TaskFormValues } from "@todo/shared";
import { TaskForm } from "./TaskForm";

export const TaskItem = ({ task, onToggle, onUpdate, onDelete }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    setDeleting(true);
    try {
      await onDelete(task._id);
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdate = async (values: TaskFormValues) => {
    await onUpdate(task._id, values);
    setIsEditing(false);
  };

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className={`card mb-3 border-0 shadow-sm task-card ${task.completed ? "task-completed" : ""}`}>
      <div className="card-body">
        {isEditing ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="mb-0 text-muted fw-semibold">
                <i className="bi bi-pencil-square me-2" />
                Edit Task
              </h6>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setIsEditing(false)}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <TaskForm
              onSubmit={handleUpdate}
              initialValues={{ title: task.title, description: task.description }}
              submitLabel="Save Changes"
              autoFocus
            />
          </>
        ) : (
          <div className="d-flex gap-3">
            {/* Checkbox */}
            <div className="pt-1">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input task-checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task._id)}
                  id={`task-${task._id}`}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-grow-1 min-width-0">
              <label
                htmlFor={`task-${task._id}`}
                className={`task-label d-block fw-semibold mb-1 ${
                  task.completed ? "text-decoration-line-through text-muted" : ""
                }`}
              >
                {task.title}
              </label>

              {task.description && (
                <p className={`mb-2 small ${task.completed ? "text-decoration-line-through text-muted" : "text-secondary"}`}>
                  {task.description}
                </p>
              )}

              <div className="d-flex align-items-center gap-2 flex-wrap">
                {task.completed ? (
                  <span className="badge bg-success-subtle text-success border border-success-subtle">
                    <i className="bi bi-check-circle-fill me-1" />Completed
                  </span>
                ) : (
                  <span className="badge bg-warning-subtle text-warning border border-warning-subtle">
                    <i className="bi bi-clock me-1" />Active
                  </span>
                )}
                <small className="text-muted">
                  <i className="bi bi-calendar3 me-1" />{formattedDate}
                </small>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex gap-1 align-items-start">
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => setIsEditing(true)}
                title="Edit task"
              >
                <i className="bi bi-pencil" />
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleDelete}
                disabled={deleting}
                title="Delete task"
              >
                {deleting
                  ? <span className="spinner-border spinner-border-sm" />
                  : <i className="bi bi-trash" />
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
