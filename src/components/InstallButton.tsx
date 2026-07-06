import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/** Zeigt „App installieren", sobald der Browser die PWA-Installation anbietet. */
export function InstallButton() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  if (!prompt) return null

  return (
    <button
      className="btn btn-ghost install-btn"
      onClick={async () => {
        await prompt.prompt()
        const { outcome } = await prompt.userChoice
        if (outcome === 'accepted') setPrompt(null)
      }}
    >
      📲 App installieren
    </button>
  )
}
