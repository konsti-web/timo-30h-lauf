/** Schlichte Stroke-Icons im SF-Symbols-Stil für die Tab-Bar & UI */

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const IconHome = () => (
  <svg {...base}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
  </svg>
)

export const IconMap = () => (
  <svg {...base}>
    <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" />
    <path d="M9 4v14M15 6v14" />
  </svg>
)

export const IconPlus = () => (
  <svg {...base} strokeWidth={2.4}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const IconTrophy = () => (
  <svg {...base}>
    <path d="M8 21h8M12 17v4" />
    <path d="M7 4h10v6a5 5 0 0 1-10 0V4Z" />
    <path d="M7 6H4.5a0.5 0.5 0 0 0-0.5 0.5C4 9 5.5 10.5 7 10.5M17 6h2.5a0.5 0.5 0 0 1 0.5 0.5C20 9 18.5 10.5 17 10.5" />
  </svg>
)

export const IconUser = () => (
  <svg {...base}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20.5c1.2-3.4 4.1-5 7.5-5s6.3 1.6 7.5 5" />
  </svg>
)

/** Strava-artige Medaille (gefüllt), color über CSS/fill-Prop */
export const IconMedal = ({ fill = '#fff', label }: { fill?: string; label?: string }) => (
  <svg viewBox="0 0 24 24" fill="none">
    <path d="M7 2h10l-2.2 5H9.2L7 2Z" fill={fill} opacity={0.75} />
    <circle cx="12" cy="14" r="7" fill={fill} />
    {label && (
      <text
        x="12"
        y="17"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="800"
        fill="rgba(0,0,0,0.55)"
        fontFamily="inherit"
      >
        {label}
      </text>
    )}
  </svg>
)

/** Strahlen um die PR-Medaille */
export const PrRays = () => (
  <svg viewBox="0 0 190 100" className="pr-rays" aria-hidden="true">
    {[-58, -38, -22, 22, 38, 58].map((deg) => {
      const rad = ((deg - 90) * Math.PI) / 180
      const cx = 95
      const cy = 95
      const r1 = 62
      const r2 = deg % 38 === 0 ? 92 : 80
      return (
        <line
          key={deg}
          x1={cx + r1 * Math.cos(rad)}
          y1={cy + r1 * Math.sin(rad)}
          x2={cx + r2 * Math.cos(rad)}
          y2={cy + r2 * Math.sin(rad)}
          stroke="#f0b429"
          strokeWidth="4"
          strokeLinecap="round"
        />
      )
    })}
  </svg>
)
