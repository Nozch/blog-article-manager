import { describe, it, expect } from 'vitest'
import { nextState, type State } from '../logic/nextState'
import type { Article } from "../logic/article"


const articles = [
  { id: 'd1', visibility: 'draft' },
  { id: 'p1', visibility: 'public' },
  { id: 'x1', visibility: 'deleted' },
] as Article[]

const ids = new Set(articles.map(a => a.id))

describe('nextState: TOGGLE_PUBLISH_MODE', () => {
  it('ブラウズモード→公開モードへの移行時、下書きの記事だけのフィルタになる', () => {
    const prev: State = { mode: 'browse', activeFilter: 'all', selectedIds: ids }

    const newState = nextState(prev, { type: 'TOGGLE_PUBLISH_MODE' }, articles)

    expect(newState.mode).toBe('publish')
    expect(newState.activeFilter).toBe('draft')
  })

  it('公開モード→ブラウズモードへの移行時、記事のフィルタは変更しない', () => {
    const prev: State = { mode: 'publish', activeFilter: 'public', selectedIds: ids } // publish中に覗いていた想定

    const newState = nextState(prev, { type: 'TOGGLE_PUBLISH_MODE' }, articles)

    expect(newState.mode).toBe('browse')
    expect(newState.activeFilter).toBe('public') // 維持される（仕様）
  })

  it('記事公開モードへの移行時、前回のStateも破壊されず維持される', () => {
    const prev: State = { mode: 'browse', activeFilter: 'all', selectedIds: ids }

    nextState(prev, { type: 'TOGGLE_PUBLISH_MODE' }, articles)

    expect(prev).toEqual({ mode: 'browse', activeFilter: 'all', selectedIds: ids }) // 変更されていない
  })
})

const draftId = 'd1'
const publicId = 'p1'
const deletedId = 'x1'


function withSelectableMap(state: State, selectable: Record<string, boolean>) {
  return { ...state, __selectable: selectable } as State & {
    __selectable: Record<string, boolean>
  }
}

describe('nextState: TOGGLE_SELECT', () => {
  it('ブラウズモードでは記事の選択操作ができない', () => {
    const prev: State = {
      mode: 'browse',
      activeFilter: 'all',
      selectedIds: new Set(),
    }

    const newState = nextState(prev, { type: 'TOGGLE_SELECT', id: draftId }, articles)

    expect(newState.selectedIds.size).toBe(0)
    expect(prev.selectedIds.size).toBe(0)
  })

  it('記事の公開モードでは、下書きの記事のみ選択可能', () => {
    const prev: State = withSelectableMap(
      {
        mode: 'publish',
        activeFilter: 'draft',
        selectedIds: new Set(),
      },
      { [draftId]: true }
    )

    const newState = nextState(prev, { type: 'TOGGLE_SELECT', id: draftId }, articles)

    expect(newState.selectedIds.has(draftId)).toBe(true)
  })

  it('同じ記事を再び選択すると、選択が解除される(トグル式)', () => {
    const prev: State = withSelectableMap(
      {
        mode: 'publish',
        activeFilter: 'draft',
        selectedIds: new Set([draftId]),
      },
      { [draftId]: true }
    )

    const newState = nextState(prev, { type: 'TOGGLE_SELECT', id: draftId }, articles)

    expect(newState.selectedIds.has(draftId)).toBe(false)
  })

  it('記事の公開モード時、すでに公開されている記事は選択できない', () => {
    const prev: State = withSelectableMap(
      {
        mode: 'publish',
        activeFilter: 'public',
        selectedIds: new Set(),
      },
      { [publicId]: false }
    )

    const newState = nextState(prev, { type: 'TOGGLE_SELECT', id: publicId }, articles)

    expect(newState.selectedIds.size).toBe(0)
  })

  it('記事の公開モード時、削除済みの記事は選択できない', () => {
    const prev: State = withSelectableMap(
      {
        mode: 'publish',
        activeFilter: 'deleted',
        selectedIds: new Set(),
      },
      { [deletedId]: false }
    )
    const newState = nextState(prev, { type: 'TOGGLE_SELECT', id: deletedId }, articles)

    expect(newState.selectedIds.size).toBe(0)
  })
})

describe('nextState: SET_FILTER', () => {
  it('フィルタの適用ができる', () => {
    const prev: State = {
      mode: 'browse',
      activeFilter: 'all',
      selectedIds: new Set(),
    }

    const newState = nextState(prev, { type: 'SET_FILTER', filter: 'draft' }, articles)

    expect(newState.activeFilter).toBe('draft')
  })
  it('フィルタを適用しても、モードと選択した記事は維持される', () => {
    const prev: State = {
      mode: 'publish',
      activeFilter: 'draft',
      selectedIds: new Set(['d1']),
    }

    const newState = nextState(prev, { type: 'SET_FILTER', filter: 'public' }, articles)

    expect(newState.mode).toBe('publish')
    expect(newState.selectedIds).toEqual(new Set(['d1']))
    expect(newState.activeFilter).toBe('public')

  })
  it('フィルタの適用関数に入力した stateが破壊されないこと', () => {
    const prev: State = {
      mode: 'browse',
      activeFilter: 'all',
      selectedIds: new Set(['d1'])
    }

    nextState(prev, { type: 'SET_FILTER', filter: 'deleted' }, articles)

    expect(prev).toEqual({
      mode: 'browse',
      activeFilter: 'all',
      selectedIds: new Set(['d1'])
    })
  })
})