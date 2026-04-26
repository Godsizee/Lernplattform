@echo off
title Code & Cash - Datenbank Tunnel
color 0A

echo =======================================================
echo    Sicherer SSH-Tunnel zur Code & Cash Datenbank
echo =======================================================
echo.
echo Verbinde mit VPS (212.227.57.140 ueber Port 4166)...
echo.
echo WICHTIG: 
echo Bitte gib dein SSH-Passwort ein, wenn du danach gefragt wirst.
echo Lass dieses schwarze Fenster danach einfach geoeffnet!
echo Sobald du das Fenster schliesst, bricht die DB-Verbindung ab.
echo.

:: Hier den Benutzernamen anpassen, falls du nicht 'root' nutzt!
ssh -p 4166 -N -L 5433:127.0.0.1:5433 root@212.227.57.140

echo.
echo Verbindung getrennt.
pause
