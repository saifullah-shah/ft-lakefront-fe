import type { CSSProperties } from "react";

/**
 * Animated Tarbela Lake scene for the hero.
 *
 * This is a stylised vector illustration, not photography of the site: no
 * coordinates, structures, or facilities are depicted, and it must not be
 * presented as an image of the real locations.
 */

const farRidge =
  "M0,452 L70,430 L140,438 L210,398 L280,424 L350,384 L420,420 L500,372 L570,410 L650,388 " +
  "L720,424 L800,396 L880,428 L960,402 L1040,432 L1120,404 L1200,430 L1290,408 L1370,434 L1440,414 " +
  "L1440,520 L0,520 Z";

const midRidge =
  "M0,506 L80,474 L150,494 L230,452 L310,490 L390,460 L470,498 L560,468 L650,502 L730,474 " +
  "L810,504 L900,476 L990,510 L1080,482 L1170,512 L1260,484 L1350,514 L1440,488 " +
  "L1440,566 L0,566 Z";

const nearRidge =
  "M0,556 L100,532 L190,554 L280,520 L370,550 L460,526 L560,558 L660,532 L760,562 L870,536 " +
  "L980,566 L1090,540 L1200,568 L1310,544 L1440,570 L1440,620 L0,620 Z";

const treeLine =
  "M0,556 L22,538 L44,556 L70,528 L92,552 L118,532 L146,556 L172,524 L198,550 L226,534 L256,558 " +
  "L286,526 L314,552 L344,530 L374,558 L406,528 L436,554 L468,532 L500,560 L534,530 L566,556 " +
  "L600,526 L632,554 L666,532 L700,560 L734,528 L768,556 L802,530 L836,558 L870,526 L904,554 " +
  "L938,530 L972,560 L1006,528 L1040,556 L1074,532 L1108,560 L1142,528 L1176,556 L1210,530 " +
  "L1244,558 L1278,528 L1312,556 L1346,532 L1380,560 L1410,534 L1440,558 L1440,600 L0,600 Z";

const waveLines = [
  { y: 640, width: 520, speed: 26, opacity: 0.3 },
  { y: 676, width: 640, speed: 34, opacity: 0.26 },
  { y: 714, width: 760, speed: 20, opacity: 0.22 },
  { y: 756, width: 880, speed: 30, opacity: 0.19 },
  { y: 800, width: 1000, speed: 24, opacity: 0.16 },
  { y: 846, width: 1120, speed: 36, opacity: 0.13 },
];

export function TarbelaLakeScene({ label = "Tarbela Lake / illustrative scene" }: { label?: string }) {
  return (
    <div className="lake-scene" aria-hidden="true">
      <svg
        className="lake-scene__svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        role="presentation"
        focusable="false"
      >
        <defs>
          <linearGradient id="lakeSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d2b34" />
            <stop offset="38%" stopColor="#1d4a52" />
            <stop offset="72%" stopColor="#4d7f7c" />
            <stop offset="100%" stopColor="#c9a86f" />
          </linearGradient>
          <radialGradient id="lakeSunGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#ffe6b8" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#f6c98a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f6c98a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lakeWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7d9d94" />
            <stop offset="26%" stopColor="#3d6a68" />
            <stop offset="70%" stopColor="#1c3f45" />
            <stop offset="100%" stopColor="#102b31" />
          </linearGradient>
          <linearGradient id="lakeShimmer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffdca6" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#f3c07a" stopOpacity="0" />
            <stop offset="100%" stopColor="#f3c07a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lakeMistBand" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="35%" stopColor="#eef4f2" stopOpacity="0.5" />
            <stop offset="65%" stopColor="#eef4f2" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lakeHaze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8d9b8" stopOpacity="0" />
            <stop offset="100%" stopColor="#e8d9b8" stopOpacity="0.6" />
          </linearGradient>
          <filter id="lakeSoft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
          <filter id="lakeSoftWide" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="42" />
          </filter>
        </defs>

        <rect width="1440" height="620" fill="url(#lakeSky)" />

        <g className="lake-scene__sun">
          <circle cx="1040" cy="470" r="230" fill="url(#lakeSunGlow)" filter="url(#lakeSoftWide)" />
          <circle cx="1040" cy="470" r="46" fill="#ffe9c4" opacity="0.92" />
        </g>

        <rect x="0" y="380" width="1440" height="240" fill="url(#lakeHaze)" filter="url(#lakeSoft)" />

        <path
          d={farRidge}
          fill="#4e6f6d"
          opacity="0.5"
          className="lake-scene__ridge lake-scene__ridge--far"
        />
        <path
          d={midRidge}
          fill="#35585a"
          opacity="0.78"
          className="lake-scene__ridge lake-scene__ridge--mid"
        />
        <path d={nearRidge} fill="#1f3d40" className="lake-scene__ridge lake-scene__ridge--near" />
        <path d={treeLine} fill="#16302f" className="lake-scene__ridge lake-scene__ridge--trees" />

        <rect x="0" y="618" width="1440" height="282" fill="url(#lakeWater)" />

        <g className="lake-scene__reflection">
          <ellipse
            cx="1040"
            cy="700"
            rx="150"
            ry="120"
            fill="#ffd9a0"
            opacity="0.28"
            filter="url(#lakeSoftWide)"
          />
          <path
            d="M1010,624 L1070,624 L1112,900 L968,900 Z"
            fill="#ffe0ae"
            opacity="0.16"
            filter="url(#lakeSoft)"
          />
        </g>

        <g className="lake-scene__waves">
          {waveLines.map((line) => (
            <g
              key={line.y}
              className="lake-scene__wave"
              style={{ "--wave-duration": `${line.speed}s` } as CSSProperties}
            >
              <line
                x1={-line.width}
                y1={line.y}
                x2={1440 + line.width}
                y2={line.y}
                stroke="#dff0ec"
                strokeWidth="1.4"
                opacity={line.opacity}
                strokeDasharray="180 90"
              />
            </g>
          ))}
        </g>

        <g className="lake-scene__mist">
          <rect
            className="lake-scene__mist-band lake-scene__mist-band--1"
            x="-400"
            y="548"
            width="1200"
            height="72"
            fill="url(#lakeMistBand)"
            filter="url(#lakeSoftWide)"
          />
          <rect
            className="lake-scene__mist-band lake-scene__mist-band--2"
            x="200"
            y="596"
            width="1400"
            height="88"
            fill="url(#lakeMistBand)"
            filter="url(#lakeSoftWide)"
          />
        </g>

        <g className="lake-scene__birds" fill="none" stroke="#20413f" strokeWidth="2" strokeLinecap="round">
          <path className="lake-scene__bird lake-scene__bird--1" d="M0,0 q9,-8 18,0 q9,-8 18,0" />
          <path className="lake-scene__bird lake-scene__bird--2" d="M0,0 q7,-6 14,0 q7,-6 14,0" />
          <path className="lake-scene__bird lake-scene__bird--3" d="M0,0 q6,-5 12,0 q6,-5 12,0" />
        </g>

        <rect className="lake-scene__vignette" x="0" y="0" width="1440" height="900" />
      </svg>
      <span className="lake-scene__label">{label}</span>
    </div>
  );
}
