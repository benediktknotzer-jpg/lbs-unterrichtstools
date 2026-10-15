"""
QR-Code als SVG erzeugen – nur Python-Standardbibliothek, kein Internet.

Aufruf im Hauptordner:
    python tools/qr_code.py "https://benediktknotzer-jpg.github.io/lbs-unterrichtstools/" bilder/qr-quiz.svg

Unterstützt Byte-Modus, Fehlerkorrektur M (ca. 15 %), Versionen 1 bis 6 (bis 106 Zeichen).
Das reicht für die Quiz-Adresse samt Klassen-Code.
"""
import sys

# Version: (Datenwörter je Block, Anzahl Blöcke, Fehlerkorrekturwörter je Block) für Stufe M
BLOECKE_M = {1: (16, 1, 10), 2: (28, 1, 16), 3: (44, 1, 26), 4: (32, 2, 18), 5: (43, 2, 24), 6: (27, 4, 16)}
AUSRICHTUNG = {1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34]}


def gf_mal(x, y):
    z = 0
    for i in range(7, -1, -1):
        z = (z << 1) ^ ((z >> 7) * 0x11D)
        z ^= ((y >> i) & 1) * x
    return z & 0xFF


def rs_divisor(grad):
    erg = [0] * (grad - 1) + [1]
    wurzel = 1
    for _ in range(grad):
        for j in range(grad):
            erg[j] = gf_mal(erg[j], wurzel)
            if j + 1 < grad:
                erg[j] ^= erg[j + 1]
        wurzel = gf_mal(wurzel, 0x02)
    return erg


def rs_rest(daten, divisor):
    erg = [0] * len(divisor)
    for b in daten:
        faktor = b ^ erg.pop(0)
        erg.append(0)
        for i, c in enumerate(divisor):
            erg[i] ^= gf_mal(c, faktor)
    return erg


def codewoerter(text):
    daten = text.encode('utf-8')
    for version in range(1, 7):
        je_block, bloecke, ec = BLOECKE_M[version]
        kapazitaet = je_block * bloecke
        if 4 + 8 + 8 * len(daten) <= kapazitaet * 8:
            break
    else:
        raise ValueError('Text zu lang für Version 6 (höchstens 106 Bytes).')
    bits = [0, 1, 0, 0]
    bits += [(len(daten) >> i) & 1 for i in range(7, -1, -1)]
    for b in daten:
        bits += [(b >> i) & 1 for i in range(7, -1, -1)]
    bits += [0] * min(4, kapazitaet * 8 - len(bits))
    bits += [0] * (-len(bits) % 8)
    worte = [int(''.join(map(str, bits[i:i + 8])), 2) for i in range(0, len(bits), 8)]
    fuell = [0xEC, 0x11]
    while len(worte) < kapazitaet:
        worte.append(fuell[(len(worte) - len(bits) // 8) % 2])
    divisor = rs_divisor(ec)
    datenbloecke = [worte[i * je_block:(i + 1) * je_block] for i in range(bloecke)]
    ecbloecke = [rs_rest(b, divisor) for b in datenbloecke]
    ergebnis = []
    for i in range(je_block):
        ergebnis += [b[i] for b in datenbloecke]
    for i in range(ec):
        ergebnis += [b[i] for b in ecbloecke]
    return version, ergebnis


MASKEN = [
    lambda x, y: (x + y) % 2 == 0,
    lambda x, y: y % 2 == 0,
    lambda x, y: x % 3 == 0,
    lambda x, y: (x + y) % 3 == 0,
    lambda x, y: (x // 3 + y // 2) % 2 == 0,
    lambda x, y: x * y % 2 + x * y % 3 == 0,
    lambda x, y: (x * y % 2 + x * y % 3) % 2 == 0,
    lambda x, y: ((x + y) % 2 + x * y % 3) % 2 == 0,
]


class Matrix:
    def __init__(self, version):
        self.n = n = version * 4 + 17
        self.m = [[False] * n for _ in range(n)]
        self.fest = [[False] * n for _ in range(n)]
        for i in range(n):  # Taktlinien
            self.setze(6, i, i % 2 == 0)
            self.setze(i, 6, i % 2 == 0)
        for x, y in ((3, 3), (n - 4, 3), (3, n - 4)):  # Suchmuster mit Trennlinie
            for dy in range(-4, 5):
                for dx in range(-4, 5):
                    d = max(abs(dx), abs(dy))
                    if 0 <= x + dx < n and 0 <= y + dy < n:
                        self.setze(x + dx, y + dy, d not in (2, 4))
        pos = AUSRICHTUNG[version]
        for a in pos:
            for b in pos:
                if (a, b) in ((6, 6), (6, pos[-1]), (pos[-1], 6)):
                    continue
                for dy in range(-2, 3):
                    for dx in range(-2, 3):
                        self.setze(a + dx, b + dy, max(abs(dx), abs(dy)) != 1)
        self.format_zeichnen(0)  # reserviert die Formatbereiche

    def setze(self, x, y, dunkel):
        self.m[y][x] = dunkel
        self.fest[y][x] = True

    def format_zeichnen(self, maske):
        n = self.n
        daten = (0 << 3) | maske  # Stufe M = 00
        rest = daten
        for _ in range(10):
            rest = (rest << 1) ^ ((rest >> 9) * 0x537)
        bits = ((daten << 10) | rest) ^ 0x5412
        bit = lambda i: (bits >> i) & 1 != 0
        for i in range(6):
            self.setze(8, i, bit(i))
        self.setze(8, 7, bit(6))
        self.setze(8, 8, bit(7))
        self.setze(7, 8, bit(8))
        for i in range(9, 15):
            self.setze(14 - i, 8, bit(i))
        for i in range(8):
            self.setze(n - 1 - i, 8, bit(i))
        for i in range(8, 15):
            self.setze(8, n - 15 + i, bit(i))
        self.setze(8, n - 8, True)

    def daten_zeichnen(self, worte):
        n = self.n
        i = 0
        rechts = n - 1
        while rechts >= 1:
            if rechts == 6:
                rechts = 5
            for senk in range(n):
                for j in range(2):
                    x = rechts - j
                    hoch = ((rechts + 1) & 2) == 0
                    y = n - 1 - senk if hoch else senk
                    if not self.fest[y][x] and i < len(worte) * 8:
                        self.m[y][x] = (worte[i >> 3] >> (7 - (i & 7))) & 1 == 1
                        i += 1
            rechts -= 2

    def maskieren(self, maske):
        f = MASKEN[maske]
        for y in range(self.n):
            for x in range(self.n):
                if not self.fest[y][x] and f(x, y):
                    self.m[y][x] = not self.m[y][x]

    def strafpunkte(self):
        n, m, p = self.n, self.m, 0
        for zeilen in (m, [list(s) for s in zip(*m)]):
            for z in zeilen:
                lauf = 1
                for i in range(1, n + 1):
                    if i < n and z[i] == z[i - 1]:
                        lauf += 1
                    else:
                        if lauf >= 5:
                            p += lauf - 2
                        lauf = 1
                s = ''.join('1' if v else '0' for v in z)
                p += 40 * (s.count('10111010000') + s.count('00001011101'))
        for y in range(n - 1):
            for x in range(n - 1):
                if m[y][x] == m[y][x + 1] == m[y + 1][x] == m[y + 1][x + 1]:
                    p += 3
        dunkel = sum(v for z in m for v in z)
        p += 10 * (abs(dunkel * 20 - n * n * 10) // (n * n))
        return p


def erzeuge(text):
    version, worte = codewoerter(text)
    beste = None
    for maske in range(8):
        mx = Matrix(version)
        mx.daten_zeichnen(worte)
        mx.maskieren(maske)
        mx.format_zeichnen(maske)
        punkte = mx.strafpunkte()
        if beste is None or punkte < beste[0]:
            beste = (punkte, mx)
    return beste[1].m


def als_svg(module, rand=4):
    n = len(module)
    g = n + 2 * rand
    pfad = ''.join('M%d %dh1v1h-1z' % (x + rand, y + rand)
                   for y in range(n) for x in range(n) if module[y][x])
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" shape-rendering="crispEdges">'
            '<rect width="100%%" height="100%%" fill="#fff"/><path d="%s" fill="#000"/></svg>\n' % (g, g, pfad))


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    with open(sys.argv[2], 'w', encoding='utf-8') as f:
        f.write(als_svg(erzeuge(sys.argv[1])))
    print('QR-Code gespeichert:', sys.argv[2])
