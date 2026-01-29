import { describe, it, expect } from 'vitest';
import { isVisible } from '../logic/isVisible';
import { makeArticle } from './helpers/articleFactory';
import { makeState } from './helpers/stateFactory';

// isVisible関数は、以下の仕様とする。
// - フィルターが'all'の場合、全ての記事が表示される。
// - それ以外の時、フィルタと一致する記事のみ表示される。
// スコープ外: 不正なフィルター値の扱い, 複数フィルターの適用



describe('isVisible', () => {
  const draft = makeArticle({ id: '1', publishStatus: 'draft' });
  const pub = makeArticle({ id: 'p1', publishStatus: 'public' });
  const del = makeArticle({ id: 'x1', publishStatus: 'deleted' })

  it('filter=all => 全てtrue', () => {
    const state = makeState({ activeFilter: 'all' });
    expect(isVisible(draft, state)).toBe(true);
    expect(isVisible(pub, state)).toBe(true);
    expect(isVisible(del, state)).toBe(true);
  });

  it('filter=draft => draftだけtrue', () => {
    const state = makeState({ activeFilter: 'draft' });
    expect(isVisible(draft, state)).toBe(true);
    expect(isVisible(pub, state)).toBe(false);
    expect(isVisible(del, state)).toBe(false);
  });

  it('filter=public => publicだけtrue', () => {
    const state = makeState({ activeFilter: 'public' });
    expect(isVisible(draft, state)).toBe(false);
    expect(isVisible(pub, state)).toBe(true);
    expect(isVisible(del, state)).toBe(false);
  });

  it('filter=deleted => deletedだけtrue', () => {
    const state = makeState({ activeFilter: 'deleted' });
    expect(isVisible(draft, state)).toBe(false);
    expect(isVisible(pub, state)).toBe(false);
    expect(isVisible(del, state)).toBe(true);
  });
});