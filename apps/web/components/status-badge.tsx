import type { ProjectStatus } from "@lakefront/contracts";

const labels: Record<ProjectStatus, string> = {
  LAND_OPPORTUNITY: "Land opportunity",
  ACTIVE_DEVELOPMENT: "Active development",
  FUTURE_RESORT: "Future resort",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={`status-badge status-badge--${status.toLowerCase()}`}>{labels[status]}</span>;
}
