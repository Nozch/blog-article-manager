import { describe, it, expect } from 'vitest'
import { summarizeSelection } from '../logic/summarizeSelection'
import { makeArticle } from './helpers/articleFactory'
import type { Article } from '../logic/article'

describe('summarizeSelection', () => {
    it('何も選択していない状態で、記事合計、行える操作カウントが0になる', () => {
        const articles: Article[] = [
            makeArticle({ publishStatus:'draft' }),
            makeArticle({ publishStatus: 'public' }),
            makeArticle({ publishStatus: 'deleted' })
        ]
        const res = summarizeSelection(new Set(), articles)

        expect(res.selectedTotal).toBe(0)
        expect(res.isMixed).toBe(false)
        expect(res.operationCounts.publish).toBe(0)
    })

    it('draftのみ選択', () => {
        const d1 = makeArticle({ publishStatus:'draft' })
        const d2 = makeArticle({ publishStatus: 'draft' })
        const p1 = makeArticle({ publishStatus: 'public' })

        const res = summarizeSelection(
            new Set([d1.id, d2.id]), [d1,d2,p1]
        )
        expect(res.byStatus).toEqual({
            draft:2,
            public:0,
            deleted:0
        })
        expect(res.operationCounts).toEqual({
            publish:2,
            unpublish:0,
            trash:2,
            restore:0,
            purge:0,
        })
    })

    it('publicのみ選択', () => {
        const p1 = makeArticle({ publishStatus:'public' })
        const p2 = makeArticle({ publishStatus:'public' })

        const res = summarizeSelection(
            new Set([p1.id, p2.id]), [p1,p2]
        )

        expect(res.operationCounts.unpublish).toBe(2)
        expect(res.operationCounts.trash).toBe(2)
    })

    it('deletedのみ選択', () => {
        const x1 = makeArticle({ publishStatus:'deleted' })
        const x2 = makeArticle({ publishStatus:'deleted' })

        const res = summarizeSelection(
            new Set([x1.id, x2.id]), [x1,x2]
        )

        expect(res.operationCounts.restore).toBe(2)
        expect(res.operationCounts.purge).toBe(2)
        expect(res.operationCounts.trash).toBe(0)
    })

    it('状態の異なる記事が選択された場合関数で検知できる', () => {
        const d = makeArticle({ publishStatus:'draft' })
        const p = makeArticle({ publishStatus:'public' })
        const res = summarizeSelection(
            new Set([d.id, p.id]),
            [d,p]
        )
        expect(res.isMixed).toBe(true)
        expect(res.operationCounts.publish).toBe(1)
        expect(res.operationCounts.unpublish).toBe(1)
        expect(res.operationCounts.trash).toBe(2)
    })
})