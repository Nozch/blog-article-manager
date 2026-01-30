import raw from './articles.json'
import type { Article } from '../logic/article'

export function loadArticles(): Article[] {
    return raw as Article[]
}