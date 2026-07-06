import type { Participant } from '../types'
import type { Badge } from './badges'
import { EVENT } from '../config'
import { formatKm } from './stats'

/**
 * Erzeugt eine Instagram-Story-taugliche Share-Card (1080×1920) als Canvas —
 * der Strava-Moment: „Ich bin X Runden für Timo gelaufen."
 */
export function renderShareCard(me: Participant, badges: Badge[]): HTMLCanvasElement {
  const W = 1080
  const H = 1920
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // Hintergrund: Nachtlauf-Gradient + Glow
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#131c33')
  bg.addColorStop(1, '#0b1120')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  const glow = ctx.createRadialGradient(W * 0.85, H * 0.1, 0, W * 0.85, H * 0.1, 700)
  glow.addColorStop(0, 'rgba(255,90,31,0.35)')
  glow.addColorStop(1, 'rgba(255,90,31,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  const font = (px: number, weight = 700) =>
    `${weight} ${px}px 'Space Grotesk Variable', system-ui, sans-serif`

  // Kicker
  ctx.textAlign = 'center'
  ctx.fillStyle = '#ff7a45'
  ctx.font = font(38, 600)
  ctx.fillText('T I M O   L Ä U F T   3 0 H   ·   Ö S C H L E S E E', W / 2, 220)

  // Name
  ctx.fillStyle = '#eef2fb'
  ctx.font = font(86)
  ctx.fillText(fit(ctx, me.name, W - 160), W / 2, 360)

  ctx.fillStyle = '#93a0bd'
  ctx.font = font(44, 500)
  ctx.fillText('war dabei und lief', W / 2, 440)

  // Große Zahl
  const laps = me.laps.length
  ctx.fillStyle = '#ff5a1f'
  ctx.font = font(380)
  ctx.fillText(String(laps), W / 2, 900)
  ctx.fillStyle = '#eef2fb'
  ctx.font = font(72)
  ctx.fillText(laps === 1 ? 'RUNDE' : 'RUNDEN', W / 2, 1010)

  // Ring um die Zahl
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 20
  ctx.beginPath()
  ctx.arc(W / 2, 780, 330, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeStyle = '#ff5a1f'
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.arc(W / 2, 780, 330, -Math.PI / 2, -Math.PI / 2 + Math.PI * 1.4)
  ctx.stroke()

  // km-Zeile
  ctx.fillStyle = '#93a0bd'
  ctx.font = font(52, 500)
  ctx.fillText(
    `${formatKm(laps * EVENT.lapKm)} km um den Öschlesee`,
    W / 2,
    1180,
  )

  // Badges
  if (badges.length) {
    ctx.font = font(80)
    ctx.fillText(badges.map((b) => b.emoji).join('  '), W / 2, 1330)
  }

  // Fußzeile
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = font(40, 500)
  ctx.fillText(`30 Stunden nonstop mit ${EVENT.runnerName}`, W / 2, 1720)
  ctx.fillStyle = '#ff7a45'
  ctx.font = font(42, 600)
  ctx.fillText(`@${EVENT.instagram}`, W / 2, 1790)

  return canvas
}

/** Teilen via Web-Share-API (Handy) oder PNG-Download (Desktop-Fallback) */
export async function shareCard(me: Participant, badges: Badge[]): Promise<void> {
  const canvas = renderShareCard(me, badges)
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob fehlgeschlagen'))), 'image/png'),
  )
  const file = new File([blob], 'timo30h-story.png', { type: 'image/png' })

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Timo läuft 30h' })
      return
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'timo30h-story.png'
  a.click()
  URL.revokeObjectURL(url)
}

function fit(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text
  let t = text
  while (t.length > 3 && ctx.measureText(t + '…').width > maxWidth) t = t.slice(0, -1)
  return t + '…'
}
