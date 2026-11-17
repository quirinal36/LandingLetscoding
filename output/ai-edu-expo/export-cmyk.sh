#!/bin/sh
# RGB 브로셔 PDF를 CMYK 인쇄용 PDF/X로 변환한다.
#   sh output/ai-edu-expo/export-cmyk.sh            # PDF/X-4 (기본, 글자 벡터 유지)
#   PDFX=1 OUT=/tmp/x1a.pdf sh output/ai-edu-expo/export-cmyk.sh   # PDF/X-1a (투명도 있는 쪽은 720dpi 래스터로 평탄화)
# 필요: Ghostscript(brew install ghostscript), python3 + PyMuPDF,
#       ~/Library/ColorSync/Profiles/JapanColor2001Coated.icc (Adobe ICC 프로파일 end-user 배포본에서 설치)
set -eu
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
SRC="${SRC:-$ROOT/output/pdf/letscoding-school-brochure.pdf}"
OUT="${OUT:-$ROOT/output/pdf/letscoding-school-brochure-cmyk.pdf}"
ICC="${ICC:-$HOME/Library/ColorSync/Profiles/JapanColor2001Coated.icc}"
PDFX="${PDFX:-4}"
EXPO_BLEED="${EXPO_BLEED:-0}"
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
[ -f "$ICC" ] || { echo "ICC 프로파일 없음: $ICC" >&2; exit 1; }
cp "$ICC" "$WORK/output.icc"

# PDF/X는 링크 주석을 허용하지 않으므로 먼저 제거한다.
python3 - "$SRC" "$WORK/nolinks.pdf" "$EXPO_BLEED" <<'PY'
import sys, fitz
doc = fitz.open(sys.argv[1])
assert sys.argv[3] in ('0', '3'), 'EXPO_BLEED must be 0 or 3'
if sys.argv[3] == '3':
    mm = 72 / 25.4
    media = fitz.Rect(0, 0, 303 * mm, 216 * mm)
    cropped = fitz.open()
    for source in doc:
        assert 0 <= source.rect.width - media.width < 2 and 0 <= source.rect.height - media.height < 2, 'Source must already include 3mm artwork bleed and spare media'
        page = cropped.new_page(width=media.width, height=media.height)
        page.show_pdf_page(media, doc, source.number, clip=media)
        page.set_bleedbox(page.mediabox)
        page.set_trimbox(fitz.Rect(3 * mm, 3 * mm, 300 * mm, 213 * mm))
    cropped.set_metadata({key: doc.metadata[key] for key in ('title', 'author', 'subject', 'keywords', 'creator')})
    doc = cropped
for page in doc:
    for annot in list(page.annots()): page.delete_annot(annot)
    for link in page.get_links(): page.delete_link(link)
doc.save(sys.argv[2], garbage=1)
PY

# Ghostscript 동봉 PDFX_def.ps를 Japan Color 2001 Coated 출력 의도로 바꿔 쓴다.
GSLIB=$(gs -h | sed -n 's/^ *\(\/[^:]*\/lib\).*/\1/p' | head -1)
[ -f "$GSLIB/PDFX_def.ps" ] || GSLIB=$(dirname "$(find "$(brew --prefix)/Cellar/ghostscript" -name PDFX_def.ps | head -1)")
sed -e "s|^/ICCProfile .*|/ICCProfile ($WORK/output.icc) def|" \
    -e "s|/Title (Title)|/Title (${TITLE:-렛츠코딩 라운지 공교육 브로셔})|" \
    -e "s|/OutputCondition (Commercial and specialty printing)|/OutputCondition (Japan Color 2001 Coated)|" \
    -e "s|/OutputConditionIdentifier (CGATS TR001)|/OutputConditionIdentifier (JC200103)|" \
    -e "s|/Info (none)|/Info (Japan Color 2001 Coated)|" \
    "$GSLIB/PDFX_def.ps" > "$WORK/PDFX_def.ps"

LEVEL=1.6; [ "$PDFX" = 1 ] && LEVEL=1.3
gs -dBATCH -dNOPAUSE -dQUIET --permit-file-read="$WORK/" \
  -sDEVICE=pdfwrite -dPDFX="$PDFX" -dCompatibilityLevel="$LEVEL" -dPDFSETTINGS=/prepress \
  -sColorConversionStrategy=CMYK -dProcessColorModel=/DeviceCMYK -sOutputICCProfile="$WORK/output.icc" \
  -dAutoRotatePages=/None -dDownsampleColorImages=false -dAutoFilterColorImages=false -dColorImageFilter=/FlateEncode \
  -o "$OUT" "$WORK/PDFX_def.ps" "$WORK/nolinks.pdf"

# 검증: 모든 이미지가 CMYK/Gray이고 RGB 색공간 참조가 없는지, 출력 의도가 있는지 확인한다.
python3 - "$OUT" "$SRC" "$EXPO_BLEED" <<'PY'
import sys, fitz, collections
doc = fitz.open(sys.argv[1])
cs = collections.Counter(img[5] for page in doc for img in page.get_images(full=True))
rgb = [x for x in range(1, doc.xref_length()) if any(k in doc.xref_object(x, compressed=True) for k in ("/DeviceRGB", "/ICCBased", "/CalRGB"))]
intents = doc.xref_get_key(doc.pdf_catalog(), "OutputIntents")
raster = [p.number + 1 for p in doc if not p.get_fonts()]
assert len(doc) == len(fitz.open(sys.argv[2])), len(doc)
assert set(cs) <= {"DeviceCMYK", "DeviceGray"}, cs
assert not rgb, rgb
assert intents[0] == "array", intents
if sys.argv[3] == '3':
    mm = 72 / 25.4
    for page in doc:
        for box, expected in [(page.mediabox, (0, 0, 303 * mm, 216 * mm)), (page.bleedbox, (0, 0, 303 * mm, 216 * mm)), (page.trimbox, (3 * mm, 3 * mm, 300 * mm, 213 * mm))]:
            assert max(abs(a - b) for a, b in zip(box, expected)) < 0.01, (page.number + 1, box)
    assert not raster, 'Bleed PDF must preserve vector text'
print(f"OK {sys.argv[1]}: pages={len(doc)} images={dict(cs)} outputIntent={intents[1]} rasterized-pages={raster or 'none'}")
PY
