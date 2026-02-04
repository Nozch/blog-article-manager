import type { Article } from "./article";
import type { OperationCounts, SelectionSummary } from "./articleOperation";

export function summarizeSelection(
    selectedIds: ReadonlySet<string>,
    articles: readonly Article[]
): SelectionSummary {
    const byStatus: SelectionSummary['byStatus'] =
    { draft: 0, public: 0, deleted: 0 }
    
    const articleMap = new Map<string, Article>
    for (const a of articles) {
        articleMap.set(a.id, a)
    }
    for(const id of selectedIds) {
        const article = articleMap.get(id)
        if (!article) continue
        byStatus[article.publishStatus]++
    }

    const selectedTotal = byStatus.draft + byStatus.public + byStatus.deleted
    const nonZeroStatuses = Object.values(byStatus).filter((n) => n > 0)
    const isMixed = nonZeroStatuses.length >= 2

    const operationCounts: OperationCounts = {
        publish: byStatus.draft,
        unpublish: byStatus.public,
        restore: byStatus.deleted,
        purge: byStatus.deleted,
        trash: byStatus.draft + byStatus.public
    }

    return {
        selectedTotal,
        byStatus,
        isMixed,
        operationCounts,
    }

}