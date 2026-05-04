<?php
// Array mit allen Quizfragen, Optionen und den korrekten Antworten für S4H00
$quizData = [
    // --- KAPITEL 1 ---
    [
        'chapter'  => 1,
        'question' => '1. Welche Trends sorgen dafür, dass die Business Suite für die digitale Welt neu aufgebaut werden muss?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Zunahme der Gerätevernetzung', 'B' => 'Benutzer übernehmen immer mehr technische IT-Aufgaben', 'C' => 'Zunehmende Verbreitung von mobilen Geräten', 'D' => 'Einzug des Cloud Computing'],
        'correct' => ['A', 'C', 'D'],
        'link' => 's4h00.php#topic-intro'
    ],
    [
        'chapter'  => 1,
        'question' => '2. Warum wurde der Anwendungscode für SAP S/4HANA neu geschrieben?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Der optimierte ABAP-Code, den wir für Suite on SAP HANA entwickelt haben, würde mit SAP S/4HANA nicht funktionieren.', 'B' => 'Um das einfachere Datenmodell zu nutzen.', 'C' => 'SAP S/4HANA wird nun mit Java geschrieben', 'D' => 'Um sicherzustellen, dass der Code für SAP HANA optimiert ist.'],
        'correct' => ['B', 'D'],
        'link' => 's4h00.php#topic-hana-platform'
    ],
    [
        'chapter'  => 1,
        'question' => '3. Wie lautet der Name für die Kernlösungen von SAP S/4HANA?',
        'type' => 'radio',
        'options' => [ 'A' => 'Enterprise Resource Management', 'B' => 'Enterprise Management', 'C' => 'Enterprise Central Component', 'D' => 'Enterprise Line of Business (LOB)'],
        'correct' => ['B'],
        'link' => 's4h00.php#topic-ecosystem'
    ],
    [
        'chapter'  => 1,
        'question' => '4. Was ist SAP Fiori?',
        'type' => 'radio',
        'options' => [ 'A' => 'Mobile Technologie', 'B' => 'User Experience', 'C' => 'Datenmodell', 'D' => 'Reporting-Tool'],
        'correct' => ['B'],
        'link' => 's4h00.php#topic-fiori-ux'
    ],
    [
        'chapter'  => 1,
        'question' => '5. Bei welcher Edition sind umfangreiche Kundenänderungen möglich?',
        'type' => 'radio',
        'options' => [ 'A' => 'SAP S/4HANA', 'B' => 'SAP S/4HANA Cloud'],
        'correct' => ['A'],
        'link' => 's4h00.php#topic-intro'
    ],
    [
        'chapter'  => 1,
        'question' => '6. Bonusfrage: Was bedeutet das Wort Fiori?',
        'type' => 'radio',
        'options' => [ 'A' => 'Feuer', 'B' => 'Blume', 'C' => 'Furie', 'D' => 'Schnell'],
        'correct' => ['B'],
        'link' => 's4h00.php#topic-fiori-ux'
    ],

    // --- KAPITEL 2 ---
    [
        'chapter'  => 2,
        'question' => '7. Nennen Sie einige der Vorteile von SAP Fiori.',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Höhere Produktivität', 'B' => 'Ermöglicht Benutzern schnelle und begründete Aktionen', 'C' => 'Legt den Schwerpunkt auf die Business Function', 'D' => 'Erhöht die Benutzerzufriedenheit'],
        'correct' => ['A', 'B', 'D'],
        'link' => 's4h00.php#topic-fiori-ux'
    ],
    [
        'chapter'  => 2,
        'question' => '8. Der Benutzer kann das Erscheinungsbild des Shell- und Content-Bereichs in SAP Business Client 8.00 anpassen, indem er das Theme in den persönlichen Einstellungen wechselt.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4h00.php#topic-fiori-ux'
    ],
    [
        'chapter'  => 2,
        'question' => '9. Welches der folgenden Oberflächenelemente enthält allgemeine Informationen über das SAP-System und die aktuelle Transaktion oder Aufgabe?',
        'type' => 'radio',
        'options' => [ 'A' => 'Statusleiste', 'B' => 'Menüpfad', 'C' => 'Rollenleiste', 'D' => 'Anwendungsfunktionsleiste'],
        'correct' => ['A'],
        'link' => 's4h00.php#topic-user-groups'
    ],
    [
        'chapter'  => 2,
        'question' => '10. Im Menü „SAP Easy Access“ können Sie eine Liste mit Favoriten anlegen, die Folgendes enthalten kann:',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Internetadressen', 'B' => 'Transaktionen', 'C' => 'Verknüpfungen zu Dateien'],
        'correct' => ['A', 'B', 'C'],
        'link' => 's4h00.php#topic-fiori-ux'
    ],
    [
        'chapter'  => 2,
        'question' => '11. Sie möchten einen Wert für ein Feld voreinstellen, das Sie häufig ausfüllen müssen. Hierzu benötigen Sie die Parameter-ID. Welche Hilfefunktion würden Sie zum Suchen der Parameter-ID verwenden?',
        'type' => 'radio',
        'options' => [ 'A' => 'F1', 'B' => 'F4', 'C' => 'Systemhilfe', 'D' => 'F11', 'E' => 'Hilfe zur Anwendung'],
        'correct' => ['A'],
        'link' => 's4h00.php#topic-help-functions'
    ],
    
    // --- KAPITEL 3 ---
    [
        'chapter'  => 3,
        'question' => '12. Welches ist die höchste Ebene aller Organisationseinheiten und stellt das Unternehmen oder die Firmenzentrale dar?',
        'type' => 'radio',
        'options' => [ 'A' => 'Werk', 'B' => 'Lagerort', 'C' => 'Buchungskreis', 'D' => 'Mandant'],
        'correct' => ['D'],
        'link' => 's4h00.php#topic-org-units'
    ],
    [
        'chapter'  => 3,
        'question' => '13. Organisationselemente bilden die Unternehmensstruktur im SAP-System für rechtliche und/oder betriebswirtschaftliche Zwecke ab.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4h00.php#topic-org-units'
    ],
    [
        'chapter'  => 3,
        'question' => '14. Welche der folgenden Elemente sind Beispiele für Organisationselemente?',
        'type' => 'radio',
        'options' => [ 'A' => 'Buchungskreis', 'B' => 'Mandant', 'C' => 'Werk', 'D' => 'Alle genannten Optionen', 'E' => 'Keine der Genannten'],
        'correct' => ['D'],
        'link' => 's4h00.php#topic-org-units'
    ],
    [
        'chapter'  => 3,
        'question' => '15. Welche der folgenden Aussagen über Stammdaten treffen zu?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Stammdaten werden zentral angelegt und sind für alle Anwendungen und alle entsprechend berechtigten Benutzer verfügbar.', 'B' => 'Stammdaten senken die Datenredundanz.', 'C' => 'Stammdaten sind in Sichten gegliedert, die Organisationselementen zugeordnet sind.'],
        'correct' => ['A', 'B', 'C'],
        'link' => 's4h00.php#topic-master-data'
    ],
    [
        'chapter'  => 3,
        'question' => '16. Transaktionen sind Anwendungsprogramme, die Geschäftsprozesse im SAP-System ausführen.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4h00.php#topic-app-types'
    ],
    [
        'chapter'  => 3,
        'question' => '17. Welcher Begriff bezeichnet einen elektronischen Datensatz aus Transaktionen, der alle vordefinierten Informationen enthält?',
        'type' => 'radio',
        'options' => [ 'A' => 'Bericht', 'B' => 'Protokoll', 'C' => 'Beleg', 'D' => 'Bestand'],
        'correct' => ['C'],
        'link' => 's4h00.php#topic-document-principle'
    ],

    // --- KAPITEL 4 ---
    [
        'chapter'  => 4,
        'question' => '18. Welche der folgenden Prozesse (Anwendungen) sind Bestandteil der Produktionsprozesse?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Absatz- und Produktionsgrobplanung', 'B' => 'Lieferabwicklung', 'C' => 'Materialbedarfsplanung', 'D' => 'Produktionsdurchführung', 'E' => 'Leitteileplanung'],
        'correct' => ['A', 'C', 'D', 'E'],
        'link' => 's4h00.php#topic-production-process'
    ],
    [
        'chapter'  => 4,
        'question' => '19. Welche Arten von Informationen sind im Fertigungsauftrag verfügbar?',
        'type' => 'radio',
        'options' => [ 'A' => 'Auftragskomponenten', 'B' => 'Produktionstermine', 'C' => 'Produktionsanweisungen', 'D' => 'Auftragskosten', 'E' => 'Alle genannten Optionen', 'F' => 'Keine der Genannten'],
        'correct' => ['E'],
        'link' => 's4h00.php#topic-production-process'
    ],
    [
        'chapter'  => 4,
        'question' => '20. Nennen Sie den Schritt innerhalb der Produktionsdurchführung, der es ermöglicht, die Istzeit und die Fertigungsleistungen zu erfassen.',
        'type' => 'radio',
        'options' => [ 'A' => 'Disaggregation', 'B' => 'Rückmeldung', 'C' => 'Materialbedarfsplanung', 'D' => 'Kalkulation'],
        'correct' => ['B'],
        'link' => 's4h00.php#topic-production-process'
    ],
    [
        'chapter'  => 4,
        'question' => '21. Welcher der folgenden Vorgänge ist der richtige Prozess für die Kundenauftragsabwicklung?',
        'type' => 'radio',
        'options' => [ 
            'A' => 'Kommissionierung, Kundenauftrag, Warenausgang, Fakturierung und Lieferung',
            'B' => 'Kundenauftrag, Kommissionierung, Warenausgang, Fakturierung und Lieferung',
            'C' => 'Kundenauftrag, Lieferung, Kommissionierung, Warenausgang und Fakturierung',
            'D' => 'Warenausgang, Kommissionierung, Kundenauftrag, Lieferung und Fakturierung'
        ],
        'correct' => ['C'],
        'link' => 's4h00.php#topic-accounts-receivable'
    ],
    [
        'chapter'  => 4,
        'question' => '22. Welche Aktivitäten sind aus einem Lieferbeleg heraus möglich?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Kommissionierung', 'B' => 'Lastschrift', 'C' => 'Gutschrift', 'D' => 'Warenausgang'],
        'correct' => ['A', 'D'],
        'link' => 's4h00.php#topic-accounts-receivable'
    ],
    [
        'chapter'  => 4,
        'question' => '23. Aus welchen beiden Belegarten heraus kann eine Faktura angelegt werden?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Anfrage', 'B' => 'Kundenauftrag', 'C' => 'Angebot', 'D' => 'Bonusliste', 'E' => 'Lieferung'],
        'correct' => ['B', 'E'],
        'link' => 's4h00.php#topic-accounts-receivable'
    ],

    // --- KAPITEL 5 ---
    [
        'chapter'  => 5,
        'question' => '24. _______ ist eine Struktur, die Wertebewegungen in einem Buchungskreis erfasst und die Hauptbuchpositionen in einem Kontenplan darstellt.',
        'type' => 'radio',
        'options' => [ 'A' => 'Buchungskreis', 'B' => 'Sachkonto', 'C' => 'Journalbuchung', 'D' => 'Kontenplan'],
        'correct' => ['B'],
        'link' => 's4h00.php#topic-gl-concepts'
    ],
    [
        'chapter'  => 5,
        'question' => '25. Welche Organisationseinheit in CO-PA ist die höchste Berichtsebene für das Ergebnis-, Vertriebs- und Marketingcontrolling?',
        'type' => 'radio',
        'options' => [ 'A' => 'Buchungskreis', 'B' => 'Profitcenter', 'C' => 'Kostenrechnungskreis', 'D' => 'Ergebnisbereich'],
        'correct' => ['D'],
        'link' => 's4h00.php#topic-controlling-org-units'
    ],

    // --- KAPITEL 6 ---
    [
        'chapter'  => 6,
        'question' => '26. Die Zuordnung von Mitarbeitenden zu Strukturen erfolgt über den Infotyp Organisatorische Zuordnung (0001).',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4h00.php#topic-more-org-units'
    ],
    [
        'chapter'  => 6,
        'question' => '27. Aufgrund der hohen Integration ist Learning ein ideales Werkzeug, um das Wissen der Mitarbeiter ständig zu erweitern.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4h00.php#topic-ecosystem'
    ],

    // --- KAPITEL 7 ---
    [
        'chapter'  => 7,
        'question' => '28. Welche Werkzeuge richten sich bei SAP S/4HANA Embedded Analytics an Endbenutzer?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Abfrage-Browser', 'B' => 'Design Studio', 'C' => 'SAP-Fiori-Analyse-Apps', 'D' => 'Abfrage-Designer', 'E' => 'SAP Smart Business Cockpits'],
        'correct' => ['A', 'C', 'E'],
        'link' => 's4h00.php#topic-app-types'
    ],
    [
        'chapter'  => 7,
        'question' => '29. Welche Werkzeuge werden von Key-Usern verwendet, um Analysen in SAP S/4HANA Embedded Analytics zu entwickeln?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'SAP HANA Live Browser', 'B' => 'KPI-Builder', 'C' => 'Design Studio', 'D' => 'Abfrage-Designer'],
        'correct' => ['B', 'C', 'D'],
        'link' => 's4h00.php#topic-user-groups'
    ],
    [
        'chapter'  => 7,
        'question' => '30. Was bietet ein virtuelles Datenmodell?',
        'type' => 'radio',
        'options' => [ 'A' => 'Für Analysen optimierte Datenbankkopie', 'B' => 'Reportingwerkzeuge für Benutzer', 'C' => 'Sofort nutzbare Datensichten', 'D' => 'Sofort einsatzfähige Geschäftsberichte'],
        'correct' => ['C'],
        'link' => 's4h00.php#topic-hana-platform'
    ],

    // --- KAPITEL 8 ---
    [
        'chapter'  => 8,
        'question' => '31. Welches sind die drei Säulen von SAP Activate?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Methodik', 'B' => 'Leistungsoptimierung', 'C' => 'Geführte Konfiguration', 'D' => 'SAP Best Practices'],
        'correct' => ['A', 'C', 'D'],
        'link' => 's4h00.php#topic-intro'
    ],
    [
        'chapter'  => 8,
        'question' => '32. Welches sind die drei Implementierungsszenarien von SAP Activate?',
        'type' => 'checkbox',
        'options' => [ 'A' => 'Systemkonvertierung', 'B' => 'Neue Implementierung', 'C' => 'Transformation der Landschaft', 'D' => 'Datenbankmigration'],
        'correct' => ['A', 'B', 'C'],
        'link' => 's4h00.php#topic-intro'
    ],
    [
        'chapter'  => 8,
        'question' => '33. Bringen Sie die Phasen der SAP-Activate-Methodik in die richtige Reihenfolge.',
        'type' => 'radio',
        'options' => [ 'A' => 'Vorbereiten - Kennenlernen - Umsetzen - Bereitstellen', 'B' => 'Kennenlernen - Vorbereiten - Umsetzen - Bereitstellen', 'C' => 'Vorbereiten - Umsetzen - Kennenlernen - Bereitstellen'],
        'correct' => ['A'],
        'link' => 's4h00.php#topic-intro'
    ],
    
    // --- KAPITEL 9 ---
    [
        'chapter'  => 9,
        'question' => '34. Im SAP Support Portal können Kunden und Partner SAP-Serviceleistungen über das Internet bestellen.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['A'],
        'link' => 's4h00.php#topic-ecosystem'
    ],
    [
        'chapter'  => 9,
        'question' => '35. SAP Learning bietet nur Klassenraumtrainings an.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch' ],
        'correct' => ['B'],
        'link' => 's4h00.php#topic-ecosystem'
    ],
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
    <title>Quiz: S4H00 Grundlagen</title>
    <link rel="stylesheet" href="css/main.css">
</head>
<body>

    <?php include 'header.php'; ?>

    <div class="quiz-container searchable-block">
        <h1>Quiz: S4H00 Grundlagen</h1>

        <!-- Auswahlbildschirm -->
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

        <!-- Quiz-Bildschirm -->
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
        
        <!-- Ergebnis-Bildschirm -->
        <div id="quiz-result-screen" style="display: none;">
            <h2 id="result-headline"></h2>
            <p id="result-text">Dein Ergebnis: <strong><span id="score-final"></span> von <span id="total-final"></span></strong> Fragen richtig (<span id="percentage-final"></span>%).</p>
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
