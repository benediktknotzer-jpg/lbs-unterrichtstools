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
  test(t.titel + ' (' + t.datei + ') lädt ohne Fehler', function () {
    var d = Q.dekodiere(fs.readFileSync(path.join(daten, t.datei)));
    assert.strictEqual(d.hinweis, null, 'Datei ist nicht UTF-8');
    var erg = Q.ladeFragen(d.text);
    assert.deepStrictEqual(erg.fehler, []);
    assert.ok(erg.fragen.length > 0);
    console.log('       ' + erg.fragen.length + ' Fragen, ' + erg.hinweise.length + ' Hinweise');
  });
});

test('Fleisch & Rindfleisch: 77 Fragen, alle drei Typen', function () {
  var erg = Q.ladeFragen(fs.readFileSync(path.join(daten, 'fleisch-rindfleisch.csv'), 'utf8'));
  assert.strictEqual(erg.fragen.length, 77);
  var typen = {};
  erg.fragen.forEach(function (f) { typen[f.typ] = (typen[f.typ] || 0) + 1; });
  assert.deepStrictEqual(typen, { MC: 57, RF: 11, ZU: 9 });
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

console.log('Formatfehler werden erkannt');
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

console.log('\n' + bestanden + ' Tests bestanden' + (process.exitCode ? ', es gibt FEHLER.' : '.'));
