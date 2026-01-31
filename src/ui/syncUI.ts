import type { State } from '../logic/article'
import type { Article } from '../data/loadArticles'
import { isVisible } from '../logic/isVisible'

export function updateFilterTabs(state: State) {
    document.querySelectorAll<HTMLElement>('[data-filter]').forEach((el) => {
        el.classList.toggle('tab-active', el.dataset.filter === state.activeFilter)
    })
}

export function updateArticleListVisibility(state: State, articles: Article[]) {
    const ul = document.querySelector<HTMLUListElement>('#article-list')
    if (!ul) throw new Error('#article-list not found')

    ul.querySelectorAll<HTMLElement>('[data-article-id]').forEach((row) => {
        const id = row.dataset.articleId
        if (!id) return
        const article = articles.find((a) => a.id === id)
        if (!article) return
        row.classList.toggle('hidden', !isVisible(article,state))
    })
}

export function syncFilterUI(state: State, articles: Article[]) {
    updateFilterTabs(state)
    updateArticleListVisibility(state, articles)
}