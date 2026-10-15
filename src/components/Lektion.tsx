import { useEffect, useMemo, useRef, useState } from 'react'
import type { Paket, Satz, Sprache } from '../data'
import { t } from '../i18n'
import * as srs from '../lib/srs'
import { baueRunde, type Uebung } from '../lib/uebungen'
import { kannSprechen, sprich, still } from '../lib/speech'

interface Props {
  lang: Sprache
  paket: Paket
  lageId: string
  onEnde: () => void
}

const RUNDE = 10

function StatusMarke({ lang, status }: { lang: Sprache; status: Satz['status'] }) {
  const farbe = status === 'geprüft' ? 'text-ok' : status === 'korrigiert' ? 'text-accent' : 'text-warn'
  return <span className={`text-xs ${farbe}`}>● {t(lang, `status.${status}`)}</span>
}

export default function Lektion({ lang, paket, lageId, onEnde }: Props) {
  const lage = paket.lagen.find((l) => l.id === lageId)
  const [stand, setStand] = useState(() => srs.lade(paket.ags))
  const [runde, setRunde] = useState<Uebung[]>([])
  const [i, setI] = useState(0)
  const [richtigZahl, setRichtigZahl] = useState(0)
  const [fertig, setFertig] = useState(false)
  const mitStimme = useMemo(() => kannSprechen(), [])

  const neueRunde = () => {
    if (!lage) return
    const ids = srs.rundenAuswahl(srs.lade(paket.ags), lage.saetze.map((s) => s.id), RUNDE)
    setRunde(baueRunde(paket, lage.id, ids, mitStimme))
    setI(0)
    setRichtigZahl(0)
    setFertig(false)
  }

  useEffect(() => {
    neueRunde()
    return () => still()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lageId])

  if (!lage) return null

  const bewerte = (satzIds: string[], richtig: boolean) => {
    let s = stand
    for (const id of satzIds) s = srs.bewerte(s, id, richtig)
    setStand(s)
    srs.speichere(paket.ags, s)
    if (richtig) setRichtigZahl((n) => n + 1)
  }

  const weiter = () => {
    still()
    if (i + 1 >= runde.length) setFertig(true)
    else setI(i + 1)
  }

  const z = srs.zusammenfassung(stand, lage.saetze.map((s) => s.id))

  return (
    <section className="pt-4">
      <div className="flex items-center gap-3 text-sm text-muted">
        <button type="button" onClick={onEnde} className="hover:text-ink">
          ← {t(lang, 'ueb.zurueck')}
        </button>
        <span className="ms-auto">{lage.titel[lang] ?? lage.titel.de}</span>
      </div>

      {fertig ? (
        <div className="mt-8 rounded-2xl bg-paper border border-line p-6 text-center">
          <div className="text-2xl font-bold">{t(lang, 'ueb.fertig')}</div>
          <div className="text-muted mt-1">{t(lang, 'ueb.ergebnis', { r: richtigZahl, n: runde.length })}</div>
          <div className="text-sm text-muted mt-3">
            {z.sicher}/{z.gesamt} {t(lang, 'lage.sicher')}
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <button type="button" onClick={neueRunde} className="rounded-xl bg-accent text-accent-ink py-3 font-medium">
              {t(lang, 'ueb.nochmal')}
            </button>
            <button type="button" onClick={onEnde} className="rounded-xl border border-line py-3 font-medium">
              {t(lang, 'ueb.schliessen')}
            </button>
          </div>
        </div>
      ) : runde.length ? (
        <>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-line overflow-hidden" aria-hidden="true">
              <div className="h-full bg-accent transition-all" style={{ width: `${(i / runde.length) * 100}%` }} />
            </div>
            <span className="text-xs text-muted">{t(lang, 'ueb.frage', { i: i + 1, n: runde.length })}</span>
          </div>
          <Aufgabe key={i} lang={lang} u={runde[i]} onBewertung={bewerte} onWeiter={weiter} />
        </>
      ) : null}
    </section>
  )
}

function Aufgabe({
  lang,
  u,
  onBewertung,
  onWeiter,
}: {
  lang: Sprache
  u: Uebung
  onBewertung: (ids: string[], richtig: boolean) => void
  onWeiter: () => void
}) {
  if (u.art === 'zuordnen') return <Zuordnen lang={lang} paare={u.paare} onBewertung={onBewertung} onWeiter={onWeiter} />
  return <Auswahl lang={lang} satz={u.satz} optionen={u.optionen} hoeren={u.art === 'hoeren'} onBewertung={onBewertung} onWeiter={onWeiter} />
}

function Gloss({ lang, satz }: { lang: Sprache; satz: Satz }) {
  const g = lang !== 'de' ? satz[lang] : undefined
  if (!g) return null
  return <div className="text-sm text-muted mt-1">{g}</div>
}

function Auswahl({
  lang,
  satz,
  optionen,
  hoeren,
  onBewertung,
  onWeiter,
}: {
  lang: Sprache
  satz: Satz
  optionen: Satz[]
  hoeren: boolean
  onBewertung: (ids: string[], richtig: boolean) => void
  onWeiter: () => void
}) {
  const [wahl, setWahl] = useState<string | null>(null)
  const [textOffen, setTextOffen] = useState(!hoeren)
  const [gespielt, setGespielt] = useState(false)
  const bewertet = useRef(false)

  useEffect(() => {
    if (hoeren) {
      const ok = sprich(satz.swg)
      setGespielt(ok)
    }
    return () => still()
  }, [hoeren, satz.swg])

  const antworte = (o: Satz) => {
    if (wahl) return
    setWahl(o.id)
    setTextOffen(true)
    if (!bewertet.current) {
      bewertet.current = true
      onBewertung([satz.id], o.id === satz.id)
    }
  }

  const richtig = wahl === satz.id

  return (
    <div className="mt-5">
      <h2 className="text-lg font-bold">{t(lang, hoeren ? 'ueb.hoeren' : 'ueb.lesen')}</h2>

      <div className="mt-3 rounded-2xl bg-paper border border-line p-4 min-h-24">
        {hoeren && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setGespielt(sprich(satz.swg))}
              className="rounded-full bg-accent text-accent-ink px-4 py-2 font-medium"
            >
              ▶ {gespielt ? t(lang, 'ueb.nochmalHoeren') : t(lang, 'ueb.abspielen')}
            </button>
            {!textOffen && (
              <button type="button" onClick={() => setTextOffen(true)} className="text-sm text-muted underline underline-offset-4">
                {t(lang, 'ueb.textZeigen')}
              </button>
            )}
          </div>
        )}
        {textOffen && (
          <div className="mt-3">
            <div className="text-xl font-medium" lang="de" dir="ltr">{satz.swg}</div>
            <div className="mt-1">
              <StatusMarke lang={lang} status={satz.status} />
            </div>
          </div>
        )}
        {hoeren && <p className="text-xs text-muted mt-3">{t(lang, 'ueb.stimmeHinweis')}</p>}
      </div>

      <ul className="mt-4 space-y-2">
        {optionen.map((o) => {
          let stil = 'bg-paper border-line hover:border-accent'
          if (wahl) {
            if (o.id === satz.id) stil = 'border-ok bg-t3'
            else if (o.id === wahl) stil = 'border-bad bg-t2'
            else stil = 'bg-paper border-line opacity-60'
          }
          return (
            <li key={o.id}>
              <button
                type="button"
                disabled={!!wahl}
                onClick={() => antworte(o)}
                className={`w-full text-left rounded-xl border px-4 py-3 ${stil}`}
                lang="de"
                dir="ltr"
              >
                {o.de}
              </button>
            </li>
          )
        })}
      </ul>

      {wahl && (
        <div className="mt-4 rounded-2xl p-4 border border-line bg-paper">
          <div className={`font-bold ${richtig ? 'text-ok' : 'text-bad'}`}>{richtig ? t(lang, 'ueb.richtig') : t(lang, 'ueb.falsch')}</div>
          {!richtig && <div className="mt-1" lang="de" dir="ltr">{satz.de}</div>}
          <Gloss lang={lang} satz={satz} />
          {satz.hinweis && (
            <div className="mt-3 text-sm">
              <span className="font-medium">{t(lang, 'ueb.hinweis')}: </span>
              {satz.hinweis[lang] ?? satz.hinweis.de}
            </div>
          )}
          <button type="button" onClick={onWeiter} className="mt-4 w-full rounded-xl bg-accent text-accent-ink py-3 font-medium">
            {t(lang, 'ueb.weiter')}
          </button>
        </div>
      )}
    </div>
  )
}

function Zuordnen({
  lang,
  paare,
  onBewertung,
  onWeiter,
}: {
  lang: Sprache
  paare: Satz[]
  onBewertung: (ids: string[], richtig: boolean) => void
  onWeiter: () => void
}) {
  const rechts = useMemo(() => [...paare].sort(() => Math.random() - 0.5), [paare])
  const [links, setLinks] = useState<string | null>(null)
  const [geloest, setGeloest] = useState<string[]>([])
  const [fehler, setFehler] = useState<string | null>(null)
  const [fehlerZahl, setFehlerZahl] = useState(0)
  const abgeschlossen = useRef(false)

  const waehleRechts = (id: string) => {
    if (!links || geloest.includes(id)) return
    if (links === id) {
      const g = [...geloest, id]
      setGeloest(g)
      setLinks(null)
      onBewertung([id], true)
      if (g.length === paare.length && !abgeschlossen.current) abgeschlossen.current = true
    } else {
      setFehler(id)
      setFehlerZahl((n) => n + 1)
      onBewertung([links], false)
      setTimeout(() => setFehler(null), 500)
      setLinks(null)
    }
  }

  const alleGeloest = geloest.length === paare.length

  return (
    <div className="mt-5">
      <h2 className="text-lg font-bold">{t(lang, 'ueb.zuordnen')}</h2>
      <div className="mt-3 grid grid-cols-2 gap-2" dir="ltr">
        <div className="space-y-2">
          {paare.map((s) => (
            <button
              key={s.id}
              type="button"
              disabled={geloest.includes(s.id)}
              onClick={() => setLinks(s.id)}
              className={`w-full text-left rounded-xl border px-3 py-3 text-sm min-h-16 ${
                geloest.includes(s.id) ? 'opacity-40 border-line bg-paper' : links === s.id ? 'border-accent bg-t0' : 'border-line bg-paper'
              }`}
              lang="de"
            >
              {s.swg}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {rechts.map((s) => (
            <button
              key={s.id}
              type="button"
              disabled={geloest.includes(s.id)}
              onClick={() => waehleRechts(s.id)}
              className={`w-full text-left rounded-xl border px-3 py-3 text-sm min-h-16 ${
                geloest.includes(s.id) ? 'opacity-40 border-ok bg-t3' : fehler === s.id ? 'border-bad bg-t2' : 'border-line bg-paper'
              }`}
              lang="de"
            >
              {s.de}
            </button>
          ))}
        </div>
      </div>
      {alleGeloest && (
        <div className="mt-4 rounded-2xl p-4 border border-line bg-paper">
          <div className="font-bold text-ok">{t(lang, 'ueb.richtig')}</div>
          {fehlerZahl > 0 && <div className="text-sm text-muted mt-1">{t(lang, 'ueb.ergebnis', { r: paare.length, n: paare.length + fehlerZahl })}</div>}
          <button type="button" onClick={onWeiter} className="mt-4 w-full rounded-xl bg-accent text-accent-ink py-3 font-medium">
            {t(lang, 'ueb.weiter')}
          </button>
        </div>
      )}
    </div>
  )
}
