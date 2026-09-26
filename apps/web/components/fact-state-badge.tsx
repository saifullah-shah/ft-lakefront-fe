import type { FactState } from "@lakefront/contracts";

const labels: Record<FactState, string> = {
  CONFIRMED: "Confirmed",
  PENDING_CONFIRMATION: "Awaiting confirmation",
  CONCEPT: "Concept",
  NOT_AVAILABLE: "Not available",
};

export function FactStateBadge({ state }: { state: FactState }) {
  return <span className={`fact-state fact-state--${state.toLowerCase()}`}>{labels[state]}</span>;
}
