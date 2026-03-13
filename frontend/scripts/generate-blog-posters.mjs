import fs from "fs";
import path from "path";

const outDir = path.join(
  process.cwd(),
  "frontend",
  "public",
  "academy",
  "blog-posters"
);

fs.mkdirSync(outDir, { recursive: true });

const posters = [
  ["how-to-learn-singing-at-home-beginner-guide", "#E7C57B", "#7C3AED", "#F59E0B", "voice"],
  ["how-to-sing-better-in-30-days", "#F59E0B", "#2563EB", "#FB7185", "voice"],
  ["breathing-techniques-for-singing", "#E7C57B", "#0EA5E9", "#67E8F9", "breath"],
  ["bollywood-singing-tips-expressive-performance", "#F59E0B", "#8B5CF6", "#FB7185", "mic"],
  ["how-to-improve-your-singing-voice", "#E7C57B", "#2563EB", "#F59E0B", "voice"],
  ["piano-lessons-for-beginners-7-day-starter-plan", "#F2CC8F", "#2563EB", "#38BDF8", "piano"],
  ["10-easy-piano-songs-for-beginners", "#F2CC8F", "#8B5CF6", "#F59E0B", "piano"],
  ["how-to-play-bollywood-songs-on-piano", "#F59E0B", "#2563EB", "#FB7185", "piano"],
  ["piano-scales-guide-for-beginners", "#E7C57B", "#2563EB", "#67E8F9", "theory"],
  ["guitar-chords-for-beginners", "#F59E0B", "#2563EB", "#F2CC8F", "guitar"],
  ["how-to-learn-guitar-fast-daily-practice-plan", "#F59E0B", "#0EA5E9", "#FB7185", "guitar"],
  ["easy-bollywood-songs-on-guitar", "#E7C57B", "#8B5CF6", "#F59E0B", "guitar"],
  ["fingerstyle-guitar-guide-for-beginners", "#F2CC8F", "#2563EB", "#67E8F9", "guitar"],
  ["introduction-to-hindustani-classical-music", "#E7C57B", "#8B5CF6", "#F59E0B", "raag"],
  ["what-is-raag-yaman-tutorial-practice-guide", "#F2CC8F", "#2563EB", "#67E8F9", "raag"],
  ["basic-alankars-for-singing", "#E7C57B", "#8B5CF6", "#F59E0B", "notes"],
  ["understanding-taal-in-indian-music", "#F59E0B", "#2563EB", "#67E8F9", "rhythm"],
  ["harmonium-lessons-for-beginners", "#F2CC8F", "#0F766E", "#14B8A6", "harmonium"],
  ["tabla-basics-theka-taal-practice-routine", "#E7C57B", "#1D4ED8", "#60A5FA", "tabla"],
  ["how-to-become-a-professional-singer", "#F59E0B", "#8B5CF6", "#FB7185", "stage"],
  ["how-to-prepare-for-reality-shows", "#F2CC8F", "#2563EB", "#F59E0B", "stage"],
  ["careers-in-the-music-industry-in-india", "#E7C57B", "#2563EB", "#67E8F9", "career"],
  ["how-to-start-teaching-music-online", "#F2CC8F", "#8B5CF6", "#F59E0B", "screen"],
];

const width = 1800;
const height = 1100;

const motif = (type, accent, beam, glow) => {
  switch (type) {
    case "voice":
      return `
        <circle cx="1320" cy="330" r="94" fill="#151515" />
        <path d="M1216 860C1248 640 1286 472 1320 472C1354 472 1392 640 1424 860H1216Z" fill="#101010"/>
        <path d="M1266 516C1282 492 1298 480 1320 480C1342 480 1358 492 1374 516V676C1374 706 1350 730 1320 730C1290 730 1266 706 1266 676V516Z" fill="#1A1A1A" stroke="${accent}" stroke-opacity="0.18"/>
        <path d="M1182 742C1238 694 1286 672 1328 672C1372 672 1418 690 1474 736" stroke="${beam}" stroke-opacity="0.48" stroke-width="10" stroke-linecap="round"/>
      `;
    case "breath":
      return `
        <circle cx="1308" cy="356" r="90" fill="#161616" />
        <path d="M1240 516C1266 486 1290 472 1308 472C1328 472 1350 486 1378 516V776H1240V516Z" fill="#111111"/>
        <path d="M1158 610C1240 552 1324 540 1438 580" stroke="${beam}" stroke-opacity="0.52" stroke-width="10" stroke-linecap="round"/>
        <path d="M1118 708C1212 648 1320 632 1476 690" stroke="${glow}" stroke-opacity="0.34" stroke-width="10" stroke-linecap="round"/>
      `;
    case "mic":
      return `
        <rect x="1268" y="260" width="148" height="260" rx="72" fill="#161616" stroke="${accent}" stroke-opacity="0.22"/>
        <rect x="1324" y="498" width="36" height="228" rx="18" fill="#1B1B1B"/>
        <path d="M1192 800C1280 720 1374 716 1490 792" stroke="${beam}" stroke-opacity="0.48" stroke-width="12" stroke-linecap="round"/>
        <circle cx="1508" cy="306" r="18" fill="${glow}" fill-opacity="0.22"/>
      `;
    case "piano":
      return `
        <rect x="1122" y="682" width="512" height="182" rx="34" fill="#121212" stroke="${accent}" stroke-opacity="0.14"/>
        <rect x="1184" y="728" width="388" height="84" rx="18" fill="#171717"/>
        <g fill="#F7F3EA">
          <rect x="1208" y="728" width="30" height="84" rx="7"/>
          <rect x="1246" y="728" width="30" height="84" rx="7"/>
          <rect x="1284" y="728" width="30" height="84" rx="7"/>
          <rect x="1322" y="728" width="30" height="84" rx="7"/>
          <rect x="1360" y="728" width="30" height="84" rx="7"/>
          <rect x="1398" y="728" width="30" height="84" rx="7"/>
          <rect x="1436" y="728" width="30" height="84" rx="7"/>
          <rect x="1474" y="728" width="30" height="84" rx="7"/>
          <rect x="1512" y="728" width="30" height="84" rx="7"/>
        </g>
      `;
    case "guitar":
      return `
        <path d="M1394 386C1472 386 1522 454 1492 528C1470 580 1470 638 1492 690C1524 764 1474 832 1394 832C1314 832 1266 764 1296 690C1320 638 1320 580 1296 528C1268 454 1316 386 1394 386Z" fill="#131313" stroke="${accent}" stroke-opacity="0.18"/>
        <rect x="1382" y="226" width="24" height="188" rx="12" fill="#181818"/>
        <path d="M1406 232L1510 166" stroke="${beam}" stroke-opacity="0.52" stroke-width="8" stroke-linecap="round"/>
      `;
    case "raag":
      return `
        <path d="M1120 716C1218 598 1322 522 1458 476C1528 452 1590 410 1652 348" stroke="${accent}" stroke-opacity="0.36" stroke-width="10" stroke-linecap="round"/>
        <circle cx="1232" cy="626" r="20" fill="${beam}" fill-opacity="0.28"/>
        <circle cx="1374" cy="520" r="24" fill="${glow}" fill-opacity="0.22"/>
        <circle cx="1508" cy="438" r="22" fill="${accent}" fill-opacity="0.22"/>
      `;
    case "notes":
      return `
        <g stroke="#F5F1E8" stroke-opacity="0.16" stroke-width="4">
          <path d="M1102 402H1658"/><path d="M1102 446H1658"/><path d="M1102 490H1658"/><path d="M1102 534H1658"/><path d="M1102 578H1658"/>
        </g>
        <circle cx="1246" cy="534" r="26" fill="${accent}" fill-opacity="0.34"/>
        <rect x="1264" y="436" width="10" height="148" rx="5" fill="#F5F1E8" fill-opacity="0.16"/>
        <circle cx="1450" cy="474" r="20" fill="${beam}" fill-opacity="0.26"/>
        <rect x="1462" y="414" width="8" height="112" rx="4" fill="#F5F1E8" fill-opacity="0.14"/>
      `;
    case "rhythm":
      return `
        <circle cx="1256" cy="644" r="102" fill="#121212" stroke="${accent}" stroke-opacity="0.18"/>
        <circle cx="1496" cy="644" r="76" fill="#121212" stroke="${beam}" stroke-opacity="0.22"/>
        <path d="M1136 814C1268 750 1408 742 1584 790" stroke="${glow}" stroke-opacity="0.34" stroke-width="10" stroke-linecap="round"/>
      `;
    case "harmonium":
      return `
        <rect x="1128" y="636" width="560" height="220" rx="34" fill="#121212" stroke="${accent}" stroke-opacity="0.16"/>
        <rect x="1196" y="694" width="406" height="94" rx="22" fill="#171717"/>
        <g fill="#F6F2E9">
          <rect x="1222" y="694" width="24" height="94" rx="6"/><rect x="1252" y="694" width="24" height="94" rx="6"/><rect x="1282" y="694" width="24" height="94" rx="6"/><rect x="1312" y="694" width="24" height="94" rx="6"/><rect x="1342" y="694" width="24" height="94" rx="6"/><rect x="1372" y="694" width="24" height="94" rx="6"/><rect x="1402" y="694" width="24" height="94" rx="6"/><rect x="1432" y="694" width="24" height="94" rx="6"/>
        </g>
      `;
    case "tabla":
      return `
        <ellipse cx="1260" cy="688" rx="92" ry="116" fill="#131313" stroke="${accent}" stroke-opacity="0.22"/>
        <ellipse cx="1476" cy="700" rx="68" ry="88" fill="#131313" stroke="${beam}" stroke-opacity="0.22"/>
        <ellipse cx="1260" cy="688" rx="26" ry="32" fill="#0A0A0A"/>
        <ellipse cx="1476" cy="700" rx="20" ry="24" fill="#0A0A0A"/>
      `;
    case "stage":
      return `
        <path d="M1084 860C1188 786 1306 750 1436 750C1562 750 1664 786 1754 860" fill="#111111"/>
        <path d="M1084 860C1188 786 1306 750 1436 750C1562 750 1664 786 1754 860" stroke="${beam}" stroke-opacity="0.32" stroke-width="8"/>
        <circle cx="1400" cy="466" r="68" fill="#161616"/><path d="M1328 812C1352 632 1378 548 1400 548C1424 548 1450 632 1478 812H1328Z" fill="#1B1B1B"/>
      `;
    case "career":
      return `
        <rect x="1120" y="302" width="276" height="182" rx="26" fill="#111111" stroke="#FFFFFF" stroke-opacity="0.05"/>
        <rect x="1160" y="350" width="154" height="16" rx="8" fill="${accent}" fill-opacity="0.32"/>
        <rect x="1160" y="390" width="208" height="16" rx="8" fill="#F5F1E8" fill-opacity="0.12"/>
        <rect x="1160" y="428" width="162" height="16" rx="8" fill="#F5F1E8" fill-opacity="0.08"/>
        <path d="M1420 792C1504 706 1584 624 1702 520" stroke="${beam}" stroke-opacity="0.4" stroke-width="10" stroke-linecap="round"/>
        <circle cx="1702" cy="520" r="24" fill="${glow}" fill-opacity="0.22"/>
      `;
    case "screen":
      return `
        <rect x="1128" y="286" width="560" height="344" rx="34" fill="#121212" stroke="#FFFFFF" stroke-opacity="0.06"/>
        <rect x="1180" y="338" width="456" height="240" rx="24" fill="#0B0B0B"/>
        <circle cx="1324" cy="452" r="30" fill="${accent}" fill-opacity="0.26"/>
        <rect x="1388" y="430" width="136" height="18" rx="9" fill="#F5F1E8" fill-opacity="0.12"/>
        <rect x="1388" y="472" width="188" height="18" rx="9" fill="#F5F1E8" fill-opacity="0.08"/>
      `;
    default:
      return "";
  }
};

const makeSvg = (slug, accent, glow, beam, type) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${slug}" x1="80" y1="60" x2="1660" y2="1040" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#030303"/>
      <stop offset="1" stop-color="#151515"/>
    </linearGradient>
    <radialGradient id="glow-${slug}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1420 180) rotate(35) scale(460 360)">
      <stop offset="0" stop-color="${glow}" stop-opacity="0.42"/>
      <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="gold-${slug}" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(260 960) rotate(-18) scale(420 260)">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg-${slug})"/>
  <circle cx="1420" cy="180" r="360" fill="url(#glow-${slug})"/>
  <circle cx="260" cy="960" r="280" fill="url(#gold-${slug})"/>
  <rect x="74" y="66" width="1652" height="968" rx="64" fill="#0A0A0A" stroke="#FFFFFF" stroke-opacity="0.06" stroke-width="2"/>
  <rect x="116" y="108" width="1568" height="884" rx="42" fill="#070707" fill-opacity="0.74"/>
  <path d="M74 886C296 804 504 802 738 854C1038 920 1292 926 1726 782V1034H74V886Z" fill="#090909"/>
  <path d="M150 216H1648" stroke="#FFFFFF" stroke-opacity="0.05" stroke-width="3"/>
  <path d="M156 930C412 840 638 842 890 896C1148 952 1354 950 1642 888" stroke="${beam}" stroke-opacity="0.22" stroke-width="5" stroke-linecap="round"/>
  <rect x="186" y="252" width="450" height="212" rx="30" fill="#0D0D0D" stroke="#FFFFFF" stroke-opacity="0.05"/>
  <rect x="224" y="294" width="122" height="16" rx="8" fill="${accent}" fill-opacity="0.36"/>
  <rect x="224" y="334" width="262" height="16" rx="8" fill="#F5F1E8" fill-opacity="0.12"/>
  <rect x="224" y="372" width="208" height="16" rx="8" fill="#F5F1E8" fill-opacity="0.08"/>
  <rect x="224" y="410" width="164" height="16" rx="8" fill="#F5F1E8" fill-opacity="0.06"/>
  ${motif(type, accent, beam, glow)}
</svg>`;

for (const [slug, accent, glow, beam, type] of posters) {
  fs.writeFileSync(
    path.join(outDir, `${slug}.svg`),
    makeSvg(slug, accent, glow, beam, type),
    "utf8"
  );
}

console.log(`Generated ${posters.length} blog posters in ${outDir}`);
