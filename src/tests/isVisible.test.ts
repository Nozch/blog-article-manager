import { describe, it, expect } from 'vitest';
import { isVisible } from '../logic/isVisible';
import { type State } from "../logic/article";
import { makeArticle } from './helpers/articleFactory';

// isVisible関数は、以下の仕様とする。
// - フィルターが'all'の場合、全ての記事が表示される。
// - それ以外の時、フィルタと一致する記事「のみ」表示される。
// スコープ外: 不正なフィルター値の扱い, 複数フィルターの適用

describe('isVisible', () => {
  const draft = makeArticle({ id: '1', visibility: 'draft' });
  const pub = makeArticle({ id: 'p1', visibility: 'public' });
  const del = makeArticle({ id: 'x1', visibility: 'deleted' })

  it('filter=all => 全てtrue', () => {
    const state: State = { activeFilter: 'all' };
    expect(isVisible(draft, state)).toBe(true);
    expect(isVisible(pub, state)).toBe(true);
    expect(isVisible(del, state)).toBe(true);
  });

  it('filter=draft => draftだけtrue', () => {
    const state: State = { activeFilter: 'draft' };
    expect(isVisible(draft, state)).toBe(true);
    expect(isVisible(pub, state)).toBe(false);
    expect(isVisible(del, state)).toBe(false);
  });

  it('filter=public => publicだけtrue', () => {
    const state: State = { activeFilter: 'public' };
    expect(isVisible(draft, state)).toBe(false);
    expect(isVisible(pub, state)).toBe(true);
    expect(isVisible(del, state)).toBe(false);
  });

  it('filter=deleted => deletedだけtrue', () => {
    const state: State = { activeFilter: 'deleted' };
    expect(isVisible(draft, state)).toBe(false);
    expect(isVisible(pub, state)).toBe(false);
    expect(isVisible(del, state)).toBe(true);
  });
});