/*
 * Warenkunde-Quiz – Ablauf und Darstellung
 * Keine Speicherung: alles bleibt nur im Arbeitsspeicher des Browsers.
 */
(function () {
  'use strict';

  var DATEN = 'daten/';
  var BUCHSTABEN = ['A', 'B', 'C', 'D', 'E', 'F'];

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

  function leere(e) {
    while (e.firstChild) e.removeChild(e.firstChild);
  }

  function istTastatur(ev) {
    return ev && ev.detail === 0;
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

  function zeigeThemen() {
    var liste = $('themen-liste');
    leere(liste);
    themen.forEach(function (t) {
      var karte = el('div', 'thema-karte');
      var knopf = el('button', 'thema-knopf');
      knopf.type = 'button';
      var text = el('span');
      text.appendChild(el('span', 'thema-name', t.titel));
      text.appendChild(document.createElement('br'));
      text.appendChild(el('span', 'thema-anzahl',
        t.fragen.length ? t.fragen.length + ' Fragen' : 'Derzeit nicht verfügbar'));
      knopf.appendChild(text);
      if (t.fragen.length) {
        knopf.addEventListener('click', function () { oeffneEinstellungen(t); });
      } else {
        knopf.disabled = true;
      }
      karte.appendChild(knopf);

      if (t.fehler.length || t.hinweise.length) {
        var det = el('details', t.fehler.length ? 'schwer' : '');
        if (!t.fragen.length) det.open = true;
        var teile = [];
        if (t.fragen.length && t.fehler.length) {
          teile.push(t.fehler.length === 1 ? '1 Frage übersprungen' : t.fehler.length + ' Fragen übersprungen');
        } else if (t.fehler.length) {
          teile.push('Datei fehlerhaft');
        }
        if (t.hinweise.length) teile.push(t.hinweise.length === 1 ? '1 Hinweis' : t.hinweise.length + ' Hinweise');
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
    $('einst-titel').textContent = t.titel;

    var sel = $('einst-unterthema');
    leere(sel);
    var zaehler = {};
    var reihenfolge = [];
    t.fragen.forEach(function (f) {
      if (!zaehler[f.thema]) { zaehler[f.thema] = 0; reihenfolge.push(f.thema); }
      zaehler[f.thema]++;
    });
    var alle = el('option', null, 'Alle Unterthemen (' + t.fragen.length + ')');
    alle.value = '';
    sel.appendChild(alle);
    reihenfolge.forEach(function (name) {
      var o = el('option', null, name + ' (' + zaehler[name] + ')');
      o.value = name;
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

  function bereite(frage) {
    var v = { q: frage };
    if (frage.typ === 'MC') {
      v.optionen = mische([frage.richtig].concat(frage.falsche));
    } else if (frage.typ === 'ZU') {
      v.chips = mische(frage.paare.map(function (p, i) { return { id: i, text: p.rechts }; }));
      v.zuordnung = frage.paare.map(function () { return null; });
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
    $('quiz-thema').textContent = f.thema;
    $('quiz-typ').textContent = f.typ === 'MC' ? 'Wählen Sie die richtige Antwort.'
      : f.typ === 'RF' ? 'Richtig oder falsch?'
        : 'Ordnen Sie richtig zu.';
    $('quiz-frage').textContent = f.frage;
    $('quiz-rueckmeldung').hidden = true;
    $('quiz-weiter').hidden = true;

    var bereich = $('quiz-antworten');
    leere(bereich);
    if (f.typ === 'MC') zeigeMC(v, bereich);
    else if (f.typ === 'RF') zeigeRF(v, bereich);
    else zeigeZU(v, bereich);

    window.scrollTo(0, 0);
    $('quiz-frage').focus({ preventScroll: true });
  }

  function antwortKnopf(zeichen, text) {
    var b = el('button', 'antwort');
    b.type = 'button';
    b.appendChild(el('span', 'zeichen', zeichen));
    b.appendChild(el('span', 'antwort-text', text));
    return b;
  }

  function markiere(knopf, richtig) {
    knopf.classList.add(richtig ? 'ist-richtig' : 'ist-falsch');
    knopf.querySelector('.zeichen').textContent = richtig ? '✓' : '✗';
  }

  function sperre(knoepfe, gewaehlt, richtigerKnopf) {
    knoepfe.forEach(function (k) {
      k.disabled = true;
      if (k === richtigerKnopf) markiere(k, true);
      else if (k === gewaehlt) markiere(k, false);
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
    var bR = antwortKnopf('', 'Richtig');
    var bF = antwortKnopf('', 'Falsch');
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

  function zeigeZU(v, bereich, fokusZiel) {
    leere(bereich);
    var paare = v.q.paare;
    var chipVon = function (id) {
      for (var i = 0; i < v.chips.length; i++) if (v.chips[i].id === id) return v.chips[i];
      return null;
    };

    bereich.appendChild(el('p', 'zu-hilfe',
      'Tippen Sie unten auf eine Antwort – sie wird dem markierten Begriff zugeordnet. ' +
      'Zum Ändern tippen Sie auf die Zuordnung.'));

    var liste = el('ul', 'zu-liste');
    var fokusElement = null;
    paare.forEach(function (p, i) {
      var li = el('li', 'zu-karte' + (v.aktiv === i ? ' aktiv' : ''));
      li.appendChild(el('div', 'zu-links', p.links));
      var belegt = v.zuordnung[i] !== null;
      var feld = el('button', 'zu-feld' + (belegt ? '' : ' leer'));
      feld.type = 'button';
      if (belegt) {
        feld.appendChild(el('span', 'zeichen', '→'));
        feld.appendChild(el('span', null, chipVon(v.zuordnung[i]).text));
        feld.setAttribute('aria-label', p.links + ': ' + chipVon(v.zuordnung[i]).text + ' – antippen zum Ändern');
      } else {
        feld.textContent = v.aktiv === i ? 'Jetzt unten eine Antwort antippen …' : 'Antippen zum Auswählen';
        feld.setAttribute('aria-label', p.links + ': noch nicht zugeordnet');
      }
      feld.addEventListener('click', function (ev) {
        v.zuordnung[i] = null;
        v.aktiv = i;
        zeigeZU(v, bereich, istTastatur(ev) ? 'pool' : null);
      });
      li.appendChild(feld);
      liste.appendChild(li);
    });
    bereich.appendChild(liste);

    var vergeben = v.zuordnung.filter(function (x) { return x !== null; });
    var frei = v.chips.filter(function (c) { return vergeben.indexOf(c.id) < 0; });

    if (frei.length) {
      bereich.appendChild(el('p', 'zu-pool-titel', 'Antworten zum Zuordnen'));
      var pool = el('div', 'zu-pool');
      frei.forEach(function (c, k) {
        var b = antwortKnopf('+', c.text);
        b.addEventListener('click', function (ev) {
          var ziel = v.aktiv;
          if (ziel === null || v.zuordnung[ziel] !== null) ziel = v.zuordnung.indexOf(null);
          v.zuordnung[ziel] = c.id;
          // nächstes freies Feld nach dem aktuellen markieren
          v.aktiv = null;
          for (var s = 1; s <= paare.length; s++) {
            var j = (ziel + s) % paare.length;
            if (v.zuordnung[j] === null) { v.aktiv = j; break; }
          }
          zeigeZU(v, bereich, istTastatur(ev) ? 'pool' : null);
        });
        if (fokusZiel === 'pool' && k === 0) fokusElement = b;
        pool.appendChild(b);
      });
      bereich.appendChild(pool);
    }

    var pruefen = el('button', 'knopf haupt', 'Zuordnung prüfen');
    pruefen.type = 'button';
    pruefen.id = 'zu-pruefen';
    pruefen.disabled = frei.length > 0;
    pruefen.addEventListener('click', function () { pruefeZU(v, bereich); });
    bereich.appendChild(pruefen);
    if (fokusZiel === 'pool' && !frei.length) fokusElement = pruefen;

    if (fokusElement) fokusElement.focus({ preventScroll: true });
  }

  function pruefeZU(v, bereich) {
    var paare = v.q.paare;
    var gegeben = v.zuordnung.map(function (id) {
      for (var i = 0; i < v.chips.length; i++) if (v.chips[i].id === id) return v.chips[i].text;
      return '';
    });
    var anzahlRichtig = 0;

    leere(bereich);
    var liste = el('ul', 'zu-liste');
    paare.forEach(function (p, i) {
      var ok = gegeben[i] === p.rechts;
      if (ok) anzahlRichtig++;
      var li = el('li', 'zu-karte ' + (ok ? 'ist-richtig' : 'ist-falsch'));
      li.appendChild(el('div', 'zu-links', p.links));
      var feld = el('div', 'zu-feld');
      feld.appendChild(el('span', 'zeichen', ok ? '✓' : '✗'));
      feld.appendChild(el('span', null, gegeben[i]));
      li.appendChild(feld);
      if (!ok) li.appendChild(el('div', 'zu-korrektur', 'Richtig: ' + p.rechts));
      liste.appendChild(li);
    });
    bereich.appendChild(liste);

    var alle = anzahlRichtig === paare.length;
    beantwortet(alle, gegeben, anzahlRichtig + ' von ' + paare.length + ' Zuordnungen richtig.' +
      (alle ? '' : ' Die richtigen Lösungen sind oben grün angegeben.'));
  }

  function beantwortet(ok, gegeben, erklaerung) {
    var v = runde.fragen[runde.pos];
    runde.ergebnisse.push({ q: v.q, korrekt: ok, gegeben: gegeben });
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

  function zeigeErgebnis() {
    letzteRunde = runde;
    var erg = runde.ergebnisse;
    runde = null;

    var richtig = erg.filter(function (e) { return e.korrekt; }).length;
    var prozent = Math.round(richtig / erg.length * 100);
    $('erg-prozent').textContent = prozent + ' %';
    $('erg-anzahl').textContent = richtig + ' von ' + erg.length + ' Fragen richtig';
    $('erg-text').textContent =
      prozent === 100 ? 'Ausgezeichnet – alles richtig!'
        : prozent >= 90 ? 'Ausgezeichnet!'
          : prozent >= 75 ? 'Sehr gut!'
            : prozent >= 50 ? 'Gut – da geht noch mehr.'
              : 'Weiter üben – wiederholen Sie die falschen Fragen.';

    var falsch = erg.filter(function (e) { return !e.korrekt; });
    var liste = $('erg-falsch-liste');
    leere(liste);
    falsch.forEach(function (e) {
      var li = el('li');
      li.appendChild(el('p', 'falsch-frage', e.q.frage));
      if (e.q.typ === 'MC') {
        li.appendChild(el('p', 'zeile-ihre', '✗ Ihre Antwort: ' + e.gegeben));
        li.appendChild(el('p', 'zeile-richtig', '✓ Richtig: ' + e.q.richtig));
      } else if (e.q.typ === 'RF') {
        li.appendChild(el('p', 'zeile-ihre', '✗ Ihre Antwort: ' + rfText(e.gegeben)));
        li.appendChild(el('p', 'zeile-richtig', '✓ Die Aussage ist ' + rfText(e.q.richtig) + '.'));
      } else {
        var ul = el('ul');
        e.q.paare.forEach(function (p, i) {
          if (e.gegeben[i] === p.rechts) {
            ul.appendChild(el('li', null, '✓ ' + p.links + ' = ' + p.rechts));
          } else {
            var item = el('li');
            item.appendChild(el('span', 'paar-falsch', '✗ ' + p.links + ' = ' + e.gegeben[i]));
            item.appendChild(document.createElement('br'));
            item.appendChild(el('span', 'paar-richtig', '✓ Richtig: ' + p.rechts));
            ul.appendChild(item);
          }
        });
        li.appendChild(ul);
      }
      liste.appendChild(li);
    });

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
