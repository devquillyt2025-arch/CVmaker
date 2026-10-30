/**
 * Predicts where the exported PDF's pages will break, from the on-screen sheet.
 *
 * The preview is one continuous sheet; print splits it into pages following the
 * `@media print` rules in globals.css, and this mirrors them:
 * - short entries (fewer than 3 bullets) and single bullets are never split, so
 *   one straddling the page end moves whole to the next page;
 * - headings and an entry's title lines stay with whatever follows them;
 * - padding repeats on every page (`box-decoration-break: clone`), so later
 *   pages hold less than the first.
 * Side-by-side columns paginate independently; the longest one sets the count.
 * Keep these selectors in step with globals.css.
 */

const KEEP_WITH_NEXT = '.resume-heading, h1, h2, h3, .resume-entry > :not(ul):not(ol):not(:last-child)';

interface Box { top: number; bottom: number; nextTop?: number }

/** Break offsets (px from the sheet top) of the column that runs to the most pages. */
export function pageBreaks(sheet: HTMLElement, pageH: number): number[] {
  const root = sheet.firstElementChild;
  if (!root || !sheet.offsetHeight) return [];

  const cache = new Map<Element, CSSStyleDeclaration>();
  const style = (e: Element) => cache.get(e) ?? cache.set(e, getComputedStyle(e)).get(e)!;
  const sheetRect = sheet.getBoundingClientRect();
  // The builder scales the preview with a transform; work in layout px.
  const scale = sheetRect.height / sheet.offsetHeight || 1;
  const y = (v: number) => (v - sheetRect.top) / scale;
  const box = (e: Element): Box => {
    const r = e.getBoundingClientRect();
    const next = e.nextElementSibling;
    return { top: y(r.top), bottom: y(r.bottom), nextTop: next ? y(next.getBoundingClientRect().top) : undefined };
  };

  // The column an element flows in: its outermost ancestor that sits beside a
  // sibling in a flex row (a sidebar or main column), else the template root.
  const flowOf = (el: Element): Element => {
    let flow = root;
    for (let n = el.parentElement; n && n !== root; n = n.parentElement) {
      const p = n.parentElement;
      if (p && p.children.length > 1 && style(p).display === 'flex' && style(p).flexDirection.startsWith('row')) flow = n;
    }
    return flow;
  };

  const flows = new Map<Element, { atoms: Box[]; keepers: Box[] }>([[root, { atoms: [], keepers: [] }]]);
  const add = (el: Element, kind: 'atoms' | 'keepers') => {
    const f = flowOf(el);
    if (!flows.has(f)) flows.set(f, { atoms: [], keepers: [] });
    flows.get(f)![kind].push(box(el));
  };
  // Unbreakable: every bullet, and every entry without a list of 3+ bullets.
  root.querySelectorAll('.resume-entry').forEach((el) => { if (!el.querySelector('li:nth-of-type(3)')) add(el, 'atoms'); });
  root.querySelectorAll('li').forEach((el) => add(el, 'atoms'));
  root.querySelectorAll(KEEP_WITH_NEXT).forEach((el) => add(el, 'keepers'));

  // Where a flow's content really ends. Its own box can't say: a short column is
  // stretched to the tall one's height, and the root to a full page by min-height.
  const contentEnd = (flow: Element) => {
    let end = 0;
    for (const c of Array.from(flow.children)) {
      const s = style(c);
      if (s.display !== 'none' && s.position !== 'absolute' && s.position !== 'fixed') end = Math.max(end, box(c).bottom);
    }
    return end;
  };

  let longest: number[] = [];
  flows.forEach(({ atoms, keepers }, flow) => {
    // Padding repeated on each page: the flow's own plus every wrapper's above it.
    let padT = 0;
    let padB = 0;
    for (let n: Element | null = flow; n && n !== sheet; n = n.parentElement) {
      padT += parseFloat(style(n).paddingTop) || 0;
      padB += parseFloat(style(n).paddingBottom) || 0;
    }
    const perPage = pageH - padT - padB;
    if (perPage <= 0) return;
    const end = contentEnd(flow);

    const breaks: number[] = [];
    let prev = 0;
    // 1px of slack: content ending exactly at the page's padding fits on it.
    for (let cut = pageH - padB; cut < end - 1; cut += perPage) {
      // Pull the break up past anything that can't be split or left behind,
      // until it settles. Something taller than a page splits regardless.
      for (let moved = true, guard = 0; moved && guard < 50; guard++) {
        moved = false;
        for (const a of atoms) {
          if (a.top > prev + 1 && a.top < cut - 0.5 && a.bottom > cut + 0.5) { cut = a.top; moved = true; }
        }
        for (const k of keepers) {
          if (k.top > prev + 1 && k.top < cut - 0.5 && k.bottom <= cut + 0.5 && k.nextTop !== undefined && k.nextTop >= cut - 0.5) {
            cut = k.top;
            moved = true;
          }
        }
      }
      breaks.push(Math.round(cut));
      prev = cut;
    }
    if (breaks.length > longest.length) longest = breaks;
  });
  return longest;
}
