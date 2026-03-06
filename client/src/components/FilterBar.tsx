import type { FilterBarProps } from "../types/component-props";
import type { FilterStatus } from "@todo/shared";

const FILTERS: { key: FilterStatus; label: string; icon: string }[] = [
  { key: "all",       label: "All",       icon: "bi-list-task"    },
  { key: "active",    label: "Active",    icon: "bi-clock"        },
  { key: "completed", label: "Completed", icon: "bi-check-circle" },
];

export const FilterBar = ({ filter, stats, onFilterChange }: FilterBarProps) => {
  const countFor = (key: FilterStatus) => {
    if (key === "all")       return stats.total;
    if (key === "active")    return stats.active;
    return stats.completed;
  };

  return (
    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
      <div className="btn-group" role="group" aria-label="Task filter">
        {FILTERS.map(({ key, label, icon }) => (
          <button
            key={key}
            type="button"
            className={`btn btn-sm ${filter === key ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => onFilterChange(key)}
          >
            <i className={`bi ${icon} me-2`} />
            {label}
            <span className={`badge ms-2 ${filter === key ? "bg-white text-primary" : "bg-secondary"}`}>
              {countFor(key)}
            </span>
          </button>
        ))}
      </div>

      {stats.total > 0 && (
        <small className="text-muted">
          <i className="bi bi-bar-chart-fill me-1 text-primary" />
          {Math.round((stats.completed / stats.total) * 100)}% complete
        </small>
      )}
    </div>
  );
};
