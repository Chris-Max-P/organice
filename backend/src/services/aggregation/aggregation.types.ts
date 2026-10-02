// Aggregations-Model — siehe docs/specs/spec-backend.md, Abschnitt 7

export interface AggregationEntry {
  firstName: string;
  lastName: string;
}

export interface AggregationGroup {
  value: string;
  count: number;
  entries: AggregationEntry[];
}
