import raw from '../data/articles.json'
import { z } from 'zod'
import type { Article } from '../logic/article'

export const PublishStatusSchema = z.enum(['draft', 'public', 'deleted'])

export const ArticleSchema = z.object({
    id: z.string().min(1),
    publishStatus: PublishStatusSchema,
    title: z.string().min(1),
    lead: z.string().optional(),
})

export const ArticlesSchema = z.array(ArticleSchema)


export async function loadArticles(): Promise<Article[]> {
    const parsed = ArticlesSchema.parse(raw)
    return parsed as Article[]
}