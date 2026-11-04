import { MEDIEN, type Anbieter, type Sprache, type Status, type Werkzeug } from '../data'
import { sprachName, t } from '../i18n'

interface Props {
  lang: Sprache
  ziel: Sprache
}

function StatusChip({ status, stand, lang }: { status: Status; stand?: string | null; lang: Sprache }) {
  const farbe = status === 'geprüft' ? 'text-ok' : status === 'korrigiert' ? 'text-accent' : 'text-warn'
  return (
    <span className={`text-xs ${farbe}`}>
      ● {t(lang, `status.${status}`)}
      {stand ? ` · ${t(lang, 'allg.stand')} ${stand}` : ''}
    </span>
  )
}

function Link({ web }: { web: string }) {
  return (
    <a className="text-sm text-accent underline underline-offset-4 ltr inline-block" href={`https://${web.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener">
      {web}
    </a>
  )
}

function Zeile({ titel, text, web }: { titel: string; text?: string; web?: string | null }) {
  if (!text && !web) return null
  return (
    <div className="text-sm">
      <span className="font-medium">{titel}: </span>
      {text && <span className="text-muted">{text}</span>}
      {web && (
        <>
          {' '}
          <Link web={web} />
        </>
      )}
    </div>
  )
}

function AnbieterKarte({ a, lang }: { a: Anbieter; lang: Sprache }) {
  const tx = (o: Partial<Record<Sprache, string>>) => o[lang] ?? o.de ?? ''
  return (
    <div className="rounded-2xl bg-paper border border-line p-4 space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-bold text-lg">{a.name}</h3>
        <Link web={a.web} />
      </div>
      <div className="text-sm">
        <span className="font-medium">{t(lang, 'medien.kosten')}: </span>
        <span className="text-muted">{tx(a.kosten.text)}</span>{' '}
        <StatusChip status={a.kosten.status} stand={a.kosten.stand} lang={lang} />
      </div>
      <Zeile titel={t(lang, 'medien.lernen')} text={tx(a.lernen)} />
      <Zeile titel={t(lang, 'medien.suche')} text={tx(a.suche.text)} web={a.suche.web} />
      <Zeile titel={t(lang, 'medien.umschalten')} text={tx(a.umschalten)} />

      {a.herkunftssprachen && (
        <div className="pt-1">
          <div className="text-sm font-medium">{t(lang, 'medien.herkunft')}</div>
          <p className="text-xs text-muted">{tx(a.herkunftssprachen.hinweis)}</p>
          <ul className="mt-2 divide-y divide-line">
            {a.herkunftssprachen.sprachen.map((h) => (
              <li key={h.code} className={`py-1.5 text-sm flex flex-wrap items-baseline gap-x-2 ${h.code === lang ? 'bg-t0 -mx-2 px-2 rounded-lg' : ''}`}>
                <span className="font-medium" lang={h.code}>
                  {tx(h.name)}
                </span>
                {h.code === lang && <span className="text-xs text-accent">{t(lang, 'medien.deineSprache')}</span>}
                <span className="text-muted">{t(lang, `medien.umfang.${h.umfang}`)}</span>
                <StatusChip status={h.status} stand={h.stand} lang={lang} />
                {h.beispiele.length > 0 && (
                  <span className="w-full text-xs text-muted">
                    {h.beispiele
                      .map((b) => `${b.titel} (${t(lang, b.deutscherTon ? 'medien.deutscherTon' : 'medien.ohneDeutschenTon')})`)
                      .join(' · ')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-xs text-muted pt-1 flex flex-wrap gap-x-3">
        <StatusChip status={a.status} lang={lang} />
        <span>{a.quelle}</span>
      </div>
    </div>
  )
}

function WerkzeugKarte({ w, lang }: { w: Werkzeug; lang: Sprache }) {
  return (
    <div className="rounded-2xl bg-paper border border-line p-4 space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-bold text-lg">{w.name}</h3>
        <Link web={w.web} />
      </div>
      <p className="text-sm text-muted">{w.text[lang] ?? w.text.de}</p>
      <div className="text-xs text-muted flex flex-wrap gap-x-3">
        <StatusChip status={w.status} lang={lang} />
        <span>{w.quelle}</span>
      </div>
    </div>
  )
}

export default function Medien({ lang, ziel }: Props) {
  const kostenlos = MEDIEN.anbieter.filter((a) => a.kostenlos)
  const abo = MEDIEN.anbieter.filter((a) => !a.kostenlos)

  return (
    <section className="pt-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{t(lang, 'medien.titel')}</h1>
        <p className="mt-2 text-sm">{t(lang, 'medien.einleitung')}</p>
        {ziel !== 'de' && (
          <p className="mt-3 rounded-2xl bg-t0 border border-line p-4 text-sm" data-test="medien-ziel">
            {t(lang, 'medien.andereZiel', { ziel: sprachName(ziel), ich: sprachName(lang) })}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="font-bold text-lg">{t(lang, 'medien.mitAbo')}</h2>
        {abo.map((a) => (
          <AnbieterKarte key={a.id} a={a} lang={lang} />
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="font-bold text-lg">{t(lang, 'medien.kostenlos')}</h2>
        {kostenlos.map((a) => (
          <AnbieterKarte key={a.id} a={a} lang={lang} />
        ))}
      </div>

      {MEDIEN.werkzeuge.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-lg">{t(lang, 'medien.werkzeuge')}</h2>
          {MEDIEN.werkzeuge.map((w) => (
            <WerkzeugKarte key={w.id} w={w} lang={lang} />
          ))}
        </div>
      )}

      <p className="text-xs text-muted pt-2">
        {t(lang, 'medien.hinweis')} {t(lang, 'allg.stand')} {MEDIEN.stand}.
      </p>
    </section>
  )
}
