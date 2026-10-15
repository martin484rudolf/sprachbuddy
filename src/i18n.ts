import type { Sprache } from './data'

export const SPRACHEN: { code: Sprache; name: string; dir: 'ltr' | 'rtl'; geprueft: boolean }[] = [
  { code: 'de', name: 'Deutsch', dir: 'ltr', geprueft: true },
  { code: 'en', name: 'English', dir: 'ltr', geprueft: true },
  { code: 'ar', name: 'العربية', dir: 'rtl', geprueft: false },
]

type Woerterbuch = Record<string, Record<Sprache, string>>

const W: Woerterbuch = {
  'app.name': { de: 'Sprachbuddy', en: 'Sprachbuddy', ar: 'Sprachbuddy' },
  'app.claim': { de: 'Den Ort verstehen.', en: 'Understand the place.', ar: 'افهم المكان.' },
  'app.untertitel': {
    de: 'Deutsch lernen – und verstehen, wie hier gesprochen wird.',
    en: 'Learn German – and understand how people speak here.',
    ar: 'تعلّم الألمانية – وافهم كيف يتكلم الناس هنا.',
  },

  'ort.frage': { de: 'Wo bist du?', en: 'Where are you?', ar: 'أين أنت؟' },
  'ort.hinweis': {
    de: 'Tipp auf deinen Ort. Grüner Punkt: Hier gibt es schon ein Paket.',
    en: 'Tap your place. Green dot: a package already exists here.',
    ar: 'اضغط على مكانك. النقطة الخضراء: توجد هنا حزمة جاهزة.',
  },
  'ort.liste': { de: 'Oder aus der Liste wählen', en: 'Or choose from the list', ar: 'أو اختر من القائمة' },
  'ort.wechseln': { de: 'Ort wechseln', en: 'Change place', ar: 'تغيير المكان' },
  'ort.einwohner': { de: 'Einwohner', en: 'residents', ar: 'نسمة' },
  'ort.kreis': { de: 'Landkreis Ludwigsburg', en: 'Ludwigsburg district', ar: 'مقاطعة لودفيغسبورغ' },
  'ort.paketFolgt': {
    de: 'Für diesen Ort gibt es noch kein Sprachpaket. Es entsteht, wenn jemand von hier mitmacht.',
    en: 'There is no language package for this place yet. It will exist once someone from here joins in.',
    ar: 'لا توجد حزمة لغوية لهذا المكان بعد. ستُنشأ عندما يشارك شخص من هنا.',
  },
  'ort.mitmachen': { de: 'Wie man mitmacht', en: 'How to contribute', ar: 'كيف تشارك' },

  'modul.verstehen': { de: 'Den Ort verstehen', en: 'Understand the place', ar: 'افهم المكان' },
  'modul.verstehenSub': {
    de: 'Hören und verstehen, wie hier gesprochen wird',
    en: 'Listen and understand how people speak here',
    ar: 'استمع وافهم كيف يتكلم الناس هنا',
  },
  'modul.zustaendig': { de: 'Wer ist hier zuständig?', en: 'Who is responsible here?', ar: 'من المسؤول هنا؟' },
  'modul.zustaendigSub': {
    de: 'Rathaus, Notruf, Hilfe im Alltag',
    en: 'Town hall, emergency numbers, everyday help',
    ar: 'البلدية، أرقام الطوارئ، المساعدة اليومية',
  },
  'modul.pruefen': { de: 'Prüfen', en: 'Review', ar: 'مراجعة' },
  'modul.pruefenSub': {
    de: 'Für Menschen von hier: Stimmt das so?',
    en: 'For locals: is this right?',
    ar: 'لأهل المكان: هل هذا صحيح؟',
  },
  'modul.ueber': { de: 'Über', en: 'About', ar: 'حول' },
  'modul.variante': { de: 'Variante', en: 'Variety', ar: 'اللهجة' },

  'lage.ueben': { de: 'Üben', en: 'Practise', ar: 'تدرّب' },
  'lage.sicher': { de: 'sicher', en: 'confident', ar: 'متقن' },
  'lage.faellig': { de: 'zu wiederholen', en: 'due for review', ar: 'للمراجعة' },
  'lage.neu': { de: 'neu', en: 'new', ar: 'جديد' },
  'lage.saetze': { de: 'Sätze', en: 'sentences', ar: 'جمل' },

  'ueb.hoeren': { de: 'Hör zu. Was bedeutet das?', en: 'Listen. What does it mean?', ar: 'استمع. ماذا يعني هذا؟' },
  'ueb.lesen': { de: 'Was bedeutet das?', en: 'What does it mean?', ar: 'ماذا يعني هذا؟' },
  'ueb.zuordnen': { de: 'Was gehört zusammen?', en: 'Match the pairs.', ar: 'طابق الأزواج.' },
  'ueb.abspielen': { de: 'Anhören', en: 'Play', ar: 'تشغيل' },
  'ueb.nochmalHoeren': { de: 'Noch einmal', en: 'Again', ar: 'مرة أخرى' },
  'ueb.textZeigen': { de: 'Text zeigen', en: 'Show text', ar: 'إظهار النص' },
  'ueb.richtig': { de: 'Richtig!', en: 'Correct!', ar: 'صحيح!' },
  'ueb.falsch': { de: 'Nicht ganz. Richtig ist:', en: 'Not quite. The answer is:', ar: 'ليس تمامًا. الإجابة الصحيحة:' },
  'ueb.weiter': { de: 'Weiter', en: 'Next', ar: 'التالي' },
  'ueb.pruefen': { de: 'Prüfen', en: 'Check', ar: 'تحقق' },
  'ueb.fertig': { de: 'Runde geschafft!', en: 'Round complete!', ar: 'أكملت الجولة!' },
  'ueb.ergebnis': { de: '{r} von {n} richtig', en: '{r} of {n} correct', ar: '{r} من {n} صحيحة' },
  'ueb.nochmal': { de: 'Noch eine Runde', en: 'Another round', ar: 'جولة أخرى' },
  'ueb.zurueck': { de: 'Zurück', en: 'Back', ar: 'رجوع' },
  'ueb.schliessen': { de: 'Beenden', en: 'Finish', ar: 'إنهاء' },
  'ueb.keineStimme': {
    de: 'Auf diesem Gerät gibt es keine deutsche Stimme – der Satz wird als Text gezeigt.',
    en: 'This device has no German voice – the sentence is shown as text.',
    ar: 'لا يوجد صوت ألماني على هذا الجهاز – تُعرض الجملة نصًا.',
  },
  'ueb.stimmeHinweis': {
    de: 'Die Stimme liest Hochdeutsch-Buchstaben – der echte Klang kommt von Menschen aus dem Ort.',
    en: 'The voice reads standard-German letters – the real sound comes from locals.',
    ar: 'الصوت يقرأ الحروف بالألمانية الفصحى – النطق الحقيقي يأتي من أهل المكان.',
  },
  'ueb.frage': { de: 'Aufgabe {i} von {n}', en: 'Task {i} of {n}', ar: 'المهمة {i} من {n}' },
  'ueb.hinweis': { de: 'Gut zu wissen', en: 'Good to know', ar: 'من المفيد معرفته' },

  'status.ungeprüft': { de: 'ungeprüft', en: 'unverified', ar: 'غير مُراجَع' },
  'status.geprüft': { de: 'geprüft', en: 'verified', ar: 'مُراجَع' },
  'status.korrigiert': { de: 'korrigiert', en: 'corrected', ar: 'مُصحَّح' },
  'status.legende': {
    de: 'Jeder Satz zeigt, ob ihn schon jemand aus dem Ort geprüft hat.',
    en: 'Every sentence shows whether someone from the place has verified it.',
    ar: 'كل جملة تُظهر ما إذا كان أحد من أهل المكان قد راجعها.',
  },

  'pruef.titel': { de: 'Prüfansicht', en: 'Review', ar: 'المراجعة' },
  'pruef.hinweis': {
    de: 'Satz für Satz: in Ordnung oder korrigieren. Deine Prüfung bleibt auf diesem Gerät, bis du sie exportierst und einschickst.',
    en: 'Sentence by sentence: OK or correct it. Your review stays on this device until you export and send it in.',
    ar: 'جملة جملة: صحيح أو صحّحها. تبقى مراجعتك على هذا الجهاز حتى تصدّرها وترسلها.',
  },
  'pruef.ok': { de: 'In Ordnung', en: 'OK', ar: 'صحيح' },
  'pruef.korrigieren': { de: 'Korrigieren', en: 'Correct', ar: 'تصحيح' },
  'pruef.speichern': { de: 'Speichern', en: 'Save', ar: 'حفظ' },
  'pruef.abbrechen': { de: 'Abbrechen', en: 'Cancel', ar: 'إلغاء' },
  'pruef.anmerkung': { de: 'Anmerkung (optional)', en: 'Note (optional)', ar: 'ملاحظة (اختياري)' },
  'pruef.export': { de: 'Prüfung exportieren', en: 'Export review', ar: 'تصدير المراجعة' },
  'pruef.zuruecksetzen': { de: 'Zurücksetzen', en: 'Reset', ar: 'إعادة ضبط' },
  'pruef.stand': { de: '{g} in Ordnung · {k} korrigiert · {u} offen', en: '{g} OK · {k} corrected · {u} open', ar: '{g} صحيح · {k} مُصحَّح · {u} مفتوح' },
  'pruef.schwaebisch': { de: 'Schwäbisch', en: 'Swabian', ar: 'الشفابية' },
  'pruef.hochdeutsch': { de: 'Hochdeutsch', en: 'Standard German', ar: 'الألمانية الفصحى' },
  'pruef.rueckgaengig': { de: 'Zurück auf offen', en: 'Set back to open', ar: 'إعادة إلى مفتوح' },

  'zust.notruf': { de: 'Notruf – Feuerwehr und Rettungsdienst', en: 'Emergency – fire brigade and ambulance', ar: 'الطوارئ – الإطفاء والإسعاف' },
  'zust.notrufText': { de: 'Kostenlos, rund um die Uhr, auch ohne Guthaben.', en: 'Free, around the clock, even without credit.', ar: 'مجاني، على مدار الساعة، حتى بدون رصيد.' },
  'zust.polizei': { de: 'Polizei', en: 'Police', ar: 'الشرطة' },
  'zust.bereitschaft': { de: 'Ärztlicher Bereitschaftsdienst', en: 'On-call medical service', ar: 'خدمة الأطباء المناوبين' },
  'zust.bereitschaftText': { de: 'Nachts und am Wochenende, wenn es nicht lebensbedrohlich ist.', en: 'Nights and weekends, when it is not life-threatening.', ar: 'ليلاً وفي عطلة نهاية الأسبوع، عندما لا تكون الحالة مهددة للحياة.' },
  'zust.rathaus': { de: 'Rathaus', en: 'Town hall', ar: 'البلدية' },
  'zust.hinweis': {
    de: 'Diese Einträge pflegen Menschen aus dem Ort. Fehlt etwas oder stimmt etwas nicht? Dann schreib es in die Prüfung.',
    en: 'These entries are maintained by locals. Something missing or wrong? Note it in the review.',
    ar: 'يحافظ أهل المكان على هذه المعلومات. هل ينقص شيء أو هناك خطأ؟ دوّنه في المراجعة.',
  },
  'zust.anrufen': { de: 'Anrufen', en: 'Call', ar: 'اتصال' },
  'zust.quelleAllgemein': { de: 'Gilt in ganz Deutschland', en: 'Valid throughout Germany', ar: 'ساري في كل ألمانيا' },

  'ueber.titel': { de: 'Über Sprachbuddy', en: 'About Sprachbuddy', ar: 'حول Sprachbuddy' },
  'ueber.text': {
    de: 'Sprachbuddy hilft, Deutsch zu lernen und sich im eigenen Ort zu verstehen – mit dem Dialekt, den der Bäcker spricht, und den Stellen, die wirklich zuständig sind. Die Inhalte entstehen Ort für Ort und werden von Menschen von dort geprüft. Offen, kostenlos, ohne Konto.',
    en: 'Sprachbuddy helps you learn German and understand your own town – with the dialect the baker speaks and the offices that are actually responsible. Content is built place by place and verified by people who live there. Open, free, no account.',
    ar: 'يساعدك Sprachbuddy على تعلّم الألمانية وفهم مدينتك – باللهجة التي يتكلمها الخبّاز، وبالجهات المسؤولة فعلاً. يُبنى المحتوى مكانًا مكانًا ويراجعه أناس يعيشون هناك. مفتوح، مجاني، بدون حساب.',
  },
  'ueber.sprachen': { de: 'Sprachen', en: 'Languages', ar: 'اللغات' },
  'ueber.sprachenText': {
    de: 'Die Oberfläche gibt es auf Deutsch, Englisch und Arabisch. Übersetzungen, die noch niemand gegengelesen hat, sind als ungeprüft markiert.',
    en: 'The interface is available in German, English and Arabic. Translations nobody has proofread yet are marked as unverified.',
    ar: 'الواجهة متاحة بالألمانية والإنجليزية والعربية. الترجمات التي لم يراجعها أحد بعد مُعلَّمة بأنها غير مُراجَعة.',
  },
  'ueber.quellen': { de: 'Quellen und Lizenzen', en: 'Sources and licences', ar: 'المصادر والتراخيص' },
  'ueber.initiator': { de: 'Initiative', en: 'Initiative', ar: 'المبادرة' },
  'ueber.initiatorText': {
    de: 'Eine Initiative aus Vaihingen an der Enz, angestoßen von Mitgliedern von Volt. Die App gehört niemandem allein: Code und Inhalte sind offen, jeder Ort kann mitmachen.',
    en: 'An initiative from Vaihingen an der Enz, started by members of Volt. The app belongs to no one alone: code and content are open, every place can join in.',
    ar: 'مبادرة من فايهينغن أن دير إنتس، أطلقها أعضاء من حزب Volt. التطبيق لا يملكه أحد وحده: الشيفرة والمحتوى مفتوحان، ويمكن لكل مكان المشاركة.',
  },
  'ueber.mitmachen': { de: 'Mitmachen', en: 'Join in', ar: 'شارك' },
  'ueber.mitmachenText': {
    de: 'Du sprichst den Dialekt deines Ortes? Öffne die Prüfansicht, geh die Sätze durch und schick die Datei ein. Du sprichst Arabisch, Ukrainisch, Türkisch, Rumänisch? Dann lies die Übersetzungen gegen. Jeder geprüfte Satz macht die App ein Stück ehrlicher.',
    en: 'You speak your town\'s dialect? Open the review, go through the sentences and send in the file. You speak Arabic, Ukrainian, Turkish, Romanian? Then proofread the translations. Every verified sentence makes the app a little more honest.',
    ar: 'هل تتكلم لهجة مدينتك؟ افتح المراجعة، راجع الجمل، وأرسل الملف. هل تتكلم العربية أو الأوكرانية أو التركية أو الرومانية؟ راجع الترجمات إذن. كل جملة مُراجَعة تجعل التطبيق أكثر صدقًا.',
  },

  'allg.sprache': { de: 'Sprache', en: 'Language', ar: 'اللغة' },
  'allg.ungeprueft': { de: 'Übersetzung ungeprüft', en: 'translation unverified', ar: 'الترجمة غير مُراجَعة' },
  'allg.menue': { de: 'Menü', en: 'Menu', ar: 'القائمة' },
  'allg.start': { de: 'Start', en: 'Home', ar: 'الرئيسية' },
  'allg.stand': { de: 'Stand', en: 'As of', ar: 'بتاريخ' },
}

export function t(lang: Sprache, key: string, vars?: Record<string, string | number>): string {
  const e = W[key]
  let s = e ? e[lang] ?? e.de : key
  if (vars) for (const k of Object.keys(vars)) s = s.replace(`{${k}}`, String(vars[k]))
  return s
}

export function dirFuer(lang: Sprache): 'ltr' | 'rtl' {
  return SPRACHEN.find((s) => s.code === lang)?.dir ?? 'ltr'
}
