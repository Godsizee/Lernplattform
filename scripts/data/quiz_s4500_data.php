<?php
// Diese Datei enthält ausschließlich die Quiz-Daten für den S4500-Kurs.
// Version 2.0 - Vollständig mit allen Fragen aus den Bildern.
$quizData = [
    // --- KAPITEL 1 ---
    [
        'chapter'  => 1,
        'question' => '1. Welche Anforderungen haben gelegentliche Benutzer normalerweise an ihre Benutzeroberfläche?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Sie sollte browser-basiert sein.', 'B' => 'Sie sollte backend-orientiert sein.', 'C' => 'Sie sollte einfach sein.', 'D' => 'Sie sollte viele Funktionen haben.'],
        'correct' => ['A', 'C'],
        'link' => 's4500.php#kapitel-1-grundlagen'
    ],
    [
        'chapter'  => 1,
        'question' => '2. Wie nennt man das Feld im SAP GUI, in das Sie einen Transaktionscode eingeben können, um eine Transaktion aufzurufen?',
        'type' => 'radio',
        'options' => [ 'A' => 'SAP Fiori Launchpad', 'B' => 'Befehlsfeld', 'C' => 'SAP Easy Access Favorite', 'D' => 'Menüleiste'],
        'correct' => ['B'],
        'link' => 's4500.php#kapitel-1-grundlagen'
    ],
    // --- KAPITEL 2 ---
    [
        'chapter'  => 2,
        'question' => '3. Im Lohnbearbeitungsprozess stellt Ihnen ein Lieferant Material zur Verfügung, das zwar bei Ihnen lagert, jedoch nicht umgehend bezahlt werden muss.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['B'],
        'link' => 's4500.php#lektion-2-1'
    ],
    [
        'chapter'  => 2,
        'question' => '4. Wie sind Organisationsebenen in einem Unternehmen von oben nach unten strukturiert?',
        'type' => 'radio',
        'options' => [ 'A' => 'Buchungskreis – Mandant – Werk – Lagerort', 'B' => 'Mandant – Werk – Buchungskreis – Lagerort', 'C' => 'Mandant – Buchungskreis – Werk – Lagerort', 'D' => 'Werk – Mandant – Buchungskreis – Lagerort'],
        'correct' => ['C'],
        'link' => 's4500.php#lektion-2-2'
    ],
    [
        'chapter'  => 2,
        'question' => '5. Eine Einkaufsorganisation kann nur einem einzigen Buchungskreis zugeordnet werden.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4500.php#lektion-2-2'
    ],
    [
        'chapter'  => 2,
        'question' => '6. Eine Einkaufsorganisation kann nur für Werke innerhalb eines Buchungskreises verantwortlich sein.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['B'],
        'link' => 's4500.php#lektion-2-2'
    ],
    [
        'chapter'  => 2,
        'question' => '7. Innerhalb welcher Organisationseinheit ist der Schlüssel eines Lagerorts eindeutig?',
        'type' => 'radio',
        'options' => [ 'A' => 'Mandant', 'B' => 'Buchungskreis', 'C' => 'Werk', 'D' => 'Einkaufsorganisation'],
        'correct' => ['C'],
        'link' => 's4500.php#lektion-2-2'
    ],
    // --- KAPITEL 3 ---
    [
        'chapter'  => 3,
        'question' => '8. Welche der folgenden sind SAP-Fiori-Apps, die im grundlegenden Fremdbeschaffungsprozess verwendet werden?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Fertigungsaufträge rückmelden', 'B' => 'Bestellungen verwalten', 'C' => 'Lieferantenrechnung anlegen', 'D' => 'Wareneingang zu Einkaufsbeleg buchen'],
        'correct' => ['B', 'C', 'D'],
        'link' => 's4500.php#kapitel-3-einfacher-beschaffungsprozess'
    ],
    [
        'chapter'  => 3,
        'question' => '9. Auf welche Belege können Sie sich beim Anlegen einer Bestellung beziehen?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Fertigungsauftrag', 'B' => 'Bestellung', 'C' => 'Lieferantenrechnung', 'D' => 'Kontrakt'],
        'correct' => ['B', 'D'],
        'link' => 's4500.php#lektion-3-1'
    ],
    [
        'chapter'  => 3,
        'question' => '10. Welche der folgenden vordefinierten Positionstypen gibt es im Einkauf?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Lohnbearbeitung', 'B' => 'Standard', 'C' => 'Storno', 'D' => 'Strecke'],
        'correct' => ['A', 'B', 'D'],
        'link' => 's4500.php#lektion-3-1'
    ],
    [
        'chapter'  => 3,
        'question' => '11. Welche Belege werden mit einem bewerteten Wareneingang angelegt?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Rückmeldebeleg', 'B' => 'Materialbeleg', 'C' => 'Buchhaltungsbeleg', 'D' => 'Stornobeleg'],
        'correct' => ['B', 'C'],
        'link' => 's4500.php#lektion-3-2'
    ],
    [
        'chapter'  => 3,
        'question' => '12. Für die Buchung einer Warenbewegung ist immer eine Bewegungsart erforderlich.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4500.php#lektion-3-2'
    ],
    [
        'chapter'  => 3,
        'question' => '13. Welche Belege werden bei einer Rechnungsbuchung angelegt?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Rechnungsbeleg', 'B' => 'Rückmeldebeleg', 'C' => 'Buchhaltungsbeleg', 'D' => 'Stornobeleg'],
        'correct' => ['A', 'C'],
        'link' => 's4500.php#lektion-3-3'
    ],
    // --- KAPITEL 4 ---
    [
        'chapter'  => 4,
        'question' => '14. Welche der folgenden Objekte werden durch Geschäftspartner-Stammdaten dargestellt?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Dispositionsbereich', 'B' => 'Lieferant', 'C' => 'Lagerort', 'D' => 'Kunde'],
        'correct' => ['B', 'D'],
        'link' => 's4500.php#lektion-4-1'
    ],
    [
        'chapter'  => 4,
        'question' => '15. Welche Organisationsebenen sind bei der Pflege eines Geschäftspartners mit den Lieferanten- und Kreditorenrollen relevant?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Einkaufsorganisation', 'B' => 'Lagerort', 'C' => 'Einkäufergruppe', 'D' => 'Buchungskreis'],
        'correct' => ['A', 'D'],
        'link' => 's4500.php#lektion-4-1'
    ],
    [
        'chapter'  => 4,
        'question' => '16. Welche der folgenden Sichten können in einem Materialstammsatz angelegt werden?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Einkaufsorganisationsdaten', 'B' => 'Buchhaltung', 'C' => 'Vertrieb', 'D' => 'Bezugsquellen', 'E' => 'Prognose'],
        'correct' => ['A', 'B', 'C', 'E'],
        'link' => 's4500.php#lektion-4-2'
    ],
    [
        'chapter'  => 4,
        'question' => '17. Beim Anlegen eines Materialstammsatzes müssen Sie eine Materialart angeben. Was steuert die Materialart?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Die Art der Nummernvergabe', 'B' => 'Die zulässige Länge des Materialkurztextes', 'C' => 'Ob ein Material bestellt werden darf', 'D' => 'Welche Sichten gepflegt werden können'],
        'correct' => ['A', 'C', 'D'],
        'link' => 's4500.php#lektion-4-2'
    ],
    [
        'chapter'  => 4,
        'question' => '18. Wenn Sie einen Materialstammsatz um eine Sicht erweitern möchten, müssen Sie den Materialstammsatz ändern.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['B'],
        'link' => 's4500.php#lektion-4-2'
    ],
    [
        'chapter'  => 4,
        'question' => '19. Um welche Art von Daten handelt es sich bei einem Einkaufsinfosatz?',
        'type' => 'radio',
        'options' => [ 'A' => 'Bewegungsdaten', 'B' => 'Customizing-Einstellung', 'C' => 'Stammdaten', 'D' => 'Meldedaten'],
        'correct' => ['C'],
        'link' => 's4500.php#lektion-4-3'
    ],
    [
        'chapter'  => 4,
        'question' => '20. Welche der folgenden Organisationsebenen sind für Einkaufsinfosätze relevant?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Mandant', 'B' => 'Buchungskreis', 'C' => 'Werk', 'D' => 'Lagerort', 'E' => 'Einkaufsorganisation'],
        'correct' => ['A', 'C', 'E'],
        'link' => 's4500.php#lektion-4-3'
    ],
    [
        'chapter'  => 4,
        'question' => '21. Welche der folgenden Aussagen über die Bewertungsklasse sind richtig?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Anhand der Bewertungsklasse wird ermittelt, welches Bestandskonto bei einer Warenbewegung eines Materials fortgeschrieben wird.', 'B' => 'Die Bewertungsklasse ist ein Gruppierungsschlüssel, der steuert, nach welchem Verfahren ein Material bewertet wird.', 'C' => 'Über die Wahl der Bewertungsklasse entscheiden Sie, ob für ein Material Einkaufskonditionen auf Werksebene zulässig sind.', 'D' => 'Die Bewertungsklasse ermöglicht es, die Bestände mehrerer Materialien auf einem Bestandskonto zu führen.'],
        'correct' => ['A', 'D'],
        'link' => 's4500.php#lektion-4-4'
    ],
    [
        'chapter'  => 4,
        'question' => '22. Welche Art von Buchung erfolgt in der Finanzbuchhaltung bei der Umlagerung eines Rohstoffs innerhalb eines Werkes?',
        'type' => 'radio',
        'options' => [ 'A' => 'Eine Preisdifferenzbuchung wird durchgeführt.', 'B' => 'Keine Buchung wird durchgeführt.', 'C' => 'Nur Buchhaltungsbelege werden fortgeschrieben.', 'D' => 'Ein neues Konto wird angelegt.'],
        'correct' => ['B'],
        'link' => 's4500.php#lektion-4-4'
    ],
    [
        'chapter'  => 4,
        'question' => '23. Sie haben ein Material für das Lager bestellt, das zum Standardpreis (Preissteuerung S) bewertet wird. Was geschieht, wenn Sie den Wareneingang für diese Bestellung buchen?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Unterscheidet sich der Bestellpreis vom Standardpreis, wird diese Differenz direkt auf das Bestandskonto gebucht.', 'B' => 'Die Bestandsbuchung erfolgt zu dem im Materialstammsatz hinterlegten Standardpreis.', 'C' => 'Der Standardpreis im Materialstammsatz wird an den Bestellpreis angepasst.', 'D' => 'Der Gesamtbestand im Materialstammsatz wird um die Wareneingangsmenge erhöht.'],
        'correct' => ['B', 'D'],
        'link' => 's4500.php#lektion-4-4-standardpreis'
    ],
    [
        'chapter'  => 4,
        'question' => '24. Sie haben ein Material für das Lager bestellt, das zum gleitenden Durchschnittspreis (Preissteuerung V) bewertet wird. Was geschieht, wenn Sie den Wareneingang für diese Bestellung buchen?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Die Bestandsbuchung erfolgt zum Bestellpreis.', 'B' => 'Der Gesamtbestand im Materialstammsatz wird um die Wareneingangsmenge erhöht.', 'C' => 'Der gleitende Durchschnittspreis im Materialstammsatz wird basierend auf dem neuen Bestandswert und dem neuen Gesamtbestand neu berechnet.', 'D' => 'Der gleitende Durchschnittspreis wird nach folgender Formel berechnet: Gesamtbestand/Gesamtwert.'],
        'correct' => ['A', 'B', 'C'],
        'link' => 's4500.php#lektion-4-4-gleitender-preis'
    ],
    // --- KAPITEL 5 ---
    [
        'chapter'  => 5,
        'question' => '25. Welche der folgenden Daten sind in einer Bestellposition erforderlich, wenn Sie Material direkt für den Verbrauch einkaufen möchten?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Kontierungstyp', 'B' => 'Materialnummer', 'C' => 'Sachkonto', 'D' => 'Materialkurztext', 'E' => 'Lagerort'],
        'correct' => ['A', 'C', 'D'],
        'link' => 's4500.php#kapitel-5'
    ],
    [
        'chapter'  => 5,
        'question' => '26. Welcher Faktor in einem Materialstammsatz steuert, ob ein Kontierungstyp für dieses Material in einer Bestellung angegeben werden muss?',
        'type' => 'radio',
        'options' => [ 'A' => 'Warengruppe', 'B' => 'Branche', 'C' => 'Materialart', 'D' => 'Feldauswahl'],
        'correct' => ['C'],
        'link' => 's4500.php#kapitel-5'
    ],
    [
        'chapter'  => 5,
        'question' => '27. Wie können Bestellanforderungen automatisch erzeugt werden?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Bei der Pflege der Materialstammdaten', 'B' => 'Beim Stornieren eines Kundenauftrags', 'C' => 'Beim Sichern von Fertigungsaufträgen', 'D' => 'Mit dem Bedarfsplanungslauf'],
        'correct' => ['C', 'D'],
        'link' => 's4500.php#kapitel-5'
    ],
    [
        'chapter'  => 5,
        'question' => '28. Beim Anlegen einer Bestellanforderungsposition müssen Sie den Bewertungspreis immer manuell eingeben.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['B'],
        'link' => 's4500.php#kapitel-5'
    ],
    [
        'chapter'  => 5,
        'question' => '29. Bei welcher Bezugsquelle handelt es sich um einen Rahmenvertrag?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Einkaufsinfosatz', 'B' => 'Lieferplan', 'C' => 'Fertigungsversion', 'D' => 'Kontrakt'],
        'correct' => ['B', 'D'],
        'link' => 's4500.php#kapitel-5'
    ],
    [
        'chapter'  => 5,
        'question' => '30. Sie möchten Material einkaufen, um den Lagerbestand aufzufüllen. Welche Einträge sind dazu in einer Bestellposition erforderlich?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Kontierungstyp', 'B' => 'Materialnummer', 'C' => 'Kennzeichen „Wareneingang“', 'D' => 'Kennzeichen „Rechnungseingang“'],
        'correct' => ['B', 'C'],
        'link' => 's4500.php#kapitel-5'
    ],
    [
        'chapter'  => 5,
        'question' => '31. In einer Bestellposition für Verbrauchsmaterial sind die Kennzeichen Wareneingang und Rechnungseingang gesetzt. Nun buchen Sie den Wareneingang für diese Bestellposition. Welche Sachkonten werden beim Wareneingang bebucht?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'WE/RE-Konto', 'B' => 'Kreditorenkonto', 'C' => 'Bestandskonto', 'D' => 'Verbrauchskonto'],
        'correct' => ['A', 'D'],
        'link' => 's4500.php#kapitel-5'
    ],
    [
        'chapter'  => 5,
        'question' => '32. In einer Bestellposition für Verbrauchsmaterial ist nur das Kennzeichen Rechnungseingang gesetzt. Sie buchen jetzt die Lieferantenrechnung für diese Bestellposition. Welche Sachkonten werden beim Rechnungseingang bebucht?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'WE/RE-Konto', 'B' => 'Kreditorenkonto', 'C' => 'Bestandskonto', 'D' => 'Verbrauchskonto'],
        'correct' => ['B', 'D'],
        'link' => 's4500.php#kapitel-5'
    ],
    // --- KAPITEL 6 ---
    [
        'chapter'  => 6,
        'question' => '33. Wie können Sie mit der App Meine Bestellanforderungen - Neu eine neue Bestellanforderungsposition anlegen?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Sie geben die Nummer eines Materialstammsatzes ein.', 'B' => 'Sie geben eine Beschreibung für das benötigte Produkt ein, wenn es nicht in einem Katalog enthalten ist.', 'C' => 'Sie importieren eine Excel-Liste mit Materialnummern.', 'D' => 'Sie wählen das Material aus einem Katalog aus.'],
        'correct' => ['A', 'B', 'D'],
        'link' => 's4500.php#kapitel-6'
    ],
    [
        'chapter'  => 6,
        'question' => '34. Die Standardeinstellungen für einen Benutzer können zentral von einem Administrator gepflegt werden.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4500.php#kapitel-6'
    ],
    [
        'chapter'  => 6,
        'question' => '35. Sie verwenden die App Wareneingang bestätigen – Neu. Welche Bedingungen muss eine Bestellanforderungsposition erfüllen, damit Sie einen Wareneingang für die Position bestätigen können?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Die Bestellanforderungsposition wurde von Ihnen oder für Sie angelegt.', 'B' => 'Für die Bestellanforderungsposition wurde eine Bestellung angelegt.', 'C' => 'Die Position wurde vollständig geliefert.', 'D' => 'Für die Bestellanforderungsposition muss eine Rechnung erfasst worden sein.'],
        'correct' => ['A', 'B'],
        'link' => 's4500.php#kapitel-6'
    ],
    // --- KAPITEL 7 ---
    [
        'chapter'  => 7,
        'question' => '36. Welche der folgenden Daten müssen Sie beim Anlegen eines Mengenkontrakts angeben?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Lieferant', 'B' => 'Gesamtwert', 'C' => 'Vertragsart MK', 'D' => 'Lieferdatum', 'E' => 'Werk', 'F' => 'Einkaufsorganisation', 'G' => 'Abrufdokumentation' ],
        'correct' => ['A', 'C', 'F'],
        'link' => 's4500.php#kapitel-7'
    ],
    [
        'chapter'  => 7,
        'question' => '37. Welche Kennzeichen finden Sie im Orderbuch?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Automatische Bestellung zulässig', 'B' => 'Feste Bezugsquelle', 'C' => 'Orderbuchpflicht', 'D' => 'Verwendung in der Disposition'],
        'correct' => ['B', 'D'],
        'link' => 's4500.php#kapitel-7'
    ],
    [
        'chapter'  => 7,
        'question' => '38. Wie kann ein Orderbuch gepflegt werden?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Manuell, pro Material und Werk', 'B' => 'Beim Anlegen oder Ändern einer Bestellposition', 'C' => 'Automatisch vom System'],
        'correct' => ['A', 'C'],
        'link' => 's4500.php#kapitel-7'
    ],
    [
        'chapter'  => 7,
        'question' => '39. Welche Bildbereiche werden in der Einbildtransaktion Bestellanforderung anlegen (ME51N) unterschieden?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Ausgangsdaten', 'B' => 'Kopf', 'C' => 'Fußzeile', 'D' => 'Belegübersicht', 'E' => 'Positionsübersicht'],
        'correct' => ['B', 'D', 'E'],
        'link' => 's4500.php#kapitel-7'
    ],
    [
        'chapter'  => 7,
        'question' => '40. Die Einbildtransaktion „Bestellung anlegen“ (ME21N) ist in die gleichen Bildbereiche unterteilt wie die Transaktion „Bestellanforderung anlegen“ (ME51N).',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4500.php#kapitel-7'
    ],
    [
        'chapter'  => 7,
        'question' => '41. Welche Belege können Sie in der Belegübersicht der Transaktion ME21N anzeigen?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Bestellungen', 'B' => 'Kontrakte', 'C' => 'Buchhaltungsbelege', 'D' => 'Materialbelege', 'E' => 'Bestellanforderungen'],
        'correct' => ['A', 'B', 'E'],
        'link' => 's4500.php#kapitel-7'
    ],
    [
        'chapter'  => 7,
        'question' => '42. Was geben Sie über den Aufriss in der Belegübersicht der Transaktion ME21N an?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Die Werte für die Selektion der Belege', 'B' => 'Nach welchen Kriterien die ausgewählten Belege sortiert werden sollen', 'C' => 'Die Daten, die für einen ausgewählten Beleg angezeigt werden sollen'],
        'correct' => ['B', 'C'],
        'link' => 's4500.php#kapitel-7'
    ],
    [
        'chapter'  => 7,
        'question' => '43. Welche Voraussetzungen müssen für die automatische Umwandlung von Bestellanforderungen in Bestellungen erfüllt sein?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Dem Bestellanforderungskopf muss eine gültige Bezugsquelle zugeordnet sein.', 'B' => 'Im Materialstammsatz muss das Kennzeichen Automatische Bestellung gesetzt sein.', 'C' => 'Der Bestellanforderungsposition muss eine gültige Bezugsquelle zugeordnet sein.', 'D' => 'Im Lieferantenstammsatz muss das Kennzeichen Automatische Bestellung gesetzt sein.'],
        'correct' => ['A', 'B', 'C', 'D'],
        'link' => 's4500.php#kapitel-7'
    ],
    [
        'chapter'  => 7,
        'question' => '44. Wie in der Belegübersicht der Transaktion ME21N (Bestellung anlegen) können Sie anhand einer Auswahl im Übersichtstraum der Transaktion MIGO (Warenbewegungen) entscheiden, welche Belege angezeigt werden.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['B'],
        'link' => 's4500.php#kapitel-7'
    ],
    [
        'chapter'  => 7,
        'question' => '45. Sie möchten einen Wareneingang für eine Bestellung mit der Einbildtransaktion für Warenbewegungen (MIGO) buchen. Welche Werte müssen angegeben werden, bevor Sie die Bestellnummer eingeben?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Vorgang', 'B' => 'Werk und Lagerort', 'C' => 'Bewegungsart', 'D' => 'Art des Referenzbelegs', 'E' => 'Vorschlagswerte für Ihren Benutzer'],
        'correct' => ['A', 'C', 'D'],
        'link' => 's4500.php#kapitel-7'
    ],
    [
        'chapter'  => 7,
        'question' => '46. Welche verschiedenen Bestandsarten gibt es?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Frei verwendbarer Bestand', 'B' => 'Eingeschränkt verwendbarer Bestand', 'C' => 'Gesperrter Bestand', 'D' => 'Qualitätsprüfbestand'],
        'correct' => ['A', 'C', 'D'],
        'link' => 's4500.php#kapitel-7'
    ],
    [
        'chapter'  => 7,
        'question' => '47. Welche Vorgänge können über die Einbildtransaktion Eingangrechnung hinzufügen (MIRO) erfasst werden?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Nachlieferung', 'B' => 'Rechnung', 'C' => 'Nachverrechnung', 'D' => 'Nachträgliche Belastung', 'E' => 'Gutschrift'],
        'correct' => ['B', 'D', 'E'],
        'link' => 's4500.php#kapitel-7'
    ],
    [
        'chapter'  => 7,
        'question' => '48. Was geben Sie an und setzen Sie voraus, wenn Sie das Kennzeichen Buchung OK für eine Position in der Rechnung setzen?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Die Position wurde geprüft.', 'B' => 'Die Position wird für die Rechnungsbuchung selektiert.', 'C' => 'Die Position wurde bearbeitet.', 'D' => 'Die Position erfordert beim Buchen eine manuelle Buchungsbestätigung.'],
        'correct' => ['A', 'C', 'D'],
        'link' => 's4500.php#kapitel-7'
    ],
    // --- KAPITEL 8 ---
    [
        'chapter'  => 8,
        'question' => '49. Welches Feld im Materialstamm steuert, mit welchem Verfahren ein Material geplant wird?',
        'type' => 'radio',
        'options' => [ 'A' => 'Beschaffungsart', 'B' => 'Dispositionsmerkmal', 'C' => 'Losgrößenverfahren'],
        'correct' => ['B'],
        'link' => 's4500.php#kapitel-8'
    ],
    [
        'chapter'  => 8,
        'question' => '50. Nennen Sie die Anforderungen, die erforderlich sind, damit eine Bestellanforderungsposition automatisch in eine Bestellung umgewandelt werden kann.',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Der Bestellanforderungsposition muss eine gültige Bezugsquelle zugeordnet sein.', 'B' => 'Im Materialstammsatz muss das Kennzeichen „Automatische Bestellung“ gesetzt sein.', 'C' => 'Im Lieferantenstammsatz muss das Kennzeichen „Automatische Wareneingangsabrechnung“ gesetzt sein.', 'D' => 'Im Lieferantenstammsatz muss das Kennzeichen „Automatische Bestellung“ gesetzt sein.'],
        'correct' => ['A', 'B', 'D'],
        'link' => 's4500.php#kapitel-8'
    ],
    // --- KAPITEL 9 ---
    [
        'chapter'  => 9,
        'question' => '51. Welche Aktionen können Sie für die Karten auf der Beschaffungsübersicht ausführen?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Karten ausblenden', 'B' => 'Karten neu anordnen', 'C' => 'Neue Karten anlegen', 'D' => 'Inhalt der Karten filtern'],
        'correct' => ['A', 'B', 'D'],
        'link' => 's4500.php#kapitel-9'
    ]
];
?>

