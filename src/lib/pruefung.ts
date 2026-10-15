import type { Paket, Status } from '../data'

/** Prüfergebnis eines Menschen aus dem Ort – bleibt im Browser, bis es exportiert wird. */
export interface Urteil {
  status: Exclude<Status, 'ungeprüft'>
  swg?: string
  de?: string
  anmerkung?: string
  zeit: number
}

export type Pruefstand = Record<string, Urteil>

function schluessel(ags: string) {
  return `sb:pruefung:${ags}`
}

export function lade(ags: string): Pruefstand {
  try {
    const s = localStorage.getItem(schluessel(ags))
    return s ? (JSON.parse(s) as Pruefstand) : {}
  } catch {
    return {}
  }
}

export function speichere(ags: string, stand: Pruefstand) {
  try {
    localStorage.setItem(schluessel(ags), JSON.stringify(stand))
  } catch {
    /* kein Speicher – Export bleibt möglich */
  }
}

/** Export: das Paket mit den Urteilen zusammengeführt, dazu ein Protokoll der Änderungen. */
export function exportiere(p: Paket, stand: Pruefstand) {
  const paket: Paket = {
    ...p,
    stand: new Date().toISOString().slice(0, 10),
    lagen: p.lagen.map((l) => ({
      ...l,
      saetze: l.saetze.map((s) => {
        const u = stand[s.id]
        if (!u) return s
        return { ...s, swg: u.swg ?? s.swg, de: u.de ?? s.de, status: u.status }
      }),
    })),
  }
  const protokoll = Object.entries(stand).map(([id, u]) => ({
    id,
    status: u.status,
    swg: u.swg,
    de: u.de,
    anmerkung: u.anmerkung,
    zeit: new Date(u.zeit).toISOString(),
  }))
  return { paket, protokoll }
}

export function ladeDatei(name: string, inhalt: string) {
  const blob = new Blob([inhalt], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
