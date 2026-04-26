# --- Konfiguration ---
# Der Quellordner ist das Verzeichnis, in dem dieses Skript liegt.
$SourceDirectory = Split-Path -Parent $MyInvocation.MyCommand.Definition
$OutputDirectory = Join-Path $SourceDirectory "code_parts" # Erstellt einen Ordner 'code_parts' im Quellverzeichnis

# Schließt jetzt sowohl "libs" als auch "node_modules" aus.
# Das Muster verwendet `|` als "ODER"-Operator in der Regex.
$ExcludeDirectoryPattern = "libs|node_modules"

# Dateitypen, die verarbeitet werden sollen
$FileTypesToProcess = "*.php", "*.html", "*.css", "*.js", "*.json", ".htaccess",".sql",".env",".gitignore","Dockerfile"
$BytesPerPart = 400000 # Anzahl der Bytes (Zeichen) pro Ausgabedatei

# --- Globale Fehlerbehandlung (Trap) ---
Trap {
    Write-Error "Ein UNERWARTETER Fehler ist aufgetreten: $($_.Exception.Message)" -ErrorAction Continue
    Write-Host "Das Skript wird aufgrund eines Fehlers beendet. Bitte drücke eine Taste, um das Fenster zu schließen." -ForegroundColor Red
    Read-Host
    Exit 1
}

# --- Vorbereitung ---
Write-Host "Starte Code-Sammlung und Aufteilung nach Zeichenanzahl ($BytesPerPart Bytes pro Teil)..." -ForegroundColor Green

If (-not (Test-Path $OutputDirectory)) {
    Write-Host "Erstelle Ausgabeordner: '$OutputDirectory'" -ForegroundColor DarkGray
    New-Item -ItemType Directory -Path $OutputDirectory | Out-Null
} else {
    Write-Host "Lösche alte Teildateien im '$OutputDirectory'..." -ForegroundColor Yellow
    Get-ChildItem -Path $OutputDirectory -Filter "*.txt" | Remove-Item -Force -ErrorAction SilentlyContinue
}

$tempCombinedFile = Join-Path ([System.IO.Path]::GetTempPath()) "temp_combined_code_$(Get-Random).txt"
Write-Host "Temporäre Sammeldatei: $($tempCombinedFile)" -ForegroundColor DarkGray

# --- Phase 0: Komplette Ordnerstruktur in Datei schreiben ---
Write-Host "`n--- Phase 0: Komplette Ordnerstruktur ---" -ForegroundColor Magenta
$structureFileName = "00_complete_structure.txt"
$structureFilePath = Join-Path $OutputDirectory $structureFileName
Write-Host "Erstelle Datei mit der kompletten Ordnerstruktur (unter Berücksichtigung der Ausschlüsse): '$structureFilePath'"

# Alle Dateipfade sammeln, ABER die ausgeschlossenen Ordner ignorieren.
# MODIFIZIERT: Where-Object Filter hinzugefügt, um $ExcludeDirectoryPattern anzuwenden.
$allFilePaths = Get-ChildItem -Path $SourceDirectory -Recurse -File | 
    Where-Object { $_.FullName -notmatch "(?i)\\($($ExcludeDirectoryPattern))\\" } | 
    Select-Object -ExpandProperty FullName

# Die Liste in die Datei schreiben
$allFilePaths | Set-Content -Path $structureFilePath -Encoding UTF8

# Die Liste zur Information auch in der Konsole ausgeben
Write-Host "Liste aller gefundenen Dateien (wird in '$structureFileName' gespeichert):" -ForegroundColor DarkGray
$allFilePaths | ForEach-Object {
    Write-Host $_
}
Write-Host "--- Ende der Ordnerstruktur ---`n" -ForegroundColor Magenta


# --- Phase 1: Code sammeln und in temporäre Datei schreiben ---
Write-Host "--- Phase 1: Code sammeln ---" -ForegroundColor Cyan
Write-Host "Sammle nun die ausgewählten Dateitypen ($($FileTypesToProcess -join ', ')) in die temporäre Datei..."

$collectedContentLines = @()

Get-ChildItem -Path $SourceDirectory -Recurse -Include $FileTypesToProcess -File | ForEach-Object {
    $file = $_
    $filePath = $file.FullName

    # Diese Logik war bereits korrekt und schließt die Ordner basierend auf dem Pattern aus.
    If ($filePath -match "(?i)\\($($ExcludeDirectoryPattern))\\") {
        Write-Host "Überspringe (Ausgeschlossener Ordner): $($filePath)" -ForegroundColor DarkYellow
        Return
    }

    Write-Host "Füge hinzu: $($filePath)" -ForegroundColor Gray

    $collectedContentLines += "--- START FILE: $($filePath) ---"
    Try {
        $collectedContentLines += (Get-Content -Path $filePath -Raw -Encoding UTF8)
    } Catch {
        Write-Warning "Fehler beim Lesen der Datei '$filePath': $($_.Exception.Message). Datei wird übersprungen."
    }
    $collectedContentLines += "--- END FILE: $($filePath) ---"
}

If ($collectedContentLines.Count -gt 0) {
    Write-Host "Schreibe gesammelten Inhalt in '$tempCombinedFile'..." -ForegroundColor DarkGray
    $collectedContentLines | Out-String | Set-Content -Path $tempCombinedFile -Encoding UTF8 -Force
}

If (-not (Test-Path $tempCombinedFile) -or (Get-Item $tempCombinedFile).Length -eq 0) {
    Write-Warning "Die temporäre Sammeldatei wurde nicht erstellt oder ist leer. Es gibt keinen Code zum Aufteilen."
    If (Test-Path $tempCombinedFile) { Remove-Item -Path $tempCombinedFile -Force -ErrorAction SilentlyContinue }
    Read-Host "Drücke eine Taste zum Beenden..."
    Exit
}

# --- Phase 2: Temporäre Datei in Teile aufteilen nach Bytes ---
Write-Host "`n--- Phase 2: Aufteilen der Datei ---" -ForegroundColor Cyan
Write-Host "Teile die gesammelte Datei in Teile à $BytesPerPart Bytes auf..."

$fileStream = $null
Try {
    $fileStream = New-Object -TypeName System.IO.FileStream -ArgumentList $tempCombinedFile, ([System.IO.FileMode]::Open), ([System.IO.FileAccess]::Read)
    $buffer = New-Object -TypeName byte[] -ArgumentList $BytesPerPart
    $partNumber = 1

    While ($true) {
        $bytesRead = $fileStream.Read($buffer, 0, $BytesPerPart)

        If ($bytesRead -eq 0) { Break }

        $partFileName = Join-Path $OutputDirectory "combined_code_part_$($partNumber).txt"
        Write-Host "Erstelle Teil $partNumber ($bytesRead Bytes) -> $($partFileName)" -ForegroundColor DarkCyan

        [System.IO.File]::WriteAllBytes($partFileName, ($buffer | Select-Object -First $bytesRead))

        $partNumber++
    }
}
Catch {
    Write-Error "Ein Fehler ist beim Aufteilen der Datei aufgetreten: $($_.Exception.Message)" -ErrorAction Continue
}
Finally {
    If ($fileStream) {
        $fileStream.Dispose()
    }
}

# --- Aufräumen ---
Write-Host "`nLösche temporäre Datei '$tempCombinedFile'..." -ForegroundColor DarkGray
Remove-Item -Path $tempCombinedFile -Force -ErrorAction SilentlyContinue

Write-Host "`nFertig! Alle Teildateien wurden im Ordner '$OutputDirectory' erstellt." -ForegroundColor Green
Write-Host "Die ursprünglichen Dateien wurden NICHT verändert." -ForegroundColor Green
Read-Host "Drücke eine beliebige Taste zum Beenden..."