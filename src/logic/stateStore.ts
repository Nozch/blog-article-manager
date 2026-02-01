import type { State } from './article'
import type { Action } from './nextState'
import type { Article } from "./article"
import { nextState } from './nextState'

type Listener = (state: State) => void

export function createStateStore(initial: State) {
  let state = initial
  const listeners = new Set<Listener>()

  function get(): State {
    return state
  }

  function apply (action: Action, articles: Article[]) {
    const newState = nextState(state, action, articles)
    // 参照が同じなら通知不要
    if (newState === state) return
    state = newState
    for (const listener of listeners) listener(state)
  }

  function onChange(listener: Listener) {
    listeners.add(listener)
    // 初回のStateを同期している。
    listener(state)
    return () => listeners.delete(listener)
  }

  return { get, apply , onChange }
}