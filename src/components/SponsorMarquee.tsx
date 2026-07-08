import { SPONSORS } from '../config'

/**
 * Endlos laufender Sponsoren-Slider: Der Track enthält die Liste 4×,
 * die Animation schiebt exakt die halbe Trackbreite → nahtloser Loop,
 * auch wenn wenige Sponsoren schmaler als der Screen sind.
 */
export function SponsorMarquee() {
  const items = [...SPONSORS, ...SPONSORS, ...SPONSORS, ...SPONSORS]
  return (
    <div className="marquee" aria-label="Unsere Sponsoren">
      <div className="marquee-track">
        {items.map((s, i) => (
          <div className="sponsor-chip" key={`${s.id}-${i}`} aria-hidden={i >= SPONSORS.length ? true : undefined}>
            <span
              className="sponsor-mono"
              style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}
            >
              {s.mono}
              <span className="sponsor-dot" style={{ background: s.accent }} />
            </span>
            <span className="sponsor-text">
              <b>{s.name}</b>
              <small>{s.category}</small>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
