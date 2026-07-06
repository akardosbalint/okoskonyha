// One-off generator for tasteful SVG placeholder illustrations & avatars.
// Real photography should replace these before launch (see content notes).
import { writeFileSync } from 'node:fs';

const palette = {
  sage300: '#a9c9a4',
  sage200: '#c6dcc2',
  sage100: '#e2ede0',
  forest700: '#1f3d33',
  forest500: '#3a6153',
  clay500: '#bd6631',
  clay300: '#dd9a63',
  cream: '#fdfbf5',
};

function blob(cx, cy, r, seed) {
  // simple organic blob using randomized radius offsets
  const points = 8;
  let d = '';
  const coords = [];
  for (let i = 0; i < points; i++) {
    const angle = (Math.PI * 2 * i) / points;
    const offset = r * (0.82 + 0.22 * Math.sin(seed + i * 2.1));
    coords.push([cx + Math.cos(angle) * offset, cy + Math.sin(angle) * offset]);
  }
  d += `M ${coords[0][0]},${coords[0][1]} `;
  for (let i = 1; i <= points; i++) {
    const [x, y] = coords[i % points];
    const [px, py] = coords[i - 1];
    const mx = (px + x) / 2;
    const my = (py + y) / 2;
    d += `Q ${px},${py} ${mx},${my} `;
  }
  d += 'Z';
  return d;
}

const icons = {
  leaf: (x, y, s, color) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M0 40 C 0 -10, 60 -20, 60 0 C 60 40, 20 45, 0 40 Z" fill="${color}" opacity="0.9"/>
      <path d="M2 38 C 20 20, 40 10, 58 2" stroke="${palette.cream}" stroke-width="2" fill="none" opacity="0.6"/>
    </g>`,
  heartHands: (x, y, s, color) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M30 55 C -10 25, 0 -5, 30 12 C 60 -5, 70 25, 30 55 Z" fill="${color}"/>
    </g>`,
  pot: (x, y, s, color) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M0 20 h60 l-6 34 a10 10 0 0 1-10 8 H16 a10 10 0 0 1-10-8 Z" fill="${color}"/>
      <rect x="-8" y="14" width="76" height="10" rx="5" fill="${color}"/>
      <circle cx="30" cy="0" r="6" fill="${color}"/>
    </g>`,
  plate: (x, y, s, color) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <circle cx="30" cy="30" r="30" fill="${color}"/>
      <circle cx="30" cy="30" r="19" fill="${palette.cream}" opacity="0.35"/>
    </g>`,
  people: (x, y, s, color) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <circle cx="16" cy="10" r="10" fill="${color}"/>
      <path d="M-4 46 a20 20 0 0 1 40 0 Z" fill="${color}"/>
      <circle cx="48" cy="10" r="10" fill="${color}" opacity="0.75"/>
      <path d="M28 46 a20 20 0 0 1 40 0 Z" fill="${color}" opacity="0.75"/>
    </g>`,
  gift: (x, y, s, color) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <rect x="0" y="20" width="56" height="38" rx="4" fill="${color}"/>
      <rect x="0" y="8" width="56" height="14" rx="4" fill="${color}" opacity="0.8"/>
      <rect x="24" y="0" width="8" height="58" fill="${palette.cream}" opacity="0.55"/>
    </g>`,
  glasses: (x, y, s, color) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M4 0 L18 34 a10 14 0 0 0 20 0 L52 0" stroke="${color}" stroke-width="5" fill="none"/>
      <line x1="28" y1="34" x2="28" y2="56" stroke="${color}" stroke-width="5"/>
      <line x1="16" y1="56" x2="40" y2="56" stroke="${color}" stroke-width="5"/>
    </g>`,
  calendar: (x, y, s, color) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <rect x="0" y="6" width="56" height="48" rx="6" fill="${color}"/>
      <rect x="0" y="6" width="56" height="14" rx="6" fill="${palette.forest700}" opacity="0.5"/>
      <rect x="10" y="0" width="6" height="14" rx="3" fill="${palette.cream}"/>
      <rect x="40" y="0" width="6" height="14" rx="3" fill="${palette.cream}"/>
    </g>`,
  saltShaker: (x, y, s, color) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M14 14 h32 l-4 44 a6 6 0 0 1-6 6 H24 a6 6 0 0 1-6-6 Z" fill="${color}"/>
      <rect x="10" y="4" width="40" height="12" rx="6" fill="${color}"/>
      <circle cx="24" cy="26" r="2" fill="${palette.cream}"/>
      <circle cx="32" cy="24" r="2" fill="${palette.cream}"/>
      <circle cx="28" cy="34" r="2" fill="${palette.cream}"/>
      <circle cx="36" cy="32" r="2" fill="${palette.cream}"/>
    </g>`,
  stack: (x, y, s, color) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <rect x="4" y="38" width="52" height="16" rx="4" fill="${color}"/>
      <rect x="8" y="20" width="44" height="16" rx="4" fill="${color}" opacity="0.85"/>
      <rect x="12" y="2" width="36" height="16" rx="4" fill="${color}" opacity="0.7"/>
    </g>`,
};

function cover({ file, bg, blobColor, icon, iconColor, seed }) {
  const w = 1200, h = 800;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <path d="${blob(w * 0.28, h * 0.4, 340, seed)}" fill="${blobColor}" opacity="0.55"/>
  <path d="${blob(w * 0.78, h * 0.72, 260, seed + 3)}" fill="${blobColor}" opacity="0.35"/>
  ${icons[icon](w / 2 - 30, h / 2 - 30, 3.4, iconColor)}
</svg>`;
  writeFileSync(file, svg);
}

const covers = [
  { file: 'src/assets/blog-covers/story-elso-vacsora.svg', bg: palette.cream, blobColor: palette.clay300, icon: 'glasses', iconColor: palette.clay500, seed: 2 },
  { file: 'src/assets/blog-covers/tipp-idobeosztas.svg', bg: palette.cream, blobColor: palette.clay300, icon: 'calendar', iconColor: palette.forest500, seed: 8 },
  { file: 'src/assets/blog-covers/tipp-fozes4eleme.svg', bg: palette.sage200, blobColor: palette.sage300, icon: 'saltShaker', iconColor: palette.forest700, seed: 30 },
  { file: 'src/assets/illustrations/contact-hero.svg', bg: palette.sage100, blobColor: palette.clay300, icon: 'calendar', iconColor: palette.forest700, seed: 14 },
];
covers.forEach(cover);

console.log('Generated', covers.length, 'covers');
