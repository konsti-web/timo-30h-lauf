const HUES = [16, 32, 158, 205, 260, 288, 340]

function hueFor(name: string): number {
  let h = 0
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 997
  return HUES[h % HUES.length]
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function Avatar({ name }: { name: string }) {
  const hue = hueFor(name)
  return (
    <span
      className="avatar"
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 65% 52%), hsl(${hue + 25} 65% 42%))`,
      }}
    >
      {initials(name)}
    </span>
  )
}
