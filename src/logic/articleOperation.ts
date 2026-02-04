type PublishStatus = 'draft' | 'public' | 'deleted'

type ArticleOperation =
  | 'publish'
  | 'unpublish'
  | 'trash'
  | 'restore'
  | 'purge'

export type OperationCounts = Record<ArticleOperation, number>
export type SelectedCountsByStatus = Record<PublishStatus, number>

export type SelectionSummary = {
  selectedTotal: number
  byStatus: SelectedCountsByStatus
  isMixed: boolean,
  operationCounts: OperationCounts
}