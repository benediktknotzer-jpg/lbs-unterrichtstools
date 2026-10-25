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
    MM: 'Mehrfachauswahl',
    RF: 'Richtig oder falsch',
    ZU: 'Zuordnen',
    RH: 'Reihenfolge',
    LT: 'Lückentext',
    OF: 'Karteikarte',
    OA: 'Offene Antwort'
  };

  // Klassenmodus: so viele Sekunden haben die Teams je Frage
  var KLASSE_SEKUNDEN = 30;

  // Notenschlüssel der LBS Theresienfeld wie bei den Schularbeiten (100 Punkte = 100 %):
  // 100–91 Sehr gut · 90–81 Gut · 80–61 Befriedigend · 60–51 Genügend · 50–0 Nicht genügend
  var NOTEN = [
    { ab: 91, bis: 100, text: 'Sehr gut (1)' },
    { ab: 81, bis: 90, text: 'Gut (2)' },
    { ab: 61, bis: 80, text: 'Befriedigend (3)' },
    { ab: 51, bis: 60, text: 'Genügend (4)' },
    { ab: 0, bis: 50, text: 'Nicht genügend (5)' }
  ];

  // Prozent wird abgerundet, nie aufgerundet: 90,9 % zählt wie 90 Punkte, also „Gut“.
  // So passen angezeigte Zahl und Note immer zusammen.
  function bewerte(richtig, gesamt) {
    var prozent = Math.floor(richtig / gesamt * 100 + 1e-9);
    var note = NOTEN.filter(function (n) { return prozent >= n.ab; })[0];
    return { prozent: prozent, note: note };
  }

  var themen = [];          // [{titel, datei, fragen, fehler, hinweise}]
  var gewaehlt = null;      // aktuell gewähltes Thema
  var runde = null;         // laufendes Quiz
  var letzteRunde = null;   // für Auswertung / Wiederholen
  var aktuelleAnsicht = 'start';
  var uhr = null;           // Countdown im Klassenmodus

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

  // Welche Fragen eine Art verwendet: Quiz ohne Karteikarten, Karteikarten nur OF,
  // Klassenquiz nur Fragen, die sich mit A-B-C-D-Karten beantworten lassen
  function poolFuer(fragen, art) {
    return fragen.filter(function (f) {
      if (art === 'karten') return f.typ === 'OF';
      if (art === 'klasse') return f.typ === 'MC' || f.typ === 'RF';
      return f.typ !== 'OF';
    });
  }

  function heute() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function stoppeUhr() {
    if (uhr) { clearInterval(uhr); uhr = null; }
  }

  function starteUhr(sekunden, fertig) {
    stoppeUhr();
    var rest = sekunden;
    var anzeige = $('quiz-uhr');
    anzeige.classList.remove('abgelaufen');
    anzeige.textContent = rest + ' s';
    uhr = setInterval(function () {
      rest--;
      if (rest > 0) { anzeige.textContent = rest + ' s'; return; }
      stoppeUhr();
      anzeige.textContent = 'Zeit!';
      anzeige.classList.add('abgelaufen');
      fertig();
    }, 1000);
  }

  function zeige(name, verlauf) {
    ['start', 'einstellungen', 'quiz', 'ergebnis'].forEach(function (n) {
      $('ansicht-' + n).hidden = n !== name;
    });
    if (name !== 'quiz') stoppeUhr();
    // Große Schrift fürs Smartboard nur während des Klassenquiz
    document.body.classList.toggle('klassenmodus', name === 'quiz' && !!runde && runde.art === 'klasse');
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
    // Mischung aus anderen Themen: wird erst nach dem Laden aller Themen zusammengestellt
    if (eintrag && typeof eintrag === 'object' && Array.isArray(eintrag.mix) &&
        typeof eintrag.titel === 'string' && eintrag.titel.trim()) {
      thema.titel = eintrag.titel.trim();
      thema.mix = eintrag.mix;
      return Promise.resolve(thema);
    }
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

  // Fragen der genannten Themen übernehmen; Unterthema ist dann das ursprüngliche Thema
  function stelleMischungZusammen(mischung, alle) {
    mischung.mix.forEach(function (datei) {
      var quelle = alle.filter(function (t) { return t.datei === datei; })[0];
      if (!quelle) {
        mischung.fehler.push('Das Thema „' + datei + '“ aus „mix“ steht nicht in themen.json.');
        return;
      }
      quelle.fragen.forEach(function (f) {
        var kopie = {};
        for (var k in f) if (Object.prototype.hasOwnProperty.call(f, k)) kopie[k] = f[k];
        kopie.thema = quelle.titel;
        mischung.fragen.push(kopie);
      });
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

    var zugaenge = null;
    ladeZugaenge()
      .then(function (z) {
        zugaenge = z;
        return holeDatei(DATEN + 'themen.json');
      })
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
        return Promise.all(liste.map(function (e, i) {
          return ladeThema(e, i + 1).then(function (t) {
            t.klassen = (e && Array.isArray(e.klassen)) ? e.klassen.map(String) : [];
            return t;
          });
        }));
      })
      .then(function (geladen) {
        geladen.forEach(function (t) { if (t.mix) stelleMischungZusammen(t, geladen); });
        $('start-lade').hidden = true;

        var zugang = bestimmeZugang(zugaenge);
        if (zugang.sperre !== undefined) {
          zeigeCodeFeld(zugang.sperre);
          return;
        }
        if (zugang.name) $('kopf-fach').textContent = 'Fachpraktikum · ' + zugang.name;
        themen = geladen.filter(function (t) {
          if (zugang.alle) return true;
          return t.klassen.indexOf(zugang.klasse) >= 0 && (!zugang.themen || zugang.themen.indexOf(t.titel) >= 0);
        });
        ergaenzeGesamtMischung();
        zeigeThemen();
      })
      .catch(function (e) {
        zeigeStartFehler('Die Themen konnten nicht geladen werden', [e.message]);
      });
  }

  /* ---------- Klassen-Codes (daten/zugaenge.json) ---------- */

  // Fehlt die Datei, sieht man wie bisher alle Themen
  function ladeZugaenge() {
    return fetch(DATEN + 'zugaenge.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  /* Ergebnis: { alle: true } · { klasse, themen, name } · { sperre: Meldung oder null } (Code nötig) */
  function bestimmeZugang(z) {
    if (!z || typeof z !== 'object') return { alle: true };
    var code = (new URLSearchParams(location.search).get('code') || '').trim().toUpperCase();
    if (code) {
      var zug = (z.zugaenge || []).filter(function (x) {
        return String(x.code || '').toUpperCase() === code;
      })[0];
      if (!zug) return { sperre: 'Den Klassen-Code „' + code + '“ gibt es nicht. Bitte prüfen Sie die Schreibweise.' };
      if (zug.aktiv !== true) return { sperre: 'Dieser Zugang ist derzeit nicht freigegeben.' };
      return { klasse: String(zug.klasse), themen: zug.themen || null, name: zug.name || '' };
    }
    var oc = z.ohneCode;
    if (oc && oc.klasse && (!oc.bis || heute() <= oc.bis)) {
      return { klasse: String(oc.klasse), themen: oc.themen || null };
    }
    return { sperre: null };
  }

  function zeigeCodeFeld(meldung) {
    var form = $('start-code');
    form.hidden = false;
    $('code-meldung').hidden = !meldung;
    $('code-meldung').textContent = meldung || '';
    $('code-eingabe').focus({ preventScroll: true });
  }

  $('start-code').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var code = $('code-eingabe').value.trim().toUpperCase();
    if (code) location.search = '?code=' + encodeURIComponent(code);
  });

  // Einstieg: alle Themen der Klasse gemischt (z. B. 5 Fragen zum Stundenbeginn)
  function ergaenzeGesamtMischung() {
    var quellen = themen.filter(function (t) { return !t.mix && t.fragen.length; });
    if (quellen.length < 2) return;
    var mischung = { titel: 'Alle Themen gemischt', mix: quellen.map(function (t) { return t.datei; }),
      fragen: [], fehler: [], hinweise: [], klassen: [], gesamt: true };
    stelleMischungZusammen(mischung, quellen);
    themen.unshift(mischung);
  }

  /* ---------- Startseite ---------- */

  function unterthemen(fragen) {
    var zaehler = {};
    var reihenfolge = [];
    fragen.forEach(function (f) {
      if (!zaehler[f.thema]) { zaehler[f.thema] = 0; reihenfolge.push(f.thema); }
      zaehler[f.thema]++;
    });
    return reihenfolge.map(function (n) { return { name: n, anzahl: zaehler[n] }; });
  }

  function zeigeThemen() {
    var liste = $('themen-liste');
    leere(liste);
    themen.forEach(function (t) {
      var karte = el('div', 'thema-karte' + (t.mix ? ' mischung' : '') + (t.gesamt ? ' gesamt' : ''));
      var b = knopf('thema-knopf');
      b.appendChild(el('span', 'thema-name', t.titel));
      var quiz = poolFuer(t.fragen, 'ueben');
      var karten = poolFuer(t.fragen, 'karten');
      var teile = [];
      if (quiz.length) {
        teile.push(mehrzahl(quiz.length, 'Frage', 'Fragen'));
        teile.push(t.mix ? mehrzahl(unterthemen(quiz).length, 'Thema', 'Themen') + ' gemischt'
          : mehrzahl(unterthemen(quiz).length, 'Unterthema', 'Unterthemen'));
      }
      if (karten.length) teile.push(mehrzahl(karten.length, 'Karteikarte', 'Karteikarten'));
      var info = t.fragen.length ? teile.join(' · ') : 'Derzeit nicht verfügbar';
      if (t.gesamt && t.fragen.length) info += ' · ideal als Einstieg mit 5 Fragen';
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

  function gewaehlteArt() {
    var r = document.querySelector('input[name="modus"]:checked');
    return r ? r.value : 'ueben';
  }

  function setzeArt(art) {
    document.querySelector('input[name="modus"][value="' + art + '"]').checked = true;
  }

  function fuelleUnterthemen() {
    var t = gewaehlt;
    var pool = poolFuer(t.fragen, gewaehlteArt());
    var sel = $('einst-unterthema');
    var vorher = sel.value;
    leere(sel);
    var alle = el('option', null, (t.mix ? 'Alle Themen (' : 'Alle Unterthemen (') + pool.length + ')');
    alle.value = '';
    sel.appendChild(alle);
    var namen = [];
    unterthemen(pool).forEach(function (u) {
      var o = el('option', null, u.name + ' (' + u.anzahl + ')');
      o.value = u.name;
      sel.appendChild(o);
      namen.push(u.name);
    });
    sel.value = namen.indexOf(vorher) >= 0 ? vorher : '';
  }

  function oeffneEinstellungen(t) {
    gewaehlt = t;
    $('einst-titel').textContent = 'Quiz: ' + t.titel;

    // Karteikarten und Klassenquiz nur anbieten, wenn das Thema passende Fragen hat
    var hatQuiz = poolFuer(t.fragen, 'ueben').length > 0;
    $('modus-karten').hidden = !poolFuer(t.fragen, 'karten').length;
    $('modus-klasse').hidden = !poolFuer(t.fragen, 'klasse').length;
    $('einst-modus').closest('fieldset').hidden = $('modus-karten').hidden && $('modus-klasse').hidden;
    $('einst-modus').querySelector('input[value="ueben"]').closest('label').hidden = !hatQuiz;
    setzeArt(hatQuiz ? 'ueben' : 'karten');

    $('einst-unterthema').value = '';
    fuelleUnterthemen();
    aktualisiereInfo();
    zeige('einstellungen', 'push');
  }

  function gefilterteFragen() {
    var filter = $('einst-unterthema').value;
    return poolFuer(gewaehlt.fragen, gewaehlteArt())
      .filter(function (f) { return !filter || f.thema === filter; });
  }

  function gewaehlteAnzahl(verfuegbar) {
    var r = document.querySelector('input[name="anzahl"]:checked');
    var wert = r ? r.value : '10';
    return wert === 'alle' ? verfuegbar : Math.min(parseInt(wert, 10), verfuegbar);
  }

  function aktualisiereInfo() {
    if (!gewaehlt) return;
    var art = gewaehlteArt();
    var n = gefilterteFragen().length;
    var anzahl = gewaehlteAnzahl(n);
    var wort = art === 'karten' ? ['Karteikarte', 'Karteikarten'] : ['Frage', 'Fragen'];
    var text = anzahl === n
      ? 'Sie bekommen ' + (n === 1 ? '' : 'alle ') + mehrzahl(n, wort[0], wort[1]) + ' in zufälliger Reihenfolge.'
      : 'Sie bekommen ' + anzahl + ' von ' + mehrzahl(n, wort[0], wort[1]) + ' in zufälliger Reihenfolge.';
    if (art === 'karten') {
      text += ' Überlegen Sie die Antwort selbst, dann decken Sie die Musterantwort auf – wie beim Fragenkatalog.';
    } else if (art === 'klasse') {
      text += ' Für das Smartboard: nur Multiple Choice und Richtig/Falsch, ' + KLASSE_SEKUNDEN +
        ' Sekunden je Frage, zwei Teams mit A-B-C-D-Karten.';
    }
    $('einst-info').textContent = text;
    $('einst-start').textContent = art === 'karten' ? 'Karteikarten starten'
      : art === 'klasse' ? 'Klassenquiz starten' : 'Quiz starten';
    $('einst-start').disabled = !n;
  }

  $('einst-modus').addEventListener('change', function () { fuelleUnterthemen(); aktualisiereInfo(); });
  $('einst-unterthema').addEventListener('change', aktualisiereInfo);
  $('einst-anzahl').addEventListener('change', aktualisiereInfo);
  $('einst-zurueck').addEventListener('click', function () { zeige('start', 'push'); });
  $('einst-start').addEventListener('click', function () {
    var pool = mische(gefilterteFragen());
    starteRunde(pool.slice(0, gewaehlteAnzahl(pool.length)), 'push', gewaehlteArt());
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
    } else if (frage.typ === 'MM') {
      v.optionen = mische(frage.richtige.concat(frage.falsche));
      v.auswahl = v.optionen.map(function () { return false; });
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

  // art: 'ueben' (Quiz am Handy), 'karten' (Karteikarten) oder 'klasse' (Klassenquiz am Smartboard)
  function starteRunde(fragen, verlauf, art) {
    runde = {
      thema: gewaehlt,
      art: art || 'ueben',
      fragen: mische(fragen).map(bereite),
      anzahl: fragen.length,
      pos: 0,
      ergebnisse: [],
      punkte: { 1: 0, 2: 0 }
    };
    $('quiz-klasse-leiste').hidden = runde.art !== 'klasse';
    $('ansicht-quiz').classList.toggle('karten-modus', runde.art === 'karten');
    zeigeStand();
    zeige('quiz', verlauf);
    zeigeFrage();
  }

  function zeigeStand() {
    $('quiz-stand').textContent = 'Team 1: ' + runde.punkte[1] + ' · Team 2: ' + runde.punkte[2];
  }

  function naechsteFrage() {
    runde.pos++;
    if (runde.pos < runde.fragen.length) zeigeFrage();
    else zeigeErgebnis();
  }

  function setzeFortschritt(erledigt) {
    var gesamt = runde.fragen.length;
    if (runde.art === 'karten') {
      // Bei Karteikarten wächst der Stapel mit jedem „Nochmal“ – gezählt werden die gewussten Karten
      gesamt = runde.anzahl;
      erledigt = runde.ergebnisse.length;
      $('quiz-fortschritt').textContent = 'Gewusst: ' + erledigt + ' von ' + gesamt;
    } else {
      $('quiz-fortschritt').textContent = 'Frage ' + (runde.pos + 1) + ' von ' + gesamt;
    }
    $('quiz-balken').style.width = Math.round(erledigt / gesamt * 100) + '%';
    var rahmen = $('quiz-balken-rahmen');
    rahmen.setAttribute('aria-valuemax', String(gesamt));
    rahmen.setAttribute('aria-valuenow', String(erledigt));
  }

  function zeigeFrage() {
    var v = runde.fragen[runde.pos];
    var f = v.q;
    setzeFortschritt(runde.pos);
    stoppeUhr();
    $('quiz-thema').textContent = f.thema + ' · ' + TYP_NAME[f.typ];
    $('quiz-frage').textContent = f.frage;
    $('quiz-rueckmeldung').hidden = true;
    $('quiz-weiter').hidden = true;
    $('quiz-aktionen').hidden = true;

    if (runde.art === 'karten' || runde.art === 'klasse') {
      $('quiz-anleitung').textContent = runde.art === 'karten'
        ? 'Überlegen Sie die Antwort – laut, im Kopf oder auf einem Zettel. Dann drehen Sie die Karte um.'
        : f.typ === 'RF'
          ? 'Richtig oder falsch? Jedes Team hält seine Karte hoch: A = richtig, B = falsch.'
          : 'Jedes Team hält seine Karte hoch: A, B, C oder D.';
      var feld = $('quiz-antworten');
      leere(feld);
      if (runde.art === 'karten') zeigeKarte(v, feld);
      else zeigeKlasse(v, feld);
      window.scrollTo(0, 0);
      $('quiz-frage').focus({ preventScroll: true });
      return;
    }

    var anleitung = {
      MC: 'Wählen Sie die richtige Antwort.',
      MM: 'Achtung: Hier können mehrere Antworten richtig sein. Wählen Sie alle richtigen aus und ' +
        'tippen Sie dann auf „Antwort prüfen“.',
      RF: 'Ist diese Aussage richtig oder falsch?',
      ZU: 'Tippen Sie unten auf die passende Antwort – sie kommt in das markierte Feld. ' +
        'Zum Ändern das Feld antippen.',
      RH: 'Tippen Sie die Schritte unten in der richtigen Reihenfolge an. Zum Ändern einen Schritt antippen.',
      LT: 'Tippen Sie unten auf das passende Wort – es kommt in die markierte Lücke. ' +
        'Zum Ändern die Lücke antippen.' + (f.typ === 'LT' && f.ablenker.length
          ? ' Achtung: Es gibt mehr Wörter als Lücken.' : ''),
      OA: 'Schreiben Sie Ihre Antwort in das Feld. Das Quiz sucht die Fachbegriffe – ' +
        'Groß- und Kleinschreibung und kleine Tippfehler sind egal.'
    };
    $('quiz-anleitung').textContent = anleitung[f.typ];

    var bereich = $('quiz-antworten');
    leere(bereich);
    if (f.typ === 'MC') zeigeMC(v, bereich);
    else if (f.typ === 'MM') zeigeMM(v, bereich);
    else if (f.typ === 'RF') zeigeRF(v, bereich);
    else if (f.typ === 'OA') zeigeOA(v, bereich);
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

  function zeigeMM(v, bereich) {
    var box = el('div', 'antworten mm');
    var pruefen = knopf('knopf haupt', 'Antwort prüfen');
    pruefen.id = 'mm-pruefen';
    pruefen.disabled = true;
    var knoepfe = v.optionen.map(function (text, i) {
      var b = antwortKnopf(BUCHSTABEN[i], text);
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        v.auswahl[i] = !v.auswahl[i];
        b.classList.toggle('gewaehlt', v.auswahl[i]);
        b.setAttribute('aria-pressed', String(v.auswahl[i]));
        b.querySelector('.zeichen').textContent = v.auswahl[i] ? '✓' : BUCHSTABEN[i];
        pruefen.disabled = v.auswahl.indexOf(true) < 0;
      });
      box.appendChild(b);
      return b;
    });
    pruefen.addEventListener('click', function () {
      var gegeben = [];
      var ok = true;
      knoepfe.forEach(function (b, i) {
        var soll = v.q.richtige.indexOf(v.optionen[i]) >= 0;
        b.disabled = true;
        b.classList.remove('gewaehlt');
        b.removeAttribute('aria-pressed');
        if (v.auswahl[i]) gegeben.push(v.optionen[i]);
        if (soll && v.auswahl[i]) {
          markiere(b, true);
        } else if (soll) {
          ok = false;
          markiere(b, true);
          b.classList.add('fehlend');
          b.querySelector('.antwort-text').appendChild(el('span', 'fehlend-hinweis', ' – übersehen'));
        } else if (v.auswahl[i]) {
          ok = false;
          markiere(b, false);
        } else {
          b.classList.add('gedimmt');
        }
      });
      pruefen.remove();
      beantwortet(ok, gegeben, ok ? null : 'Richtig ' + (v.q.richtige.length === 1 ? 'ist: ' : 'sind: ') +
        v.q.richtige.join(' · '));
    });
    bereich.appendChild(box);
    bereich.appendChild(pruefen);
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
        // Mit Erklärung („Falsch: …“) steht nur die Erklärung da, sonst der kurze Satz
        beantwortet(ok, paar[1], v.q.erklaerung ? null : 'Die Aussage ist ' + (v.q.richtig ? 'richtig.' : 'falsch.'));
      });
    });
    bereich.appendChild(box);
  }

  /* Offene Antwort: frei tippen, das Quiz sucht die Schlüsselbegriffe (js/oa.js).
     Richtig ist die Frage, wenn genug Begriffe gefunden wurden. */
  function begriffNamen(q, indizes) {
    return indizes.map(function (i) { return window.QuizOA.name(q.begriffe[i]); });
  }

  function zeigeOA(v, bereich) {
    var q = v.q;
    var feld = el('textarea', 'oa-eingabe');
    feld.id = 'oa-eingabe';
    feld.rows = 4;
    feld.setAttribute('aria-labelledby', 'quiz-frage');
    feld.setAttribute('autocomplete', 'off');
    feld.setAttribute('autocapitalize', 'sentences');
    feld.placeholder = 'Ihre Antwort …';
    bereich.appendChild(feld);
    if (q.mindestens < q.begriffe.length) {
      bereich.appendChild(el('p', 'oa-hinweis', 'Es genügen ' + q.mindestens + ' von ' + q.begriffe.length +
        ' möglichen Begriffen.'));
    }

    var pruefen = knopf('knopf haupt', 'Antwort prüfen');
    pruefen.id = 'oa-pruefen';
    pruefen.disabled = true;
    feld.addEventListener('input', function () { pruefen.disabled = !feld.value.trim(); });
    // Strg+Eingabe prüft, eine normale Eingabe macht nur eine neue Zeile
    feld.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey) && !pruefen.disabled) pruefen.click();
    });
    pruefen.addEventListener('click', function () {
      var text = feld.value.trim();
      var erg = window.QuizOA.pruefe(q.begriffe, q.mindestens, text);
      feld.readOnly = true;
      pruefen.remove();

      var liste = el('ul', 'oa-begriffe');
      // Reicht die Antwort schon, sind die übrigen Begriffe kein Fehler, sondern weitere Möglichkeiten
      q.begriffe.forEach(function (b, i) {
        var da = erg.gefunden.indexOf(i) >= 0;
        var li = el('li', da ? 'ist-richtig' : erg.ok ? 'auch-moeglich' : 'ist-falsch');
        li.appendChild(el('span', 'zeichen', da ? '✓' : erg.ok ? '+' : '✗'));
        li.appendChild(el('span', null, window.QuizOA.name(b) + (da ? '' : erg.ok ? ' – auch möglich' : ' – fehlt')));
        liste.appendChild(li);
      });
      bereich.appendChild(liste);

      beantwortet(erg.ok, text, erg.gefunden.length + ' von ' + q.begriffe.length + ' Begriffen gefunden' +
        (q.mindestens < q.begriffe.length ? ', ' + q.mindestens + ' genügen.' : '.'));
      runde.ergebnisse[runde.ergebnisse.length - 1].oa = erg;
      var box = $('quiz-rueckmeldung');
      box.insertBefore(el('p', 'oa-muster', 'Musterantwort: ' + q.richtig), box.querySelector('.erklaerung'));
    });
    bereich.appendChild(pruefen);
    feld.focus({ preventScroll: true });
  }

  /* Karteikarte zum Umdrehen: vorne die Frage, hinten die Musterantwort.
     „Gewusst“ legt die Karte weg, „Nochmal“ legt sie ans Ende der Runde –
     die Runde endet erst, wenn alle Karten gewusst sind (oder mit „Beenden“). */
  function kartenSeite(klasse, etikett) {
    var seite = el('span', 'karte-seite ' + klasse);
    seite.appendChild(el('span', 'karte-etikett', etikett));
    return seite;
  }

  function zeigeKarte(v, bereich) {
    var karte = knopf('karteikarte');
    var innen = el('span', 'karte-innen');
    var vorne = kartenSeite('karte-vorne', v.versuche ? 'Frage · zum ' + (v.versuche + 1) + '. Mal' : 'Frage');
    vorne.appendChild(el('span', 'karte-text', v.q.frage));
    vorne.appendChild(el('span', 'karte-tipp', 'Tippen zum Umdrehen'));
    var hinten = kartenSeite('karte-hinten', 'Musterantwort');
    hinten.appendChild(el('span', 'karte-text', v.q.richtig));
    if (v.q.erklaerung) hinten.appendChild(el('span', 'karte-erklaerung', v.q.erklaerung));
    hinten.setAttribute('aria-hidden', 'true');
    innen.appendChild(vorne);
    innen.appendChild(hinten);
    karte.appendChild(innen);
    karte.setAttribute('aria-pressed', 'false');
    bereich.appendChild(karte);

    var wahl = el('div', 'antworten karten-wahl');
    var nochmal = antwortKnopf('↻', 'Nochmal');
    nochmal.classList.add('karte-nochmal');
    var gewusst = antwortKnopf('✓', 'Gewusst');
    gewusst.classList.add('karte-gewusst');
    wahl.appendChild(nochmal);
    wahl.appendChild(gewusst);
    wahl.hidden = true;
    bereich.appendChild(wahl);

    karte.addEventListener('click', function () {
      var umgedreht = karte.classList.toggle('umgedreht');
      karte.setAttribute('aria-pressed', String(umgedreht));
      vorne.setAttribute('aria-hidden', String(umgedreht));
      hinten.setAttribute('aria-hidden', String(!umgedreht));
      if (!umgedreht || !wahl.hidden) return;
      $('quiz-anleitung').textContent = 'Vergleichen Sie mit Ihrer Antwort. Gewusst? ' +
        'Sonst „Nochmal“ – die Karte kommt am Ende der Runde wieder.';
      wahl.hidden = false;
      gewusst.focus({ preventScroll: true });
      wahl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    gewusst.addEventListener('click', function () {
      if (!runde) return;
      var versuche = v.versuche || 0;
      runde.ergebnisse.push({ q: v.q, korrekt: versuche === 0, versuche: versuche });
      naechsteFrage();
    });
    nochmal.addEventListener('click', function () {
      if (!runde) return;
      v.versuche = (v.versuche || 0) + 1;
      runde.fragen.push(v);
      naechsteFrage();
    });
  }

  /* Klassenquiz: Antworten nur anzeigen, die Teams antworten mit Karten,
     die Lehrkraft löst auf und vergibt die Punkte */
  function zeigeKlasse(v, bereich) {
    var q = v.q;
    var optionen = q.typ === 'RF' ? ['Richtig', 'Falsch'] : v.optionen;
    var richtigIdx = q.typ === 'RF' ? (q.richtig ? 0 : 1) : optionen.indexOf(q.richtig);
    var box = el('div', 'antworten klasse' + (q.typ === 'RF' ? ' rf' : ''));
    var felder = optionen.map(function (text, i) {
      var d = el('div', 'antwort');
      d.appendChild(el('span', 'zeichen', BUCHSTABEN[i]));
      d.appendChild(el('span', 'antwort-text', text));
      box.appendChild(d);
      return d;
    });
    bereich.appendChild(box);

    var aufloesen = knopf('knopf haupt', 'Auflösen');
    aufloesen.id = 'klasse-aufloesen';
    bereich.appendChild(aufloesen);
    starteUhr(KLASSE_SEKUNDEN, function () { aufloesen.classList.add('dringend'); });

    aufloesen.addEventListener('click', function () {
      stoppeUhr();
      aufloesen.remove();
      felder.forEach(function (d, i) {
        if (i === richtigIdx) markiere(d, true);
        else d.classList.add('gedimmt');
      });
      var rm = $('quiz-rueckmeldung');
      leere(rm);
      rm.className = 'rueckmeldung gut';
      rm.appendChild(el('strong', null, 'Lösung: ' + BUCHSTABEN[richtigIdx] + ' – ' + optionen[richtigIdx]));
      if (q.erklaerung) rm.appendChild(el('p', 'erklaerung', q.erklaerung));
      rm.hidden = false;

      var akt = $('quiz-aktionen');
      leere(akt);
      [['Punkt für Team 1', [1]], ['Punkt für Team 2', [2]], ['Beide Teams richtig', [1, 2]], ['Kein Punkt', []]]
        .forEach(function (p) {
          var b = knopf('knopf' + (p[1].length === 1 ? ' haupt' : ''), p[0]);
          b.addEventListener('click', function () {
            p[1].forEach(function (team) { runde.punkte[team]++; });
            runde.ergebnisse.push({ q: q, korrekt: p[1].length > 0, teams: p[1] });
            zeigeStand();
            naechsteFrage();
          });
          akt.appendChild(b);
        });
      akt.hidden = false;
      setzeFortschritt(runde.pos + 1);
      akt.firstChild.focus({ preventScroll: true });
      akt.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
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
    if (v.q.erklaerung) box.appendChild(el('p', 'erklaerung', v.q.erklaerung));
    box.hidden = false;

    var weiter = $('quiz-weiter');
    weiter.textContent = runde.pos + 1 < runde.fragen.length ? 'Weiter' : 'Zur Auswertung';
    weiter.hidden = false;
    weiter.focus({ preventScroll: true });
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    weiter.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  $('quiz-weiter').addEventListener('click', naechsteFrage);

  $('quiz-beenden').addEventListener('click', function () {
    if (runde.ergebnisse.length &&
        !window.confirm('Quiz wirklich beenden? Ihr Fortschritt geht verloren.')) return;
    stoppeUhr();
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
    } else if (q.typ === 'MM') {
      inhalt.appendChild(zeile('zeile-ihre', '✗ Ihre Auswahl: ' + e.gegeben.join(' · ')));
      inhalt.appendChild(zeile('zeile-richtig', '✓ Richtig: ' + q.richtige.join(' · ')));
    } else if (q.typ === 'RF') {
      inhalt.appendChild(zeile('zeile-ihre', '✗ Ihre Antwort: ' + rfText(e.gegeben)));
      inhalt.appendChild(zeile('zeile-richtig', '✓ ' + (q.erklaerung || 'Die Aussage ist ' + rfText(q.richtig) + '.')));
    } else if (q.typ === 'OA') {
      inhalt.appendChild(zeile('zeile-ihre', '✗ Ihre Antwort: ' + e.gegeben));
      if (e.oa && e.oa.gefunden.length) {
        inhalt.appendChild(zeile('zeile-richtig', '✓ Gefunden: ' + begriffNamen(q, e.oa.gefunden).join(' · ')));
      }
      if (e.oa && e.oa.fehlend.length) {
        inhalt.appendChild(zeile('zeile-ihre', '✗ Gefehlt: ' + begriffNamen(q, e.oa.fehlend).join(' · ')));
      }
      inhalt.appendChild(zeile('zeile-richtig', '✓ Musterantwort: ' + q.richtig));
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
    if (q.erklaerung && q.typ !== 'RF') inhalt.appendChild(zeile('erklaerung', q.erklaerung));
    li.appendChild(inhalt);
    return li;
  }

  // Karteikarte oder Klassenquiz: Frage mit Lösung (ohne „Ihre Antwort“)
  function loesungEintrag(e, nr) {
    var q = e.q;
    var li = el('li', 'tabelle');
    li.appendChild(el('div', 'tabelle-kopf', 'Frage ' + nr + ' · ' + q.thema));
    var inhalt = el('div', 'tabelle-inhalt');
    inhalt.appendChild(zeile('falsch-frage', q.frage));
    if (e.versuche) {
      inhalt.appendChild(zeile('zeile-ihre', 'Gewusst nach ' + mehrzahl(e.versuche + 1, 'Anlauf', 'Anläufen')));
    }
    var loesung = q.typ === 'RF' ? (q.erklaerung || 'Die Aussage ist ' + rfText(q.richtig) + '.') : q.richtig;
    inhalt.appendChild(zeile('zeile-richtig', '✓ ' + loesung));
    if (q.erklaerung && q.typ !== 'RF') inhalt.appendChild(zeile('erklaerung', q.erklaerung));
    li.appendChild(inhalt);
    return li;
  }

  // Tabelle je Unterthema, das Schwächste zuerst (unter 61 % = unter „Befriedigend“ markiert)
  function zeigeUnterthemen(erg) {
    var gruppen = {};
    var namen = [];
    erg.forEach(function (e) {
      var n = e.q.thema;
      if (!gruppen[n]) { gruppen[n] = { richtig: 0, gesamt: 0 }; namen.push(n); }
      gruppen[n].gesamt++;
      if (e.korrekt) gruppen[n].richtig++;
    });
    var tabelle = $('erg-unterthemen');
    var body = $('erg-unterthemen-liste');
    leere(body);
    tabelle.hidden = namen.length < 2;
    namen.map(function (n) {
      var g = gruppen[n];
      return { name: n, richtig: g.richtig, gesamt: g.gesamt, prozent: bewerte(g.richtig, g.gesamt).prozent };
    }).sort(function (a, b) {
      return a.prozent - b.prozent || a.name.localeCompare(b.name, 'de');
    }).forEach(function (z) {
      var tr = el('tr', z.prozent < 61 ? 'schwach' : '');
      tr.appendChild(el('td', null, z.name));
      tr.appendChild(el('td', null, z.richtig + ' von ' + z.gesamt));
      tr.appendChild(el('td', null, z.prozent + ' %'));
      body.appendChild(tr);
    });
  }

  function zeigeErgebnis() {
    letzteRunde = runde;
    var erg = runde.ergebnisse;
    var art = runde.art;
    runde = null;
    stoppeUhr();

    var richtig = erg.filter(function (e) { return e.korrekt; }).length;
    var offen = erg.filter(function (e) { return !e.korrekt; });
    var liste = $('erg-falsch-liste');
    leere(liste);
    $('erg-note-zeile').hidden = art !== 'ueben';
    $('erg-schluessel-tabelle').hidden = art !== 'ueben';

    if (art === 'karten') {
      $('erg-titel').textContent = 'Karteikarten: ' + letzteRunde.thema.titel;
      $('erg-prozent').textContent = richtig + ' von ' + erg.length;
      $('erg-anzahl').textContent = 'Karten auf Anhieb gewusst';
      $('erg-text').textContent = richtig === erg.length
        ? 'Alles auf Anhieb gewusst – so sind Sie für die Schularbeit gerüstet.'
        : 'Am Ende saßen alle Karten. Die unten brauchten mehrere Anläufe – üben Sie sie morgen noch einmal.';
      $('erg-falsch-titel').textContent = 'Mehrere Anläufe gebraucht – die Musterantworten';
      $('erg-wiederholen').textContent = 'Diese Karten nochmals üben (' + offen.length + ')';
      offen.forEach(function (e, i) { liste.appendChild(loesungEintrag(e, i + 1)); });
      zeigeUnterthemen(erg);
      $('erg-unterthemen-spalte').textContent = 'Auf Anhieb';
    } else if (art === 'klasse') {
      var p1 = letzteRunde.punkte[1];
      var p2 = letzteRunde.punkte[2];
      $('erg-titel').textContent = 'Klassenquiz: ' + letzteRunde.thema.titel;
      $('erg-prozent').textContent = p1 + ' : ' + p2;
      $('erg-anzahl').textContent = 'Team 1 : Team 2 nach ' + mehrzahl(erg.length, 'Frage', 'Fragen');
      $('erg-text').textContent = p1 === p2 ? 'Unentschieden!' : 'Team ' + (p1 > p2 ? '1' : '2') + ' gewinnt!';
      $('erg-falsch-titel').textContent = 'Diese Fragen konnte kein Team – bitte nochmals besprechen';
      $('erg-wiederholen').textContent = 'Diese Fragen nochmals spielen (' + offen.length + ')';
      offen.forEach(function (e, i) { liste.appendChild(loesungEintrag(e, i + 1)); });
      $('erg-unterthemen').hidden = true;
    } else {
      var b = bewerte(richtig, erg.length);
      $('erg-titel').textContent = 'Auswertung: ' + letzteRunde.thema.titel;
      $('erg-prozent').textContent = b.prozent + ' %';
      $('erg-anzahl').textContent = richtig + ' von ' + erg.length + ' Fragen richtig';
      $('erg-note').textContent = b.note.text;
      $('erg-text').textContent =
        richtig === erg.length ? 'Ausgezeichnet – alles richtig!'
          : b.prozent >= 91 ? 'Ausgezeichnet!'
            : b.prozent >= 81 ? 'Sehr gut gemacht!'
              : b.prozent >= 61 ? 'Gut – da geht noch mehr.'
                : 'Weiter üben – wiederholen Sie die falschen Fragen.';

      var schluessel = $('erg-schluessel');
      leere(schluessel);
      NOTEN.forEach(function (n) {
        var tr = el('tr', n === b.note ? 'erreicht' : '');
        tr.appendChild(el('td', null, n.bis + '–' + n.ab + ' %'));
        tr.appendChild(el('td', null, n.text));
        schluessel.appendChild(tr);
      });
      $('erg-falsch-titel').textContent = 'Falsch beantwortet – so ist es richtig';
      $('erg-wiederholen').textContent = 'Falsche Fragen wiederholen (' + offen.length + ')';
      offen.forEach(function (e, i) { liste.appendChild(falschEintrag(e, i + 1)); });
      zeigeUnterthemen(erg);
      $('erg-unterthemen-spalte').textContent = 'Richtig';
    }

    $('erg-falsch-bereich').hidden = !offen.length;
    $('erg-wiederholen').hidden = !offen.length;
    zeige('ergebnis', 'replace');
  }

  $('erg-wiederholen').addEventListener('click', function () {
    var falsch = letzteRunde.ergebnisse
      .filter(function (e) { return !e.korrekt; })
      .map(function (e) { return e.q; });
    if (falsch.length) starteRunde(falsch, 'replace', letzteRunde.art);
  });

  $('erg-neu').addEventListener('click', function () {
    zeige('start', 'push');
  });

  starte();
})();
