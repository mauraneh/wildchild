import { Product } from '../core/site.config';

export const esc = (s: string | number): string =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function printText(text: string, x: number, y: number, maxW: number, ink: string, size: number): string {
  const fs = Math.min(size, (maxW / Math.max(text.length, 1)) * 1.7);
  // Force the print width so it never spills off the product, whatever font actually loads.
  const w = Math.min(maxW, fs * 0.48 * text.length);
  return `<text x="${x}" y="${y}" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="${fs.toFixed(1)}" fill="${ink}" textLength="${w.toFixed(1)}" lengthAdjust="spacingAndGlyphs">${esc(text)}</text>`;
}

/** Renders a product mockup as an SVG string (no image files needed). */
export function mockupSvg(p: Product): string {
  const { type, color, ink, print } = p;
  const stroke = "rgba(0,0,0,.18)";
  let body = "";
  switch (type) {
    case "tee":
      body = `<path d="M140 70 L100 82 L48 128 L78 176 L112 152 L112 340 L288 340 L288 152 L322 176 L352 128 L300 82 L260 70 C250 96 150 96 140 70 Z" fill="${color}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M140 70 C150 96 250 96 260 70" fill="none" stroke="${stroke}" stroke-width="3"/>
        ${printText(print, 200, 215, 150, ink, 38)}
        <text x="200" y="245" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="11" fill="${ink}" letter-spacing="3">WILD CHILD</text>`;
      break;
    case "hoodie":
      body = `<path d="M150 78 L100 96 L52 150 L66 300 L104 300 L112 176 L112 346 L288 346 L288 176 L296 300 L334 300 L348 150 L300 96 L250 78 Z" fill="${color}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>
        <path d="M150 78 C150 30 250 30 250 78 C240 118 160 118 150 78 Z" fill="${color}" stroke="${stroke}" stroke-width="3"/>
        <path d="M165 82 C175 108 225 108 235 82" fill="none" stroke="${stroke}" stroke-width="3"/>
        <line x1="186" y1="104" x2="184" y2="150" stroke="${ink}" stroke-width="3"/><line x1="214" y1="104" x2="216" y2="150" stroke="${ink}" stroke-width="3"/>
        <path d="M140 290 L260 290 L270 340 L130 340 Z" fill="none" stroke="${stroke}" stroke-width="3"/>
        ${printText(print, 200, 230, 150, ink, 36)}`;
      break;
    case "cap":
      body = `<path d="M96 240 C96 140 304 140 304 240 Z" fill="${color}" stroke="${stroke}" stroke-width="3"/>
        <path d="M96 240 C150 256 300 256 360 262 C350 286 240 290 96 262 Z" fill="${color}" stroke="${stroke}" stroke-width="3" filter="brightness(.9)"/>
        <path d="M200 146 L200 240" stroke="${stroke}" stroke-width="2"/>
        <circle cx="200" cy="146" r="6" fill="${ink}"/>
        ${printText(print, 200, 222, 150, ink, 30)}`;
      break;
    case "mug":
      body = `<path d="M270 160 C330 160 330 270 270 270" fill="none" stroke="${color}" stroke-width="22"/>
        <path d="M270 160 C330 160 330 270 270 270" fill="none" stroke="${stroke}" stroke-width="2"/>
        <rect x="110" y="120" width="170" height="200" rx="14" fill="${color}" stroke="${stroke}" stroke-width="3"/>
        <ellipse cx="195" cy="122" rx="85" ry="10" fill="rgba(0,0,0,.08)"/>
        ${printText(print, 195, 235, 140, ink, 40)}`;
      break;
    case "bottle":
      body = `<rect x="172" y="52" width="56" height="44" rx="10" fill="#0f0e17"/>
        <path d="M160 96 L240 96 L252 130 L252 340 C252 352 244 358 232 358 L168 358 C156 358 148 352 148 340 L148 130 Z" fill="${color}" stroke="${stroke}" stroke-width="3"/>
        <g transform="rotate(-90 200 240)">${printText(print, 200, 254, 180, ink, 48)}</g>`;
      break;
    case "tote":
      body = `<path d="M150 150 C150 60 250 60 250 150" fill="none" stroke="${color}" stroke-width="14"/>
        <path d="M150 150 C150 60 250 60 250 150" fill="none" stroke="${stroke}" stroke-width="2"/>
        <rect x="90" y="140" width="220" height="220" rx="6" fill="${color}" stroke="${stroke}" stroke-width="3"/>
        ${printText(print, 200, 262, 170, ink, 40)}`;
      break;
  }
  const bg = color.toLowerCase() === "#0f0e17" ? "#2a2937" : "#1b1a26";
  return `<svg viewBox="0 0 400 400" role="img" aria-label="${esc(p.name)}" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="${bg}"/>
    <circle cx="200" cy="210" r="150" fill="rgba(255,255,255,.04)"/>
    ${body}</svg>`;
}
