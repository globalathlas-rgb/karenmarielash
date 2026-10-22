/** Ilustrações originais em SVG — sem fotografias. Cores via tokens (currentColor / var). */
export function EyeArt({ className = "" }: { className?: string }) {
  const lashes = Array.from({ length: 13 }, (_, i) => {
    const t = i / 12;
    const x = 60 + t * 280;
    const y = 200 - Math.sin(Math.PI * t) * 70;
    const ang = (t - 0.5) * 70;
    const len = 26 + Math.sin(Math.PI * t) * 26;
    return { x, y, ang, len, i };
  });
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" aria-hidden>
      <circle cx="200" cy="200" r="180" stroke="var(--accent)" strokeOpacity=".25" />
      <circle cx="200" cy="200" r="150" stroke="var(--secondary)" strokeOpacity=".15" strokeDasharray="2 6" className="origin-center animate-[spin_80s_linear_infinite]" />
      <path d="M60 200 Q200 90 340 200" stroke="var(--primary)" strokeWidth="2.2" strokeLinecap="round" className="draw-line" />
      <path d="M60 200 Q200 290 340 200" stroke="var(--primary)" strokeWidth="1.2" strokeOpacity=".5" strokeLinecap="round" className="draw-line [animation-delay:.3s]" />
      <circle cx="200" cy="203" r="34" stroke="var(--accent)" strokeWidth="1.4" />
      <circle cx="200" cy="203" r="14" fill="var(--secondary)" className="shimmer-soft" />
      {lashes.map(({ x, y, ang, len, i }) => (
        <line key={i} x1={x} y1={y} x2={x} y2={y - len} stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round"
          transform={`rotate(${ang} ${x} ${y})`} className="draw-line" style={{ animationDelay: `${0.6 + i * 0.06}s` }} />
      ))}
      <Flower x={318} y={92} />
      <Flower x={84} y={312} s={0.7} />
    </svg>
  );
}

export function Flower({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke="var(--accent)" strokeWidth="1.2" fill="none">
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="0" cy="-11" rx="5.5" ry="11" transform={`rotate(${r})`} fill="var(--blush)" fillOpacity=".35" />
      ))}
      <circle r="3" fill="var(--accent)" />
    </g>
  );
}

export function LashDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 24" className={className} fill="none" stroke="currentColor" aria-hidden>
      <path d="M10 18 Q80 -2 150 18" strokeWidth="1.2" />
      {[30, 50, 70, 90, 110, 130].map((x, i) => <line key={x} x1={x} y1={12 - (i === 2 || i === 3 ? 4 : 1)} x2={x + (x - 80) / 12} y2={2} strokeWidth="1" />)}
    </svg>
  );
}
