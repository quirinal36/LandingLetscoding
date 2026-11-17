// Run in print media before PDF export; keep the 1200px A4 content at its original size.
(() => {
  const sheets = [...document.querySelectorAll('.sheet:not([hidden])')];
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  assert(matchMedia('print').matches, 'Bleed export requires print media');
  assert(sheets.length === 12, 'Expected 12 brochure pages');
  assert(!document.querySelector('.bleed-page'), 'Bleed already applied');
  const mm = 1200 / 297;
  const bleed = 3 * mm;
  const before = sheets.map(sheet => {
    assert(Math.abs(parseFloat(getComputedStyle(sheet).width) - 1200) < 0.1, 'Expected A4 layout');
    return sheet.querySelector('.page-foot').getBoundingClientRect().y - sheet.getBoundingClientRect().y;
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
    #slide-1 .cover-emblem { top:-${bleed}px; right:-${bleed}px;
      height:calc(100% + ${2 * bleed}px); width:calc(54% + ${bleed}px); }
  `;
  document.head.append(style);
  for (const [index, sheet] of sheets.entries()) {
    const frame = sheet.parentElement.getBoundingClientRect();
    const content = sheet.getBoundingClientRect();
    const margin = 3 * 96 / 25.4;
    assert(Math.abs(content.x - frame.x - margin) < 0.1, 'Incorrect left bleed');
    assert(Math.abs(content.y - frame.y - margin) < 0.1, 'Incorrect top bleed');
    assert(Math.abs(frame.right - content.right - margin) < 0.1, 'Incorrect right bleed');
    assert(Math.abs(frame.bottom - content.bottom - margin) < 0.1, 'Incorrect bottom bleed');
    assert(Math.abs(sheet.querySelector('.page-foot').getBoundingClientRect().y - content.y - before[index]) < 0.1, 'Content moved');
    assert(getComputedStyle(sheet, '::before').content === 'none' && getComputedStyle(sheet, '::after').content === 'none', 'Preview guides must not print');
  }
  const cover = sheets[0].parentElement.getBoundingClientRect();
  const photo = sheets[0].querySelector('.cover-emblem').getBoundingClientRect();
  assert(Math.abs(photo.top - cover.top) < 0.1 && Math.abs(photo.bottom - cover.bottom) < 0.1 && Math.abs(photo.right - cover.right) < 0.1, 'Cover photo must fill bleed');
})();
