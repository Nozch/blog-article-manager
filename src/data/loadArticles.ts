import raw from './articles.json'
import { z } from 'zod'
export const PublishStatusSchema = z.enum(['draft', 'public', 'deleted'])

export const ArticleSchema = z.object({
    id: z.string().min(1),
    publishStatus: PublishStatusSchema,
    title: z.string().min(1),
    lead: z.string().optional(),
})

export const ArticlesSchema = z.array(ArticleSchema)

export type Article = z.infer<typeof ArticleSchema>

export function loadArticles(): Article[] {
    const parsed = ArticlesSchema.parse(raw)
    return parsed as Article[]
}