/** Leichtgewichtiges Canvas-Konfetti für Badge-Unlocks & Zielerreichung. */
const COLORS = ['#ff5a1f', '#ffb46b', '#34d399', '#fbbf24', '#eef2fb', '#7ce7bd']

export function fireConfetti(durationMs = 1800): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const canvas = document.createElement('canvas')
  canvas.style.cssText =
    'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999'
  canvas.width = window.innerWidth * devicePixelRatio
  canvas.height = window.innerHeight * devicePixelRatio
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')!
  ctx.scale(devicePixelRatio, devicePixelRatio)

  const W = window.innerWidth
  const H = window.innerHeight
  const parts = Array.from({ length: 140 }, () => ({
    x: W / 2 + (Math.random() - 0.5) * W * 0.3,
    y: H * 0.35,
    vx: (Math.random() - 0.5) * 14,
    vy: -6 - Math.random() * 10,
    size: 5 + Math.random() * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
  }))

  const t0 = performance.now()
  function frame(t: number) {
    const elapsed = t - t0
    ctx.clearRect(0, 0, W, H)
    for (const p of parts) {
      p.vy += 0.35
      p.x += p.vx
      p.y += p.vy
      p.rot += p.vr
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = Math.max(0, 1 - elapsed / durationMs)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
      ctx.restore()
    }
    if (elapsed < durationMs) requestAnimationFrame(frame)
    else canvas.remove()
  }
  requestAnimationFrame(frame)
}
