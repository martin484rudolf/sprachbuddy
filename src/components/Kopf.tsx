import { useEffect, useRef, useState } from 'react'
import { gemeinde, type Sprache } from '../data'
import { SPRACHEN, t } from '../i18n'

interface Props {
  lang: Sprache
  setLang: (l: Sprache) => void
  ort: string | null
  geh: (p: string) => void
  zeigeOrt: boolean
}

export default function Kopf({ lang, setLang, ort, geh, zeigeOrt }: Props) {
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

  return (
    <header className="sticky top-0 z-10 bg-ground/90 backdrop-blur border-b border-line">
      <div className="max-w-xl mx-auto px-4 h-14 flex items-center gap-3">
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
            className="text-sm px-3 py-1.5 rounded-full border border-line bg-paper hover:border-accent"
            aria-haspopup="menu"
            aria-expanded={offen}
            aria-label={t(lang, 'allg.sprache')}
          >
            {SPRACHEN.find((s) => s.code === lang)?.name}
          </button>
          {offen && (
            <ul role="menu" className="absolute end-0 mt-2 w-56 rounded-xl bg-paper border border-line shadow-lg overflow-hidden">
              {SPRACHEN.map((s) => (
                <li key={s.code} role="none">
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={s.code === lang}
                    dir={s.dir}
                    onClick={() => {
                      setLang(s.code)
                      setOffen(false)
                    }}
                    className={`w-full text-start px-4 py-2.5 flex items-center gap-2 hover:bg-ground ${s.code === lang ? 'font-bold text-accent' : ''}`}
                  >
                    <span>{s.name}</span>
                    {!s.geprueft && (
                      <span className="ms-auto text-xs text-warn" dir={s.dir}>
                        {t(s.code, 'allg.ungeprueft')}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  )
}
