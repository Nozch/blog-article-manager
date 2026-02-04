import type { Article } from "../../logic/article";

let seq = 1
export function makeArticle(overrides?: Partial<Article>): Article {
    const id = overrides?.id ?? `a${seq++}`
    return {
        id,
        publishStatus: 'draft',
        title: 'dummy',
        lead: 'dummy',
        ...overrides,
    }
}