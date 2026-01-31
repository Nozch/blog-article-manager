import type { State } from "./article";
import type { Article } from "../data/loadArticles";

export function isVisible(article: Article, state: State): boolean {
  if (state.activeFilter === 'all') return true;
  return article.publishStatus === state.activeFilter;
}