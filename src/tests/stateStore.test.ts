import { describe, it, expect, vi } from "vitest"
import { createStateStore } from "../logic/stateStore"
import type { State } from "../logic/nextState"
import type { Article } from "../logic/article"

const initial: State = {
      activeFilter: 'all',
      selectedIds: new Set(),
}

const articles = [
  { id: 'd1', publishStatus: 'draft' },
  { id: 'p1', publishStatus: 'public' },
  { id: 'x1', publishStatus: 'deleted' },
] as Article[]

describe('store', () => {
  it('apply すると state が更新される', () => {
    const store = createStateStore(initial)
    store.apply ({ type: 'SET_FILTER', filter: 'draft' }, articles)
    expect(store.get().activeFilter).toBe('draft')
  })

  it('onChange した listener が state 変更時に呼ばれる', () => {
    const store = createStateStore(initial)
    const spy = vi.fn()

    store.onChange(spy)
    store.apply ({ type: 'SET_FILTER', filter: 'draft' }, articles)

    expect(spy).toHaveBeenCalled()
  })

  it('同じ参照の state のときは通知されない（最適化が有効）', () => {
    const store = createStateStore(initial)
    const spy = vi.fn()

    store.onChange(spy)
    store.apply ({ type: 'SET_FILTER', filter: 'all' }, articles) // 変化なし

    expect(spy).toHaveBeenCalledTimes(1) // 初回通知のみ
  })
})