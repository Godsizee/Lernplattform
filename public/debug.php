<?php
echo "<pre>";
echo "REQUEST_URI: " . $_SERVER['REQUEST_URI'] . "\n";
echo "SCRIPT_NAME: " . $_SERVER['SCRIPT_NAME'] . "\n";
echo "PHP_SELF: " . $_SERVER['PHP_SELF'] . "\n";
echo "DOCUMENT_ROOT: " . $_SERVER['DOCUMENT_ROOT'] . "\n";
echo "BASE_DIR (calculated): " . dirname($_SERVER['SCRIPT_NAME']) . "\n";
echo "CWD: " . getcwd() . "\n";
echo "</pre>";
