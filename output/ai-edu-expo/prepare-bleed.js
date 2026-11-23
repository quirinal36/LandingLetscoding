// Run in print media before PDF export; keep the 1200px A4 content at its original size.
(() => {
  const sheets = [...document.querySelectorAll('.sheet:not([hidden])')];
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  assert(matchMedia('print').matches, 'Bleed export requires print media');
  assert(sheets.length === 12, 'Expected 12 brochure pages');
  assert(!document.querySelector('.bleed-page'), 'Bleed already applied');
  const mm = 1200 / 297;
  const bleed = 3 * mm;
  const artwork = sheets[0].querySelector('.cover-emblem');
  assert(artwork.complete && artwork.naturalWidth === 3508, 'Load the A4 cover before adding bleed');
  const before = sheets.map(sheet => {
    assert(Math.abs(parseFloat(getComputedStyle(sheet).width) - 1200) < 0.1, 'Expected A4 layout');
    if (sheet === sheets[0]) return null;
    return sheet.querySelector('.page-foot, .back-contact').getBoundingClientRect().y - sheet.getBoundingClientRect().y;
  });
  for (const sheet of sheets) {
    const wrapper = document.createElement('div');
    wrapper.className = 'bleed-page';
    wrapper.style.background = getComputedStyle(sheet).background;
    sheet.before(wrapper);
    wrapper.append(sheet);
  }
  const style = document.createElement('style');
  style.media = 'print';
  style.textContent = `
    /* Chromium rounds paper sizes; export-cmyk.sh crops the spare media without scaling. */
    @page { size:303.3mm 216.3mm; margin:0; }
    main { width:${303 * mm}px; }
    .bleed-page { position:relative; width:${303 * mm}px; height:${216 * mm}px;
      padding:${bleed}px; overflow:hidden; break-after:page; break-inside:avoid; }
    .bleed-page:last-child { break-after:auto; }
    .bleed-page > .sheet { background:none; break-after:auto; }
    .bleed-page > .outer-cover { overflow:visible; }
  `;
  document.head.append(style);
  // The wrapper clips each reflection to the 3 mm outside the trim.
  for (const y of [-1, 0, 1]) {
    for (const x of [-1, 0, 1]) {
      if (!x && !y) continue;
      const edge = artwork.cloneNode(false);
      edge.src = artwork.currentSrc;
      edge.alt = '';
      edge.setAttribute('aria-hidden', 'true');
      edge.style.transform = `translate(${x * 100}%, ${y * 100}%) scale(${x ? -1 : 1}, ${y ? -1 : 1})`;
      sheets[0].append(edge);
    }
  }
  for (const [index, sheet] of sheets.entries()) {
    const frame = sheet.parentElement.getBoundingClientRect();
    const content = sheet.getBoundingClientRect();
    const margin = 3 * 96 / 25.4;
    assert(Math.abs(content.x - frame.x - margin) < 0.1, 'Incorrect left bleed');
    assert(Math.abs(content.y - frame.y - margin) < 0.1, 'Incorrect top bleed');
    assert(Math.abs(frame.right - content.right - margin) < 0.1, 'Incorrect right bleed');
    assert(Math.abs(frame.bottom - content.bottom - margin) < 0.1, 'Incorrect bottom bleed');
    if (before[index] !== null) assert(Math.abs(sheet.querySelector('.page-foot, .back-contact').getBoundingClientRect().y - content.y - before[index]) < 0.1, 'Content moved');
    assert(getComputedStyle(sheet, '::before').content === 'none' && getComputedStyle(sheet, '::after').content === 'none', 'Preview guides must not print');
  }
  const trim = sheets[0].getBoundingClientRect();
  const photo = artwork.getBoundingClientRect();
  assert(['top', 'right', 'bottom', 'left'].every(side => Math.abs(photo[side] - trim[side]) < 0.1), 'Cover composition must match the trimmed edition');
})();
