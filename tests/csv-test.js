/*
 * Prüft das Einlesen der Fragen-Dateien – ohne Browser, ohne Zusatzpakete.
 * Aufruf im Hauptordner:  node tests/csv-test.js
 */
'use strict';

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var Q = require('../js/csv.js');

var KOPF = 'nr;thema;typ;frage;richtig;falsch1;falsch2;falsch3;quelle\n';
var bestanden = 0;

function test(name, fn) {
  try {
    fn();
    bestanden++;
    console.log('  ok   ' + name);
  } catch (e) {
    console.log('  FEHLER ' + name + '\n       ' + e.message);
    process.exitCode = 1;
  }
}

function enthaelt(liste, teil) {
  assert.ok(liste.some(function (x) { return x.indexOf(teil) >= 0; }),
    'erwartet „' + teil + '“ in: ' + JSON.stringify(liste));
}

console.log('Alle Themen aus daten/themen.json');
var daten = path.join(__dirname, '..', 'daten');
var themen = JSON.parse(fs.readFileSync(path.join(daten, 'themen.json'), 'utf8'));
themen.forEach(function (t) {
  if (t.mix) {
    test(t.titel + ': alle gemischten Themen stehen in themen.json', function () {
      t.mix.forEach(function (datei) {
        assert.ok(themen.some(function (x) { return x.datei === datei; }), datei + ' fehlt in themen.json');
      });
    });
    return;
  }
  test(t.titel + ' (' + t.datei + ') lädt ohne Fehler', function () {
    var d = Q.dekodiere(fs.readFileSync(path.join(daten, t.datei)));
    assert.strictEqual(d.hinweis, null, 'Datei ist nicht UTF-8');
    var erg = Q.ladeFragen(d.text);
    assert.deepStrictEqual(erg.fehler, []);
    assert.ok(erg.fragen.length > 0);
    console.log('       ' + erg.fragen.length + ' Fragen, ' + erg.hinweise.length + ' Hinweise');
  });
});

/* Längen-Prüfung: Ist bei MC die richtige Antwort meist die längste, kann man nach der Länge raten.
   Erlaubt sind höchstens 35 % je Datei (Zufall wären etwa 25 %). Ist LAENGE_SCHARF false,
   gibt es nur eine Warnung (scharf seit 21.10.2026, alle Themen überarbeitet). */
var LAENGE_GRENZE = 35;
var LAENGE_SCHARF = true;

// Zweite Regel: Auch keine andere Längen-Position darf über 50 % liegen – sonst wird
// „immer die zweitlängste nehmen“ zur neuen Rate-Strategie.
var POSITION_GRENZE = 50;

function laengenQuote(fragen) {
  var mc = fragen.filter(function (f) { return f.typ === 'MC'; });
  var laengste = mc.filter(function (f) {
    return f.falsche.every(function (x) { return f.richtig.length > x.length; });
  });
  // Position = Anzahl der falschen Antworten, die länger sind als die richtige (0 = längste)
  var position = [0, 0, 0, 0];
  mc.forEach(function (f) {
    position[f.falsche.filter(function (x) { return x.length > f.richtig.length; }).length]++;
  });
  var maxPos = 0;
  position.forEach(function (n, i) { if (n > position[maxPos]) maxPos = i; });
  return { mc: mc.length, nummern: laengste.map(function (f) { return f.nr; }),
    prozent: mc.length ? Math.round(laengste.length / mc.length * 100) : 0,
    maxPosition: maxPos + 1, maxPositionProzent: mc.length ? Math.round(position[maxPos] / mc.length * 100) : 0 };
}

console.log('Längen-Prüfung (richtige MC-Antwort höchstens ' + LAENGE_GRENZE + ' % die längste, keine Position über ' + POSITION_GRENZE + ' %' +
  (LAENGE_SCHARF ? ')' : ', derzeit nur Warnung)'));
var dateien = themen.filter(function (t) { return t.datei; }).map(function (t) { return t.datei; });
fs.readdirSync(daten).filter(function (d) { return /\.csv$/.test(d) && dateien.indexOf(d) < 0; })
  .forEach(function (d) { dateien.push(d); });
dateien.forEach(function (datei) {
  var q = laengenQuote(Q.ladeFragen(fs.readFileSync(path.join(daten, datei), 'utf8')).fragen);
  if (q.mc < 10) return;
  var zuViel = q.prozent > LAENGE_GRENZE || q.maxPositionProzent > POSITION_GRENZE;
  if (!zuViel || LAENGE_SCHARF) {
    test(datei + ': ' + q.prozent + ' % von ' + q.mc + ' MC-Fragen, häufigste Position ' +
        q.maxPosition + ' mit ' + q.maxPositionProzent + ' %', function () {
      assert.ok(q.prozent <= LAENGE_GRENZE, 'zu oft ist die richtige Antwort die längste, Nr. ' + q.nummern.join(', '));
      assert.ok(q.maxPositionProzent <= POSITION_GRENZE, 'die richtige Antwort steht zu oft an Längen-Position ' +
        q.maxPosition + ' (' + q.maxPositionProzent + ' %)');
    });
  } else {
    console.log('  WARNUNG ' + datei + ': ' + q.prozent + ' % von ' + q.mc + ' MC-Fragen');
  }
});

console.log('Klassen und Zugänge (daten/themen.json, daten/zugaenge.json)');
test('Jedes Thema in themen.json hat mindestens eine Klasse', function () {
  themen.forEach(function (t) {
    assert.ok(Array.isArray(t.klassen) && t.klassen.length, '„' + t.titel + '“ ohne „klassen“');
  });
});

test('zugaenge.json: gültig, keine doppelten Codes, Klassen und Themen vorhanden', function () {
  var z = JSON.parse(fs.readFileSync(path.join(daten, 'zugaenge.json'), 'utf8'));
  var klassen = {};
  themen.forEach(function (t) { (t.klassen || []).forEach(function (k) { klassen[String(k)] = true; }); });
  var titel = themen.map(function (t) { return t.titel; });
  assert.ok(Array.isArray(z.zugaenge), '„zugaenge“ muss eine Liste sein');
  var gesehen = {};
  z.zugaenge.forEach(function (zug) {
    var code = String(zug.code || '');
    assert.ok(/^[A-Z0-9-]+$/.test(code), 'Code „' + code + '“: nur Großbuchstaben, Ziffern und Bindestrich');
    assert.ok(!gesehen[code], 'Code „' + code + '“ kommt doppelt vor');
    gesehen[code] = true;
    assert.ok(klassen[String(zug.klasse)], 'Code „' + code + '“: Klasse „' + zug.klasse + '“ hat kein Thema');
    assert.strictEqual(typeof zug.aktiv, 'boolean', 'Code „' + code + '“: „aktiv“ muss true oder false sein');
    (zug.themen || []).forEach(function (t) {
      assert.ok(titel.indexOf(t) >= 0, 'Code „' + code + '“: Thema „' + t + '“ steht nicht in themen.json');
    });
    assert.ok(fs.existsSync(path.join(__dirname, '..', 'bilder', 'qr-' + code + '.svg')),
      'Code „' + code + '“: QR-Code bilder/qr-' + code + '.svg fehlt');
  });
  if (z.ohneCode) {
    assert.ok(klassen[String(z.ohneCode.klasse)], '„ohneCode“: Klasse fehlt oder hat kein Thema');
    assert.ok(!z.ohneCode.bis || /^\d{4}-\d{2}-\d{2}$/.test(z.ohneCode.bis), '„ohneCode.bis“ im Format JJJJ-MM-TT');
  }
});

test('Fleisch & Rindfleisch: 82 Fragen (MC, RF, ZU, MM), alle RF mit Erklärung', function () {
  var erg = Q.ladeFragen(fs.readFileSync(path.join(daten, 'fleisch-rindfleisch.csv'), 'utf8'));
  assert.strictEqual(erg.fragen.length, 82);
  var typen = {};
  erg.fragen.forEach(function (f) { typen[f.typ] = (typen[f.typ] || 0) + 1; });
  assert.deepStrictEqual(typen, { MC: 57, RF: 11, ZU: 9, MM: 5 });
  erg.fragen.filter(function (f) { return f.typ === 'RF'; }).forEach(function (f) {
    assert.ok(f.erklaerung, 'RF Nr. ' + f.nr + ' ohne Erklärung');
  });
  var zu = erg.fragen.filter(function (f) { return f.nr === '18'; })[0];
  assert.deepStrictEqual(zu.paare[0], { links: 'A', rechts: 'Jungstier' });
  assert.strictEqual(zu.paare.length, 5);
  var rf = erg.fragen.filter(function (f) { return f.nr === '15'; })[0];
  assert.strictEqual(rf.richtig, true);
});

console.log('Gültige Fragen');
test('MC, RF, ZU werden richtig aufgebaut', function () {
  var erg = Q.ladeFragen(KOPF +
    '1;Käse;MC;Frage?;Ja;Nein;Vielleicht;Nie;LB\n' +
    '2;Käse;rf;Aussage.;Falsch;;;;LB\n' +
    '3;Käse;ZU;Ordnen Sie zu.;Emmentaler = Hartkäse | Brie = Weichkäse;;;;LB\n');
  assert.deepStrictEqual(erg.fehler, []);
  assert.strictEqual(erg.fragen.length, 3);
  assert.deepStrictEqual(erg.fragen[0].falsche, ['Nein', 'Vielleicht', 'Nie']);
  assert.strictEqual(erg.fragen[1].typ, 'RF');
  assert.strictEqual(erg.fragen[1].richtig, false);
  assert.deepStrictEqual(erg.fragen[2].paare, [
    { links: 'Emmentaler', rechts: 'Hartkäse' }, { links: 'Brie', rechts: 'Weichkäse' }]);
});

test('Anführungszeichen, Semikolon im Text, CRLF, BOM, Leerzeilen', function () {
  var erg = Q.ladeFragen('﻿' + KOPF.replace('\n', '\r\n') +
    '1;A;MC;"Was gilt; genau?";"Das ""Beste""";B;C;D;\r\n' +
    ';;;;;;;;\r\n\r\n');
  assert.deepStrictEqual(erg.fehler, []);
  assert.strictEqual(erg.fragen[0].frage, 'Was gilt; genau?');
  assert.strictEqual(erg.fragen[0].richtig, 'Das "Beste"');
});

test('Windows-1252-Datei wird mit Hinweis gelesen', function () {
  var d = Q.dekodiere(Buffer.from([0x4b, 0xe4, 0x73, 0x65])); // „Käse“ in Windows-1252
  assert.strictEqual(d.text, 'Käse');
  assert.ok(d.hinweis && d.hinweis.indexOf('UTF-8') >= 0);
});

test('Käse: 86 Fragen, alle sechs Typen', function () {
  var erg = Q.ladeFragen(fs.readFileSync(path.join(daten, 'kaese.csv'), 'utf8'));
  assert.strictEqual(erg.fragen.length, 86);
  var typen = {};
  erg.fragen.forEach(function (f) { typen[f.typ] = (typen[f.typ] || 0) + 1; });
  assert.deepStrictEqual(Object.keys(typen).sort(), ['LT', 'MC', 'MM', 'RF', 'RH', 'ZU']);
});

test('LT: Lücken, Text und Ablenkwörter', function () {
  var erg = Q.ladeFragen(KOPF + '1;Käse;LT;Ergänzen Sie.;Milch wird mit [Lab] dick, es entsteht [Molke].;Hefe;Lab;;\n');
  assert.deepStrictEqual(erg.fehler, []);
  var f = erg.fragen[0];
  assert.deepStrictEqual(f.luecken, ['Lab', 'Molke']);
  assert.deepStrictEqual(f.ablenker, ['Hefe']);
  assert.deepStrictEqual(f.teile, [{ text: 'Milch wird mit ' }, { luecke: 0 }, { text: ' dick, es entsteht ' },
    { luecke: 1 }, { text: '.' }]);
  enthaelt(erg.hinweise, 'Ablenkwort „Lab“');
});

test('RH: Schritte in Reihenfolge', function () {
  var erg = Q.ladeFragen(KOPF + '1;Käse;RH;Reihenfolge?;Eins | Zwei | Drei;;;;\n');
  assert.deepStrictEqual(erg.fehler, []);
  assert.deepStrictEqual(erg.fragen[0].schritte, ['Eins', 'Zwei', 'Drei']);
});

console.log('Formatfehler werden erkannt');
test('LT ohne Lücke', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;LT;Ergänzen.;Text ohne Lücke.;;;;\n').fehler, 'keine Lücke');
});

test('LT mit nicht geschlossener Klammer', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;LT;Ergänzen.;Milch mit [Lab dick.;;;;\n').fehler, 'Klammern');
  enthaelt(Q.ladeFragen(KOPF + '1;A;LT;Ergänzen.;Milch [mit [Lab] dick.;;;;\n').fehler, 'Klammern');
});

test('LT mit leerer Lücke', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;LT;Ergänzen.;Milch mit [ ] dick.;;;;\n').fehler, 'leere Lücke');
});

test('RH mit zu wenigen Schritten', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;RH;Reihenfolge?;Eins | Zwei;;;;\n').fehler, 'mindestens drei');
});

test('RH mit doppeltem Schritt', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;RH;Reihenfolge?;Eins | Zwei | Eins;;;;\n').fehler, 'doppelt');
});

test('falscher Typ', function () {
  var erg = Q.ladeFragen(KOPF + '1;A;XY;Frage?;Ja;Nein;;;\n');
  assert.strictEqual(erg.fragen.length, 0);
  enthaelt(erg.fehler, 'Zeile 2 (Nr. 1): Unbekannter Fragetyp „XY“');
});

test('fehlender Typ', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;;Frage?;Ja;Nein;;;\n').fehler, 'Fragetyp (Spalte „typ“) fehlt');
});

test('MC ohne richtige Antwort', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;MC;Frage?;;Nein;Doch;Nie;\n').fehler, 'richtige Antwort');
});

test('MC ohne falsche Antworten', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;MC;Frage?;Ja;;;;\n').fehler, 'falschen Antworten');
});

test('MC mit nur einer falschen Antwort → Hinweis, Frage bleibt', function () {
  var erg = Q.ladeFragen(KOPF + '1;A;MC;Frage?;Ja;Nein;;;\n');
  assert.strictEqual(erg.fragen.length, 1);
  enthaelt(erg.hinweise, 'Nur 1 falsche Antwort');
});

test('MC: falsche Antwort gleich richtiger', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;MC;Frage?;Ja;ja;Nein;Nie;\n').fehler, 'identisch');
});

test('RF mit ungültigem Wert', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;RF;Aussage.;stimmt;;;;\n').fehler, 'gefunden: „stimmt“');
});

test('ZU ohne „=“', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;ZU;Zuordnen.;A - B | C = D;;;;\n').fehler, 'enthält kein „=“');
});

test('ZU mit nur einem Paar', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;ZU;Zuordnen.;A = B;;;;\n').fehler, 'mindestens zwei Paare');
});

test('ZU mit leerer Seite', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;ZU;Zuordnen.;A = | C = D;;;;\n').fehler, 'fehlt links oder rechts');
});

test('fehlender Fragetext', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;RF;;richtig;;;;\n').fehler, 'Fragetext');
});

test('zu viele Spalten (Semikolon im Text)', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;RF;Aussage; mit Semikolon.;richtig;;;;;\n').fehler, 'mehr Spalten');
});

test('fehlende Spalte in der Kopfzeile', function () {
  enthaelt(Q.ladeFragen('nr;thema;typ;frage;richtig\n1;A;RF;X;richtig\n').fehler, '„falsch1“');
});

test('Komma statt Semikolon', function () {
  enthaelt(Q.ladeFragen('nr,thema,typ,frage,richtig,falsch1,falsch2,falsch3,quelle\n').fehler, 'Semikolon');
});

test('nicht geschlossenes Anführungszeichen', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;RF;"Aussage;richtig;;;;\n').fehler, 'nie geschlossen');
});

test('leere Datei', function () {
  enthaelt(Q.ladeFragen('').fehler, 'leer');
});

test('gute Fragen bleiben trotz fehlerhafter Nachbarzeile erhalten', function () {
  var erg = Q.ladeFragen(KOPF + '1;A;RF;Gut.;richtig;;;;\n2;A;XX;Schlecht.;;;;;\n3;A;RF;Auch gut.;falsch;;;;\n');
  assert.strictEqual(erg.fragen.length, 2);
  assert.strictEqual(erg.fehler.length, 1);
});

console.log('Mehrfachauswahl (MM) und Erklärung');
test('MM: mehrere richtige und falsche Antworten', function () {
  var erg = Q.ladeFragen(KOPF + '1;Öl;MM;Welche sind tierisch?;Rindertalg | Butterschmalz;Rapsöl;Kokosfett;;IB\n');
  assert.deepStrictEqual(erg.fehler, []);
  assert.deepStrictEqual(erg.fragen[0].richtige, ['Rindertalg', 'Butterschmalz']);
  assert.deepStrictEqual(erg.fragen[0].falsche, ['Rapsöl', 'Kokosfett']);
});

test('MM ohne falsche Antwort ist ein Fehler', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;MM;Welche?;A | B;;;;\n').fehler, 'falsche Antwort');
});

test('MM: Antwort gleichzeitig richtig und falsch ist ein Fehler', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;MM;Welche?;A | B;B;C;;\n').fehler, 'auch bei den richtigen');
});

test('MM mit mehr als sechs Antworten ist ein Fehler', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;MM;Welche?;A | B | C | D;E;F;G;\n').fehler, 'sechs');
});

test('MM mit nur einer richtigen Antwort gibt einen Hinweis', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;MM;Welche?;A;B;C;;\n').hinweise, 'MC');
});

test('Spalte „erklaerung“ ist freiwillig und wird gelesen', function () {
  var mit = Q.ladeFragen(KOPF.replace('\n', ';erklaerung\n') +
    '1;A;RF;Aussage.;falsch;;;;LB;Falsch: So ist es richtig.\n2;A;RF;Aussage 2.;richtig;;;;LB\n');
  assert.deepStrictEqual(mit.fehler, []);
  assert.strictEqual(mit.fragen[0].erklaerung, 'Falsch: So ist es richtig.');
  assert.strictEqual(mit.fragen[1].erklaerung, '');
  var ohne = Q.ladeFragen(KOPF + '1;A;RF;Aussage.;falsch;;;;LB\n');
  assert.strictEqual(ohne.fragen[0].erklaerung, '');
});

console.log('Offene Fragen (OF, Karteikarten)');
test('OF: Frage und Musterantwort', function () {
  var erg = Q.ladeFragen(KOPF + '1;Milch;OF;Was ist Laktose?;Milchzucker.;;;;FRAGEN\n');
  assert.deepStrictEqual(erg.fehler, []);
  assert.deepStrictEqual(erg.hinweise, []);
  assert.strictEqual(erg.fragen[0].typ, 'OF');
  assert.strictEqual(erg.fragen[0].richtig, 'Milchzucker.');
});

test('OF ohne Musterantwort ist ein Fehler', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;OF;Frage?;;;;;\n').fehler, 'Musterantwort');
});

test('OF mit Antworten in falsch1 gibt einen Hinweis', function () {
  enthaelt(Q.ladeFragen(KOPF + '1;A;OF;Frage?;Antwort;Nein;;;\n').hinweise, 'leer');
});

console.log('\n' + bestanden + ' Tests bestanden' + (process.exitCode ? ', es gibt FEHLER.' : '.'));
