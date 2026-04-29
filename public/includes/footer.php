<?php
if (isset($isSoftRoute) && $isSoftRoute) {
    // metadata for router
    $title = "Code & Cash | Lernplattform"; // Default or dynamic if available
    // In a real app, you'd set $title dynamically in the view or controller
    echo "<!-- soft-route-metadata: " . json_encode([
        'title' => $title,
        'pageScript' => $pageScript ?? null
    ]) . " -->";
    return;
}
?>
            </div> <!-- End view-container -->
        </main> <!-- End main-content -->
    </div> <!-- End app-layout -->

    <!-- Globale Variablen für den Router -->
    <script>
        window.CURRENT_PAGE_SCRIPT = '<?= $pageScript ?? '' ?>';
    </script>

    <!-- Core App Script (Globale Helfer & Theme) -->
    <script type="module" src="<?= BASE_URL ?>/assets/js/app.js"></script>
</body>
</html>
