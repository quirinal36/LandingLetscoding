import { readFile } from "node:fs/promises";
import path from "node:path";
import logo from "@/assets/logo.png";

export const dynamic = "force-static";

// Use the approved print master directly so the website and brochure share one source.
export async function GET() {
  const root = process.cwd();
  const [source, fonts, inquiryQr, loungeQr] = await Promise.all([
    readFile(path.join(root, "prototypes/brochure/brochure.html"), "utf8"),
    readFile(path.join(root, "src/app/fonts.css"), "utf8"),
    readFile(path.join(root, "prototypes/brochure/assets/inquiry-qr.svg")),
    readFile(path.join(root, "prototypes/brochure/assets/lounge-qr.svg")),
  ]);
  const html = source
    .replace('<link rel="stylesheet" href="fonts.css">', `<style>${fonts}</style>`)
    .replaceAll("../../public/", "/")
    .replaceAll("../../src/assets/logo.png", logo.src)
    .replaceAll("assets/inquiry-qr.svg", `data:image/svg+xml;base64,${inquiryQr.toString("base64")}`)
    .replaceAll("assets/lounge-qr.svg", `data:image/svg+xml;base64,${loungeQr.toString("base64")}`)
    .replace("</head>", `<style>
      .brochure-tools { position:sticky; top:0; z-index:1; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:12px 24px; padding:16px 24px; background:#e9edf3; border-bottom:1px solid #c9d1df; }
      .brochure-tools strong { font-size:18px; }
      .brochure-tools p { font-size:14px; color:#55607a; margin-top:4px; }
      .brochure-tools nav { display:flex; align-items:center; gap:20px; }
      .brochure-tools button, .brochure-tools a { font:inherit; font-size:16px; min-height:44px; display:inline-flex; align-items:center; }
      .brochure-tools button { background:#2a53b0; color:white; border:0; border-radius:8px; padding:10px 22px; cursor:pointer; }
      .brochure-tools a { color:#2a53b0; }
      .brochure-tools :focus-visible { outline:3px solid #3b6fe0; outline-offset:4px; }
      .brochure-pages { width:297mm; margin:24px auto; }
      .brochure-pages .sheet + .sheet { margin-top:0; }
      @media print { .brochure-tools { display:none; } .brochure-pages { zoom:1!important; margin:0; } }
    </style></head>`)
    .replace("<body>", `<body><header class="brochure-tools"><div><strong>렛츠코딩 라운지 소개서</strong><p>가로 A4 · 8쪽 · 양면 인쇄 시 짧은 쪽 넘김</p></div><nav aria-label="브로셔 인쇄와 다운로드"><button type="button" id="print-brochure">인쇄하기</button><a href="/brochure/pdf" download="letscoding-lounge-brochure.pdf">PDF 다운로드</a><a href="/">홈으로</a></nav></header><main class="brochure-pages">`)
    .replace("</body>", `</main><script>
      const pages = document.querySelector('.brochure-pages');
      function fitPages() { pages.style.zoom = Math.min(1, (document.documentElement.clientWidth - 24) / (297 * 96 / 25.4)); }
      fitPages();
      window.addEventListener('resize', fitPages);
      document.getElementById('print-brochure').addEventListener('click', async () => {
        await document.fonts.ready;
        await Promise.all(Array.from(document.images, image => image.decode()));
        window.print();
      });
    </script></body>`);
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
