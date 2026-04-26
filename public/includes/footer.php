            </div> <!-- End view-container -->
        </main> <!-- End main-content -->
    </div> <!-- End app-layout -->

    <!-- Core App Script (Globale Helfer & Theme) -->
    <script type="module" src="<?= $basePath ?>assets/js/app.js"></script>
    
    <!-- Spezifisches Skript der aktuellen Seite einfügen, falls vorhanden -->
    <?php if (isset($pageScript) && $pageScript): ?>
        <script type="module" src="<?= $basePath ?>assets/js/pages/<?= htmlspecialchars($pageScript) ?>.js"></script>
    <?php endif; ?>
</body>
</html>
