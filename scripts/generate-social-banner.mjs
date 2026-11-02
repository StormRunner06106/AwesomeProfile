import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const output = fileURLToPath(new URL("../public/social/", import.meta.url));
mkdirSync(output, { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#101923"/><stop offset="1" stop-color="#223a4b"/></linearGradient>
    <linearGradient id="card" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b7d9d4"/><stop offset="1" stop-color="#7eaaa5"/></linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#background)"/>
  <path d="M0 560H1200M800 0V630M1080 0V630M0 70H1200" stroke="#ffffff" stroke-opacity=".09"/>
  <circle cx="1030" cy="304" r="242" fill="none" stroke="#ffffff" stroke-opacity=".12"/>
  <circle cx="1030" cy="304" r="190" fill="none" stroke="#ffffff" stroke-opacity=".08"/>
  <rect x="64" y="100" width="44" height="5" rx="2.5" fill="#b7d9d4"/>
  <text x="64" y="153" fill="#b7d9d4" font-family="Arial, Helvetica, sans-serif" font-size="20" letter-spacing="5">SOFTWARE DEVELOPER</text>
  <text x="60" y="268" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="82" font-weight="700" letter-spacing="-3">Lucas Huang</text>
  <text x="64" y="344" fill="#e4edf1" font-family="Arial, Helvetica, sans-serif" font-size="34">AI, web &amp; mobile applications.</text>
  <text x="64" y="398" fill="#aabcc7" font-family="Arial, Helvetica, sans-serif" font-size="24">Turning ideas into useful software.</text>
  <rect x="868" y="198" width="244" height="244" rx="44" fill="url(#card)" transform="rotate(-7 990 320)"/>
  <text x="990" y="356" text-anchor="middle" fill="#172b36" font-family="Arial, Helvetica, sans-serif" font-size="105" font-weight="700" letter-spacing="-7">LH</text>
  <text x="64" y="594" fill="#c6d4dc" font-family="Arial, Helvetica, sans-serif" font-size="19" letter-spacing="2">PORTFOLIO / PROJECTS / EXPERIENCE</text>
  <text x="1118" y="594" text-anchor="end" fill="#b7d9d4" font-family="Arial, Helvetica, sans-serif" font-size="21">Lucas Huang</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(`${output}/lucas-huang-portfolio.png`);
console.log("Generated public/social/lucas-huang-portfolio.png (1200 × 630)");
