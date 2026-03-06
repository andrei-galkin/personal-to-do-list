import { useState } from "react";
import { useTasks } from "./hooks/use-tasks";
import { TaskForm } from "./components/TaskForm";
import { KanbanBoard } from "./components/kanban/KanbanBoard";
import { EditTaskModal } from "./components/kanban/EditTaskModal";
import type { Task, TaskFormValues } from "../../shared/types";

export default function App() {
  const { tasks, loading, error, stats, addTask, updateTask, moveTask, removeTask, clearError, refresh } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAdd = async (values: TaskFormValues) => {
    await addTask({ title: values.title, description: values.description, status: "ACTIVE" });
  };

  const handleSave = async (id: string, values: TaskFormValues) => {
    await updateTask(id, values);
  };

  return (
    <div className="app-wrapper min-vh-100">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="app-header py-4 mb-5">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h1 className="display-6 fw-bold mb-0 text-white">
                <i className="bi bi-kanban me-2" />
                Personal To‑Do List
              </h1>
              <p className="mb-0 text-white-50 small">Stay organized, stay productive</p>
            </div>
            <button className="btn btn-sm btn-outline-light" onClick={refresh} title="Refresh">
              <i className="bi bi-arrow-clockwise" />
            </button>
          </div>
        </div>
      </header>

      <div className="container-fluid px-4 pb-5">
        <div className="row g-4">

          {/* ── Left: Add Task Panel ───────────────────────────────────────── */}
          <div className="col-xl-3 col-lg-4">
            <div className="card border-0 shadow-sm sticky-top" style={{ top: "1rem" }}>
              <div className="card-header bg-white border-0 pt-4 pb-0">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-plus-circle-fill text-primary me-2" />
                  New Task
                </h5>
              </div>
              <div className="card-body">
                <TaskForm onSubmit={handleAdd} autoFocus submitLabel="Add Task" />
              </div>

              {/* Stats */}
              <div className="card-footer bg-light border-0 rounded-bottom">
                <div className="row text-center g-0">
                  <div className="col border-end">
                    <div className="py-2">
                      <div className="h5 mb-0 fw-bold text-primary">{stats.total}</div>
                      <div className="small text-muted">Total</div>
                    </div>
                  </div>
                  <div className="col border-end">
                    <div className="py-2">
                      <div className="h5 mb-0 fw-bold" style={{ color: "#f59e0b" }}>{stats.active}</div>
                      <div className="small text-muted">Active</div>
                    </div>
                  </div>
                  <div className="col border-end">
                    <div className="py-2">
                      <div className="h5 mb-0 fw-bold" style={{ color: "#3b82f6" }}>{stats.inProgress}</div>
                      <div className="small text-muted">In Prog.</div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="py-2">
                      <div className="h5 mb-0 fw-bold text-success">{stats.completed}</div>
                      <div className="small text-muted">Done</div>
                    </div>
                  </div>
                </div>

                {stats.total > 0 && (
                  <div className="px-1 pb-2 pt-1">
                    <div className="progress" style={{ height: 6 }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{
                          width: `${(stats.completed / stats.total) * 100}%`,
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: Kanban Board ────────────────────────────────────────── */}
          <div className="col-xl-9 col-lg-8">

            {/* Error alert */}
            {error && (
              <div className="alert alert-danger alert-dismissible d-flex align-items-center mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2 flex-shrink-0" />
                <div>{error}</div>
                <button type="button" className="btn-close" onClick={clearError} aria-label="Close" />
              </div>
            )}

            {/* Loading skeleton */}
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
                {[1, 2, 3].map((n) => (
                  <div key={n} className="card border-0 shadow-sm">
                    <div className="card-body">
                      <div className="placeholder-glow">
                        <span className="placeholder col-6 mb-3 d-block rounded" style={{ height: 12 }} />
                        {[1, 2, 3].map((i) => (
                          <span key={i} className="placeholder col-12 mb-2 d-block rounded" style={{ height: 70 }} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <KanbanBoard
                tasks={tasks}
                onStatusChange={moveTask}
                onEdit={setEditingTask}
                onDelete={removeTask}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Edit Modal ───────────────────────────────────────────────────────── */}
      <EditTaskModal
        task={editingTask}
        onSave={handleSave}
        onClose={() => setEditingTask(null)}
      />
    </div>
  );
}
