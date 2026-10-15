import { ORTE, gemeinde, type Sprache } from '../data'
import { t } from '../i18n'

interface Props {
  lang: Sprache
  ags: string
}

function Karte({
  titel,
  text,
  tel,
  adresse,
  web,
  quelle,
  status,
  lang,
}: {
  titel: string
  text?: string
  tel?: string | null
  adresse?: string | null
  web?: string | null
  quelle?: string
  status?: 'ungeprüft' | 'geprüft' | 'korrigiert'
  lang: Sprache
}) {
  const telRein = tel?.replace(/[^\d+]/g, '')
  return (
    <div className="rounded-2xl bg-paper border border-line p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-bold">{titel}</div>
          {text && <div className="text-sm text-muted mt-0.5">{text}</div>}
          {adresse && <div className="text-sm mt-2 ltr">{adresse}</div>}
          {web && (
            <a className="text-sm text-accent underline underline-offset-4 ltr block mt-1" href={`https://${web.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener">
              {web}
            </a>
          )}
        </div>
        {tel && (
          <a href={`tel:${telRein}`} className="shrink-0 rounded-full bg-accent text-accent-ink px-4 py-2 font-bold ltr">
            {tel}
          </a>
        )}
      </div>
      {(quelle || status) && (
        <div className="text-xs text-muted mt-3 flex flex-wrap gap-x-3">
          {status && <span className={status === 'geprüft' ? 'text-ok' : 'text-warn'}>● {t(lang, `status.${status}`)}</span>}
          {quelle && <span>{quelle}</span>}
        </div>
      )}
    </div>
  )
}

export default function Zustaendig({ lang, ags }: Props) {
  const g = gemeinde(ags)
  const orte = ORTE[ags]
  const r = g?.rathaus

  return (
    <section className="pt-6 space-y-3">
      <h1 className="text-2xl font-bold">{t(lang, 'modul.zustaendig')}</h1>
      <p className="text-muted text-sm">{g?.name}</p>

      <Karte lang={lang} titel={t(lang, 'zust.notruf')} text={t(lang, 'zust.notrufText')} tel="112" quelle={t(lang, 'zust.quelleAllgemein')} />
      <Karte lang={lang} titel={t(lang, 'zust.polizei')} tel="110" quelle={t(lang, 'zust.quelleAllgemein')} />
      <Karte lang={lang} titel={t(lang, 'zust.bereitschaft')} text={t(lang, 'zust.bereitschaftText')} tel="116 117" quelle={t(lang, 'zust.quelleAllgemein')} />

      {r && r.strasse && (
        <Karte
          lang={lang}
          titel={`${t(lang, 'zust.rathaus')} ${g?.name}`}
          adresse={`${r.strasse}, ${r.plz ?? ''} ${g?.name ?? ''}`}
          tel={r.tel}
          web={r.web}
          quelle="Gemeindedaten Landratsamt Ludwigsburg"
        />
      )}

      {orte?.eintraege.map((e) => (
        <Karte
          key={e.id}
          lang={lang}
          titel={e.titel[lang] ?? e.titel.de ?? e.id}
          text={e.text?.[lang] ?? e.text?.de}
          adresse={e.adresse}
          tel={e.tel}
          web={e.web}
          status={e.status}
          quelle={e.quelle}
        />
      ))}

      <p className="text-xs text-muted pt-2">{t(lang, 'zust.hinweis')}</p>
    </section>
  )
}
