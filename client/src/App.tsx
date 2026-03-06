import { useTasks } from "./hooks/useTasks";
import { TaskForm } from "./components/TaskForm";
import { TaskItem } from "./components/TaskItem";
import { FilterBar } from "./components/FilterBar";
import type { TaskFormValues } from "../../shared/types";

export default function App() {
  const {
    filteredTasks,
    loading,
    error,
    filter,
    stats,
    setFilter,
    addTask,
    updateTask,
    removeTask,
    toggleTask,
    clearError,
    refresh,
  } = useTasks();

  const handleAdd = async (values: TaskFormValues) => {
    await addTask({ ...values, completed: false });
  };

  const handleUpdate = async (id: string, values: TaskFormValues) => {
    await updateTask(id, values);
  };

  return (
    <div className="app-wrapper min-vh-100">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="app-header py-4 mb-5">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h1 className="display-6 fw-bold mb-0 text-white">
                <i className="bi bi-check2-all me-2" />
                TaskFlow
              </h1>
              <p className="mb-0 text-white-50 small">
                Stay organized, stay productive
              </p>
            </div>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={refresh}
              title="Refresh tasks"
            >
              <i className="bi bi-arrow-clockwise" />
            </button>
          </div>
        </div>
      </header>

      <div className="container pb-5">
        <div className="row g-4">
          {/* ── Left: Add Task Panel ──────────────────────────────────────── */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm sticky-top sticky-offset">
              <div className="card-header bg-white border-0 pt-4 pb-0">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-plus-circle-fill text-primary me-2" />
                  New Task
                </h5>
              </div>
              <div className="card-body">
                <TaskForm onSubmit={handleAdd} autoFocus submitLabel="Add Task" />
              </div>

              {/* ── Stats Card ───────────────────────────────────────────── */}
              <div className="card-footer bg-light border-0 rounded-bottom">
                <div className="row text-center g-0">
                  <div className="col border-end">
                    <div className="py-2">
                      <div className="h4 mb-0 fw-bold text-primary">{stats.total}</div>
                      <div className="small text-muted">Total</div>
                    </div>
                  </div>
                  <div className="col border-end">
                    <div className="py-2">
                      <div className="h4 mb-0 fw-bold text-warning">{stats.active}</div>
                      <div className="small text-muted">Active</div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="py-2">
                      <div className="h4 mb-0 fw-bold text-success">{stats.completed}</div>
                      <div className="small text-muted">Done</div>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                {stats.total > 0 && (
                  <div className="px-1 pb-1">
                    <div
                      className="progress"
                      style={{ height: "6px" }}
                      title={`${Math.round((stats.completed / stats.total) * 100)}% complete`}
                    >
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

          {/* ── Right: Task List ──────────────────────────────────────────── */}
          <div className="col-lg-8">
            {/* Error alert */}
            {error && (
              <div className="alert alert-danger alert-dismissible d-flex align-items-center mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2 flex-shrink-0" />
                <div>{error}</div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={clearError}
                  aria-label="Close"
                />
              </div>
            )}

            {/* Filter Bar */}
            <FilterBar filter={filter} stats={stats} onFilterChange={setFilter} />

            {/* Loading skeleton */}
            {loading && (
              <div>
                {[1, 2, 3].map((n) => (
                  <div key={n} className="card mb-3 border-0 shadow-sm">
                    <div className="card-body">
                      <div className="placeholder-glow">
                        <span className="placeholder col-8 mb-2 d-block rounded" />
                        <span className="placeholder col-5 d-block rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && filteredTasks.length === 0 && (
              <div className="text-center py-5">
                <div
                  className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: 80, height: 80 }}
                >
                  <i
                    className={`bi ${
                      filter === "completed"
                        ? "bi-check2-circle"
                        : filter === "active"
                        ? "bi-inbox"
                        : "bi-clipboard2-plus"
                    } text-muted`}
                    style={{ fontSize: "2rem" }}
                  />
                </div>
                <h5 className="text-muted fw-semibold">
                  {filter === "completed"
                    ? "No completed tasks yet"
                    : filter === "active"
                    ? "Nothing active — great job!"
                    : "No tasks yet"}
                </h5>
                <p className="text-muted small">
                  {filter === "all"
                    ? "Add your first task using the form on the left."
                    : "Change the filter to see other tasks."}
                </p>
              </div>
            )}

            {/* Task list */}
            {!loading &&
              filteredTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggle={toggleTask}
                  onUpdate={handleUpdate}
                  onDelete={removeTask}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
