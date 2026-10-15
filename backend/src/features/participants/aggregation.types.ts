// Aggregation model — see docs/specs/dashboard.md, "Participant overview"

export interface AggregationEntry {
  firstName: string;
  lastName: string;
}

export interface AggregationGroup {
  value: string;
  count: number;
  entries: AggregationEntry[];
}
