import karte from './karte/ludwigsburg.json'
import vaihingen from './pakete/08118073.json'
import orteVaihingen from './orte/08118073.json'

export type Sprache = 'de' | 'en' | 'ar'
export type Status = 'ungeprüft' | 'geprüft' | 'korrigiert'

export interface Satz {
  id: string
  swg: string
  de: string
  en?: string
  ar?: string
  hinweis?: Partial<Record<Sprache, string>>
  status: Status
}

export interface Lage {
  id: string
  titel: Record<Sprache, string>
  saetze: Satz[]
}

export interface Paket {
  ags: string
  ort: string
  sprache: string
  variante: string
  modul: string
  version: string
  stand: string
  quelle: string
  hausschreibung: string[]
  lagen: Lage[]
}

export interface Eintrag {
  id: string
  titel: Partial<Record<Sprache, string>>
  text?: Partial<Record<Sprache, string>>
  tel?: string
  mail?: string
  web?: string
  adresse?: string
  status: Status
  quelle?: string
}

export interface OrtsDaten {
  ags: string
  stand: string
  eintraege: Eintrag[]
}

export interface Gemeinde {
  ags: string
  name: string
  c: number
  d: string
  lx: number
  ly: number
  fs: number
  lines: string[]
  ew: number | null
  rathaus: {
    strasse: string | null
    plz: string | null
    tel: string | null
    mail: string | null
    web: string | null
    titel: string | null
    bm: string | null
  }
}

export interface Karte {
  quelle: string
  stand_geo: string
  w: number
  h: number
  frame: number[]
  lbbox: number[]
  kreis: string
  others: string[]
  nb: { key: string; d: string; bx: number; by: number }[]
  g: Gemeinde[]
}

export const KARTE = karte as Karte

/** Alle Pakete, Schlüssel = amtlicher Gemeindeschlüssel (AGS). Neue Orte: Datei anlegen, hier eintragen. */
export const PAKETE: Record<string, Paket> = {
  [vaihingen.ags]: vaihingen as Paket,
}

/** Ortsbezogene Zuständigkeiten, gepflegt von der Ortsgruppe. */
export const ORTE: Record<string, OrtsDaten> = {
  [orteVaihingen.ags]: orteVaihingen as OrtsDaten,
}

export function gemeinde(ags: string): Gemeinde | undefined {
  return KARTE.g.find((g) => g.ags === ags)
}

export function alleSaetze(p: Paket): Satz[] {
  return p.lagen.flatMap((l) => l.saetze)
}
