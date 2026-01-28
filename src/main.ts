import './style.css'
import type { State, Action } from './logic/nextState'
import type { Article } from "./logic/article"
import { createStateStore } from './logic/stateStore'
import { render } from './ui/render'


const initial: State =  {
  activeFilter: 'all',
  selectedIds: new Set(),
}

export const articles = [
  { id: 'd1', visibility: 'draft',
    title: 'HIKAKINが妻のことを"つまお"と呼んでいる件について',
    lead: '血が繋がっていれば"キン"をつけるという説は本当なのか'
  },
  { id: 'p1', visibility: 'public',
    title: 'MEGWIN TVの視聴者層に関する考察',
    lead: '一体全体、誰が見ているのか'
  },
  { id: 'x1', visibility: 'deleted',
    title: '"マスオでぇす！"のあいさつに隠された深い意味の考察', 
    lead: 'この記事は世に出るべきではないかもしれない'
  },
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
// 記事のチェックボックス用リスナー
app.addEventListener('click', (e) => {
  const target = e.target as HTMLElement

  const checkbox = target.closest<HTMLInputElement>('[data-action="toggle-select"]')
  if (checkbox) {
    const row = checkbox.closest<HTMLElement>('[data-article-id]')
    const id = row?.dataset.articleId
    if (!id) return
    stateStore.apply({ type: 'TOGGLE_SELECT', id }, articles)
    return 
  }
})


