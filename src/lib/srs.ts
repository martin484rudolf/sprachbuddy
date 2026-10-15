/** Wiederholung in wachsenden Abständen (Leitner-Boxen), gespeichert im Browser des Geräts. */

export interface Karte {
  box: number // 0 = neu/gefallen … 4 = sicher
  due: number // Zeitpunkt der nächsten Wiederholung
  gesehen: number
  richtig: number
}

export type Stand = Record<string, Karte>

const TAG = 24 * 60 * 60 * 1000
const ABSTAENDE = [0, 1 * TAG, 3 * TAG, 7 * TAG, 21 * TAG]
export const SICHER_AB = 3

function schluessel(ags: string) {
  return `sb:srs:${ags}`
}

export function lade(ags: string): Stand {
  try {
    const s = localStorage.getItem(schluessel(ags))
    return s ? (JSON.parse(s) as Stand) : {}
  } catch {
    return {}
  }
}

export function speichere(ags: string, stand: Stand) {
  try {
    localStorage.setItem(schluessel(ags), JSON.stringify(stand))
  } catch {
    /* privater Modus o. ä. – dann eben ohne Gedächtnis */
  }
}

export function bewerte(stand: Stand, id: string, richtig: boolean, jetzt = Date.now()): Stand {
  const alt = stand[id] ?? { box: 0, due: jetzt, gesehen: 0, richtig: 0 }
  const box = richtig ? Math.min(4, alt.box + 1) : Math.max(0, alt.box - 1)
  return {
    ...stand,
    [id]: { box, due: jetzt + ABSTAENDE[box], gesehen: alt.gesehen + 1, richtig: alt.richtig + (richtig ? 1 : 0) },
  }
}

export interface Zusammenfassung {
  gesamt: number
  sicher: number
  faellig: number
  neu: number
}

export function zusammenfassung(stand: Stand, ids: string[], jetzt = Date.now()): Zusammenfassung {
  let sicher = 0, faellig = 0, neu = 0
  for (const id of ids) {
    const k = stand[id]
    if (!k) neu++
    else {
      if (k.box >= SICHER_AB) sicher++
      if (k.due <= jetzt) faellig++
    }
  }
  return { gesamt: ids.length, sicher, faellig, neu }
}

/** Auswahl für eine Runde: erst Fälliges (schwache Boxen zuerst), dann Neues, dann der Rest. */
export function rundenAuswahl(stand: Stand, ids: string[], n: number, jetzt = Date.now()): string[] {
  const faellig = ids.filter((id) => stand[id] && stand[id].due <= jetzt).sort((a, b) => stand[a].box - stand[b].box)
  const neu = ids.filter((id) => !stand[id])
  const rest = ids.filter((id) => stand[id] && stand[id].due > jetzt).sort((a, b) => stand[a].due - stand[b].due)
  return [...faellig, ...neu, ...rest].slice(0, n)
}
