diversIT Social Platform

Aufrufbar unter: https://mintistcool-be74c.web.app/

## Entwickler Installationsanleitung
Was muss installiert werden um mitentwickelt zu können? (verwendeter Quelltext-Editor --> VS Code):
a) Node.js (https://nodejs.org/en/)
b) Angular CLI (in Commandline: npm install -g @angular/cli)
c) Visual Studio Code (https://code.visualstudio.com/)
d) git (https://git-scm.com/downloads) --> (user.email und user.name konfigurieren!)
d1) In Commandline: git config --global user.email "..."
d2) In Commandline: git config --global user.name "..."

Speziell (Nur beim Auftreten von Fehlermeldungen dass eine Komponente nicht installiert ist):
e) Angular Devkit (in Commandline: npm install --save-dev @angular-devkit/build-angular)
f) Angular Compiler CLI (in Commandline: npm install --save-dev @angular/compiler-cli)
g) Angular Compiler (in Commandline: npm install --save-dev @angular/compiler)

Starten der Angular-Web-App (ACHTUNG: Man muss darauf achten dass man im Terminal im richtigen Ordner ist):
h) Node_Modules installieren --> npm install
i) Webserver starten --> ng serve (Default-Host: http://localhost:4200) 
