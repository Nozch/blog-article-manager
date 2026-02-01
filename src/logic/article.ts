import type { ArticleSchema } from "../data/loadArticles";
import { z } from 'zod'

export type Article = z.infer<typeof ArticleSchema>

export type Filter = 'all' | Article['publishStatus'];

export type State = {
  activeFilter: Filter,
  selectedIds: ReadonlySet<String>
};