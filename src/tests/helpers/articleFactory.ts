import type { Article } from "../../logic/article";

export function makeArticle(overrides?: Partial<Article>): Article {
    return {
        id: 'a1',
        visibility: 'draft',
        title: 'dummy',
        lead: 'dummy',
        ...overrides,
    }
}