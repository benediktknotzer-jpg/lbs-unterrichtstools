/*
 * Warenkunde-Quiz – Ablauf und Darstellung
 * Keine Speicherung: alles bleibt nur im Arbeitsspeicher des Browsers.
 */
(function () {
  'use strict';

  var DATEN = 'daten/';
  var BUCHSTABEN = ['A', 'B', 'C', 'D', 'E', 'F'];

  var TYP_NAME = {
    MC: 'Multiple Choice',
    RF: 'Richtig oder falsch',
    ZU: 'Zuordnen',
    RH: 'Reihenfolge',
    LT: 'Lückentext'
  };

  // Notenschlüssel wie bei den Schularbeiten (Prozent der Punkte)
  var NOTEN = [
    { ab: 91, text: 'Sehr gut (1)' },
    { ab: 81, text: 'Gut (2)' },
    { ab: 61, text: 'Befriedigend (3)' },
    { ab: 51, text: 'Genügend (4)' },
    { ab: 0, text: 'Nicht genügend (5)' }
  ];

  var themen = [];          // [{titel, datei, fragen, fehler, hinweise}]
  var gewaehlt = null;      // aktuell gewähltes Thema
  var runde = null;         // laufendes Quiz
  var letzteRunde = null;   // für Auswertung / Wiederholen
  var aktuelleAnsicht = 'start';

  function $(id) { return document.getElementById(id); }

  /* ---------- Hilfsfunktionen ---------- */

  function mische(liste) {
    var a = liste.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Element mit Text erzeugen (nie innerHTML mit Daten aus der CSV)
  function el(tag, klasse, text) {
    var e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (text !== undefined && text !== null) e.textContent = text;
    return e;
  }

  function knopf(klasse, text) {
    var b = el('button', klasse, text);
    b.type = 'button';
    return b;
  }

  function leere(e) {
    while (e.firstChild) e.removeChild(e.firstChild);
  }

  function istTastatur(ev) {
    return ev && ev.detail === 0;
  }

  function mehrzahl(n, eins, viele) {
    return n + ' ' + (n === 1 ? eins : viele);
  }

  function zeige(name, verlauf) {
    ['start', 'einstellungen', 'quiz', 'ergebnis'].forEach(function (n) {
      $('ansicht-' + n).hidden = n !== name;
    });
    aktuelleAnsicht = name;
    if (verlauf === 'push') history.pushState({ ansicht: name }, '');
    else if (verlauf === 'replace') history.replaceState({ ansicht: name }, '');
    window.scrollTo(0, 0);
    var h = $('ansicht-' + name).querySelector('h2');
    if (h) h.focus({ preventScroll: true });
  }

  // Zurück-Taste / Wischgeste des Handys
  window.addEventListener('popstate', function (ev) {
    var ziel = (ev.state && ev.state.ansicht) || 'start';
    if (aktuelleAnsicht === 'quiz' && ziel !== 'quiz' && runde && runde.pos < runde.fragen.length) {
      if (!window.confirm('Quiz wirklich beenden? Ihr Fortschritt geht verloren.')) {
        history.pushState({ ansicht: 'quiz' }, '');
        return;
      }
      runde = null;
    }
    if (ziel === 'einstellungen' && !gewaehlt) ziel = 'start';
    if (ziel === 'quiz' && !runde) ziel = gewaehlt ? 'einstellungen' : 'start';
    if (ziel === 'ergebnis' && !letzteRunde) ziel = 'start';
    if (ziel === 'einstellungen') aktualisiereInfo();
    zeige(ziel);
  });

  /* ---------- Laden ---------- */

  function holeDatei(pfad) {
    return fetch(pfad, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) {
        throw new Error(r.status === 404
          ? 'Die Datei ' + pfad + ' wurde nicht gefunden. Bitte Dateinamen prüfen (auch Groß-/Kleinschreibung).'
          : 'Die Datei ' + pfad + ' konnte nicht geladen werden (Fehler ' + r.status + ').');
      }
      return r.arrayBuffer();
    }, function () {
      throw new Error('Die Datei ' + pfad + ' konnte nicht geladen werden. Bitte Internetverbindung prüfen.');
    });
  }

  function ladeThema(eintrag, nr) {
    var thema = { titel: '', datei: '', fragen: [], fehler: [], hinweise: [] };
    if (!eintrag || typeof eintrag !== 'object' ||
        typeof eintrag.titel !== 'string' || typeof eintrag.datei !== 'string' ||
        !eintrag.titel.trim() || !eintrag.datei.trim()) {
      thema.titel = 'Eintrag ' + nr + ' in themen.json';
      thema.fehler.push('Jeder Eintrag in themen.json braucht „titel“ und „datei“, z. B. ' +
        '{ "titel": "Käse", "datei": "kaese.csv" }.');
      return Promise.resolve(thema);
    }
    thema.titel = eintrag.titel.trim();
    thema.datei = eintrag.datei.trim();
    return holeDatei(DATEN + thema.datei).then(function (buffer) {
      var d = window.QuizDaten.dekodiere(buffer);
      var erg = window.QuizDaten.ladeFragen(d.text);
      thema.fragen = erg.fragen;
      thema.fehler = erg.fehler;
      thema.hinweise = (d.hinweis ? [d.hinweis] : []).concat(erg.hinweise);
      if (!thema.fragen.length && !thema.fehler.length) thema.fehler.push('Keine Fragen gefunden.');
      return thema;
    }, function (e) {
      thema.fehler.push(e.message);
      return thema;
    });
  }

  function zeigeStartFehler(titel, zeilen) {
    var box = el('div', 'meldung');
    box.setAttribute('role', 'alert');
    box.appendChild(el('h3', null, titel));
    zeilen.forEach(function (z) {
      var p = el('p');
      if (typeof z === 'string') p.textContent = z;
      else z.forEach(function (teil) { p.appendChild(teil); });
      box.appendChild(p);
    });
    $('start-meldung').appendChild(box);
    $('start-lade').hidden = true;
  }

  function starte() {
    history.replaceState({ ansicht: 'start' }, '');

    if (location.protocol === 'file:') {
      zeigeStartFehler('Das Quiz muss über einen Webserver geöffnet werden', [
        'Die Datei wurde direkt vom Computer geöffnet (file://). Browser erlauben dann das Laden der Fragen nicht.',
        [document.createTextNode('Starten Sie im Ordner des Quiz einen lokalen Server, z. B. mit '),
          el('code', null, 'python -m http.server 8000'),
          document.createTextNode(', und öffnen Sie dann '),
          el('code', null, 'http://localhost:8000'),
          document.createTextNode('. Details stehen in der README.')]
      ]);
      return;
    }

    holeDatei(DATEN + 'themen.json')
      .then(function (buffer) {
        var text = window.QuizDaten.dekodiere(buffer).text;
        var liste;
        try {
          liste = JSON.parse(text);
        } catch (e) {
          throw new Error('Die Datei daten/themen.json enthält einen Formatfehler (' + e.message + '). ' +
            'Häufige Ursachen: fehlendes Komma zwischen zwei Einträgen, Komma nach dem letzten Eintrag ' +
            'oder fehlende Anführungszeichen.');
        }
        if (!Array.isArray(liste) || !liste.length) {
          throw new Error('Die Datei daten/themen.json muss eine Liste von Themen enthalten, z. B. ' +
            '[ { "titel": "Fleisch & Rindfleisch", "datei": "fleisch-rindfleisch.csv" } ]');
        }
        return Promise.all(liste.map(function (e, i) { return ladeThema(e, i + 1); }));
      })
      .then(function (geladen) {
        themen = geladen;
        $('start-lade').hidden = true;
        zeigeThemen();
      })
      .catch(function (e) {
        zeigeStartFehler('Die Themen konnten nicht geladen werden', [e.message]);
      });
  }

  /* ---------- Startseite ---------- */

  function unterthemen(t) {
    var zaehler = {};
    var reihenfolge = [];
    t.fragen.forEach(function (f) {
      if (!zaehler[f.thema]) { zaehler[f.thema] = 0; reihenfolge.push(f.thema); }
      zaehler[f.thema]++;
    });
    return reihenfolge.map(function (n) { return { name: n, anzahl: zaehler[n] }; });
  }

  function zeigeThemen() {
    var liste = $('themen-liste');
    leere(liste);
    themen.forEach(function (t) {
      var karte = el('div', 'thema-karte');
      var b = knopf('thema-knopf');
      b.appendChild(el('span', 'thema-name', t.titel));
      var info = t.fragen.length
        ? mehrzahl(t.fragen.length, 'Frage', 'Fragen') + ' · ' +
          mehrzahl(unterthemen(t).length, 'Unterthema', 'Unterthemen')
        : 'Derzeit nicht verfügbar';
      b.appendChild(el('span', 'thema-anzahl', info));
      if (t.fragen.length) {
        b.appendChild(el('span', 'thema-los', 'Quiz starten ›'));
        b.addEventListener('click', function () { oeffneEinstellungen(t); });
      } else {
        b.disabled = true;
      }
      karte.appendChild(b);

      if (t.fehler.length || t.hinweise.length) {
        var det = el('details', t.fehler.length ? 'schwer' : '');
        if (!t.fragen.length) det.open = true;
        var teile = [];
        if (t.fragen.length && t.fehler.length) {
          teile.push(mehrzahl(t.fehler.length, 'Frage', 'Fragen') + ' übersprungen');
        } else if (t.fehler.length) {
          teile.push('Datei fehlerhaft');
        }
        if (t.hinweise.length) teile.push(mehrzahl(t.hinweise.length, 'Hinweis', 'Hinweise'));
        det.appendChild(el('summary', null, '⚠ Für die Lehrkraft: ' + teile.join(', ')));
        var ul = el('ul');
        t.fehler.forEach(function (f) { ul.appendChild(el('li', null, f)); });
        t.hinweise.forEach(function (h) { ul.appendChild(el('li', null, h)); });
        det.appendChild(ul);
        karte.appendChild(det);
      }
      liste.appendChild(karte);
    });
  }

  /* ---------- Einstellungen ---------- */

  function oeffneEinstellungen(t) {
    gewaehlt = t;
    $('einst-titel').textContent = 'Quiz: ' + t.titel;

    var sel = $('einst-unterthema');
    leere(sel);
    var alle = el('option', null, 'Alle Unterthemen (' + t.fragen.length + ')');
    alle.value = '';
    sel.appendChild(alle);
    unterthemen(t).forEach(function (u) {
      var o = el('option', null, u.name + ' (' + u.anzahl + ')');
      o.value = u.name;
      sel.appendChild(o);
    });
    sel.value = '';

    aktualisiereInfo();
    zeige('einstellungen', 'push');
  }

  function gefilterteFragen() {
    var filter = $('einst-unterthema').value;
    return gewaehlt.fragen.filter(function (f) { return !filter || f.thema === filter; });
  }

  function gewaehlteAnzahl(verfuegbar) {
    var r = document.querySelector('input[name="anzahl"]:checked');
    var wert = r ? r.value : '10';
    return wert === 'alle' ? verfuegbar : Math.min(parseInt(wert, 10), verfuegbar);
  }

  function aktualisiereInfo() {
    if (!gewaehlt) return;
    var n = gefilterteFragen().length;
    var anzahl = gewaehlteAnzahl(n);
    $('einst-info').textContent = anzahl === n
      ? 'Sie bekommen alle ' + n + ' Fragen in zufälliger Reihenfolge.'
      : 'Sie bekommen ' + anzahl + ' von ' + n + ' Fragen in zufälliger Reihenfolge.';
  }

  $('einst-unterthema').addEventListener('change', aktualisiereInfo);
  $('einst-anzahl').addEventListener('change', aktualisiereInfo);
  $('einst-zurueck').addEventListener('click', function () { zeige('start', 'push'); });
  $('einst-start').addEventListener('click', function () {
    var pool = mische(gefilterteFragen());
    starteRunde(pool.slice(0, gewaehlteAnzahl(pool.length)), 'push');
  });

  /* ---------- Quiz ---------- */

  /* Zuordnen, Reihenfolge und Lückentext funktionieren gleich:
     Es gibt „Felder“ (slots) mit je einer erwarteten Lösung und einen Vorrat an
     Antwort-Kärtchen (chips). Ein Kärtchen antippen = ins markierte Feld setzen. */
  function bereite(frage) {
    var v = { q: frage };
    var slots = null;
    var extra = [];
    if (frage.typ === 'MC') {
      v.optionen = mische([frage.richtig].concat(frage.falsche));
    } else if (frage.typ === 'ZU') {
      slots = frage.paare.map(function (p) { return p.rechts; });
    } else if (frage.typ === 'RH') {
      slots = frage.schritte.slice();
    } else if (frage.typ === 'LT') {
      slots = frage.luecken.slice();
      extra = frage.ablenker;
    }
    if (slots) {
      v.slots = slots;
      v.chips = mische(slots.concat(extra).map(function (text, i) { return { id: i, text: text }; }));
      v.zuordnung = slots.map(function () { return null; });
      v.aktiv = 0;
    }
    return v;
  }

  function starteRunde(fragen, verlauf) {
    runde = {
      thema: gewaehlt,
      fragen: mische(fragen).map(bereite),
      pos: 0,
      ergebnisse: []
    };
    zeige('quiz', verlauf);
    zeigeFrage();
  }

  function setzeFortschritt(erledigt) {
    var gesamt = runde.fragen.length;
    $('quiz-fortschritt').textContent = 'Frage ' + (runde.pos + 1) + ' von ' + gesamt;
    $('quiz-balken').style.width = Math.round(erledigt / gesamt * 100) + '%';
    var rahmen = $('quiz-balken-rahmen');
    rahmen.setAttribute('aria-valuemax', String(gesamt));
    rahmen.setAttribute('aria-valuenow', String(erledigt));
  }

  function zeigeFrage() {
    var v = runde.fragen[runde.pos];
    var f = v.q;
    setzeFortschritt(runde.pos);
    $('quiz-thema').textContent = f.thema + ' · ' + TYP_NAME[f.typ];
    $('quiz-frage').textContent = f.frage;
    $('quiz-rueckmeldung').hidden = true;
    $('quiz-weiter').hidden = true;

    var anleitung = {
      MC: 'Wählen Sie die richtige Antwort.',
      RF: 'Ist diese Aussage richtig oder falsch?',
      ZU: 'Tippen Sie unten auf die passende Antwort – sie kommt in das markierte Feld. ' +
        'Zum Ändern das Feld antippen.',
      RH: 'Tippen Sie die Schritte unten in der richtigen Reihenfolge an. Zum Ändern einen Schritt antippen.',
      LT: 'Tippen Sie unten auf das passende Wort – es kommt in die markierte Lücke. ' +
        'Zum Ändern die Lücke antippen.' + (f.typ === 'LT' && f.ablenker.length
          ? ' Achtung: Es gibt mehr Wörter als Lücken.' : '')
    };
    $('quiz-anleitung').textContent = anleitung[f.typ];

    var bereich = $('quiz-antworten');
    leere(bereich);
    if (f.typ === 'MC') zeigeMC(v, bereich);
    else if (f.typ === 'RF') zeigeRF(v, bereich);
    else zeigeTipp(v, bereich);

    window.scrollTo(0, 0);
    $('quiz-frage').focus({ preventScroll: true });
  }

  function antwortKnopf(zeichen, text) {
    var b = knopf('antwort');
    b.appendChild(el('span', 'zeichen', zeichen));
    b.appendChild(el('span', 'antwort-text', text));
    return b;
  }

  function markiere(b, richtig) {
    b.classList.add(richtig ? 'ist-richtig' : 'ist-falsch');
    b.querySelector('.zeichen').textContent = richtig ? '✓' : '✗';
  }

  function sperre(knoepfe, gewaehlterKnopf, richtigerKnopf) {
    knoepfe.forEach(function (k) {
      k.disabled = true;
      if (k === richtigerKnopf) markiere(k, true);
      else if (k === gewaehlterKnopf) markiere(k, false);
      else k.classList.add('gedimmt');
    });
  }

  function zeigeMC(v, bereich) {
    var box = el('div', 'antworten');
    var knoepfe = v.optionen.map(function (text, i) {
      var b = antwortKnopf(BUCHSTABEN[i], text);
      box.appendChild(b);
      return b;
    });
    var richtigerKnopf = knoepfe[v.optionen.indexOf(v.q.richtig)];
    knoepfe.forEach(function (b, i) {
      b.addEventListener('click', function () {
        var ok = v.optionen[i] === v.q.richtig;
        sperre(knoepfe, b, richtigerKnopf);
        beantwortet(ok, v.optionen[i], ok ? null : 'Richtige Antwort: ' + v.q.richtig);
      });
    });
    bereich.appendChild(box);
  }

  function zeigeRF(v, bereich) {
    var box = el('div', 'antworten rf');
    var bR = antwortKnopf('✓', 'Richtig');
    var bF = antwortKnopf('✗', 'Falsch');
    box.appendChild(bR);
    box.appendChild(bF);
    var richtigerKnopf = v.q.richtig ? bR : bF;
    [[bR, true], [bF, false]].forEach(function (paar) {
      paar[0].addEventListener('click', function () {
        var ok = paar[1] === v.q.richtig;
        sperre([bR, bF], paar[0], richtigerKnopf);
        beantwortet(ok, paar[1], 'Die Aussage ist ' + (v.q.richtig ? 'richtig.' : 'falsch.'));
      });
    });
    bereich.appendChild(box);
  }

  function chipText(v, id) {
    for (var i = 0; i < v.chips.length; i++) if (v.chips[i].id === id) return v.chips[i].text;
    return '';
  }

  // Ein Feld (Lücke, Zuordnung oder Reihenfolge-Platz) als Knopf
  function feldKnopf(v, i, bereich, klasse, beschriftung) {
    var belegt = v.zuordnung[i] !== null;
    var b = knopf('feld ' + klasse + (belegt ? ' belegt' : ' leer') + (v.aktiv === i ? ' aktiv' : ''));
    if (belegt) {
      b.textContent = chipText(v, v.zuordnung[i]);
      b.setAttribute('aria-label', beschriftung + ': ' + b.textContent + ' – antippen zum Ändern');
    } else {
      b.textContent = v.aktiv === i ? 'hier einsetzen …' : 'antippen';
      b.setAttribute('aria-label', beschriftung + ': noch leer' + (v.aktiv === i ? ', markiert' : ''));
    }
    b.addEventListener('click', function (ev) {
      v.zuordnung[i] = null;
      v.aktiv = i;
      zeigeTipp(v, bereich, istTastatur(ev) ? 'vorrat' : null);
    });
    return b;
  }

  function zeigeTipp(v, bereich, fokusZiel) {
    leere(bereich);
    var q = v.q;
    var fokusElement = null;

    if (q.typ === 'ZU') {
      var ul = el('ul', 'feld-liste');
      q.paare.forEach(function (p, i) {
        var li = el('li', 'feld-karte' + (v.aktiv === i ? ' aktiv' : ''));
        li.appendChild(el('div', 'feld-titel', p.links));
        li.appendChild(feldKnopf(v, i, bereich, 'zu-feld', p.links));
        ul.appendChild(li);
      });
      bereich.appendChild(ul);
    } else if (q.typ === 'RH') {
      var ol = el('ol', 'feld-liste rh');
      v.slots.forEach(function (s, i) {
        var li = el('li', 'feld-karte rh-karte' + (v.aktiv === i ? ' aktiv' : ''));
        li.appendChild(el('span', 'rh-nr', String(i + 1)));
        li.appendChild(feldKnopf(v, i, bereich, 'rh-feld', 'Schritt ' + (i + 1)));
        ol.appendChild(li);
      });
      bereich.appendChild(ol);
    } else {
      var p = el('p', 'lt-text');
      q.teile.forEach(function (t) {
        if (t.text !== undefined) p.appendChild(document.createTextNode(t.text));
        else p.appendChild(feldKnopf(v, t.luecke, bereich, 'luecke', 'Lücke ' + (t.luecke + 1)));
      });
      bereich.appendChild(p);
    }

    var vergeben = v.zuordnung.filter(function (x) { return x !== null; });
    var frei = v.chips.filter(function (c) { return vergeben.indexOf(c.id) < 0; });
    var alleBelegt = vergeben.length === v.slots.length;

    if (!alleBelegt) {
      bereich.appendChild(el('p', 'vorrat-titel',
        q.typ === 'LT' ? 'Wörter' : q.typ === 'RH' ? 'Schritte' : 'Antworten'));
      var vorrat = el('div', 'vorrat');
      frei.forEach(function (c, k) {
        var b = antwortKnopf('+', c.text);
        b.addEventListener('click', function (ev) {
          var ziel = v.aktiv;
          if (ziel === null || v.zuordnung[ziel] !== null) ziel = v.zuordnung.indexOf(null);
          v.zuordnung[ziel] = c.id;
          // nächstes freies Feld nach dem aktuellen markieren
          v.aktiv = null;
          for (var s = 1; s <= v.slots.length; s++) {
            var j = (ziel + s) % v.slots.length;
            if (v.zuordnung[j] === null) { v.aktiv = j; break; }
          }
          zeigeTipp(v, bereich, istTastatur(ev) ? 'vorrat' : null);
        });
        if (fokusZiel === 'vorrat' && k === 0) fokusElement = b;
        vorrat.appendChild(b);
      });
      bereich.appendChild(vorrat);
    }

    var pruefen = knopf('knopf haupt', 'Antwort prüfen');
    pruefen.id = 'tipp-pruefen';
    pruefen.disabled = !alleBelegt;
    pruefen.addEventListener('click', function () { pruefeTipp(v, bereich); });
    bereich.appendChild(pruefen);
    if (fokusZiel === 'vorrat' && alleBelegt) fokusElement = pruefen;

    if (fokusElement) fokusElement.focus({ preventScroll: true });
  }

  function pruefeTipp(v, bereich) {
    var q = v.q;
    var gegeben = v.zuordnung.map(function (id) { return chipText(v, id); });
    var ok = gegeben.map(function (g, i) { return g === v.slots[i]; });
    var anzahlRichtig = ok.filter(Boolean).length;

    leere(bereich);
    if (q.typ === 'LT') {
      var p = el('p', 'lt-text');
      q.teile.forEach(function (t) {
        if (t.text !== undefined) { p.appendChild(document.createTextNode(t.text)); return; }
        var i = t.luecke;
        var span = el('span', 'feld luecke ' + (ok[i] ? 'ist-richtig' : 'ist-falsch'));
        span.appendChild(el('span', 'zeichen', ok[i] ? '✓ ' : '✗ '));
        if (ok[i]) {
          span.appendChild(document.createTextNode(gegeben[i]));
        } else {
          span.appendChild(el('s', null, gegeben[i]));
          span.appendChild(document.createTextNode(' → '));
          span.appendChild(el('strong', null, v.slots[i]));
        }
        p.appendChild(span);
      });
      bereich.appendChild(p);
    } else {
      var liste = el(q.typ === 'RH' ? 'ol' : 'ul', 'feld-liste' + (q.typ === 'RH' ? ' rh' : ''));
      v.slots.forEach(function (soll, i) {
        var li = el('li', 'feld-karte ' + (q.typ === 'RH' ? 'rh-karte ' : '') + (ok[i] ? 'ist-richtig' : 'ist-falsch'));
        if (q.typ === 'RH') li.appendChild(el('span', 'rh-nr', String(i + 1)));
        else li.appendChild(el('div', 'feld-titel', q.paare[i].links));
        var feld = el('div', 'feld belegt');
        feld.appendChild(el('span', 'zeichen', ok[i] ? '✓' : '✗'));
        feld.appendChild(el('span', null, gegeben[i]));
        li.appendChild(feld);
        if (!ok[i]) li.appendChild(el('div', 'korrektur', 'Richtig: ' + soll));
        liste.appendChild(li);
      });
      bereich.appendChild(liste);
    }

    var alle = anzahlRichtig === v.slots.length;
    var einheit = q.typ === 'LT' ? ['Lücke', 'Lücken'] : q.typ === 'RH' ? ['Schritt', 'Schritten'] : ['Zuordnung', 'Zuordnungen'];
    beantwortet(alle, gegeben, anzahlRichtig + ' von ' + v.slots.length + ' ' + einheit[1] + ' richtig.' +
      (alle ? '' : ' Die richtige Lösung steht oben grün.'));
  }

  function beantwortet(ok, gegeben, erklaerung) {
    var v = runde.fragen[runde.pos];
    runde.ergebnisse.push({ q: v.q, korrekt: ok, gegeben: gegeben, slots: v.slots });
    setzeFortschritt(runde.pos + 1);

    var box = $('quiz-rueckmeldung');
    leere(box);
    box.className = 'rueckmeldung ' + (ok ? 'gut' : 'schlecht');
    box.appendChild(el('strong', null, ok ? '✓ Richtig!' : '✗ Leider falsch.'));
    if (erklaerung) box.appendChild(el('p', null, erklaerung));
    box.hidden = false;

    var weiter = $('quiz-weiter');
    weiter.textContent = runde.pos + 1 < runde.fragen.length ? 'Weiter' : 'Zur Auswertung';
    weiter.hidden = false;
    weiter.focus({ preventScroll: true });
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    weiter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  $('quiz-weiter').addEventListener('click', function () {
    runde.pos++;
    if (runde.pos < runde.fragen.length) zeigeFrage();
    else zeigeErgebnis();
  });

  $('quiz-beenden').addEventListener('click', function () {
    if (runde.ergebnisse.length &&
        !window.confirm('Quiz wirklich beenden? Ihr Fortschritt geht verloren.')) return;
    runde = null;
    aktualisiereInfo();
    zeige('einstellungen', 'replace');
  });

  /* ---------- Auswertung ---------- */

  function rfText(wert) { return wert ? 'richtig' : 'falsch'; }

  function zeile(klasse, text) { return el('p', klasse, text); }

  function falschEintrag(e, nr) {
    var q = e.q;
    var li = el('li', 'tabelle');
    li.appendChild(el('div', 'tabelle-kopf', 'Frage ' + nr + ' · ' + q.thema));
    var inhalt = el('div', 'tabelle-inhalt');
    inhalt.appendChild(zeile('falsch-frage', q.frage));

    if (q.typ === 'MC') {
      inhalt.appendChild(zeile('zeile-ihre', '✗ Ihre Antwort: ' + e.gegeben));
      inhalt.appendChild(zeile('zeile-richtig', '✓ Richtig: ' + q.richtig));
    } else if (q.typ === 'RF') {
      inhalt.appendChild(zeile('zeile-ihre', '✗ Ihre Antwort: ' + rfText(e.gegeben)));
      inhalt.appendChild(zeile('zeile-richtig', '✓ Die Aussage ist ' + rfText(q.richtig) + '.'));
    } else if (q.typ === 'LT') {
      var p = el('p', 'zeile-richtig lt-loesung');
      p.appendChild(document.createTextNode('✓ '));
      q.teile.forEach(function (t) {
        if (t.text !== undefined) p.appendChild(document.createTextNode(t.text));
        else p.appendChild(el('strong', null, q.luecken[t.luecke]));
      });
      inhalt.appendChild(p);
      var ul = el('ul');
      q.luecken.forEach(function (soll, i) {
        if (e.gegeben[i] !== soll) {
          ul.appendChild(el('li', 'paar-falsch', '✗ Lücke ' + (i + 1) + ': „' + e.gegeben[i] + '“ statt „' + soll + '“'));
        }
      });
      inhalt.appendChild(ul);
    } else {
      var liste = el(q.typ === 'RH' ? 'ol' : 'ul');
      e.slots.forEach(function (soll, i) {
        var links = q.typ === 'ZU' ? q.paare[i].links + ' = ' : '';
        if (e.gegeben[i] === soll) {
          liste.appendChild(el('li', null, '✓ ' + links + soll));
        } else {
          var item = el('li');
          item.appendChild(el('span', 'paar-falsch', '✗ ' + links + e.gegeben[i]));
          item.appendChild(document.createElement('br'));
          item.appendChild(el('span', 'paar-richtig', '✓ Richtig: ' + soll));
          liste.appendChild(item);
        }
      });
      inhalt.appendChild(liste);
    }
    li.appendChild(inhalt);
    return li;
  }

  function zeigeErgebnis() {
    letzteRunde = runde;
    var erg = runde.ergebnisse;
    runde = null;

    var richtig = erg.filter(function (e) { return e.korrekt; }).length;
    var anteil = richtig / erg.length * 100;
    var note = NOTEN.filter(function (n) { return anteil >= n.ab; })[0];
    $('erg-titel').textContent = 'Auswertung: ' + letzteRunde.thema.titel;
    $('erg-prozent').textContent = Math.round(anteil) + ' %';
    $('erg-anzahl').textContent = richtig + ' von ' + erg.length + ' Fragen richtig';
    $('erg-note').textContent = note.text;
    $('erg-text').textContent =
      richtig === erg.length ? 'Ausgezeichnet – alles richtig!'
        : anteil >= 91 ? 'Ausgezeichnet!'
          : anteil >= 81 ? 'Sehr gut gemacht!'
            : anteil >= 61 ? 'Gut – da geht noch mehr.'
              : 'Weiter üben – wiederholen Sie die falschen Fragen.';

    var falsch = erg.filter(function (e) { return !e.korrekt; });
    var liste = $('erg-falsch-liste');
    leere(liste);
    falsch.forEach(function (e, i) { liste.appendChild(falschEintrag(e, i + 1)); });

    $('erg-falsch-bereich').hidden = !falsch.length;
    $('erg-wiederholen').hidden = !falsch.length;
    $('erg-wiederholen').textContent = 'Falsche Fragen wiederholen (' + falsch.length + ')';
    zeige('ergebnis', 'replace');
  }

  $('erg-wiederholen').addEventListener('click', function () {
    var falsch = letzteRunde.ergebnisse
      .filter(function (e) { return !e.korrekt; })
      .map(function (e) { return e.q; });
    if (falsch.length) starteRunde(falsch, 'replace');
  });

  $('erg-neu').addEventListener('click', function () {
    zeige('start', 'push');
  });

  starte();
})();
