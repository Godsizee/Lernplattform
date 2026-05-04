<?php
// Das $quizData Array für S4220 mit den neuen Fragetypen
$quizData = [
    // --- KAPITEL 1 ---
    [
        'chapter'  => 1,
        'question' => '1. Welche der folgenden Elemente verwenden den Materialbedarfsplanungslauf (MRP-Lauf)?',
        'type' => 'checkbox',
        'options' => [
            'A' => 'Periodenbasierte Planung und Produktion',
            'B' => 'Planung für die diskrete Fertigung',
            'C' => 'Integrierte Unternehmensplanung',
            'D' => 'Montageabwicklung mit Fertigungsauftrag'
        ],
        'correct' => ['A', 'B'],
        'link' => 's4220.php#k1-l1'
    ],
    // --- KAPITEL 2 ---
    [
        'chapter'  => 2,
        'question' => '1. Welche der folgenden Elemente gehören zu den Produktionsstammdaten in SAP S/4HANA?',
        'type' => 'checkbox',
        'options' => [
            'A' => 'Arbeitsplatz',
            'B' => 'Umlagerung',
            'C' => 'Produktkostensammler',
            'D' => 'Stückliste'
        ],
        'correct' => ['A', 'D'],
        'link' => 's4220.php#k2-l1'
    ],
	// --- KAPITEL 3 ---
	[
		'chapter'  => 3,
		'question' => '1. Eine Planungsstrategie unterstützt die Lagerfertigung, wenn Sie die Produktion oder den Einkauf erst starten können, wenn Sie einen Kundenauftrag erhalten.',
		'type' => 'radio',
		'options' => [ 'A' => 'Richtig', 'B' => 'Falsch'],
		'correct' => ['B'],
		'link' => 's4220.php#k3-l2'
	],
	[
		'chapter'  => 3,
		'question' => '2. Ordnen Sie jedem Verrechnungsmodus die entsprechende Funktion zu.',
		'type' => 'matching',
		'options' => [
			'stems' => [
				['id' => 'A', 'text' => 'Rückwärtsverrechnung (Verrechnungsmodus 1)'],
				['id' => 'B', 'text' => 'Vorwärtsverrechnung (Verrechnungsmodus 3)'],
			],
			'responses' => [
				['id' => 'A', 'text' => 'Kundenaufträge werden mit Planprimärbedarfen nach dem Kundenbedarf verrechnet.'],
				['id' => 'B', 'text' => 'Kundenaufträge werden mit Planprimärbedarfen vor dem Kundenbedarf verrechnet.'],
			]
		],
		'correct' => [ 'A' => 'B', 'B' => 'A' ],
		'link' => 's4220.php#k3-l1'
	],
    [
        'chapter'  => 3,
        'question' => '3. Wenn Sie Modus 1 verwenden und das Rückwärtsverrechnungsintervall nicht pflegen, werden nur die Bedarfe am aktuellen Tag verrechnet.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch'],
        'correct' => ['A'],
        'link' => 's4220.php#k3-l1'
    ],
    [
        'chapter'  => 3,
        'question' => '4. Gleichen Sie jede Option für das Einzel-/Sammelbedarfskennzeichen mit der entsprechenden Beschreibung ab.',
        'type' => 'matching',
        'options' => [
            'stems' => [
                ['id' => 'A', 'text' => 'ECC-Kennzeichen 1'],
                ['id' => 'B', 'text' => 'ECC-Kennzeichen 2'],
            ],
            'responses' => [
                ['id' => 'A', 'text' => 'Dieses Kennzeichen für Einzelbedarfe bedeutet, dass das Material speziell für einen Kundenauftrag gefertigt oder beschafft wird. Für jeden Bedarf wird ein eigenes Segment angelegt. Ein Einzelbedarf wird nur angelegt, wenn das übergeordnete Material keinen Sammelbedarf erzeugt.'],
                ['id' => 'B', 'text' => 'Dieses Kennzeichen für Sammelbedarf bedeutet, dass das Material für verschiedene Bedarfe gefertigt oder beschafft wird. Die Bedarfe sind im Nettobedarfssegment enthalten.'],
            ]
        ],
        'correct' => [ 'A' => 'A', 'B' => 'B' ],
        'link' => 's4220.php#k3-l2'
    ],
    [
        'chapter'  => 3,
        'question' => '5. Ordnen Sie die Schritte zur Reorganisation von Planprimärbedarfen in der richtigen Reihenfolge an.',
        'type' => 'radio',
        'options' => [
            'A' => '1. Bedarfe anpassen (MD74) → 2. Einteilungen reorganisieren (MD75) → 3. Historie löschen (MD76)',
            'B' => '1. Historie löschen (MD76) → 2. Bedarfe anpassen (MD74) → 3. Einteilungen reorganisieren (MD75)',
            'C' => '1. Einteilungen reorganisieren (MD75) → 2. Historie löschen (MD76) → 3. Bedarfe anpassen (MD74)'
        ],
        'correct' => ['A'],
        'link' => 's4220.php#k3-l3'
    ],
    // --- KAPITEL 4 ---
    [
        'chapter'  => 4,
        'question' => '1. Wenn Materialdaten vor der Aktivierung des MRP-Laufs für ein Werk angelegt wurden, müssen Sie für alle dispositionsrelevanten Materialien im Werk einen Eintrag in der Planungsvormerkdatei anlegen.',
        'type' => 'radio',
        'options' => [ 'A' => 'Richtig', 'B' => 'Falsch'],
        'correct' => ['A'],
        'link' => 's4220.php#k4-l1'
    ],
    [
        'chapter'  => 4,
        'question' => '2. Welche der folgenden Vorteile bietet eine verbesserte Materialbedarfsplanung und Produktionsplanung mit SAP S/4HANA?',
        'type' => 'checkbox',
        'options' => [
            'A' => 'Häufigere MRP-Läufe, die zeitnahe und genauere Materialbestandsinformationen bereitstellen.',
            'B' => 'Nur Sichtbarkeit für Materialunterdeckungen aus standortspezifischer Sicht und aus Materialsicht.',
            'C' => 'Zentrale Echtzeitsicht auf Materialunterdeckungen aus Informationen in allen Standorten, ohne über mehrere ERP-Transaktionen hinweg navigieren zu müssen.',
            'D' => 'Neue Sichten auf Materialunterdeckungen aus Kundenauftrags-, Bestands- und Beschaffungssicht anstatt nur aus Materialsicht.',
            'E' => 'Neue Möglichkeit, empfohlene Lösungsumsetzbarkeit und -effektivität in Echtzeit zu überprüfen und in Tausenden von Materialsituationen zu simulieren.'
        ],
        'correct' => ['A', 'C', 'D', 'E'],
        'link' => 's4220.php#k4-l2'
    ],
    // --- KAPITEL 5 ---
    [
        'chapter'  => 5,
        'question' => '1. Welche der folgenden Komponenten gehören zu SAP Integrated Business Planning (IBP)?',
        'type' => 'checkbox',
        'options' => [
            'A' => 'Production Planning and Detailed Scheduling',
            'B' => 'Bedarf',
            'C' => 'Response and Supply',
            'D' => 'Available To Promise'
        ],
        'correct' => ['B', 'C', ],
        'link' => 's4220.php#k5-l1'
    ],
    [
        'chapter'  => 5,
        'question' => '2. Welche herkömmlichen Komponenten können Sie durch die eingebettete PP/DS in SAP S/4HANA ersetzen?',
        'type' => 'checkbox',
        'options' => [
            'A' => 'Absatzplanung (DP)',
            'B' => 'Standard-SOP',
            'C' => 'Kapazitätsplanung (CRP)',
            'D' => 'Materialbedarfsplanung (MRP)'
        ],
        'correct' => ['C', 'D'],
        'link' => 's4220.php#k5-l1'
    ],
    [
        'chapter'  => 5,
        'question' => '3. Welches Stammdatenobjekt müssen Sie per CIF aus einem ERP-System übertragen, um eine Ressource auf Seiten des SAP-SCM-Systems zu erhalten?',
        'type' => 'radio',
        'options' => [
            'A' => 'Werk',
            'B' => 'Arbeitsplatzkapazität',
            'C' => 'Material',
            'D' => 'Dispoberiech'
        ],
        'correct' => ['B'],
        'link' => 's4220.php#k5-l2'
    ],
    [
        'chapter'  => 5,
        'question' => '4. Welche Alert-Typen bietet der Alert Monitor in der erweiterten Planung von SAP S/4HANA?',
        'type' => 'checkbox',
        'options' => [
            'A' => 'Fehler',
            'B' => 'Benachrichtigung',
            'C' => 'Information',
            'D' => 'Warnung'
        ],
        'correct' => ['A', 'C', 'D'],
        'link' => 's4220.php#k5-l4'
    ],
    [
        'chapter'  => 5,
        'question' => '5. Welche der folgenden Aufgaben können Sie mit der Produktsicht in der erweiterten Planung von SAP S/4HANA ausführen?',
        'type' => 'checkbox',
        'options' => [
            'A' => 'Interaktive Planung',
            'B' => 'Beschaffungselemente ändern',
            'C' => 'Optimierungslauf starten',
            'D' => 'ATP-Prüfung einrichten'
        ],
        'correct' => ['A', 'B' ],
        'link' => 's4220.php#k5-l6'
    ],
    // --- KAPITEL 6 ---
    [
        'chapter'  => 6,
        'question' => '1. Welche der folgenden Elemente sind vom Einzel-/Sammelkennzeichen betroffen?',
        'type' => 'checkbox',
        'options' => [
            'A' => 'Die Beschaffungsart',
            'B' => 'die Terminierung des Beschaffungselements',
            'C' => 'Die Art und Weise der Bestandsführung',
            'D' => 'Kundeneinzelfertigung vs. Lagerfertigung'
        ],
        'correct' => ['C', 'D'],
        'link' => 's4220.php#k6-l1'
    ],
    [
        'chapter'  => 6,
        'question' => '2. Was passiert mit der Verrechnung im Hinblick auf Planungsstrategien?',
        'type' => 'checkbox',
        'options' => [
            'A' => 'Planprimärbedarfe können mit Kundenaufträgen verrechnet werden.',
            'B' => 'Kundenaufträge können mit Planprimärbedarfen verrechnet werden.',
            'C' => 'Kundenaufträge können den Bestand reduzieren.',
            'D' => 'Planprimärbedarfe können den Bestand reduzieren.'
        ],
        'correct' => ['B'],
        'link' => 's4220.php#k6-l2'
    ],
    // --- KAPITEL 7 ---
    [
        'chapter'  => 7,
        'question' => '1. Was ist Sicherheitsbestand in der Materialbedarfsplanung?',
        'type' => 'radio',
        'options' => [
            'A' => 'Frei verwendbarer Bestand',
            'B' => 'Gesperrter Bestand',
            'C' => 'Eine Anforderung',
            'D' => 'Ein Beleg'
        ],
        'correct' => ['C'],
        'link' => 's4220.php#k7-l1'
    ],
    [
        'chapter'  => 7,
        'question' => '2. Was ist in Bezug auf PP/DS in SAP S/4HANA eine Heuristik?',
        'type' => 'radio',
        'options' => [
            'A' => 'Eine Customizing-Einstellung für die erweiterte Planung.',
            'B' => 'einen Funktionsbaustein mit Steuerungsparametern',
            'C' => 'eine Reihe statistischer Planungsparameter für den Planungslauf',
            'D' => 'Ein Job, der mit Jahresabschlussaktivitäten des laufenden Jahres ausgeführt werden soll'
        ],
        'correct' => ['B'],
        'link' => 's4220.php#k7-l2'
    ],
    [
        'chapter'  => 7,
        'question' => '3. Welche Arten von Heuristiken gibt es in SAP S/4HANA PP/DS?',
        'type' => 'checkbox',
        'options' => [
            'A' => 'Heuristiken zur Ablaufsteuerung',
            'B' => 'Produktheuristiken',
            'C' => 'Performance-Heuristiken',
            'D' => 'Service-Heuristiken'
        ],
        'correct' => ['A', 'B', 'D'],
        'link' => 's4220.php#k7-l2'
    ],
    // --- KAPITEL 8 ---
    [
        'chapter'  => 8,
        'question' => '1. Welche Einstellungen finden Sie in einer Feinplanungsstrategie?',
        'type' => 'checkbox',
        'options' => [
            'A' => 'ob die Terminierung in Nichtarbeitszeiten erfolgt',
            'B' => 'ob Planaufträge oder Bestellanforderungen angelegt werden',
            'C' => 'Planungsrichtung, ausgehend vom Wunschtermin',
            'D' => 'das Losgrößenverfahren'
        ],
        'correct' => ['A', 'C'],
        'link' => 's4220.php#k8-l1'
    ],
    [
        'chapter'  => 8,
        'question' => '2. Welches Werkzeug ist das zentrale Werkzeug für die interaktive Kapazitätsplanung in der erweiterten Planung von SAP S/4HANA?',
        'type' => 'radio',
        'options' => [
            'A' => 'Produktsicht',
            'B' => 'Produktübersicht',
            'C' => 'Feinplanungsplantafel',
            'D' => 'Planungstableau'
        ],
        'correct' => ['C'],
        'link' => 's4220.php#k8-l2'
    ],
    [
        'chapter'  => 8,
        'question' => '3. Welche der folgenden Apps dienen der Feinplanung in SAP S/4HANA?',
        'type' => 'checkbox',
        'options' => [
            'A' => 'Kapazitätsübersichtstabelle',
            'B' => 'Heuristik der Abweichungsanalyse',
            'C' => 'Kapazitätsauslastung ermitteln',
            'D' => 'Fertigungsplantafel'
        ],
        'correct' => ['C', 'D'],
        'link' => 's4220.php#k8-l3'
    ],
    [
        'chapter'  => 8,
        'question' => '4. MRP Live kann die PP/DS-Planung und die Produktionsplanung in SAP S/4HANA nicht parallel ausführen.',
        'type' => 'radio',
        'options' => ['A' => 'Richtig', 'B' => 'Falsch'],
        'correct' => ['B'],
        'link' => 's4220.php#k8-l5'
    ],
    [
        'chapter'  => 8,
        'question' => '5. Was optimiert der PP/DS-Optimierer?',
        'type' => 'radio',
        'options' => [
            'A' => 'Sie maximiert den ROI.',
            'B' => 'Sie minimiert eine Zielfunktion.',
            'C' => 'Sie minimiert die Ressourcenauslastung.',
            'D' => 'Sie minimiert die Anzahl der möglichen Lösungen.'
        ],
        'correct' => ['B'],
        'link' => 's4220.php#k8-l7'
    ],
	// --- KAPITEL 9 ---
    [
        'chapter'  => 9,
        'question' => '1. Ordnen Sie die fünf Schritte der DDMRP-Methodik in der richtigen Reihenfolge an.',
        'type' => 'radio',
        'options' => [
            'A' => '1. Puffer festlegen → 2. Pufferprofile einrichten → 3. Puffergrößen anpassen → 4. Nachschubaufträge erstellen → 5. Aufträge priorisieren',
            'B' => '1. Pufferprofile einrichten → 2. Puffer festlegen → 3. Puffergrößen anpassen → 4. Nachschubaufträge erstellen → 5. Aufträge priorisieren',
            'C' => '1. Puffer festlegen → 2. Puffergrößen anpassen → 3. Pufferprofile einrichten → 4. Aufträge priorisieren → 5. Nachschubaufträge erstellen'
        ],
        'correct' => ['A'],
        'link' => 's4220.php#k9-l1'
    ],
[
    'chapter'  => 9,
    'question' => '2. Ordnen Sie jede App der entsprechenden Verwendung zu.',
    'type'     => 'matching',
    'options'  => [
        'stems' => [
            ['id' => 'A', 'text' => 'Produktklassifizierung einplanen (BWB)'],
            ['id' => 'B', 'text' => 'Massenpflege von Produkten (BWB)'],
            ['id' => 'C', 'text' => 'Durchlaufzeitklassifikation einplanen (BWB)'],
            ['id' => 'D', 'text' => 'Berechnung von Puffervorschlag einplanen']
        ],
        'responses' => [
            ['id' => 'A', 'text' => 'Mit dieser App können Sie die für die bedarfsorientierte Wiederbeschaffung relevanten Produkte klassifizieren, indem Sie sie in einem festgelegten Auswertungsintervall ausgehend von ihrer entkoppelten Durchlaufzeit (EFG-Klassifizierung) auswerten.'],
            ['id' => 'B', 'text' => 'Mit dieser App können Sie Ihre Produkte klassifizieren, indem Sie sie in einem festgelegten Auswertungsintervall ausgehend von ihrem Warenausgangswert (ABC-Klassifizierung), ihrer Nutzung in allen Stücklisten (PQR-Klassifizierung) und den Schwankungen des Istbedarfs (XYZ-Klassifizierung) systematisch auswerten.'],
            ['id' => 'C', 'text' => 'Mit dieser App können Sie Puffervorschläge (Bestandsvorschläge) für Ihre bedarfsorientiert beschafften Produkte basierend auf ihrem durchschnittlichen Tagesverbrauch, ihrer entkoppelten Beschaffungszeit, ihren Pufferprofilen und mehreren anderen Faktoren generieren.'],
            ['id' => 'D', 'text' => 'Mit dieser App können Sie Produktdetails (Stammdatensätze) für die bedarfsorientierte Wiederbeschaffung relevant sind, anzeigen und ändern.']
        ]
    ],
    'correct'  => [ 'A' => 'C', 'B' => 'A', 'C' => 'D', 'D' => 'B' ],
    'link'     => 's4220.php#k9-l1'
],
];

$chapters = array_unique(array_column($quizData, 'chapter'));
sort($chapters);
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz: S4220 Produktionsplanung</title>
    <link rel="stylesheet" href="css/main.css">
</head>
<body>

    <?php include 'header.php'; ?>

    <div class="quiz-container searchable-block">
        <h1>Quiz: S4220 Produktionsplanung</h1>

        <div id="chapter-selection-screen">
            <h2>Wähle deine Kapitel</h2>
            <p>Klicke auf die Kapitelkarten, die du in dein Quiz aufnehmen möchtest.</p>
            <form id="chapter-select-form">
                <div class="chapter-selection-grid">
                    <?php foreach ($chapters as $chapter): ?>
                        <div class="chapter-card selected" data-chapter="<?= $chapter ?>">
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
                <div id="options-container"></div>
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
