interface PotatoLogoProps {
  size?: number;
  className?: string;
}

export default function PotatoLogo({ size = 32, className }: PotatoLogoProps) {
  const fx = 38;
  const fy = 6;
  const petalOffset = 7.0;
  const petals = [0, 72, 144, 216, 288];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 -4 54 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="petalGrad" cx={fx} cy={fy} r="13" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#FFFFFF" />
          <stop offset="35%"  stopColor="#F8EDD8" />
          <stop offset="100%" stopColor="#E0C898" />
        </radialGradient>
      </defs>

      {/* ── Sprout stem — longer so flower clears potato ── */}
      <path
        d="M 20 23 C 18 13 27 5 38 7"
        stroke="#4A6B3E"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* ── Left leaf — bigger, curve flipped (arcs back toward potato) ── */}
      <path
        d="M 22 19 C 12 23 6 17 8 10 C 12 7 20 14 22 19Z"
        fill="#7FA86A"
      />
      <path
        d="M 22 19 C 13 22 7 16 8 10"
        stroke="#4A6B3E" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"
      />

      {/* ── Right leaf — bigger, curve flipped (arcs back toward potato) ── */}
      <path
        d="M 30 12 C 38 16 44 10 42 4 C 38 2 31 9 30 12Z"
        fill="#90BE78"
      />
      <path
        d="M 30 12 C 38 15 43 9 42 4"
        stroke="#4A6B3E" strokeWidth="0.8" strokeLinecap="round" opacity="0.5"
      />

      {/* ── Flower petals — bigger, rounder, no overlap ── */}
      {petals.map((angle) => (
        <ellipse
          key={angle}
          cx={fx}
          cy={fy - petalOffset}
          rx="3.2"
          ry="4.8"
          fill="url(#petalGrad)"
          stroke="#C8A060"
          strokeWidth="0.6"
          transform={`rotate(${angle}, ${fx}, ${fy})`}
        />
      ))}

      {/* ── Flower centre ── */}
      <circle cx={fx} cy={fy} r="3.4" fill="#C9A96E" />
      <circle cx={fx - 1} cy={fy - 1} r="1.2" fill="#DFC080" opacity="0.7" />

      {/* ── Potato body — no rotation ── */}
      <path
        d="M 9 33
           C 8 27, 11 22, 18 21
           C 21 20, 23 20, 26 21
           C 29 20, 34 20, 38 22
           C 43 24, 46 28, 45 33
           C 44 38, 39 41, 31 41
           C 23 41, 13 40, 9 36
           Z"
        fill="#C49060"
      />
      <ellipse cx="18" cy="25" rx="6" ry="2.5" fill="#D8A878" opacity="0.45" />
      <ellipse cx="27" cy="40" rx="13" ry="2.2" fill="#A07040" opacity="0.4" />
      <circle cx="16" cy="32" r="1.6" fill="#9A6030" opacity="0.5" />
      <circle cx="27" cy="29" r="1.3" fill="#9A6030" opacity="0.4" />
      <circle cx="35" cy="34" r="1.4" fill="#9A6030" opacity="0.45" />
      <circle cx="22" cy="37" r="1.1" fill="#9A6030" opacity="0.4" />
    </svg>
  );
}
