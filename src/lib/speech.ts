/** Vorlesen über die Stimme des Geräts (Web Speech API). Kein Server, keine Audiodateien. */

let stimmen: SpeechSynthesisVoice[] = []

function ladeStimmen() {
  if (typeof speechSynthesis === 'undefined') return
  stimmen = speechSynthesis.getVoices()
}

if (typeof speechSynthesis !== 'undefined') {
  ladeStimmen()
  speechSynthesis.addEventListener?.('voiceschanged', ladeStimmen)
}

export function deutscheStimme(): SpeechSynthesisVoice | null {
  if (!stimmen.length) ladeStimmen()
  const de = stimmen.filter((v) => v.lang.toLowerCase().startsWith('de'))
  if (!de.length) return null
  // Lokale Stimmen zuerst, dann de-DE vor de-AT/de-CH
  de.sort((a, b) => Number(b.localService) - Number(a.localService) || (a.lang === 'de-DE' ? -1 : 1))
  return de[0]
}

export function kannSprechen(): boolean {
  return typeof speechSynthesis !== 'undefined' && deutscheStimme() !== null
}

export function sprich(text: string, tempo = 0.85): boolean {
  if (typeof speechSynthesis === 'undefined') return false
  const stimme = deutscheStimme()
  if (!stimme) return false
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.voice = stimme
  u.lang = stimme.lang
  u.rate = tempo
  speechSynthesis.speak(u)
  return true
}

export function still() {
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel()
}
