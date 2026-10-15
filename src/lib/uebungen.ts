import type { Paket, Satz } from '../data'
import { alleSaetze } from '../data'

export type Uebung =
  | { art: 'hoeren'; satz: Satz; optionen: Satz[] }
  | { art: 'lesen'; satz: Satz; optionen: Satz[] }
  | { art: 'zuordnen'; paare: Satz[] }

function mischen<T>(a: T[], zufall: () => number): T[] {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

/** Ablenker: erst aus derselben Lage (ähnlicher Kontext), dann aus dem ganzen Paket. */
function ablenker(p: Paket, satz: Satz, lageId: string, n: number, zufall: () => number): Satz[] {
  const lage = p.lagen.find((l) => l.id === lageId)
  const eigene = mischen((lage?.saetze ?? []).filter((s) => s.id !== satz.id && s.de !== satz.de), zufall)
  const andere = mischen(alleSaetze(p).filter((s) => s.id !== satz.id && !lage?.saetze.includes(s) && s.de !== satz.de), zufall)
  const alle = [...eigene, ...andere]
  const out: Satz[] = []
  for (const s of alle) {
    if (out.length >= n) break
    if (!out.some((o) => o.de === s.de)) out.push(s)
  }
  return out
}

export function baueRunde(
  p: Paket,
  lageId: string,
  ids: string[],
  mitStimme: boolean,
  zufall: () => number = Math.random,
): Uebung[] {
  const saetze = ids.map((id) => alleSaetze(p).find((s) => s.id === id)).filter((s): s is Satz => !!s)
  const uebungen: Uebung[] = []
  const einzeln = saetze.length >= 6 ? saetze.slice(0, saetze.length - 4) : saetze
  const zumZuordnen = saetze.length >= 6 ? saetze.slice(saetze.length - 4) : []

  einzeln.forEach((satz, i) => {
    const art = mitStimme && i % 2 === 0 ? 'hoeren' : 'lesen'
    const optionen = mischen([satz, ...ablenker(p, satz, lageId, 3, zufall)], zufall)
    uebungen.push({ art, satz, optionen })
  })
  if (zumZuordnen.length === 4) uebungen.push({ art: 'zuordnen', paare: zumZuordnen })
  return uebungen
}
