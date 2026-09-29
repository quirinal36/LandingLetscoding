// 투명 PNG 레이어를 내용만 남게 자르고 WebP로 줄인다. 손 좌표를 잴 수 있게 10% 모눈을 얹은 미리보기도 만든다.
//   node prototypes/evolve/cut.mjs <raw.png> <out.webp> [preview.png]
// 결과: 잘라 낸 크기(가로/세로 비)를 찍는다. 이 비율을 evolve.html·evolve-stage.tsx 의 aspect 에 적는다.
import sharp from "sharp";

const [, , src, out, preview] = process.argv;
if (!src || !out) {
  console.error("usage: node cut.mjs <raw.png> <out.webp> [preview.png]");
  process.exit(1);
}

// 완전 투명한 가장자리를 걷어 낸다. 반투명 종이 그림자까지 남기려고 threshold 를 낮게 둔다.
const trimmed = sharp(src).trim({ threshold: 8 });
const { width, height } = await trimmed.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);

// 웹용: 긴 변 1400px 이내, 무손실에 가까운 품질
await trimmed
  .clone()
  .resize({ width: width > height ? 1400 : undefined, height: height >= width ? 1400 : undefined, withoutEnlargement: true })
  .webp({ quality: 90, alphaQuality: 95 })
  .toFile(out);

console.log(`${out}: ${width}x${height} (aspect ${(width / height).toFixed(4)})`);

if (preview) {
  // 흰 바탕 + 10% 모눈. 손 좌표를 % 로 읽는다.
  const W = 700;
  const H = Math.round((W * height) / width);
  const lines = [];
  for (let i = 1; i < 10; i++) {
    const x = (W * i) / 10, y = (H * i) / 10;
    lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#3b6fe0" stroke-width="1" opacity="0.5"/>`);
    lines.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#3b6fe0" stroke-width="1" opacity="0.5"/>`);
    lines.push(`<text x="${x + 2}" y="12" font-size="11" fill="#2a53b0">${i * 10}</text>`);
    lines.push(`<text x="2" y="${y - 2}" font-size="11" fill="#2a53b0">${i * 10}</text>`);
  }
  const grid = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${lines.join("")}</svg>`);
  await sharp({ create: { width: W, height: H, channels: 4, background: "#ffffff" } })
    .composite([{ input: await trimmed.clone().resize(W, H).png().toBuffer() }, { input: grid }])
    .png()
    .toFile(preview);
  console.log(`${preview}: ${W}x${H}`);
}
