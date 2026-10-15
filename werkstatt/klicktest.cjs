/* Klick-Test: Ort wählen → Start → Lektion → Übungen → Prüfansicht → Export. Screenshots nach shots/. */
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const BASE = process.env.BASE || 'http://localhost:4173'
const OUT = path.join(__dirname, 'shots')
fs.mkdirSync(OUT, { recursive: true })

const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium/chrome-linux/chrome', '/opt/pw-browsers/chromium']
  .find((p) => fs.existsSync(p))

async function main() {
  const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] })
  const fehler = []
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: 'de-DE' })
  const page = await ctx.newPage()
  page.on('pageerror', (e) => fehler.push('pageerror: ' + e.message))
  page.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()) })

  await page.goto(BASE + '/#/ort', { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(OUT, '01-ort.png') })

  // Vaihingen auf der Karte antippen
  await page.locator('path[aria-label="Vaihingen an der Enz"]').click()
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(OUT, '02-start.png'), fullPage: true })
  const h1 = await page.locator('h1').first().textContent()
  if (!/Vaihingen/.test(h1 || '')) fehler.push('Start zeigt nicht Vaihingen: ' + h1)

  // Lektion Bäcker
  await page.getByRole('button', { name: /Beim Bäcker/ }).click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(OUT, '03-lektion.png'), fullPage: true })

  // Runde durchspielen: immer die erste Option / Paare lösen
  for (let k = 0; k < 12; k++) {
    const fertig = await page.getByText('Runde geschafft!').count()
    if (fertig) break
    const zuordnen = await page.getByRole('heading', { name: 'Was gehört zusammen?' }).count()
    if (zuordnen) {
      const links = page.locator('div[dir="ltr"] > div:first-child button')
      const rechts = page.locator('div[dir="ltr"] > div:last-child button')
      const n = await links.count()
      for (let i = 0; i < n; i++) {
        const swg = (await links.nth(i).textContent()).trim()
        await links.nth(i).click()
        // rechte Seite: das passende Hochdeutsch finden wir über die Reihenfolge nicht – also alle probieren
        const m = await rechts.count()
        for (let j = 0; j < m; j++) {
          if (await rechts.nth(j).isDisabled()) continue
          await rechts.nth(j).click()
          await page.waitForTimeout(80)
          if (await rechts.nth(j).isDisabled()) break
          await links.nth(i).click()
        }
        void swg
      }
      await page.screenshot({ path: path.join(OUT, '04-zuordnen.png'), fullPage: true })
      await page.getByRole('button', { name: 'Weiter' }).click()
      continue
    }
    const optionen = page.locator('ul li button[lang="de"]')
    await optionen.first().waitFor()
    await optionen.first().click()
    await page.waitForTimeout(150)
    if (k === 0) await page.screenshot({ path: path.join(OUT, '04-antwort.png'), fullPage: true })
    await page.getByRole('button', { name: 'Weiter' }).click()
    await page.waitForTimeout(150)
  }
  await page.screenshot({ path: path.join(OUT, '05-fertig.png'), fullPage: true })
  if (!(await page.getByText('Runde geschafft!').count())) fehler.push('Runde nicht beendet')
  await page.getByRole('button', { name: 'Beenden' }).click()
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(OUT, '06-start-nach-runde.png'), fullPage: true })

  // Zuständig
  await page.getByRole('button', { name: /Wer ist hier zuständig/ }).click()
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(OUT, '07-zustaendig.png'), fullPage: true })
  await page.goBack()

  // Prüfansicht + Export
  await page.getByRole('button', { name: /^Prüfen/ }).click()
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: /In Ordnung/ }).first().click()
  await page.getByRole('button', { name: 'Korrigieren' }).nth(1).click()
  await page.locator('input[dir="ltr"]').first().fill('I hätt gern a Laugaweckle ond zwoi Brezla, bitte.')
  await page.getByRole('button', { name: 'Speichern' }).click()
  await page.screenshot({ path: path.join(OUT, '08-pruefen.png'), fullPage: true })
  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /Prüfung exportieren/ }).click()])
  const ziel = path.join(OUT, dl.suggestedFilename())
  await dl.saveAs(ziel)
  const exp = JSON.parse(fs.readFileSync(ziel, 'utf8'))
  if (!exp.protokoll || exp.protokoll.length !== 2) fehler.push('Export: Protokoll hat ' + (exp.protokoll || []).length + ' Einträge')
  const b02 = exp.paket.lagen[0].saetze[1]
  if (b02.status !== 'korrigiert' || !/bitte\.$/.test(b02.swg)) fehler.push('Export: Korrektur fehlt in b02: ' + JSON.stringify(b02))
  console.log('Export:', dl.suggestedFilename(), '→', exp.protokoll.map((p) => p.id + ':' + p.status).join(', '))

  // Über
  await page.goto(BASE + '/#/ueber', { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(OUT, '09-ueber.png'), fullPage: true })

  // Arabisch (RTL) + Dunkel
  await page.getByRole('button', { name: 'Sprache' }).click()
  await page.getByRole('menuitemradio', { name: /العربية/ }).click()
  await page.waitForTimeout(200)
  await page.goto(BASE + '/#/start', { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(OUT, '10-start-ar.png'), fullPage: true })
  const dir = await page.evaluate(() => document.documentElement.dir)
  if (dir !== 'rtl') fehler.push('dir ist nicht rtl: ' + dir)
  await page.getByRole('button', { name: /عند المخبز/ }).click()
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(OUT, '11-lektion-ar.png'), fullPage: true })

  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto(BASE + '/#/ort', { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(OUT, '12-ort-dunkel-ar.png') })

  // Englisch, Ort ohne Paket
  await page.emulateMedia({ colorScheme: 'light' })
  await page.getByRole('button', { name: /اللغة|Sprache|Language/ }).click()
  await page.getByRole('menuitemradio', { name: 'English' }).click()
  await page.locator('path[aria-label="Ditzingen"]').click()
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(OUT, '13-ditzingen-en.png'), fullPage: true })

  await browser.close()
  if (fehler.length) {
    console.log('FEHLER:\n' + fehler.join('\n'))
    process.exit(1)
  }
  console.log('Klick-Test ok, Screenshots in', OUT)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
