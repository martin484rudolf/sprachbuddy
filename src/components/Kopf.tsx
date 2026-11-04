import { useEffect, useRef, useState } from 'react'
import { gemeinde, type Sprache } from '../data'
import { SPRACHEN, t } from '../i18n'

interface Props {
  lang: Sprache
  setLang: (l: Sprache) => void
  ziel: Sprache
  setZiel: (l: Sprache) => void
  ort: string | null
  geh: (p: string) => void
  zeigeOrt: boolean
}

function Auswahl({
  id,
  label,
  wert,
  onWahl,
  lang,
}: {
  id: string
  label: string
  wert: Sprache
  onWahl: (l: Sprache) => void
  lang: Sprache
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-muted mb-1">
        {label}
      </label>
      <select
        id={id}
        value={wert}
        onChange={(e) => onWahl(e.target.value as Sprache)}
        className="w-full rounded-lg border border-line bg-ground px-3 py-2 text-sm"
      >
        {SPRACHEN.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
            {!s.geprueft ? ` (${t(lang, 'allg.ungeprueft')})` : ''}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function Kopf({ lang, setLang, ziel, setZiel, ort, geh, zeigeOrt }: Props) {
  const [offen, setOffen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const g = ort ? gemeinde(ort) : undefined

  useEffect(() => {
    if (!offen) return
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOffen(false)
    }
    document.addEventListener('click', h)
    return () => document.removeEventListener('click', h)
  }, [offen])

  const tausche = () => {
    const ich = lang
    setLang(ziel)
    setZiel(ich)
  }

  return (
    <header className="sticky top-0 z-10 bg-ground/90 backdrop-blur border-b border-line">
      <div className="max-w-xl mx-auto seite h-14 flex items-center gap-3">
        <button
          type="button"
          onClick={() => geh(ort ? '/start' : '/ort')}
          className="font-bold text-lg tracking-tight text-accent"
          aria-label={t(lang, 'allg.start')}
        >
          {t(lang, 'app.name')}
        </button>
        {zeigeOrt && g && (
          <button
            type="button"
            onClick={() => geh('/ort')}
            className="text-sm text-muted truncate hover:text-ink"
            title={t(lang, 'ort.wechseln')}
          >
            {g.name}
          </button>
        )}
        <div className="ms-auto relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOffen((o) => !o)}
            className="text-sm px-3 py-1.5 rounded-full border border-line bg-paper hover:border-accent whitespace-nowrap"
            aria-haspopup="dialog"
            aria-expanded={offen}
            aria-label={t(lang, 'sprachen.titel')}
          >
            <span dir="ltr">
              {lang.toUpperCase()} → {ziel.toUpperCase()}
            </span>
          </button>
          {offen && (
            <div
              role="dialog"
              aria-label={t(lang, 'sprachen.titel')}
              className="absolute end-0 mt-2 w-72 rounded-xl bg-paper border border-line shadow-lg p-4 space-y-3"
            >
              <div className="font-bold">{t(lang, 'sprachen.titel')}</div>
              <Auswahl id="sprache-ich" label={t(lang, 'sprachen.ich')} wert={lang} onWahl={setLang} lang={lang} />
              <button
                type="button"
                onClick={tausche}
                className="w-full rounded-lg border border-line py-1.5 text-sm hover:border-accent"
              >
                ⇅ {t(lang, 'sprachen.tauschen')}
              </button>
              <Auswahl id="sprache-ziel" label={t(lang, 'sprachen.ziel')} wert={ziel} onWahl={setZiel} lang={lang} />
              <p className="text-xs text-muted">{t(lang, 'sprachen.hinweis')}</p>
              <button
                type="button"
                onClick={() => setOffen(false)}
                className="w-full rounded-lg bg-accent text-accent-ink py-2 text-sm font-medium"
              >
                {t(lang, 'sprachen.fertig')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
