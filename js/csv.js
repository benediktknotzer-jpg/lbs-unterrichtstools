/*
 * Warenkunde-Quiz – Einlesen und Prüfen der Fragen-Dateien (CSV)
 *
 * Erwartetes Format (UTF-8, Trennzeichen Semikolon):
 *   nr;thema;typ;frage;richtig;falsch1;falsch2;falsch3;quelle
 *
 * Läuft im Browser (window.QuizDaten) und in Node.js (require) –
 * so kann die Prüfung auch ohne Browser getestet werden.
 */
(function (global) {
  'use strict';

  var PFLICHTSPALTEN = ['nr', 'thema', 'typ', 'frage', 'richtig', 'falsch1', 'falsch2', 'falsch3'];
  var TYPEN = ['MC', 'RF', 'ZU'];

  /* Bytes -> Text. Bevorzugt UTF-8; eine in Excel als „CSV (Trennzeichen-getrennt)“
     gespeicherte Datei ist meist Windows-1252 – die wird trotzdem gelesen, mit Hinweis. */
  function dekodiere(buffer) {
    try {
      return { text: new TextDecoder('utf-8', { fatal: true }).decode(buffer), hinweis: null };
    } catch (e) {
      return {
        text: new TextDecoder('windows-1252').decode(buffer),
        hinweis: 'Die Datei ist nicht als UTF-8 gespeichert und wurde als Windows-Zeichensatz gelesen. ' +
          'Umlaute können falsch angezeigt werden. Bitte in Excel mit „CSV UTF-8 (durch Trennzeichen getrennt)“ speichern.'
      };
    }
  }

  /* Zerlegt CSV-Text in Datensätze. Unterstützt Felder in Anführungszeichen
     (dann dürfen sie ; oder Zeilenumbrüche enthalten, "" = ein Anführungszeichen). */
  function parseCsv(text, trenn) {
    trenn = trenn || ';';
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1); // BOM (Excel)

    var datensaetze = [];
    var fehler = [];
    var felder = [];
    var feld = '';
    var inAnf = false;
    var zeile = 1;
    var startZeile = 1;
    var anfStart = 0;

    function feldEnde() {
      felder.push(feld);
      feld = '';
    }
    function satzEnde() {
      feldEnde();
      var leer = felder.every(function (f) { return f.trim() === ''; });
      if (!leer) datensaetze.push({ zeile: startZeile, felder: felder });
      felder = [];
    }

    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inAnf) {
        if (c === '"') {
          if (text[i + 1] === '"') { feld += '"'; i++; }
          else inAnf = false;
        } else {
          if (c === '\n') zeile++;
          feld += c;
        }
      } else if (c === '"' && feld.trim() === '') {
        inAnf = true;
        anfStart = zeile;
        feld = '';
      } else if (c === trenn) {
        feldEnde();
      } else if (c === '\r' || c === '\n') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        satzEnde();
        zeile++;
        startZeile = zeile;
      } else {
        feld += c;
      }
    }
    if (inAnf) {
      fehler.push('Zeile ' + anfStart + ': Ein Anführungszeichen (") wird geöffnet, aber nie geschlossen. ' +
        'Alles ab hier konnte nicht gelesen werden.');
    } else if (feld !== '' || felder.length) {
      satzEnde();
    }
    return { datensaetze: datensaetze, fehler: fehler };
  }

  function zitat(s) {
    s = String(s);
    if (s.length > 60) s = s.slice(0, 57) + '…';
    return '„' + s + '“';
  }

  /* Prüft den CSV-Text und baut die Fragen auf.
     Rückgabe: { fragen: [...], fehler: [...], hinweise: [...] }
     - fehler: Frage wurde übersprungen (bzw. ganze Datei unbrauchbar)
     - hinweise: Frage wurde übernommen, aber etwas ist auffällig */
  function ladeFragen(text) {
    var erg = { fragen: [], fehler: [], hinweise: [] };
    var p = parseCsv(text, ';');
    erg.fehler = erg.fehler.concat(p.fehler);

    if (!p.datensaetze.length) {
      erg.fehler.push('Die Datei ist leer.');
      return erg;
    }

    var kopfSatz = p.datensaetze[0];
    var kopf = kopfSatz.felder.map(function (f) { return f.trim().toLowerCase(); });

    if (kopf.length === 1 && /[,\t]/.test(kopfSatz.felder[0])) {
      erg.fehler.push('Die Kopfzeile enthält keine Semikolons. Die Spalten müssen durch Semikolon (;) ' +
        'getrennt sein, nicht durch Komma oder Tabulator.');
      return erg;
    }

    var idx = {};
    var fehlend = [];
    PFLICHTSPALTEN.forEach(function (name) {
      idx[name] = kopf.indexOf(name);
      if (idx[name] < 0) fehlend.push(name);
    });
    if (fehlend.length) {
      erg.fehler.push('In der Kopfzeile (Zeile 1) fehlt: ' + fehlend.map(zitat).join(', ') +
        '. Erwartet wird: nr;thema;typ;frage;richtig;falsch1;falsch2;falsch3;quelle');
      return erg;
    }

    var gesehenNr = {};

    p.datensaetze.slice(1).forEach(function (satz) {
      var felder = satz.felder;
      function f(name) {
        var j = idx[name];
        return j < felder.length ? felder[j].trim() : '';
      }

      var nr = f('nr');
      var ort = 'Zeile ' + satz.zeile + (nr ? ' (Nr. ' + nr + ')' : '');
      var probleme = [];
      var hinweise = [];

      var ueberzaehlig = felder.slice(kopf.length).filter(function (x) { return x.trim() !== ''; });
      if (ueberzaehlig.length) {
        probleme.push('Die Zeile hat mehr Spalten als die Kopfzeile – vermutlich steht ein Semikolon im Text. ' +
          'Text mit Semikolon in Anführungszeichen setzen oder das Semikolon ersetzen.');
      }

      var typRoh = f('typ');
      var typ = typRoh.toUpperCase();
      var frageText = f('frage');
      var thema = f('thema');
      var richtig = f('richtig');
      var frage = { nr: nr, zeile: satz.zeile, thema: thema || 'Ohne Unterthema', typ: typ, frage: frageText };

      if (!frageText) probleme.push('Der Fragetext (Spalte „frage“) fehlt.');
      if (!thema) hinweise.push('Kein Unterthema (Spalte „thema“) angegeben – die Frage erscheint unter „Ohne Unterthema“.');

      if (!typRoh) {
        probleme.push('Der Fragetyp (Spalte „typ“) fehlt. Erlaubt sind MC, RF oder ZU.');
      } else if (TYPEN.indexOf(typ) < 0) {
        probleme.push('Unbekannter Fragetyp ' + zitat(typRoh) + '. Erlaubt sind MC, RF oder ZU.');
      } else if (typ === 'MC') {
        if (!richtig) probleme.push('Die richtige Antwort (Spalte „richtig“) fehlt.');
        var falsche = [];
        ['falsch1', 'falsch2', 'falsch3'].forEach(function (s) {
          var w = f(s);
          if (!w) return;
          if (richtig && w.toLowerCase() === richtig.toLowerCase()) {
            probleme.push('Die Antwort in Spalte „' + s + '“ ist identisch mit der richtigen Antwort.');
          } else if (falsche.some(function (x) { return x.toLowerCase() === w.toLowerCase(); })) {
            hinweise.push('Die falsche Antwort ' + zitat(w) + ' kommt doppelt vor und wird nur einmal angezeigt.');
          } else {
            falsche.push(w);
          }
        });
        if (!falsche.length && !probleme.length) {
          probleme.push('Es fehlen die falschen Antworten (Spalten falsch1 bis falsch3).');
        } else if (falsche.length && falsche.length < 3) {
          hinweise.push('Nur ' + falsche.length + ' falsche Antwort(en) statt 3 – die Frage hat weniger Auswahlmöglichkeiten.');
        }
        frage.richtig = richtig;
        frage.falsche = falsche;
      } else if (typ === 'RF') {
        var rf = richtig.toLowerCase();
        if (rf !== 'richtig' && rf !== 'falsch') {
          probleme.push('Bei RF-Fragen muss in Spalte „richtig“ das Wort „richtig“ oder „falsch“ stehen' +
            (richtig ? ' (gefunden: ' + zitat(richtig) + ').' : ' – die Spalte ist leer.'));
        }
        frage.richtig = rf === 'richtig';
      } else if (typ === 'ZU') {
        var paare = [];
        var teile = richtig.split('|').map(function (t) { return t.trim(); }).filter(Boolean);
        if (teile.length < 2) {
          probleme.push('Bei ZU-Fragen braucht Spalte „richtig“ mindestens zwei Paare im Format ' +
            '„links = rechts | links = rechts“.');
        }
        teile.forEach(function (t) {
          var pos = t.indexOf('=');
          if (pos < 0) {
            probleme.push('Das Paar ' + zitat(t) + ' enthält kein „=“.');
            return;
          }
          var links = t.slice(0, pos).trim();
          var rechts = t.slice(pos + 1).trim();
          if (!links || !rechts) {
            probleme.push('Beim Paar ' + zitat(t) + ' fehlt links oder rechts vom „=“ der Text.');
            return;
          }
          if (paare.some(function (pp) { return pp.links.toLowerCase() === links.toLowerCase(); })) {
            probleme.push('Der Begriff ' + zitat(links) + ' kommt links doppelt vor.');
            return;
          }
          paare.push({ links: links, rechts: rechts });
        });
        frage.paare = paare;
      }

      if (probleme.length) {
        if (felder.length > kopf.length && !ueberzaehlig.length) {
          probleme.push('Tipp: Die Zeile hat mehr Spalten als die Kopfzeile – steht ein Semikolon im Text?');
        }
        erg.fehler.push(ort + ': ' + probleme.join(' '));
        return;
      }
      if (nr) {
        if (gesehenNr[nr]) hinweise.push('Die Nummer ' + nr + ' kommt mehrfach vor.');
        gesehenNr[nr] = true;
      }
      hinweise.forEach(function (h) { erg.hinweise.push(ort + ': ' + h); });
      erg.fragen.push(frage);
    });

    if (!erg.fragen.length && p.datensaetze.length < 2) {
      erg.fehler.push('Die Datei enthält nur die Kopfzeile, aber keine Fragen.');
    }
    return erg;
  }

  var api = { dekodiere: dekodiere, parseCsv: parseCsv, ladeFragen: ladeFragen };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.QuizDaten = api;
})(this);
