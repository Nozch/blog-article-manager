import { isVisible } from '../logic/isVisible';
import type { State } from '../logic/nextState';
import { articles } from '../main';

export function render(state: State) {
  // タブ形式のフィルタ
  document.querySelectorAll<HTMLElement>('[data-filter]').forEach((el) => {
    el.classList.toggle('tab-active', el.dataset.filter === state.activeFilter);
  });
  // 記事公開モードへの移行処理
  document.body.classList.toggle('mode-publish', state.mode === 'publish');
  const toggleBtn = document.querySelector<HTMLButtonElement>('[data-action="toggle-publish-mode"]');
  if (toggleBtn) {
    toggleBtn.textContent = state.mode === 'publish' ? 'Back to Browsing Articles'
      : 'Publish Articles';
  }
  const publishBtn = document.querySelector<HTMLButtonElement>('[data-action="publish-selected"]');
  if (publishBtn) {
    publishBtn.classList.toggle('hidden', state.mode !== 'publish');
    publishBtn.disabled = state.selectedIds.size === 0;
  }
  document.querySelectorAll<HTMLElement>('[data-article-id]').forEach((row) => {
    // 記事一覧へのフィルタ 
    const id = row.dataset.articleId!;
    const article = articles.find(article => article.id === id);
    if (!article) return;
    row.classList.toggle('hidden', !isVisible(article, state));

    // 記事公開モードでのcheckbox表示制御
    const checkbox = row.querySelector<HTMLInputElement>('[data-action="toggle-select"]');
    if (checkbox) {
      const inPublish = state.mode === 'publish';
      const isDraft = article.visibility === 'draft';
      checkbox.classList.toggle('hidden', !(inPublish && isDraft));
      checkbox.checked = state.selectedIds.has(id);
      checkbox.disabled = !(inPublish && isDraft);
    }
  });
}
