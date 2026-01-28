import type { Article } from "./article"

export type Visibility = 'draft' | 'public' | 'deleted'
export type Filter = 'all' | Visibility
export type Mode = 'browse' | 'publish'
export type State = {
  activeFilter: Filter
  mode: Mode
  selectedIds: Set<String>
}

export type Action =
  | { type: 'TOGGLE_PUBLISH_MODE' }
  | { type: 'TOGGLE_SELECT'; id: string }
  | { type: 'SET_FILTER'; filter: Filter }

function findArticleById(articles: Article[], id: string): Article | undefined {
  return articles.find((a) => a.id === id)
}

function isSelectable(article: Article, state: State): boolean {
  if (state.mode !== 'publish') return false
  return article.visibility === 'draft'
}

export function nextState(state: State, action: Action, articles: Article[]): State {
  switch (action.type) {
    case 'TOGGLE_PUBLISH_MODE': {
      if (state.mode === 'browse') {
        return { ...state, mode: 'publish', activeFilter: 'draft', selectedIds: new Set() }
      }
      // 作業終了：filterは維持して戻る（仕様）
      return { ...state, mode: 'browse', selectedIds: new Set() }
    }


    case 'TOGGLE_SELECT': {
      if (state.mode !== 'publish') return state

      const article = findArticleById(articles, action.id)
      if (!article) return state

      if (!isSelectable(article, state)) return state

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

