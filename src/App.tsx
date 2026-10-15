import { useEffect, useMemo, useState } from 'react'
import { PAKETE, gemeinde, type Sprache } from './data'
import { SPRACHEN, dirFuer } from './i18n'
import { useHash } from './router'
import Kopf from './components/Kopf'
import Ortswahl from './components/Ortswahl'
import Start from './components/Start'
import Lektion from './components/Lektion'
import Zustaendig from './components/Zustaendig'
import Pruefansicht from './components/Pruefansicht'
import Ueber from './components/Ueber'

function ladeOrt(): string | null {
  try {
    const o = localStorage.getItem('sb:ort')
    return o && gemeinde(o) ? o : null
  } catch {
    return null
  }
}

function ladeSprache(): Sprache {
  try {
    const s = localStorage.getItem('sb:lang') as Sprache | null
    if (s && SPRACHEN.some((x) => x.code === s)) return s
  } catch {
    /* ignore */
  }
  const nav = (navigator.language || 'de').slice(0, 2) as Sprache
  return SPRACHEN.some((x) => x.code === nav) ? nav : 'de'
}

export default function App() {
  const [hash, geh] = useHash()
  const [ort, setOrt] = useState<string | null>(ladeOrt)
  const [lang, setLang] = useState<Sprache>(ladeSprache)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dirFuer(lang)
    try {
      localStorage.setItem('sb:lang', lang)
    } catch {
      /* ignore */
    }
  }, [lang])

  useEffect(() => {
    try {
      if (ort) localStorage.setItem('sb:ort', ort)
      else localStorage.removeItem('sb:ort')
    } catch {
      /* ignore */
    }
  }, [ort])

  const teile = useMemo(() => hash.split('/').filter(Boolean), [hash])
  const seite = teile[0] ?? ''
  const paket = ort ? PAKETE[ort] : undefined

  const waehleOrt = (ags: string) => {
    setOrt(ags)
    geh('/start')
  }

  let inhalt: React.ReactNode
  if (!ort || seite === 'ort') {
    inhalt = <Ortswahl lang={lang} aktiv={ort} onWahl={waehleOrt} />
  } else if (seite === 'lektion' && paket && teile[1]) {
    inhalt = <Lektion lang={lang} paket={paket} lageId={teile[1]} onEnde={() => geh('/start')} />
  } else if (seite === 'zustaendig') {
    inhalt = <Zustaendig lang={lang} ags={ort} />
  } else if (seite === 'pruefen' && paket) {
    inhalt = <Pruefansicht lang={lang} paket={paket} />
  } else if (seite === 'ueber') {
    inhalt = <Ueber lang={lang} />
  } else {
    inhalt = <Start lang={lang} ags={ort} paket={paket} geh={geh} />
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <Kopf lang={lang} setLang={setLang} ort={ort} geh={geh} zeigeOrt={!!ort && seite !== 'ort'} />
      <main className="flex-1 w-full max-w-xl mx-auto px-4 pb-10">{inhalt}</main>
    </div>
  )
}
