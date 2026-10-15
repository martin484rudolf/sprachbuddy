import { useMemo, useState } from 'react'
import type { Paket, Satz, Sprache } from '../data'
import { alleSaetze } from '../data'
import { t } from '../i18n'
import * as pr from '../lib/pruefung'

interface Props {
  lang: Sprache
  paket: Paket
}

export default function Pruefansicht({ lang, paket }: Props) {
  const [stand, setStand] = useState<pr.Pruefstand>(() => pr.lade(paket.ags))
  const [offen, setOffen] = useState<string | null>(null)
  const [resetFrage, setResetFrage] = useState(false)
  const [kopiert, setKopiert] = useState(false)
  const saetze = useMemo(() => alleSaetze(paket), [paket])

  const setze = (id: string, u: pr.Urteil | null) => {
    const neu = { ...stand }
    if (u) neu[id] = u
    else delete neu[id]
    setStand(neu)
    pr.speichere(paket.ags, neu)
    setOffen(null)
  }

  const zahlen = saetze.reduce(
    (a, s) => {
      const u = stand[s.id]
      if (!u) a.u++
      else if (u.status === 'geprüft') a.g++
      else a.k++
      return a
    },
    { g: 0, k: 0, u: 0 },
  )

  const exportText = () => {
    const { paket: p, protokoll } = pr.exportiere(paket, stand)
    return JSON.stringify({ paket: p, protokoll }, null, 2)
  }

  const exportieren = () => {
    const datum = new Date().toISOString().slice(0, 10)
    pr.ladeDatei(`${datum}_Pruefung_${paket.ags}.json`, exportText())
  }

  const kopieren = async () => {
    try {
      await navigator.clipboard.writeText(exportText())
      setKopiert(true)
      setTimeout(() => setKopiert(false), 2000)
    } catch {
      /* Zwischenablage verweigert – dann bleibt der Download */
    }
  }

  return (
    <section className="pt-6">
      <h1 className="text-2xl font-bold">{t(lang, 'pruef.titel')}</h1>
      <p className="text-muted text-sm mt-1">{t(lang, 'pruef.hinweis')}</p>
      <p className="text-xs text-muted mt-2">{paket.variante}</p>

      <div className="sticky top-14 z-[5] bg-ground py-3 mt-2 flex items-center gap-3 text-sm">
        <span className="text-muted">{t(lang, 'pruef.stand', zahlen)}</span>
        <button type="button" onClick={exportieren} className="ms-auto rounded-full bg-accent text-accent-ink px-4 py-1.5 font-medium">
          {t(lang, 'pruef.export')}
        </button>
        <button type="button" onClick={kopieren} className="rounded-full border border-line px-3 py-1.5" title={t(lang, 'pruef.kopieren')}>
          {kopiert ? '✓' : t(lang, 'pruef.kopieren')}
        </button>
      </div>

      {paket.lagen.map((l) => (
        <div key={l.id} className="mt-4">
          <h2 className="font-bold text-lg">{l.titel[lang] ?? l.titel.de}</h2>
          <ul className="mt-2 space-y-2">
            {l.saetze.map((s) => (
              <Zeile
                key={s.id}
                lang={lang}
                satz={s}
                urteil={stand[s.id]}
                offen={offen === s.id}
                onOeffnen={() => setOffen(offen === s.id ? null : s.id)}
                onUrteil={(u) => setze(s.id, u)}
              />
            ))}
          </ul>
        </div>
      ))}

      <div className="mt-8 text-sm flex items-center gap-3">
        {resetFrage ? (
          <>
            <span className="text-muted">{t(lang, 'pruef.zuruecksetzenFrage')}</span>
            <button
              type="button"
              onClick={() => {
                setStand({})
                pr.speichere(paket.ags, {})
                setResetFrage(false)
              }}
              className="rounded-full border border-bad text-bad px-3 py-1"
            >
              {t(lang, 'pruef.zuruecksetzen')}
            </button>
            <button type="button" onClick={() => setResetFrage(false)} className="text-muted underline underline-offset-4">
              {t(lang, 'pruef.abbrechen')}
            </button>
          </>
        ) : (
          <button type="button" onClick={() => setResetFrage(true)} className="text-muted underline underline-offset-4">
            {t(lang, 'pruef.zuruecksetzen')}
          </button>
        )}
      </div>
    </section>
  )
}

function Zeile({
  lang,
  satz,
  urteil,
  offen,
  onOeffnen,
  onUrteil,
}: {
  lang: Sprache
  satz: Satz
  urteil?: pr.Urteil
  offen: boolean
  onOeffnen: () => void
  onUrteil: (u: pr.Urteil | null) => void
}) {
  const [swg, setSwg] = useState(urteil?.swg ?? satz.swg)
  const [de, setDe] = useState(urteil?.de ?? satz.de)
  const [anm, setAnm] = useState(urteil?.anmerkung ?? '')

  const status = urteil?.status ?? satz.status
  const rand = status === 'geprüft' ? 'border-ok' : status === 'korrigiert' ? 'border-accent' : 'border-line'

  return (
    <li className={`rounded-2xl bg-paper border ${rand} p-3`}>
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0" lang="de" dir="ltr">
          <div className="font-medium">{urteil?.swg ?? satz.swg}</div>
          <div className="text-sm text-muted">{urteil?.de ?? satz.de}</div>
          {urteil?.anmerkung && <div className="text-xs text-muted mt-1">„{urteil.anmerkung}"</div>}
        </div>
        <span className={`text-xs shrink-0 ${status === 'geprüft' ? 'text-ok' : status === 'korrigiert' ? 'text-accent' : 'text-warn'}`}>
          {t(lang, `status.${status}`)}
        </span>
      </div>

      {!offen && (
        <div className="mt-2 flex gap-2 text-sm">
          {!urteil && (
            <button
              type="button"
              onClick={() => onUrteil({ status: 'geprüft', zeit: Date.now() })}
              className="rounded-full border border-ok text-ok px-3 py-1 font-medium"
            >
              ✓ {t(lang, 'pruef.ok')}
            </button>
          )}
          <button type="button" onClick={onOeffnen} className="rounded-full border border-line px-3 py-1">
            {t(lang, 'pruef.korrigieren')}
          </button>
          {urteil && (
            <button type="button" onClick={() => onUrteil(null)} className="ms-auto text-muted underline underline-offset-4">
              {t(lang, 'pruef.rueckgaengig')}
            </button>
          )}
        </div>
      )}

      {offen && (
        <form
          className="mt-3 space-y-2"
          onSubmit={(e) => {
            e.preventDefault()
            onUrteil({
              status: 'korrigiert',
              swg: swg.trim() || satz.swg,
              de: de.trim() || satz.de,
              anmerkung: anm.trim() || undefined,
              zeit: Date.now(),
            })
          }}
        >
          <label className="block text-xs text-muted">
            {t(lang, 'pruef.schwaebisch')}
            <input value={swg} onChange={(e) => setSwg(e.target.value)} lang="de" dir="ltr" className="mt-1 w-full rounded-xl border border-line bg-ground px-3 py-2 text-base text-ink" />
          </label>
          <label className="block text-xs text-muted">
            {t(lang, 'pruef.hochdeutsch')}
            <input value={de} onChange={(e) => setDe(e.target.value)} lang="de" dir="ltr" className="mt-1 w-full rounded-xl border border-line bg-ground px-3 py-2 text-base text-ink" />
          </label>
          <label className="block text-xs text-muted">
            {t(lang, 'pruef.anmerkung')}
            <input value={anm} onChange={(e) => setAnm(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-ground px-3 py-2 text-base text-ink" />
          </label>
          <div className="flex gap-2 pt-1">
            <button type="submit" className="rounded-full bg-accent text-accent-ink px-4 py-1.5 text-sm font-medium">
              {t(lang, 'pruef.speichern')}
            </button>
            <button type="button" onClick={onOeffnen} className="rounded-full border border-line px-4 py-1.5 text-sm">
              {t(lang, 'pruef.abbrechen')}
            </button>
          </div>
        </form>
      )}
    </li>
  )
}
