import { useEffect, useState } from 'react'

/** Minimaler Hash-Router: Zurück-Taste des Handys funktioniert, keine Server-Regeln nötig. */
export function useHash(): [string, (pfad: string, ersetzen?: boolean) => void] {
  const [hash, setHash] = useState(() => lese())
  useEffect(() => {
    const h = () => setHash(lese())
    window.addEventListener('hashchange', h)
    return () => window.removeEventListener('hashchange', h)
  }, [])
  const geh = (pfad: string, ersetzen = false) => {
    const neu = '#' + (pfad.startsWith('/') ? pfad : '/' + pfad)
    if (ersetzen) history.replaceState(null, '', neu)
    else location.hash = neu
    setHash(lese())
  }
  return [hash, geh]
}

function lese(): string {
  const h = location.hash.replace(/^#/, '')
  return h.startsWith('/') ? h : '/' + h
}
