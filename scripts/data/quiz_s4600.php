<?php
// Array mit allen Quizfragen, Optionen und den korrekten Antworten für S4600
$quizData = [
    // --- KAPITEL 1 ---
    [
        'chapter'  => 1,
        'question' => '1. Welche der folgenden Apps bieten eine visuelle Übersicht über komplexe Themen der Überwachung oder Nachverfolgung?',
        'type' => 'radio',
        'options' => [ 'A' => 'Transaktions-Apps', 'B' => 'Analytische Apps', 'C' => 'Infoblätter'],
        'correct' => ['B'],
        'link' => 's4600.php#k1-l1'
    ],
    [
        'chapter'  => 1,
        'question' => '2. Ein Benutzer kann die Startseite von SAP Fiori Launchpad standardmäßig personalisieren.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch'],
        'correct' => ['B'],
        'link' => 's4600.php#k1-l1'
    ],
    [
        'chapter'  => 1,
        'question' => '3. Die Funktion zum Personalisieren der Startseite muss in der Launchpad-Konfiguration aktiviert werden.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch'],
        'correct' => ['A'],
        'link' => 's4600.php#k1-l1'
    ],

    // --- KAPITEL 2 ---
    [
        'chapter'  => 2,
        'question' => '1. Ein Buchungskreis ist die kleinste Organisationseinheit der Finanzbuchhaltung, die eine vollständige, in sich abgeschlossene Buchhaltung abbildet.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4600.php#k2-l1'
    ],
    [
        'chapter'  => 2,
        'question' => '2. Jeder Vertriebsbeleg kann mehreren Vertriebsbereichen zugeordnet werden.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['B'],
        'link' => 's4600.php#k2-l1'
    ],

    // --- KAPITEL 3 ---
    [
        'chapter'  => 3,
        'question' => '1. Welcher der folgenden Schritte ist der erste Schritt des Versandprozesses in SAP S/4HANA?',
        'type' => 'radio',
        'options' => [ 'A' => 'Kommissionierung und Rückmeldung über die Funktionen der Lagerverwaltung', 'B' => 'Verpackung', 'C' => 'Fakturierung', 'D' => 'Auslieferungserstellung'],
        'correct' => ['D'],
        'link' => 's4600.php#k3-l3'
    ],
    [
        'chapter'  => 3,
        'question' => '2. Auf welcher der folgenden Ebenen befinden sich in der Verkaufsbelegstruktur Liefermengen und Liefertermine?',
        'type' => 'radio',
        'options' => [ 'A' => 'Kopfebene', 'B' => 'Positionsebene', 'C' => 'Einteilungsebene'],
        'correct' => ['C'],
        'link' => 's4600.php#k3-l2'
    ],
    [
        'chapter'  => 3,
        'question' => '3. Sie können nur eine Auslieferung mit Bezug auf einen Einzelauftrag anlegen.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['B'],
        'link' => 's4600.php#k3-l3'
    ],
    [
        'chapter'  => 3,
        'question' => '4. Jede Einteilung eines Verkaufsbelegs kann zu einer Position im Lieferbeleg werden.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4600.php#k3-l3'
    ],
    [
        'chapter'  => 3,
        'question' => '5. Welcher der folgenden Belege bildet die Grundlage für die Ausführung von Kommissionierungsaktivitäten in SAP EWM?',
        'type' => 'radio',
        'options' => [ 'A' => 'Auslieferungsauftrag', 'B' => 'Warenausgangsbeleg', 'C' => 'Lageraufgaben', 'D' => 'Lagerauftrag'],
        'correct' => ['A'],
        'link' => 's4600.php#k3-l4'
    ],
    [
        'chapter'  => 3,
        'question' => '6. Lageraufgaben werden in Lagerressourcen zusammengefasst.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['B'],
        'link' => 's4600.php#k3-l4'
    ],
    [
        'chapter'  => 3,
        'question' => '7. Beim Sichern einer Faktura erzeugt das System alle erforderlichen Belege für das Rechnungswesen.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4600.php#k3-l5'
    ],
        // --- KAPITEL 4 ---
    [
        'chapter'  => 4,
        'question' => '1. Die Stammdaten von Kunden und Lieferanten werden in SAP S/4HANA über Geschäftspartner-Stammdaten verwaltet.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch'],
        'correct' => ['A'],
        'link' => 's4600.php#k4-l1'
    ],
    [
        'chapter'  => 4,
        'question' => '2. Welche der folgenden Partnerrollen gilt für einen Kunden, der die Rechnung erhält?',
        'type' => 'radio',
        'options' => [ 'A' => 'Auftraggeber', 'B' => 'Warenempfänger', 'C' => 'Rechnungsempfänger', 'D' => 'Regulierer'],
        'correct' => ['C'],
        'link' => 's4600.php#k4-l1'
    ],
    [
        'chapter'  => 4,
        'question' => '3. Das Customizing von Verkaufsbelegarten umfasst Parameter, mit denen zwischen einer spartenbezogenen und einer spartenübergreifenden Verkaufsabwicklung unterschieden werden kann.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch'],
        'correct' => ['A'],
        'link' => 's4600.php#k4-l5'
    ],
    [
        'chapter'  => 4,
        'question' => '4. Wenn eine Kunden-Material-Info für einen Kunden und ein Material definiert ist, werden beim Erfassen von Belegen die entsprechenden Vorschlagswerte anstelle der jeweiligen Werte im Kunden- oder Materialstammsatz verwendet.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch'],
        'correct' => ['A'],
        'link' => 's4600.php#k4-l3'
    ],
    [
        'chapter'  => 4,
        'question' => '5. Welche der folgenden Informationen sind in den Konditionsstammdaten enthalten?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Preise', 'B' => 'Zuschläge', 'C' => 'Vertriebsweg', 'D' => 'Frachtkosten', 'E' => 'Steuern', 'F' => 'Rabatte'],
        'correct' => ['A', 'B', 'D', 'E', 'F'],
        'link' => 's4600.php#k4-l4'
    ],
    [
        'chapter'  => 4,
        'question' => '6. Wenn Sie keine Unterscheidung der Stammdaten nach Sparten benötigen, müssen Sie dennoch die Stammdaten für die verschiedenen Sparten anlegen.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch'],
        'correct' => ['B'],
        'link' => 's4600.php#k4-l5'
    ],

    // --- KAPITEL 5 ---
    [
        'chapter'  => 5,
        'question' => '1. Die in Vertriebsprozessen verwendeten Werke werden häufig als Auslieferungswerke bezeichnet, da sie das Verteilzentrum darstellen, aus dem das Material an den Kunden geliefert wird.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch'],
        'correct' => ['A'],
        'link' => 's4600.php#k5-l1'
    ],
    [
        'chapter'  => 5,
        'question' => '2. Welche der folgenden Funktionen sind von Versandstellen abhängig?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Versandterminierung', 'B' => 'Routenfindung', 'C' => 'Erstellen der Lieferung'],
        'correct' => ['A','B', 'C'],
        'link' => 's4600.php#k5-l1'
    ],
    [
        'chapter'  => 5,
        'question' => '3. Bei der Rückwärtsterminierung wird das Wunschlieferdatum des Kunden als relevantes Lieferdatum angenommen.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch'],
        'correct' => ['A'],
        'link' => 's4600.php#k5-l2'
    ],
    [
        'chapter'  => 5,
        'question' => '4. Die in der Einteilung verwendete Transportdispositionsvorlaufzeit wird von der Versandstelle übernommen.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch'],
        'correct' => ['B'],
        'link' => 's4600.php#k5-l2'
    ],
        // --- KAPITEL 6 ---
    [
        'chapter'  => 6,
        'question' => '1. In welcher Reihenfolge greift das System bei der Suche nach dem Standardauslieferungswerk in einem Kundenauftrag auf Stammdaten zu?',
        'type' => 'ordering',
        'options' => [
            ['id' => 'c', 'text' => 'Materialstammsatz'],
            ['id' => 'a', 'text' => 'Kunden-Material-Informationen'],
            ['id' => 'b', 'text' => 'Kundenstammsatz des Warenempfängers'],
        ],
        'correct' => ['a', 'b', 'c'],
        'link' => 's4600.php#k5-l1'
    ],
    [
        'chapter'  => 6,
        'question' => '2. Welche der folgenden Faktoren können vom Prüfumfang zur Bewertung der Bestandsverfügbarkeit bei der Kundenauftragserfassung berücksichtigt werden?',
        'type' => 'checkbox',
        'options' => [ 
            'A' => 'Vorhandene Kundenaufträge', 
            'B' => 'Lieferpriorität des Kunden', 
            'C' => 'Bestellungen', 
            'D' => 'Materialart', 
            'E' => 'Materialreservierungen'
        ],
        'correct' => ['A', 'C', 'E'],
        'link' => 's4600.php#k6-l1'
    ],
    [
        'chapter'  => 6,
        'question' => '3. Welche der folgenden Optionen enthält eine Sammlung von Einstellungen, die festlegt, welche Bedarfe geprüft werden und wie sie vor der Rückstandsbearbeitung (BOP) behandelt werden?',
        'type' => 'radio',
        'options' => [ 
            'A' => 'BOP-Segment', 
            'B' => 'BOP-Variante', 
            'C' => 'BOP-Lauf'
        ],
        'correct' => ['B'],
        'link' => 's4600.php#k6-l2'
    ],

    // --- KAPITEL 7 ---
    [
        'chapter'  => 7,
        'question' => '1. Wenn Sie Folgebelege für Kundenaufträge anlegen möchten, können Sie dies oft über die Sammelbearbeitung tun.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4600.php#k7-l1'
    ],
    [
        'chapter'  => 7,
        'question' => '2. Um den Prozess des Anlegens von Fakturen zu beschleunigen, können Sie über die Sammelbearbeitung mehrere Fakturen gleichzeitig anlegen.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4600.php#k7-l1'
    ],
    [
        'chapter'  => 7,
        'question' => '3. Neben Effizienz und Geschwindigkeit besteht ein weiterer Vorteil der Sammelbearbeitung darin, dass Sie automatisch ermittelt, ob mehrere Referenzbelege zu weniger (oder mehr) Folgebelegen führen sollen.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4600.php#k7-l1'
    ],
        // --- KAPITEL 8 ---
    [
        'chapter'  => 8,
        'question' => '1. In SAP S/4HANA ist die Verwendung von Anfragen und Angeboten als Presales-Belege für den Vertriebsprozess obligatorisch.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch'],
        'correct' => ['B'],
        'link' => 's4600.php#k8-l1'
    ],
[
    'chapter'  => 8,
    'question' => '2. Bringen Sie den Ablauf der Kundeneinzelfertigung vom Kundenauftrag bis zum Fertigungsauftrag in die richtige Reihenfolge.',
    'type' => 'ordering',
    'options' => [
        ['id' => 'd', 'text' => 'Der Fertigungsauftrag wird angelegt, indem der Planauftrag für das Endprodukt umgewandelt wird.'],
        ['id' => 'b', 'text' => 'Ein Kundeneinzelbedarf wird an die Disposition übergeben.'],
        ['id' => 'e', 'text' => 'Das System überträgt die bestätigte Menge und das Materialbereitstellungsdatum aus dem Fertigungsauftrag in den Kundenauftrag.'],
        ['id' => 'a', 'text' => 'Aus dem Kundenauftrag wird ein Kundeneinzelbedarf erzeugt.'],
        ['id' => 'c', 'text' => 'Die Materialbedarfsplanung (MRP) erzeugt automatisch einen Planauftrag für das Material.']
    ],
    'correct' => ['a', 'b', 'c', 'd', 'e'],
    'link' => 's4600.php#k8-l2'
],
    [
        'chapter'  => 8,
        'question' => '3. Die Auswahl der Materialart DIEN für Serviceprodukte erleichtert die Datenerfassung.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch'],
        'correct' => ['A'],
        'link' => 's4600.php#k8-l3'
    ],

    // --- KAPITEL 9 ---
    [
        'chapter'  => 9,
        'question' => '1. Beim Anlegen einer Gut- oder Lastschriftsanforderung wird der Beleg automatisch und sofort fakturiert.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['B'],
        'link' => 's4600.php#k9-l1'
    ],
    [
        'chapter'  => 9,
        'question' => '2. Beim Stornieren einer Faktura werden eine separate Faktura (Stornofaktura) und ein neuer Buchhaltungsbeleg erzeugt.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4600.php#k9-l2'
    ],
    [
        'chapter'  => 9,
        'question' => '3. Beim Anlegen des Retourenbelegs werden Sie aufgefordert, eine Gutschrift zu pflegen.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['B'],
        'link' => 's4600.php#k9-l3'
    ],

    // --- KAPITEL 10 ---
    [
        'chapter'  => 10,
        'question' => '1. Mit SAP Smart Business können Sie direkt von einem Datenpunkt in einem Diagramm zu der entsprechenden Transaktion für die Lösung des Problems springen.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4600.php#k10-l1'
    ],
    [
        'chapter'  => 10,
        'question' => '2. Welche der folgenden Optionen bietet eine Hybridsicht für Kundenaufträge, in der Sie die Differenz zwischen Plan- und Istdaten effektiv visualisieren können?',
        'type' => 'radio',
        'options' => [
            'A' => 'Vertriebspläne verwalten',
            'B' => 'Vertriebsergebnisse – Plan/Ist',
            'C' => 'Kundenaufträge ändern',
            'D' => 'SAP-App „Erfüllung von Kundenaufträgen“'
        ],
        'correct' => ['B'],
        'link' => 's4600.php#k10-l2'
    ],
    [
        'chapter'  => 10,
        'question' => '3. Welche der folgenden Optionen wird in SAP S/4HANA genutzt, um Transaktionen und Analysen zu verbinden und so betriebliches Reporting in Echtzeit zu ermöglichen?',
        'type' => 'radio',
        'options' => [
            'A' => 'SAP ERP',
            'B' => 'SAP Core Data Services (CDS)',
            'C' => 'ABAP-Schicht'
        ],
        'correct' => ['B'],
        'link' => 's4600.php#k10-l3'
    ]
];

// Extrahiere eine Liste einzigartiger Kapitel für den Auswahlbildschirm
$chapters = array_unique(array_column($quizData, 'chapter'));
sort($chapters);
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz: S4600 Sales Prozesse</title>
    <link rel="stylesheet" href="css/main.css">
</head>
<body>

    <?php include 'header.php'; ?>

    <div class="quiz-container searchable-block">
        <h1>Quiz: S4600 Geschäftsprozesse in Sales</h1>

        <div id="chapter-selection-screen">
            <h2>Wähle deine Kapitel</h2>
            <p>Klicke auf die Kapitelkarten, die du in dein Quiz aufnehmen möchtest. Du kannst beliebig viele Kapitel kombinieren.</p>
            <form id="chapter-select-form">
                <div class="chapter-selection-grid">
                    <?php foreach ($chapters as $chapter): ?>
                        <div class="chapter-card" data-chapter="<?= $chapter ?>">
                            <input type="checkbox" name="chapters" value="<?= $chapter ?>" id="chapter-<?= $chapter ?>" checked>
                            <div class="chapter-icon">📚</div>
                            <div class="chapter-title">Kapitel <?= $chapter ?></div>
                        </div>
                    <?php endforeach; ?>
                </div>
                <button type="submit" class="submit-btn" style="margin-top: 2.5rem; width: 100%;">Quiz starten</button>
            </form>
        </div>

        <div id="quiz-screen" style="display: none;">
            <div class="quiz-progress-bar-container">
                <div class="quiz-progress-bar" id="quiz-progress-bar-inner"></div>
            </div>
            <div id="quiz-progress-text"></div>
            
            <div class="question-block">
                <p id="question-text"></p>
                <div class="options" id="options-container"></div>
            </div>

            <div id="feedback-area" style="margin-top: 1.5rem;"></div>
            
            <div class="quiz-navigation" style="margin-top: 2rem;">
                <button id="check-answer-btn" class="submit-btn">Antwort prüfen</button>
                <button id="next-question-btn" class="submit-btn" style="display: none;">Nächste Frage</button>
            </div>
        </div>
        
<div id="quiz-result-screen" class="quiz-result-screen" style="display: none;">
    <h2 id="result-headline"></h2>
    <p id="result-text">Dein Ergebnis: <strong><span id="score-final"></span> von <span id="total-final"></span></strong> Fragen richtig (<span id="percentage-final" class="result-percentage"></span>%).</p>
    
<div class="quiz-actions">
    <a href="index.php" class="cta-button">Zur Startseite</a>
    <button id="retry-incorrect-btn" class="submit-btn" style="display: none;">Falsche Fragen wiederholen</button>
    <button id="restart-quiz-btn" class="submit-btn">Neues Quiz starten</button>
</div>
</div>

    </div>
    
    <?php include 'footer.php'; ?>
    <script>
        const quizData = <?php echo json_encode($quizData); ?>;
    </script>
    <script src="app.js"></script>

</body>
</html>