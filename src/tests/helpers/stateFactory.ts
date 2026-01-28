import type { State, Filter } from '../../logic/article'

export function makeState(overrides: Partial<State> = {}): State {
  return {
    activeFilter: 'all' satisfies Filter,
    selectedIds: new Set<string>(),
    ...overrides,
  }
}