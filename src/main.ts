import './style.css'
import type { State, Action } from './logic/nextState'
import type { Article } from "./logic/article"
import { createStateStore } from './logic/stateStore'
import { render } from './ui/render'


const initial: State =  {
  mode: 'browse',
  activeFilter: 'all',
  selectedIds: new Set(),
}

export const articles = [
  { id: 'd1', visibility: 'draft',
    title: 'HIKAKINが妻のことを"つまお"と呼んでいる件について',
    lead: '血が繋がっていれば"キン"をつけるという説は本当なのか'
  },
  { id: 'p1', visibility: 'public' },
  { id: 'x1', visibility: 'deleted' },
] as Article[]

function createArticleRow(a: Article): HTMLElement {
  const tpl = document.getElementById('article-row-template') as HTMLTemplateElement
  const node = tpl.content.firstElementChild!.cloneNode(true) as HTMLElement
  node.dataset.articleId = a.id
  const badge = node.querySelector('.badge')!
  badge.textContent = a.visibility
  badge.classList.add(
    a.visibility === 'public' ? 'badge-accent' : 'badge-neutral'
  )
  node.querySelector('.article-title')!.textContent = a.title
  const leadEl = node.querySelector('.article-lead')!
  if (a.lead) {
    leadEl.textContent = a.lead
  } else {
    leadEl.remove()
  }
  return node
}

const stateStore = createStateStore(initial) 
stateStore.onChange(render)


const app = document.querySelector<HTMLDivElement>('#app')!
// フィルタ切り替えるリスナー
app.addEventListener('change', (e) => {
  const target = e.target as HTMLElement

  const tab = target.closest<HTMLInputElement>('[data-filter]')
  if (!tab) return

  const filter = tab.dataset.filter as State['activeFilter']
  const action: Action = { type: 'SET_FILTER', filter }
  stateStore.apply(action, articles)
  return

})
// 記事公開モードへの移行用リスナー
app.addEventListener('click', (e) => {
  const target = e.target as HTMLElement
  const toggleBtn = target.closest<HTMLElement>('[data-action="toggle-publish-mode"]')
  if (toggleBtn) {
    stateStore.apply({ type: 'TOGGLE_PUBLISH_MODE'}, articles)
    return
  }

  const publishBtn = target.closest<HTMLElement>('[data-action="publish-selected"]')
  if (publishBtn) {
    console.log('publish selected', Array.from(stateStore.get().selectedIds))
    return
  }

  const checkbox = target.closest<HTMLInputElement>('[data-action="toggle-select"]')
  if (checkbox) {
    const row = checkbox.closest<HTMLElement>('[data-article-id]')
    const id = row?.dataset.articleId
    if (!id) return
    stateStore.apply({ type: 'TOGGLE_SELECT', id }, articles)
    return 
  }
})


