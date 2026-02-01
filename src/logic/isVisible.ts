import type { Article, State } from "./article";

export function isVisible(article: Article, state: State): boolean {
  if (state.activeFilter === 'all') return true;
  return article.publishStatus === state.activeFilter;
}