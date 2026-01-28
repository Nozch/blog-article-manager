import { describe, it, expect } from 'vitest'
import { nextState, type State } from '../logic/nextState'
import type { Article } from "../logic/article"


const articles = [
  { id: 'd1', visibility: 'draft' },
  { id: 'p1', visibility: 'public' },
  { id: 'x1', visibility: 'deleted' },
] as Article[]

const draftId = 'd1'

function withSelectableMap(state: State, selectable: Record<string, boolean>) {
  return { ...state, __selectable: selectable } as State & {
    __selectable: Record<string, boolean>
  }
}

describe('nextState: TOGGLE_SELECT', () => {
  it('一覧画面で記事の選択操作ができる', () => {
    const prev: State = {
      activeFilter: 'all',
      selectedIds: new Set(),
    }
    const newState = nextState(prev, { type: 'TOGGLE_SELECT', id: draftId }, articles)
    expect(newState.selectedIds.size).toBe(1)
    expect(prev.selectedIds.size).toBe(0)
  })


  it('同じ記事を再び選択すると、選択が解除される(トグル式)', () => {
    const prev: State = withSelectableMap(
      {
        activeFilter: 'draft',
        selectedIds: new Set([draftId]),
      },
      { [draftId]: true }
    )

    const newState = nextState(prev, { type: 'TOGGLE_SELECT', id: draftId }, articles)

    expect(newState.selectedIds.has(draftId)).toBe(false)
  })

})

describe('nextState: SET_FILTER', () => {
  it('フィルタの適用ができる', () => {
    const prev: State = {
      activeFilter: 'all',
      selectedIds: new Set(),
    }

    const newState = nextState(prev, { type: 'SET_FILTER', filter: 'draft' }, articles)

    expect(newState.activeFilter).toBe('draft')
  })
  it('フィルタを適用しても、選択した記事は維持される', () => {
    const prev: State = {
      activeFilter: 'draft',
      selectedIds: new Set(['d1']),
    }

    const newState = nextState(prev, { type: 'SET_FILTER', filter: 'public' }, articles)
    expect(newState.selectedIds).toEqual(new Set(['d1']))
    expect(newState.activeFilter).toBe('public')

  })
  it('フィルタの適用関数に入力した stateが破壊されないこと', () => {
    const prev: State = {
      activeFilter: 'all',
      selectedIds: new Set(['d1'])
    }

    nextState(prev, { type: 'SET_FILTER', filter: 'deleted' }, articles)

    expect(prev).toEqual({
      activeFilter: 'all',
      selectedIds: new Set(['d1'])
    })
  })
})