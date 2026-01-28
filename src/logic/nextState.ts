import type { Article } from "./article"

export type Visibility = 'draft' | 'public' | 'deleted'
export type Filter = 'all' | Visibility
export type Mode = 'browse' | 'publish'
export type State = {
  activeFilter: Filter
  selectedIds: Set<String>
}

export type Action =
  | { type: 'TOGGLE_SELECT'; id: string }
  | { type: 'SET_FILTER'; filter: Filter }

function findArticleById(articles: Article[], id: string): Article | undefined {
  return articles.find((a) => a.id === id)
}

export function nextState(state: State, action: Action, articles: Article[]): State {
  switch (action.type) {
    case 'TOGGLE_SELECT': {
      const article = findArticleById(articles, action.id)
      if (!article) return state

      if (!(article.visibility === 'draft')) return state

      const nextSelected = new Set(state.selectedIds)
      if (nextSelected.has(action.id)) nextSelected.delete(action.id)
      else nextSelected.add(action.id)

      return { ...state, selectedIds: nextSelected }
    }

    case 'SET_FILTER': {
      if (state.activeFilter === action.filter) return state
      return {
        ...state,
        activeFilter: action.filter
      }
    }
  }
}

