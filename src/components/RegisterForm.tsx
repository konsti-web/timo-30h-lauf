import { useState, type FormEvent } from 'react'
import type { RegisterInput } from '../store'

export function RegisterForm({
  onRegister,
}: {
  onRegister: (input: RegisterInput) => Promise<void>
}) {
  const [name, setName] = useState('')
  const [instagram, setInstagram] = useState('')
  const [goal, setGoal] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (name.trim().length < 2) {
      setError('Bitte gib deinen Namen ein (mind. 2 Zeichen).')
      return
    }
    const goalLaps = goal ? Number(goal) : undefined
    if (goalLaps !== undefined && (!Number.isInteger(goalLaps) || goalLaps < 1 || goalLaps > 500)) {
      setError('Das Rundenziel muss zwischen 1 und 500 liegen.')
      return
    }
    setError('')
    setBusy(true)
    try {
      await onRegister({ name, instagram: instagram || undefined, goalLaps })
    } catch {
      setError('Anmeldung fehlgeschlagen – bitte nochmal versuchen.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="card register-card fade-in" onSubmit={submit}>
      <h3>Sei dabei 🏃</h3>
      <p className="hint">
        Kein Account, kein Passwort – nur dein Name. Dein Instagram-Handle wird im
        Leaderboard verlinkt, wenn du magst.
      </p>
      <div className="field">
        <label htmlFor="reg-name">Dein Name *</label>
        <input
          id="reg-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="z. B. Lena M."
          maxLength={60}
          autoComplete="name"
        />
      </div>
      <div className="field">
        <label htmlFor="reg-insta">Instagram (optional)</label>
        <div className="prefix-wrap">
          <span>@</span>
          <input
            id="reg-insta"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value.replace(/^@/, ''))}
            placeholder="dein.handle"
            maxLength={40}
            autoCapitalize="none"
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="reg-goal">Dein Rundenziel (optional)</label>
        <input
          id="reg-goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value.replace(/\D/g, ''))}
          placeholder="z. B. 5"
          inputMode="numeric"
          maxLength={3}
        />
      </div>
      {error && <p className="form-error">{error}</p>}
      <button className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
        {busy ? 'Einen Moment …' : 'Anmelden'}
      </button>
    </form>
  )
}
