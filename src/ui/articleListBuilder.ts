import type { Article } from '../logic/article';

function badgeKind(status: Article['publishStatus']) {
  // あなたの現状ルール
  // public: accent + soft
  // draft/deleted: neutral + soft
  return status === 'public' ? 'badge-accent' : 'badge-neutral'
}

function createArticleRowFromTemplate(tpl: HTMLTemplateElement, a: Article): HTMLElement {
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement
  node.dataset.articleId = a.id

  const badge = node.querySelector<HTMLElement>('.badge')
  if (!badge) throw new Error('template: .badge not found')
  badge.textContent = a.publishStatus
  badge.classList.add(badgeKind(a.publishStatus))

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

export function buildArticleList(articles: Article[]) {
  const ul = document.querySelector<HTMLUListElement>('#article-list')
  if (!ul) throw new Error('#article-list not found')

  const tpl = document.querySelector<HTMLTemplateElement>('#article-row-template')
  if (!tpl) throw new Error('#article-row-template not found')
  
  const headerLi = ul.querySelector('li')
  const rows = articles.map((a) => createArticleRowFromTemplate(tpl, a))

  ul.replaceChildren(...(headerLi ? [headerLi, ...rows] : rows))
}