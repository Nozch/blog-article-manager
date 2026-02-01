import './style.css'
import type { State } from './logic/article'
import type { Action } from './logic/nextState'
import { createStateStore } from './logic/stateStore'
import { buildArticleList } from './ui/articleListBuilder'
import { syncFilterUI } from './ui/syncUI'
import { loadArticles } from './data/loadArticles'

const articles = await loadArticles()
const initial: State =  {
  activeFilter: 'all',
  selectedIds: new Set(),
}

const stateStore = createStateStore(initial) 
buildArticleList(articles)

stateStore.onChange((state) => { 
  syncFilterUI(state, articles)
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