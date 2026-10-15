import { useMemo } from 'react'
import { gemeinde, type Paket, type Sprache } from '../data'
import { t } from '../i18n'
import * as srs from '../lib/srs'

interface Props {
  lang: Sprache
  ags: string
  paket?: Paket
  geh: (p: string) => void
}

function Kachel({ titel, sub, onClick, farbe }: { titel: string; sub: string; onClick: () => void; farbe: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-start rounded-2xl p-4 border border-line ${farbe} hover:border-accent transition-colors`}
    >
      <div className="font-bold text-lg">{titel}</div>
      <div className="text-sm text-muted mt-0.5">{sub}</div>
    </button>
  )
}

export default function Start({ lang, ags, paket, geh }: Props) {
  const g = gemeinde(ags)
  const stand = useMemo(() => srs.lade(ags), [ags])
  const nf = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : lang === 'en' ? 'en-GB' : 'de-DE')

  return (
    <section className="pt-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{g?.name}</h1>
        <p className="text-muted text-sm">
          {g?.ew ? `${nf.format(g.ew)} ${t(lang, 'ort.einwohner')} · ` : ''}
          {t(lang, 'ort.kreis')}
        </p>
      </div>

      {paket ? (
        <div className="rounded-2xl bg-paper border border-line p-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-bold text-lg">{t(lang, 'modul.verstehen')}</h2>
            <span className="text-xs text-muted">{t(lang, 'modul.variante')}: {paket.variante.split(' – ')[0]}</span>
          </div>
          <p className="text-sm text-muted">{t(lang, 'modul.verstehenSub')}</p>
          <ul className="mt-3 divide-y divide-line">
            {paket.lagen.map((l) => {
              const z = srs.zusammenfassung(stand, l.saetze.map((s) => s.id))
              const anteil = Math.round((z.sicher / z.gesamt) * 100)
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => geh(`/lektion/${l.id}`)}
                    className="w-full flex items-center gap-3 py-3 text-start hover:text-accent"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{l.titel[lang] ?? l.titel.de}</div>
                      <div className="text-xs text-muted">
                        {z.gesamt} {t(lang, 'lage.saetze')} · {z.sicher} {t(lang, 'lage.sicher')}
                        {z.faellig ? ` · ${z.faellig} ${t(lang, 'lage.faellig')}` : ''}
                        {z.neu ? ` · ${z.neu} ${t(lang, 'lage.neu')}` : ''}
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-line overflow-hidden" aria-hidden="true">
                        <div className="h-full bg-accent" style={{ width: `${anteil}%` }} />
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-medium px-3 py-1.5 rounded-full bg-accent text-accent-ink">
                      {t(lang, 'lage.ueben')}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="text-xs text-muted mt-3">{t(lang, 'status.legende')}</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-paper border border-dashed border-line p-4">
          <h2 className="font-bold text-lg">{t(lang, 'modul.verstehen')}</h2>
          <p className="text-sm text-muted mt-1">{t(lang, 'ort.paketFolgt')}</p>
          <button type="button" onClick={() => geh('/ueber')} className="mt-3 text-sm font-medium text-accent underline underline-offset-4">
            {t(lang, 'ort.mitmachen')}
          </button>
        </div>
      )}

      <Kachel titel={t(lang, 'modul.zustaendig')} sub={t(lang, 'modul.zustaendigSub')} onClick={() => geh('/zustaendig')} farbe="bg-t1" />
      {paket && <Kachel titel={t(lang, 'modul.pruefen')} sub={t(lang, 'modul.pruefenSub')} onClick={() => geh('/pruefen')} farbe="bg-t2" />}

      <div className="flex gap-4 text-sm text-muted pt-2">
        <button type="button" onClick={() => geh('/ort')} className="hover:text-ink underline underline-offset-4">
          {t(lang, 'ort.wechseln')}
        </button>
        <button type="button" onClick={() => geh('/ueber')} className="hover:text-ink underline underline-offset-4">
          {t(lang, 'modul.ueber')}
        </button>
      </div>
    </section>
  )
}
