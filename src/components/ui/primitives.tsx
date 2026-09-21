import { useEffect, useRef } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type ButtonVariant = "primary" | "secondary" | "quiet";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({ variant = "secondary", className = "", children, ...props }: ButtonProps) {
  return (
    <button className={("button button--" + variant + " " + className).trim()} {...props}>
      {children}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

export function IconButton({ label, className = "", children, ...props }: IconButtonProps) {
  return (
    <button className={("icon-button " + className).trim()} aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}

export function Card({ className = "", children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={("card " + className).trim()} {...props}>
      {children}
    </section>
  );
}

export function Surface({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={("surface " + className).trim()} {...props}>
      {children}
    </div>
  );
}

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  detail?: string;
  tone?: "default" | "accent" | "positive" | "warning";
}

export function KpiCard({ label, value, unit, detail, tone = "default" }: KpiCardProps) {
  return (
    <Card className={"kpi-card kpi-card--" + tone}>
      <p className="eyebrow">{label}</p>
      <p className="kpi-value">
        <span>{value}</span>
        {unit && <span className="kpi-unit">{unit}</span>}
      </p>
      {detail && <p className="kpi-detail">{detail}</p>}
    </Card>
  );
}

const statusTone = (status: string): string => {
  if (["RECEIVED", "POSTED", "COMPLETE", "DELIVERED", "ACTIVE"].includes(status)) return "positive";
  if (["CONFIRMED", "IN_PROGRESS", "IN_TRANSIT", "OUT_FOR_DELIVERY", "ALLOCATED", "PICKING", "PACKED", "SHIPPED"].includes(status)) return "accent";
  if (["EXPECTED", "DRAFT", "NEW", "NOT_STARTED", "WAITING", "PLANNED", "DISPATCHED"].includes(status)) return "warning";
  return "neutral";
};

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <span className={"status-badge status-badge--" + statusTone(status)}>
      <span className="status-indicator" aria-hidden="true" />
      {label ?? status.replaceAll("_", " ")}
    </span>
  );
}

export function OperationalId({ children }: { children: ReactNode }) {
  return <span className="operational-id">{children}</span>;
}

export function Metric({ label, value, unit }: { label: string; value: string | number; unit?: string }) {
  return (
    <div className="metric">
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}{unit && <span className="metric-unit"> {unit}</span>}</span>
    </div>
  );
}

export function MetricDelta({ before, after, label }: { before: number; after: number; label: string }) {
  const change = after - before;
  return (
    <div className="metric-delta">
      <span className="metric-label">{label}</span>
      <span className="metric-delta-values">
        {before}<span aria-hidden="true"> → </span>{after}
        <span className={change >= 0 ? "delta-positive" : "delta-negative"}>
          {change >= 0 ? "+" : ""}{change}
        </span>
      </span>
    </div>
  );
}

export function SectionHeader({ title, trailing }: { title: string; trailing?: ReactNode }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {trailing}
    </div>
  );
}

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return <span className="tooltip-target" title={label}>{children}</span>;
}

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="dialog-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        className="dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <div className="dialog-mark" aria-hidden="true">!</div>
        <h2 id="dialog-title">{title}</h2>
        <p id="dialog-description">{description}</p>
        <div className="dialog-actions">
          <button ref={closeRef} className="button button--quiet" onClick={onClose}>Keep current progress</button>
          {children}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state">
      <span className="empty-state-mark" aria-hidden="true">—</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export function LoadingState({ label = "Loading scenario" }: { label?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="loading-state"
      role="status"
      aria-label={label}
      animate={reduceMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <span className="loading-line" />
      <span>{label}</span>
    </motion.div>
  );
}

export function ChartCard({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <Card className="chart-card">
      <SectionHeader title={title} />
      {description && <p className="section-description">{description}</p>}
      <div className="chart-region">{children ?? <EmptyState title="Visualization extension point" description="Add a chart when it helps explain a scenario decision." />}</div>
    </Card>
  );
}

export function DataTable({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="table-scroll">
      <table aria-label={label}>{children}</table>
    </div>
  );
}

export function DataTableHead({ children }: { children: ReactNode }) {
  return <thead><tr>{children}</tr></thead>;
}

export function DataTableCell({ children, numeric = false }: { children: ReactNode; numeric?: boolean }) {
  return <td className={numeric ? "table-numeric" : undefined}>{children}</td>;
}
