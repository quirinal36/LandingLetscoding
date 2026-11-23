"""Place the continuous side mural under the vector text at trim-size 300 ppi."""
import sys
from io import BytesIO
from pathlib import Path

import fitz
from PIL import Image

panel, filename = sys.argv[1:]
assert panel in ("S1", "S2")
source = Image.open(Path(__file__).parent / "assets/booth-print/lounge.jpg")
w, h = (round(mm * 300 / 25.4) for mm in (1470, 2300))
scale = max(2 * w / source.width, h / source.height)
left = (source.width - 2 * w / scale) / 2 + (panel == "S2") * w / scale
top = (source.height - h / scale) / 2
with fitz.open(filename) as overlay, fitz.open() as output:
    page = output.new_page(width=1470 * 72 / 25.4, height=2300 * 72 / 25.4)
    for y in range(0, h, 768):
        end = min(h, y + 768)
        box = (left, max(0, top + y / scale), min(source.width, left + w / scale), min(source.height, top + end / scale))
        strip = source.resize((w, end-y), Image.Resampling.LANCZOS, box=box)
        data = BytesIO()
        strip.save(data, "JPEG", quality=94)
        page.insert_image((0, y * page.rect.height / h, page.rect.width, end * page.rect.height / h),
                          stream=data.getvalue(), keep_proportion=False)
    if overlay[0].get_contents():
        page.show_pdf_page(page.rect, overlay, 0)
    temporary = Path(filename).with_suffix(".new.pdf")
    output.save(temporary)
temporary.replace(filename)
