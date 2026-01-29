import type { Article, Visibility, State } from '../logic/article';
import { isVisible } from '../logic/isVisible';
import { articles } from '../main';

function badgeKind(v: Visibility) {
  // あなたの現状ルール
  // public: accent + soft
  // draft/deleted: neutral + soft
  return v === 'public' ? 'badge-accent' : 'badge-neutral'
}

function createArticleRowFromTemplate(tpl: HTMLTemplateElement, a: Article): HTMLElement {
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement

  node.dataset.articleId = a.id

  const badge = node.querySelector<HTMLElement>('.badge')
  if (!badge) throw new Error('template: .badge not found')
  badge.textContent = a.visibility
  badge.classList.add(badgeKind(a.visibility))

  const titleEl = node.querySelector<HTMLElement>('.article-title')
  if (!titleEl) throw new Error('template: .article-title not found')
  titleEl.textContent = a.title

  const leadEl = node.querySelector<HTMLElement>('.article-lead')
  if (leadEl) {
    const lead = a.lead?.trim()
    if (lead) leadEl.textContent = lead
    else leadEl.remove()
  }

  return node
}

export function renderArticleList(state: State, articles: Article[]) {
  const ul = document.querySelector<HTMLUListElement>('#article-list')
  if (!ul) throw new Error('#article-list not found')

  const tpl = document.querySelector<HTMLTemplateElement>('#article-row-template')
  if (!tpl) throw new Error('#article-row-template not found')

  // 1) まず「一覧を articles から生成」する
  //    - 既存の固定ヘッダが <li> として1つ入ってるなら残す
  const headerLi = ul.querySelector('li') // 先頭が "Articles" 見出し前提
  const rows = articles.map((a) => createArticleRowFromTemplate(tpl, a))

  ul.replaceChildren(...(headerLi ? [headerLi, ...rows] : rows))

  
  ul.querySelectorAll<HTMLElement>('[data-article-id]').forEach((row) => {
    const id = row.dataset.articleId!
    const article = articles.find((a) => a.id === id)
    if (!article) return
    row.classList.toggle('hidden', !isVisible(article, state))
  })
}

export function renderArticleListFilter(state: State) {
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


