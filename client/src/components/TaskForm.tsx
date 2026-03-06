import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import type { TaskFormProps } from "../types/componentProps";
import type { TaskFormValues } from "@todo/shared";

// ─── Validation Schema ────────────────────────────────────────────────────────

const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be ≤ 100 characters"),
  description: z.string().max(500, "Description must be ≤ 500 characters").optional().default(""),
  completed: z.boolean().default(false),
});

const EMPTY: TaskFormValues = { title: "", description: "" };

export const TaskForm = ({
  onSubmit,
  initialValues = EMPTY,
  submitLabel = "Add Task",
  autoFocus = false,
}: TaskFormProps) => {
  const [values, setValues] = useState<TaskFormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<TaskFormValues>>({});
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) titleRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues.title, initialValues.description]); // eslint-disable-line

  const validate = (): boolean => {
    const result = CreateTaskSchema.safeParse({ ...values, completed: false });
    if (!result.success) {
      const fieldErrors: Partial<TaskFormValues> = {};
      result.error.errors.forEach((e) => {
        const key = e.path[0] as keyof TaskFormValues;
        if (key) fieldErrors[key] = e.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof TaskFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(values);
      setValues(EMPTY);
      titleRef.current?.focus();
    } catch {
      // Error handled by hook / parent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label htmlFor="title" className="form-label fw-semibold">
          Title <span className="text-danger">*</span>
        </label>
        <input
          ref={titleRef}
          id="title"
          name="title"
          type="text"
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
          placeholder="What needs to be done?"
          value={values.title}
          onChange={handleChange}
          maxLength={100}
          disabled={submitting}
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        <div className="form-text">{values.title.length}/100</div>
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label fw-semibold">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className={`form-control ${errors.description ? "is-invalid" : ""}`}
          placeholder="Add more details (optional)..."
          value={values.description}
          onChange={handleChange}
          rows={3}
          maxLength={500}
          disabled={submitting}
        />
        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
        <div className="form-text">{(values.description ?? "").length}/500</div>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={submitting || !values.title.trim()}
      >
        {submitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" />
            Saving…
          </>
        ) : (
          <>
            <i className="bi bi-plus-lg me-2" />
            {submitLabel}
          </>
        )}
      </button>
    </form>
  );
};
