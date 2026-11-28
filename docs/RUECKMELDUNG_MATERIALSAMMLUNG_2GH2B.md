# Rückmeldung der Materialsammlung zum Auftrag 2GH2b

Stand 13.11.2026 · Antwort auf `docs/AUFTRAG_MATERIALSAMMLUNG_2GH2B.md` · für Benedikt Knotzer (knb)

Die Sitzung in der Materialsammlung hat den Auftrag am 12.11. abgearbeitet. Hier steht, **was
sich in Katalog-Lösungen und SA geändert hat** und welche Quiz-Zeilen deshalb nachzuziehen
sind. Die Karteikarten stehen im Wortlaut der Katalog-Lösungen, also gilt der neue Wortlaut unten.

## 1. Was das Quiz nachziehen muss

**Nachgezogen 13.11. (Quiz-Repository):** Fleisch 83 im Wortlaut 2a (mit Zusatz „AMA-Broschüre:
21 %“), Fische 47 und 78 auf Scherg (Sternhausen) und Keta-Lachs, dazu die Erklärung von Fische 45
nach Lebensmittelbuch B 35 („nur mit der Fischart in der Bezeichnung“ statt „Ersatzprodukte“).
Mischquiz zur 2. SA: nichts zu ändern, Fische 3 und 60 fragen Seelachs schon als Magerfisch ab,
keine Quizfrage nennt den Karpfen mager. Karteikarten Fische nach 2b: Frist bleibt **Fr 11.12.**
(Umsetzungsplan in `docs/ENTSCHEIDUNGEN_2GH2B.md`, nicht 08.01.).

| Quiz-Zeile | Steht jetzt | Ändern auf | Grund |
|---|---|---|---|
| `fleisch-rindfleisch.csv` Nr. 83 (Karteikarte Fleisch Frage 4) | „Fleisch liefert rund 20 % hochwertiges Eiweiß, …“ | Wortlaut der Katalog-Lösung, siehe 2a. Inhaltlich gleich, neu ist der Zusatz „(AMA-Broschüre: 21 %)“. Kann auch so bleiben, wenn der Zusatz auf der Karte stört. | Katalog-Lösung W4 Frage 4 geändert |
| `fische.csv` Nr. 47 (ZU Kaviarsorten) | „Sevruga = Vom **Schörg**“ · „Keta-Kaviar = Rogen des **Lachses**“ | „Sevruga = Vom **Scherg** (Sternhausen)“ · „Keta-Kaviar = Rogen des **Keta-Lachses**“ | „Schörg“ gibt es nicht (Buch S. 158 und Lebensmittelbuch: Scherg). Keta-Kaviar kommt nur vom Keta-Lachs. |
| `fische.csv` Nr. 78 (OF Kaviararten) | „Sevruga vom **Schörg**“ · „Keta-Kaviar, Rogen des **Lachses**“ | „Sevruga vom **Scherg** (Sternhausen)“ · „Keta-Kaviar, Rogen des **Keta-Lachses**“ | wie oben |
| Karteikarten Fische (kommen bis 08.01.) | – | Wortlaut der Katalog-Lösungen Teil 1 und 2, siehe 2b | Fettgehalt, Konserven, Kaviar geändert |
| Mischquiz zur 2. SA | – | SA2 Aufgabe 3a fragt jetzt **Seelachs** statt Karpfen | siehe 2c |

**Stimmt schon, nichts zu tun:** `fische.csv` Nr. 45 und 77 („Echter Kaviar ist der gesalzene
Rogen des Störs“), Nr. 48 (nordischer Kaviar vom Seehasen), Nr. 66 (Fettgehalt dreistufig).

## 2. Der neue Wortlaut

### 2a. Katalog-Lösung Fleisch W4, Frage 4
`01_Lehrgang_II_2026-27/FP_Food_2GH2b/Woche_04_30-11_bis_04-12/09_FRAGEN_Lösung_FP_W4_Fleisch.docx`

> Rund 20 % Eiweiß (AMA-Broschüre: 21 %), rund drei Viertel Wasser, etwa 1 % Mineralstoffe
> (Eisen, Kalium, Selen, Zink, Kupfer), Fett je nach Stück sehr unterschiedlich, kaum
> Kohlenhydrate; dazu Vitamine der B-Gruppe (B1, B2, B12) und Niacin. Die biologische Wertigkeit
> gibt an, wie gut ein Lebensmittel im Körper verwertet werden kann. Fleischeiweiß ist hochwertig
> und sehr gut verwertbar; tierische Lebensmittel wie Fleisch und Eier haben eine höhere
> biologische Wertigkeit als viele pflanzliche.

### 2b. Katalog-Lösungen Fische W6
`…/Woche_06_14-12_bis_18-12/09_FRAGEN_Lösung_FP_W6_Fische_Teil_1.docx` und `…_Teil_2.docx`

- **Einteilung nach dem Fettgehalt (Teil 1):** Magerfische unter 2 % Fett (Dorsch, Seelachs,
  Hecht, Scholle) · mittelfette Fische 2–10 % (Forelle, Karpfen, Rotbarsch) · Fettfische über
  10 % (Hering, Makrele, Aal, Sardine, Sprotte). Buch S. 154.
- **Fischdauerkonserven (Teil 2):** Durch Hitzebehandlung über 100 °C haltbar gemacht. Buch S. 158.
- **Was ist Kaviar? (Teil 2):** Kaviar ist gesalzener Fischrogen von Störarten. Rogen anderer
  Fische darf nur mit der Fischart in der Bezeichnung verkauft werden (z. B. Keta-Kaviar,
  Lachskaviar, Forellenkaviar, Deutscher Kaviar aus Seehasenrogen).
- **Welche Kaviarfische kennen Sie?** Hausen, Stör, Scherg, Schipp liefern den berühmten
  „russischen Kaviar“. Auch der Kaviar des Lachses, vom Dorsch und der Forelle sind im Handel.
- **Kaviararten im Handel:** Sevruga-Kaviar … stammt vom Scherg (Sternhausen). Beluga und
  Osietra unverändert.
- **Wann bezeichnet man Kaviar als „deutschen Kaviar“?** Gefärbter Rogen vom Seehasen, wie der
  nordische Kaviar; vollständige Bezeichnung „Deutscher Kaviar aus Seehasenrogen, gefärbt“.
  (Vorher stand „stammt vom Kabeljau“. Das war falsch.)
- **Was ist „Keta-Kaviar“?** Er ist der Rogen des Keta-Lachses (eines Pazifiklachses; nur dieser
  Rogen darf Keta-Kaviar heißen), hat naturbelassene, leuchtendrote bis orangerote Farbe, ist
  großkörnig und besitzt den typischen Lachsgeschmack.

Belege zum Kaviar (das Buch S. 158 ist hier ungenau, „Kaviar ist Fischrogen“):
Österreichisches Lebensmittelbuch B 35, B.5.1.1 und B.5.2 (online, Stand 2026): „Kaviar ist
gesalzener Fischrogen von Störarten“, Rogen anderer Fischarten „stets mit dem Namen der Fischart“,
„Keta-Kaviar“ ausschließlich vom Keta-Lachs · Codex Alimentarius CXS 291-2010 · Leitsätze für
Fisch und Fischerzeugnisse (Deutschland, Stand 07/2026) 2.3.3.4.1: „Deutscher Kaviar aus
Seehasenrogen, gefärbt“.

Der Vorschlag aus dem Auftrag („Keta-Kaviar vom Lachs als Ersatz“) wurde so **nicht**
übernommen: Lebensmittelbuch und Leitsätze sprechen von Rogen, der mit der Fischart bezeichnet
wird, nicht von Ersatz.

### 2c. SA2 Aufgabe 3a
`…/Woche_09_18-01_bis_22-01/13_SA2_FP_W9.docx` und `14_SA2_Lösung_FP_W9.docx`

Magerfisch oder Fettfisch: Hering Fettfisch · Dorsch Magerfisch · Makrele Fettfisch ·
**Seelachs Magerfisch** (vorher Karpfen). 4 Punkte, unverändert.

## 3. Sonst geändert (betrifft das Quiz nicht direkt)

- Frageblatt-Lösung AMA-Broschüre (Mappe I. LG): Nährstoffe wie 2a, Bio „mindestens 2 Jahre
  Umstellung für Acker- und Grünland“, Tiefkühl-Monate nach Buch S. 124, keine Gartemperaturen.
- IB Feinkost: San Daniele „mindestens 400 Tage, rund 13 Monate, gereift“.
- Mündliche Wiederholung Fische Nr. 2, 13, 16: wie 2b.
- Milch-Auftrag vom 10.11.: war schon umgesetzt.
- Gerüst FP 2GH2b: Quiz-Stand nachgezogen, SA2-Datum einheitlich **Di 19.01.**

## 4. Noch offen

- **Bio-Kontrollnummer (E):** Entscheidung Benedikt bis Mi 13.01. Danach folgt eine eigene Meldung.

## 5. Nachtrag 15./16.11.2026 — Käse (Woche 2), aus dem Prüfgremium der Materialsammlung

Betrifft Quizfragen zum Thema Käse. Bitte gegen diese Punkte prüfen und nachziehen.

**Nachgezogen 16.11. (Quiz-Repository):** 30-%-Regel selbst gegengeprüft: Lebensmittelbuch B 32
Abschnitt 9 (lebensmittelbuch.at, Stand 2026: „zumindest 30 %ige Reduktion des absoluten
Fettgehalts“) und VO (EG) 1924/2006 Anhang („leicht“ = Bedingungen wie „reduziert“, mindestens
30 %). Geändert: 79 (MC, neue Frage und Ablenker, „25 % F. i. T.“ nur noch in der Erklärung als
überholt), 102 (Karte im Wortlaut der Katalog-Lösung Frage 16, ohne den Lehrkraft-Satz „zählt“),
111 (OA: Begriffe „30“ und „weniger/reduziert/verringert“, beide nötig; gegen `js/oa.js` geprüft,
„Bei 25 % F.i.T. und weniger“ und „30 % F.i.T.“ gelten als falsch), 81 (LMIV). Salzbad und
Emmentaler: nichts zu ändern.

- **„leicht“ bei Käse (Fragenkatalog Käse Frage 16, Arbeitsblatt 2d, 1. Schularbeit 1e):**
  Frage neu: „Wann darf ein Käse als ‚leicht‘ bezeichnet werden?“ Antwort neu: wenn er
  mindestens 30 % weniger Fett enthält als der vergleichbare Käse. Beleg: Österreichisches
  Lebensmittelbuch, Codexkapitel B 32, Abschnitt 9 (Leitlinien „leicht“/„light“), und
  EU-Verordnung 1924/2006; geprüft am 15.11.2026. Der Satz im Warenkundebuch S. 100
  („25 % F. i. T. und weniger“) ist überholt; im Unterricht zählt die Buchantwort noch,
  wird aber richtiggestellt. Eine Quizfrage mit „25 % F. i. T.“ als einzig richtiger Antwort
  bitte ändern.
- **Salzbad (Infoblatt Käse Schritt 6):** „Das Ergebnis ist der junge, noch ungereifte Käse
  (das Buch nennt ihn hier Frischkäse).“ Keine Quizfrage, die „Frischkäse“ als Ergebnis des
  Salzbads verlangt.
- **Emmentaler** im Arbeitsblatt: „4 Monate gereift“ (Hartkäse reift laut Buch S. 103
  3 bis 36 Monate).
- **Lebensmittelinformationsverordnung (LMIV)** statt „Verbraucherinformationsverordnung“,
  auch in der Präsentation.

### 5a. Betroffene Fragen in `daten/kaese.csv` (Stand 16.11.2026, von der Sitzung in der Materialsammlung nur gelesen)

Das Quiz Käse ist für Mo 16.11. im Unterricht eingeplant. Bitte vor dem nächsten Einsatz ändern:

| Nr | Typ | Jetzt | Soll |
|---|---|---|---|
| 79 | MC | „Ab welchem F.i.T.-Wert darf ein Käse als ‚leicht‘ bezeichnet werden?“ → „Bei 25 % F.i.T. und weniger“ | Frage: „Wann darf ein Käse als ‚leicht‘ bezeichnet werden?“ Richtig: „Wenn er mindestens 30 % weniger Fett enthält als der vergleichbare Käse“. Falsche Antworten neu, eine davon „Bei 25 % F. i. T. und weniger (ältere Faustregel aus dem Buch S. 100)“ nur, wenn die Erklärung das auflöst; sonst weglassen |
| 102 | OF | Antwort „25 % F. i. T. und weniger“ | Antwort wie Katalog-Lösung Frage 16 neu; Quelle: Lebensmittelbuch B 32 Abschnitt 9, Buch S. 100 als überholt nennen |
| 111 | OA | verlangt die Zahl 25 | Zahl 30 („mindestens … % weniger Fett als der vergleichbare Käse“) oder Frage streichen |
| 81 | MM | „Verbraucherinformationsverordnung“ | „Lebensmittelinformationsverordnung (LMIV)“ |

Nicht betroffen: Fragen zum Salzbad (18, 91, 106) nennen „Frischkäse“ nicht als Ergebnis. Frage 28, 83, 92, 107 nennen für Hartkäse „3 bis 12 Monate“ (Katalog-Lösung Frage 6, Buch S. 102); die Tabelle im Buch S. 103 sagt „3–36 Mon.“ — kein Fehler, nur zur Kenntnis.

### 5b. Nachtrag 16.11.2026 (Abschluss der Prüfung von Woche 2)

- **Frage 4 des Fragenkatalogs Käse** („An welchem Schritt entscheidet sich, ob ein Käse hart oder weich wird?“): Die Katalog-Lösung lässt jetzt drei Antworten gelten, je mit Begründung: Bearbeitung der Feststoffe (Schritt 3), Brennen und Rühren (Schritt 4), Formen und Pressen (Schritt 5). Eine Quizfrage mit nur einer richtigen Antwort dazu bitte prüfen.
- **Reifezeiten** bleiben wie bisher: Buch S. 102 „Hartkäse 3 bis 12 Monate (Parmesan bis zu 2 1/2 Jahren), Schnittkäse 4 bis 10 Wochen, Weichkäse einige Wochen“ (am 16.11.2026 am Buch gelesen).
- Der Zugangszettel sagt jetzt: „Fehlt ein Thema noch, kommt es im Lauf des Lehrgangs dazu.“ Die Tabelle nennt Fleisch und die gemischte Wiederholung als „im Quiz“; bitte melden, falls diese Themen noch fehlen.

**Nachgezogen 22.11. (Quiz-Repository):** Karte Käse 90 steht im neuen Wortlaut der Katalog-Lösung
Frage 4 (alle drei Schritte mit Begründung). MC 14 fragt nur, wie der Bruch geschnitten wird, und
bleibt. Reifezeiten: nichts zu tun. Zugangszettel: Fleisch und beide Mischquiz („Wiederholung zur
1./2. Schularbeit“) sind im Quiz, die Tabelle stimmt.

## 6. Nachtrag 28.11.2026 — 1. Schularbeit umgebaut, Lehrausgang, Termine (bis Mi 02.12.)

Aus der Sitzung in der Materialsammlung, Auftrag von Benedikt vom 28.11.2026: „mit den
LBS-Unterrichtstools kommunizieren bezüglich … des Quiz … welche Unterkapitel … dass das alles
wirklich fertig ist, spätestens am Mittwoch.“ **Frist: Mi 02.12.2026, 12:50** (Wiederholungs-
nachmittag, das Mischquiz läuft am Smartboard und ab dann am Handy zum Üben).

**Nachgezogen 28.11. (Quiz-Repository):** Neues Unterthema „Reklamation und Umtausch“ im Thema
„Verkaufsgespräch, CI & Verpackung“ (`verkauf-marketing.csv` Nr. 70–79, 10 Fragen: MC, 2 ZU, RH,
RF, MM, OA; Quelle IB und LB Reklamation W3, neue Fälle, keiner aus der SA1). Das Mischquiz
„Wiederholung zur 1. Schularbeit“ nimmt die Datei ganz auf, Reklamation ist damit drin. Freigabe
Feinkost vorläufig Mo 14.12., `docs/LEHRGANG_II_2GH2B.md` W3–W5 nachgezogen. Zum Lehrausgang keine
Fragen. Hinweis: Das Mischquiz wird am Mi 02.12. freigeschaltet (Freigabe nach Wochenplan seit 27.11.);
am Smartboard läuft es ab 0 Uhr des Tages.

### 6a. Was sich geändert hat

- **Lehrausgang Vöslauer** ist von Mi 16.12. auf **Mi 09.12.** vorverlegt. Der FP-Block am 09.12.
  entfällt ganz (Werksführung 13:30 bis 15:45). Fragestunde und Quiz zur 1. SA sind auf
  **Mi 02.12.** gewandert. **Feinkost und Fertigkost hat noch keinen neuen Termin** (Benedikt
  entscheidet). Mi 16.12. ist wieder normal (Rückgabe SA1, Fische).
- **1. Schularbeit Mo 14.12.** neu gebaut (`Woche_06_14-12_bis_18-12/13_SA1_FP_W6.docx`, Lösung
  `14_SA1_Lösung_FP_W6.docx`, Stoffbekanntgabe `00_Stoffbekanntgabe_1_SA_FP_II.md`). Neu Stoff:
  **Reklamation und Umtausch** (W3 Di, 8 P) und **Lehrausgang Vöslauer** (6 P). Gewichtung jetzt
  Verkaufsgespräch 12 · CI 8 · Reklamation 8 · Milch 18 · Käse 18 · Verpackung/Recycling 10 ·
  Lehrausgang 6 · Fleisch 20. Nicht mehr in der SA: Bestandteile des Corporate Design, Abrechnung
  der Rohmilch, H-Milch, Reifung Hart-/Weichkäse, Milchsorten für Käse, Definition Fleisch — als
  Katalogstoff bleiben sie im Quiz, sie sind nur nicht mehr SA-Aufgabe.

### 6b. Was das Quiz bis Mi 02.12. braucht

| Was | Jetzt | Soll |
|---|---|---|
| Unterthema **Reklamation und Umtausch** | fehlt (`verkauf-marketing.csv` hat Neun Phasen, Bedarfsermittlung, CI, Verpackung, Recycling) | 8 bis 10 Fragen, Quelle Infoblatt und Arbeitsblatt/Lösungsblatt `Woche_03_23-11_bis_27-11/03_IB_FP_W3_Reklamation_Umtausch.docx`, `05_LB_FP_W3_Reklamation_Umtausch.docx`: Reklamation, Beschwerde, Kulanz unterscheiden (mit neuen Fällen, nicht denen der SA); die sechs Schritte der Annahme (RH); welche Maßnahme bei welchem Mangel (Frischware: Geschwindigkeit); welche Angaben für die Prüfung nötig sind. Kein Buch (eigenes Material), Quelle „IB Reklamation W3“. |
| Mischquiz „Wiederholung zur 1. Schularbeit“ | Mix ohne Reklamation | Reklamation in den Mix aufnehmen |
| Freigabe `2GH2B-MILCH` | „Feinkost, Fertigkost & Zusatzverkauf“: 2026-12-09 | Datum offen lassen bis Benedikt entscheidet; vorläufig 2026-12-14 (Zusatzverkauf nach der SA), Feinkost-Fragen sind SA2-Stoff |
| `docs/LEHRGANG_II_2GH2B.md` Zeilen W4/W5 | W5 „Fragestunde SA1 · Feinkost“ | W4 Mi „Telefon · Wiederholung und Fragestunde SA1“, W5 Mi „Lehrausgang Vöslauer“, Feinkost offen |

Lehrausgang: **keine Quizfragen** (was gezeigt wird, steht erst am 09.12. fest).

Antwortmuster (Regel Benedikt 27.11.2026, Lernlog Teil B Nr. 6): In den Mischquiz bitte darauf
achten, dass Zuordnungen und Richtig/Falsch-Folgen nicht regelmäßig wechseln; die App mischt die
Antworten, die Reihenfolge der Fragen in Kartenstapeln aber nicht immer.
