// Aggregation model — see docs/specs/spec-backend.md, section 7

export interface AggregationEntry {
  firstName: string;
  lastName: string;
}

export interface AggregationGroup {
  value: string;
  count: number;
  entries: AggregationEntry[];
}
