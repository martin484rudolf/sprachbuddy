import { useMemo, useState } from 'react'
import { KARTE, PAKETE, type Sprache } from '../data'
import { t } from '../i18n'

interface Props {
  lang: Sprache
  aktiv: string | null
  onWahl: (ags: string) => void
}

export default function Ortswahl({ lang, aktiv, onWahl }: Props) {
  const [hot, setHot] = useState<string | null>(null)
  const [x0, y0, x1, y1] = KARTE.lbbox
  const pad = 70
  const vx0 = x0 - pad, vy0 = y0 - pad, vx1 = x1 + pad, vy1 = y1 + pad
  const viewBox = `${vx0} ${vy0} ${vx1 - vx0} ${vy1 - vy0}`
  const klemm = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
  const sortiert = useMemo(() => [...KARTE.g].sort((a, b) => a.name.localeCompare(b.name, 'de')), [])

  return (
    <section className="pt-6">
      <h1 className="text-2xl font-bold">{t(lang, 'ort.frage')}</h1>
      <p className="text-muted mt-1">{t(lang, 'ort.hinweis')}</p>
      <p className="text-xs text-muted mt-1">{t(lang, 'ort.kreis')}</p>

      <div className="karte mt-4 rounded-2xl bg-paper border border-line p-2" dir="ltr">
        <svg viewBox={viewBox} role="group" aria-label={t(lang, 'ort.kreis')}>
          <g>
            {KARTE.others.map((d, i) => (
              <path key={i} d={d} className="land" />
            ))}
            {KARTE.nb.map((n) => (
              <path key={n.key} d={n.d} className="nbA" />
            ))}
          </g>
          <g>
            {KARTE.g.map((g) => (
              <path
                key={g.ags}
                d={g.d}
                className={`gm c${g.c} ${g.ags === aktiv ? 'aktiv' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={g.name}
                onClick={() => onWahl(g.ags)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onWahl(g.ags)
                  }
                }}
                onMouseEnter={() => setHot(g.ags)}
                onMouseLeave={() => setHot(null)}
                onFocus={() => setHot(g.ags)}
                onBlur={() => setHot(null)}
              />
            ))}
          </g>
          <path d={KARTE.kreis} className="rahmen" />
          <g>
            {KARTE.g.map((g) => (
              <text key={g.ags} className={`lbl ${hot === g.ags || aktiv === g.ags ? 'hot' : ''}`} fontSize={g.fs}>
                {g.lines.map((l, i) => (
                  <tspan key={i} x={g.lx} y={(g.ly + (i - (g.lines.length - 1) / 2) * g.fs * 1.05 + g.fs * 0.35).toFixed(1)}>
                    {l}
                  </tspan>
                ))}
              </text>
            ))}
            {KARTE.g.filter((g) => PAKETE[g.ags]).map((g) => (
              <circle key={g.ags} cx={g.lx} cy={g.ly - g.fs * (g.lines.length / 2) - 6} r={5} className="punkt" />
            ))}
          </g>
          <g>
            {KARTE.nb.map((n) => (
              <text key={n.key} className="nbl" x={klemm(n.bx, vx0 + 60, vx1 - 60)} y={klemm(n.by + 6, vy0 + 24, vy1 - 10)}>
                {n.key}
              </text>
            ))}
          </g>
        </svg>
      </div>

      <label className="block mt-5">
        <span className="text-sm text-muted">{t(lang, 'ort.liste')}</span>
        <select
          className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2.5"
          value={aktiv ?? ''}
          onChange={(e) => e.target.value && onWahl(e.target.value)}
        >
          <option value="">–</option>
          {sortiert.map((g) => (
            <option key={g.ags} value={g.ags}>
              {g.name}
              {PAKETE[g.ags] ? ' ●' : ''}
            </option>
          ))}
        </select>
      </label>
    </section>
  )
}
