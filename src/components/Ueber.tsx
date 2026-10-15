import { KARTE, PAKETE, type Sprache } from '../data'
import { t } from '../i18n'

interface Props {
  lang: Sprache
}

export default function Ueber({ lang }: Props) {
  const pakete = Object.values(PAKETE)
  return (
    <section className="pt-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t(lang, 'ueber.titel')}</h1>
        <p className="mt-2">{t(lang, 'ueber.text')}</p>
      </div>

      <div>
        <h2 className="font-bold text-lg">{t(lang, 'ueber.mitmachen')}</h2>
        <p className="mt-1 text-sm">{t(lang, 'ueber.mitmachenText')}</p>
      </div>

      <div>
        <h2 className="font-bold text-lg">{t(lang, 'ueber.sprachen')}</h2>
        <p className="mt-1 text-sm">{t(lang, 'ueber.sprachenText')}</p>
        <p className="mt-2 text-sm text-muted">{t(lang, 'status.legende')}</p>
      </div>

      <div>
        <h2 className="font-bold text-lg">{t(lang, 'ueber.initiator')}</h2>
        <p className="mt-1 text-sm">{t(lang, 'ueber.initiatorText')}</p>
      </div>

      <div>
        <h2 className="font-bold text-lg">{t(lang, 'ueber.quellen')}</h2>
        <ul className="mt-1 text-sm text-muted space-y-2" dir="ltr">
          <li>{KARTE.quelle}</li>
          {pakete.map((p) => (
            <li key={p.ags}>
              {p.ort}, {p.variante}: {p.quelle}. Version {p.version}, {t(lang, 'allg.stand')} {p.stand}.
            </li>
          ))}
          <li>
            Nachschlagewerke für die Schwäbisch-Pakete: Hermann Fischer, Schwäbisches Wörterbuch (1904–1936, Internet Archive);
            Sprachatlas von Nord Baden-Württemberg, Universität Tübingen (2019, frei zugänglich).
          </li>
          <li>Schrift Ubuntu (Ubuntu Font Licence). Vorlesen und Spracherkennung: Stimmen des Geräts, keine Server.</li>
        </ul>
      </div>
    </section>
  )
}
