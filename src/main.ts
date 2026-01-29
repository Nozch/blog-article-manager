import './style.css'
import type { State, Action } from './logic/nextState'
import type { Article } from "./logic/article"
import { createStateStore } from './logic/stateStore'
import { renderArticleList, renderArticleListFilter,} from './ui/articleListRenderer'


const initial: State =  {
  activeFilter: 'all',
  selectedIds: new Set(),
}

export const articles = [
  { id: 'd1', visibility: 'draft',
    title: 'draft draft',
    lead: 'Drift drift kyu kyu kyu'
  },
  { id: 'p1', visibility: 'public',
    title: 'Public Public',
    lead: 'look around, there are public'
  },
  { id: 'x1', visibility: 'deleted',
    title: 'this one is already deleted,', 
    lead: 'and you should have leave here soon'
  },
] as Article[]



const stateStore = createStateStore(initial) 
renderArticleList(stateStore.get(), articles)

stateStore.onChange((state) => { 
  renderArticleListFilter
  renderArticleList(state, articles)
})


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


