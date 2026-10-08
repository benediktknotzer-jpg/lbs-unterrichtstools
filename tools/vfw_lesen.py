"""Text aus Word- und PowerPoint-Dateien in VFW_Claude lesen – nur lesen, nie schreiben.

Aufruf (Pfad relativ zum Ordner VFW_Claude):
    python tools/vfw_lesen.py "01_Lehrgang_I_2026-27/FP_Food_2GH1b/Woche_02_07-09_bis_11-09/08_FRAGEN_FP_W2_Käse.docx"

- Unterstützt .docx und .pptx (beides sind ZIP-Archive mit XML).
- Öffnet die Datei ausschließlich lesend und gibt den Text auf dem Bildschirm aus.
- Legt keine Dateien an, ändert nichts, verlässt den Ordner VFW_Claude nicht.
- Nur Python-Standardbibliothek, keine Zusatzpakete.
"""

import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

VFW = Path(r"C:\Users\bened\VFW_Claude").resolve()

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"


def absatz_text(p):
    teile = []
    for e in p.iter():
        if e.tag == W + "t":
            teile.append(e.text or "")
        elif e.tag == W + "tab":
            teile.append("\t")
        elif e.tag in (W + "br", W + "cr"):
            teile.append("\n")
    return "".join(teile)


def docx_block(element, ausgabe):
    """Absätze und Tabellen in Dokumentreihenfolge ausgeben."""
    for kind in element:
        if kind.tag == W + "p":
            ausgabe.append(absatz_text(kind))
        elif kind.tag == W + "tbl":
            ausgabe.append("[Tabelle]")
            for zeile in kind.iter(W + "tr"):
                zellen = []
                for zelle in zeile.findall(W + "tc"):
                    text = " / ".join(
                        t for t in (absatz_text(p).strip() for p in zelle.iter(W + "p")) if t
                    )
                    zellen.append(text)
                ausgabe.append("| " + " | ".join(zellen) + " |")
            ausgabe.append("[Tabellenende]")
        elif kind.tag == W + "sdt":
            inhalt = kind.find(W + "sdtContent")
            if inhalt is not None:
                docx_block(inhalt, ausgabe)


def docx_lesen(z):
    ausgabe = []
    for name in ("word/header1.xml", "word/header2.xml", "word/header3.xml"):
        if name in z.namelist():
            kopf = ET.fromstring(z.read(name))
            text = " ".join(t for t in (absatz_text(p).strip() for p in kopf.iter(W + "p")) if t)
            if text:
                ausgabe.append(f"[Kopfzeile] {text}")
    koerper = ET.fromstring(z.read("word/document.xml")).find(W + "body")
    docx_block(koerper, ausgabe)
    return ausgabe


def pptx_lesen(z):
    def nummer(name):
        return int(re.search(r"(\d+)\.xml$", name).group(1))

    folien = sorted(
        (n for n in z.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)), key=nummer
    )
    ausgabe = []
    for name in folien:
        ausgabe.append(f"--- Folie {nummer(name)} ---")
        wurzel = ET.fromstring(z.read(name))
        for p in wurzel.iter(A + "p"):
            text = "".join(t.text or "" for t in p.iter(A + "t")).strip()
            if text:
                ausgabe.append(text)
        notiz = f"ppt/notesSlides/notesSlide{nummer(name)}.xml"
        if notiz in z.namelist():
            texte = [
                "".join(t.text or "" for t in p.iter(A + "t")).strip()
                for p in ET.fromstring(z.read(notiz)).iter(A + "p")
            ]
            texte = [t for t in texte if t and not t.isdigit()]
            if texte:
                ausgabe.append("[Notizen] " + " ".join(texte))
    return ausgabe


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    if len(sys.argv) != 2:
        print(__doc__)
        return 2

    pfad = (VFW / sys.argv[1]).resolve()
    if not pfad.is_relative_to(VFW):
        print("Abgelehnt: Der Pfad liegt außerhalb von VFW_Claude.")
        return 1
    if not pfad.is_file():
        print(f"Datei nicht gefunden: {sys.argv[1]}")
        return 1

    endung = pfad.suffix.lower()
    if endung not in (".docx", ".pptx"):
        print(f"Nicht unterstützt: {endung} (nur .docx und .pptx; alte .doc/.ppt bitte als PDF).")
        return 1

    with zipfile.ZipFile(pfad, "r") as z:
        zeilen = docx_lesen(z) if endung == ".docx" else pptx_lesen(z)

    print(f"# {pfad.relative_to(VFW)}\n")
    print("\n".join(zeilen))
    return 0


if __name__ == "__main__":
    sys.exit(main())
