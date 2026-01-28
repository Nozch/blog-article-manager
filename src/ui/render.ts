import { isVisible } from '../logic/isVisible';
import type { State } from '../logic/nextState';
import { articles } from '../main';

export function render(state: State) {
  // タブ形式のフィルタ
  document.querySelectorAll<HTMLElement>('[data-filter]').forEach((el) => {
    el.classList.toggle('tab-active', el.dataset.filter === state.activeFilter);
  });

  document.querySelectorAll<HTMLElement>('[data-article-id]').forEach((row) => {
    // 記事一覧へのフィルタ 
    const id = row.dataset.articleId!;
    const article = articles.find(article => article.id === id);
    if (!article) return;
    row.classList.toggle('hidden', !isVisible(article, state));
  });
}
