"""Prepare the desk artwork at its final trim size, without bleed."""
from io import BytesIO
from pathlib import Path

import fitz
from PIL import Image, ImageCms, ImageOps

root = Path(__file__).resolve().parent
dest = root.parent / "pdf" / "expo-info-desk-950x660"
dest.mkdir(exist_ok=True, parents=True)
width_mm, height_mm = 950, 660
dpi = 300
pixels = tuple(round(mm * dpi / 25.4) for mm in (width_mm, height_mm))
with Image.open(root / "assets/info-desk-redrawn.png") as source:
    rgb = ImageOps.fit(source.convert("RGB"), pixels, method=Image.Resampling.LANCZOS)
preview = rgb.resize((1900, 1320), Image.Resampling.LANCZOS)
preview.save(root / "info-desk.png")

profile = ImageCms.getOpenProfile(str(Path.home() / "Library/ColorSync/Profiles/JapanColor2001Coated.icc"))
cmyk = ImageCms.profileToProfile(rgb, ImageCms.createProfile("sRGB"), profile, outputMode="CMYK")
cmyk.save(dest / "info-desk-950x660-300dpi-cmyk.tif", compression="tiff_adobe_deflate",
          dpi=(dpi, dpi), icc_profile=profile.tobytes())
del cmyk
with BytesIO() as jpeg, fitz.open() as pdf:
    rgb.save(jpeg, "JPEG", quality=97, subsampling=0)
    page = pdf.new_page(width=width_mm * 72 / 25.4, height=height_mm * 72 / 25.4)
    page.insert_image(page.rect, stream=jpeg.getvalue(), keep_proportion=False)
    pdf.save(dest / "info-desk-950x660-rgb.pdf")
