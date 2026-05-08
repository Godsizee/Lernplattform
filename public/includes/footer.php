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

        <?php if (isset($hideSidebar) && !$hideSidebar): ?>
        <!-- Bottom Navigation (Mobile Only) -->
        <nav class="bottom-nav">
            <a href="<?= BASE_URL ?>/" class="bottom-nav-item <?= $currentRoute === '/' ? 'active' : '' ?>">
                <i class="ph ph-squares-four"></i>
                <span class="bottom-nav-text">Dashboard</span>
            </a>
            <a href="<?= BASE_URL ?>/learning" class="bottom-nav-item <?= $currentRoute === '/learning' ? 'active' : '' ?>">
                <i class="ph ph-books"></i>
                <span class="bottom-nav-text">Lernen</span>
            </a>
            <a href="<?= BASE_URL ?>/profile" class="bottom-nav-item <?= $currentRoute === '/profile' ? 'active' : '' ?>">
                <i class="ph ph-user-circle"></i>
                <span class="bottom-nav-text">Profil</span>
            </a>
            <?php if (isset($user) && $user && $user['role'] === 'admin'): ?>
            <a href="<?= BASE_URL ?>/admin" class="bottom-nav-item <?= $currentRoute === '/admin' ? 'active' : '' ?>">
                <i class="ph ph-shield-star"></i>
                <span class="bottom-nav-text">Admin</span>
            </a>
            <?php endif; ?>
        </nav>
        <?php endif; ?>
    </div> <!-- End app-layout -->

    <!-- Globale Variablen für den Router -->
    <script>
        window.CURRENT_PAGE_SCRIPT = '<?= $pageScript ?? '' ?>';
    </script>

    <!-- Vendor Scripts -->
    <script src="<?= BASE_URL ?>/assets/vendor/confetti.browser.min.js"></script>

    <!-- Core App Script (Globale Helfer & Theme) -->
    <script type="module" src="<?= BASE_URL ?>/assets/js/app.js"></script>
</body>
</html>
