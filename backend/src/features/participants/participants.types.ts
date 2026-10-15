// Participants API model — see docs/specs/dashboard.md, "Participant overview"

export type GroupByField = 'category' | 'wantsToHelp';

export const GROUP_BY_FIELDS: GroupByField[] = ['category', 'wantsToHelp'];

export function isGroupByField(value: string): value is GroupByField {
  return (GROUP_BY_FIELDS as string[]).includes(value);
}
