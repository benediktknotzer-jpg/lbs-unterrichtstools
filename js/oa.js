/*
 * Warenkunde-Quiz – Korrektur offener Antworten (Fragetyp OA)
 *
 * Prüft, welche Schlüsselbegriffe in einer frei getippten Antwort vorkommen. Nachsichtig bei
 * Groß-/Kleinschreibung, Umlauten (ae = ä), Satzzeichen, Bindestrichen, kleinen Tippfehlern und
 * Wortendungen (pasteurisiert = Pasteurisierung). Zahlen werden als Zahl verglichen
 * (1.290 = 1290, 3,5 = 3.5). Ein „=“ vor dem Begriff heißt „genau so“, ohne Toleranz – für
 * Begriffe, die sich nur in einem Buchstaben unterscheiden (=Laktose / =Laktase).
 * Erkennt Begriffe, keinen Sinn: „nicht pasteurisiert“ enthält auch
 * „pasteurisiert“ – OA ist deshalb für Aufzählungen, Fachbegriffe und Zahlen gedacht.
 *
 * Läuft im Browser (window.QuizOA) und in Node.js (require).
 */
(function (global) {
  'use strict';

  function grundform(s) {
    return String(s).toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function woerter(s) {
    return grundform(s).split(/[^a-z0-9]+/).filter(Boolean);
  }

  // Levenshtein-Abstand, bricht ab, sobald er größer als „grenze“ wird
  function abstand(a, b, grenze) {
    if (Math.abs(a.length - b.length) > grenze) return grenze + 1;
    var vorher = [];
    for (var j = 0; j <= b.length; j++) vorher[j] = j;
    for (var i = 1; i <= a.length; i++) {
      var jetzt = [i];
      var min = i;
      for (j = 1; j <= b.length; j++) {
        var kosten = a[i - 1] === b[j - 1] ? 0 : 1;
        jetzt[j] = Math.min(vorher[j] + 1, jetzt[j - 1] + 1, vorher[j - 1] + kosten);
        if (jetzt[j] < min) min = jetzt[j];
      }
      if (min > grenze) return grenze + 1;
      vorher = jetzt;
    }
    return vorher[b.length];
  }

  // Ein Tippfehler bei 5–8 Buchstaben, zwei ab 9, bei kurzen Wörtern (bis 4) keiner
  function toleranz(laenge) {
    return laenge <= 4 ? 0 : laenge <= 8 ? 1 : 2;
  }

  function aehnlich(wort, begriff) {
    if (wort === begriff) return true;
    if (abstand(wort, begriff, toleranz(begriff.length)) <= toleranz(begriff.length)) return true;
    // Andere Endung: pasteurisiert ~ pasteurisierung, homogenisiert ~ homogenisieren
    if (begriff.length >= 6) {
      var stamm = begriff.slice(0, begriff.length - 2);
      if (wort.indexOf(stamm) === 0 && Math.abs(wort.length - begriff.length) <= 3) return true;
    }
    return false;
  }

  /* ---------- Zahlen ---------- */

  var ZAHL = /^\d+(?:[.,]\d+)*\s*%?$/;

  // „1.290“ = 1290, „3,5“ = 3,5 – so wie man in Österreich schreibt
  function deutscheZahl(s) {
    return parseFloat(String(s).replace(/[%\s]/g, '').replace(/\./g, '').replace(',', '.'));
  }

  // Alle Lesarten einer Zahl aus der Antwort: deutsch (1.290 / 3,5) und mit Dezimalpunkt (3.5)
  function zahlenIn(text) {
    var werte = [];
    (String(text).match(/\d+(?:[.,]\d+)*/g) || []).forEach(function (t) {
      werte.push(deutscheZahl(t));
      if (/^\d+\.\d+$/.test(t)) werte.push(parseFloat(t));
    });
    return werte;
  }

  /* ---------- Begriff in der Antwort suchen ---------- */

  function enthaeltVariante(antwort, aw, variante) {
    // „=Laktose“: genau so, ohne Tippfehler-Toleranz (sonst zählt auch „Laktase“)
    if (variante.charAt(0) === '=') {
      var genau = woerter(variante.slice(1)).join(' ');
      return (' ' + aw.join(' ') + ' ').indexOf(' ' + genau + ' ') >= 0;
    }
    if (ZAHL.test(variante.trim())) {
      var soll = deutscheZahl(variante);
      return zahlenIn(antwort).some(function (z) { return Math.abs(z - soll) < 1e-9; });
    }
    var bw = woerter(variante);
    if (!bw.length) return false;
    var ziel = bw.join('');
    // Sehr kurze Begriffe (ESL, UHT, Lab) nur als ganzes Wort
    if (ziel.length <= 3) return aw.indexOf(ziel) >= 0;
    // Wortfenster um die Länge des Begriffs: „bakteriologische Beschaffenheit“, „Mager-Milch“
    for (var k = Math.max(1, bw.length - 1); k <= bw.length + 1; k++) {
      for (var i = 0; i + k <= aw.length; i++) {
        if (aehnlich(aw.slice(i, i + k).join(''), ziel)) return true;
      }
    }
    // Zusammengesetzte Wörter: „Haltbarmilch“ enthält „milch“
    return ziel.length >= 5 && aw.some(function (w) { return w.length > ziel.length && w.indexOf(ziel) >= 0; });
  }

  /* begriffe: [[Variante, Synonym, …], …], mindestens: wie viele Begriffe genügen.
     Rückgabe: { gefunden: [Index], fehlend: [Index], ok: true/false } */
  function pruefe(begriffe, mindestens, antwort) {
    var aw = woerter(antwort);
    var erg = { gefunden: [], fehlend: [] };
    begriffe.forEach(function (varianten, i) {
      var da = varianten.some(function (v) { return enthaeltVariante(antwort, aw, v); });
      (da ? erg.gefunden : erg.fehlend).push(i);
    });
    erg.ok = erg.gefunden.length >= (mindestens || begriffe.length);
    return erg;
  }

  // Anzeigename eines Begriffs: erste Schreibweise, ohne das „=“ für „genau so“
  function name(varianten) {
    return varianten[0].replace(/^=/, '');
  }

  var api = { pruefe: pruefe, woerter: woerter, name: name };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.QuizOA = api;
})(this);
