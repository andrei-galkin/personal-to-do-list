import type { TaskCardProps } from "../../types/component-props";

const STATUS_BADGE = {
  ACTIVE:      { cls: "bg-warning-subtle text-warning border border-warning-subtle",  label: "Active"      },
  IN_PROGRESS: { cls: "bg-primary-subtle text-primary border border-primary-subtle",  label: "In Progress" },
  DONE:        { cls: "bg-success-subtle text-success border border-success-subtle",  label: "Done"        },
};

export const TaskCard = ({ task, onDragStart, onEdit, onDelete }: TaskCardProps) => {
  const badge = STATUS_BADGE[task.status];

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div
      className="task-card card border-0 shadow-sm mb-2"
      draggable
      onDragStart={(e) => onDragStart(e, task._id)}
      style={{ cursor: "grab", userSelect: "none" }}
    >
      <div className="card-body p-3">
        {/* Title + actions */}
        <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
          <p className={`fw-semibold mb-0 small flex-grow-1 ${task.completed ? "text-decoration-line-through text-muted" : ""}`}>
            {task.title}
          </p>
          <div className="d-flex gap-1 flex-shrink-0">
            <button
              className="btn p-0 px-1 btn-outline-secondary border-0"
              onClick={() => onEdit(task)}
              title="Edit"
              style={{ fontSize: "0.72rem" }}
            >
              <i className="bi bi-pencil" />
            </button>
            <button
              className="btn p-0 px-1 btn-outline-danger border-0"
              onClick={() => {
                if (window.confirm(`Delete "${task.title}"?`)) onDelete(task._id);
              }}
              title="Delete"
              style={{ fontSize: "0.72rem" }}
            >
              <i className="bi bi-trash" />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-muted mb-2" style={{ fontSize: "0.78rem", lineHeight: 1.45 }}>
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-1 mt-2">
          <span className={`badge ${badge.cls}`} style={{ fontSize: "0.68rem" }}>
            {badge.label}
          </span>
          <small className="text-muted" style={{ fontSize: "0.7rem" }}>
            <i className="bi bi-calendar3 me-1" />
            {formattedDate}
          </small>
        </div>
      </div>
    </div>
  );
};
