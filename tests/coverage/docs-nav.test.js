import { describe, expect, it } from 'vitest';

import { DOCS_NAV, DOCS_ORDER, getPrevNext } from '../../src/lib/docs-nav';

describe('docs-nav', () => {
  it('groups every non-external sidebar item into the linear page order', () => {
    const navKeys = DOCS_NAV.flatMap((g) => g.items.filter((i) => !i.external).map((i) => i.key));
    const orderKeys = DOCS_ORDER.map((p) => p.key);
    for (const key of orderKeys) {
      expect(navKeys, `DOCS_ORDER key ${key} missing from DOCS_NAV`).toContain(key);
    }
  });

  it('uses unique keys across the sidebar', () => {
    const keys = DOCS_NAV.flatMap((g) => g.items.map((i) => i.key));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('starts every internal href with a leading slash', () => {
    for (const group of DOCS_NAV) {
      for (const item of group.items) {
        if (!item.external) {
          expect(item.href.startsWith('/'), `${item.key} href ${item.href}`).toBe(true);
        }
      }
    }
  });

  it('returns surrounding pages for an interior key', () => {
    const { prev, next } = getPrevNext('audit-prompt');
    expect(prev?.key).toBe('audit-model');
    expect(next?.key).toBe('guide-ts');
  });

  it('omits prev for the first page and next for the last', () => {
    const first = getPrevNext(DOCS_ORDER[0].key);
    const last = getPrevNext(DOCS_ORDER[DOCS_ORDER.length - 1].key);
    expect(first.prev).toBeUndefined();
    expect(first.next?.key).toBe(DOCS_ORDER[1].key);
    expect(last.next).toBeUndefined();
    expect(last.prev?.key).toBe(DOCS_ORDER[DOCS_ORDER.length - 2].key);
  });

  it('returns no neighbours for an unknown key', () => {
    const r = getPrevNext('does-not-exist');
    expect(r.prev).toBeUndefined();
    expect(r.next).toBeUndefined();
  });
});
