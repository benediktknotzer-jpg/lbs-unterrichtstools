"""Erzeugt eine Streichliste (Markdown) aus einer Themen-CSV und einer Einordnung je Frage.

Aufruf: python streichliste.py <csv> <einordnung.json> <ausgabe.md> <titel>
einordnung.json: {"A": {"nr": "Grund", ...}, "B": {"nr": "Grund", ...}}
Alle anderen Quizfragen (ohne OF) gelten als Kern.
"""
import csv, json, sys

csv_pfad, einordnung_pfad, ausgabe, titel = sys.argv[1:5]
with open(csv_pfad, encoding="utf-8") as f:
    zeilen = [z for z in csv.DictReader(f, delimiter=";") if z["typ"] != "OF"]
with open(einordnung_pfad, encoding="utf-8") as f:
    einordnung = json.load(f)

def kurz(text, n=95):
    text = " ".join(text.split())
    return text if len(text) <= n else text[: n - 1].rstrip() + "…"

def antwort(z):
    r = z["richtig"]
    if z["typ"] == "RF":
        return r
    return kurz(r.replace(" | ", " · "))

def tabelle(gruppe):
    aus = ["| Nr | Typ | Frage | Richtige Antwort | Herkunft | Warum auf der Liste |",
           "|---:|-----|-------|------------------|----------|---------------------|"]
    for z in zeilen:
        grund = einordnung[gruppe].get(z["nr"])
        if grund:
            zelle = lambda s: s.replace("|", "/")
            aus.append(f"| {z['nr']} | {z['typ']} | {zelle(kurz(z['frage'], 110))} | {zelle(antwort(z))} | {z['quelle']} | {grund} |")
    return "\n".join(aus)

a, b = einordnung["A"], einordnung["B"]
kern = [z for z in zeilen if z["nr"] not in a and z["nr"] not in b]
text = f"""# Streichliste: {titel}

Quizfragen jetzt: **{len(zeilen)}** · Kern (bleibt fix): **{len(kern)}** · Streichen sicher: **{len(a)}** · Grenzfälle: **{len(b)}**

**Kern** = kommt im Fragenkatalog, im Lösungsblatt, in der Schularbeit, in der Wiederholung oder im
Quick-Check vor. Diese Fragen stehen hier nicht, sie bleiben.

**So geht die Durchsicht:** Alles auf dieser Liste wird gestrichen. Nennen Sie nur die Nummern, die
**bleiben** sollen, z. B. „behalten: 44, 57“. Die Karteikarten bleiben alle.

## A – Streichen (nicht im Unterricht, nur Kollegenmaterial oder „nicht prüfungsrelevant“)

{tabelle("A")}

## B – Grenzfälle (steht im Infoblatt, wird aber in keiner Aufgabe gefragt)

{tabelle("B")}
"""
with open(ausgabe, "w", encoding="utf-8") as f:
    f.write(text)
print(f"{len(zeilen)} Fragen, Kern {len(kern)}, A {len(a)}, B {len(b)}")
