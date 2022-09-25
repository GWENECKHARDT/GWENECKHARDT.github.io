# IKT22_Projekt_Reiseblog_S0573811
Repository für das IKT-Projekt aus dem Sommersemester 2022.

Das Projekt soll einen Reiseblog darstellen. <br>
Über den gelben Button unten rechts können Fotos aufgenommen, sowie hochgeladen werden.<br>
Den Bildern kann ein Titel, das Aufnahmedatum und Notizen hinzugefügt werden.<br>
Außerdem kann ein Ort entweder manuell eingegeben werden oder alternativ kann der aktuelle Standort über
den Button "Location" ausgegeben werden. Nutzt man diese Variante wird der Längen- und Breitengrad in der
Datenbank gespeichert. <br>
Im Menüpunkt "Karte" werden alle Standorte, die einen Längen- und Breitengrad haben, angezeigt.<br>
Wird der Standort manuell eingegeben bzw. kann der Standort aufgrund fehlender Internetverbindung nicht
abgefragt werden, bleiben Längen- und Breitengrad leer und werden nicht auf der Karte angezeigt.<br>
Auf den Karten der Bildergalerie, sieht man das Bild, den Titel und den Ort. Klickt man auf "Weitere
Informationen", werden einem auch das Datum und die Notizen angezeigt.<br>
Im Menüpunkt "Hilfe" findet man eine kurze Beschreibung der Anwendung, sowie Kontaktinformationen, wenn
man auf die jeweiligen Buttons klickt.<br>
Die Anwendung lässt sich installieren.<br>
Außerdem ist sie auch offline verwendbar. Offline greift die Anwendung auf den bestehenden Cache zurück.
Das bedeutet, die Menüpunkte "Bilder", "Karte" und "Hilfe" werden so angezeigt, wie sie bei der letzten 
Internetverbindung bestanden. Werden Beiträge hochgeladen, während keine Internetverbindung 
besteht, werden diese zwischengespeichert und synchronisiert, sobald wieder eine Verbindung mit dem Internet
besteht.<br>
Darüber hinaus können über die beiden Buttons "Benachrichtigung" in der Kopfleiste bzw. "Benachrichtigung Ein"
im seitlichen Menü, Benachrichtigungen aktiviert werden. Man bekommt eine Benachrichtigung, wenn man diese 
aktiviert hat und dann wieder, sobald Beiträge in der Anwendung geteilt werden.<br>
Die Aktivierungs-Benachrichtigung kann man über das X Schließen oder mit Ok bestätigen.
In der Beitrags-Benachrichtigung, gelangt man direkt in die Bildergalerie, wenn man auf die Benachrichtigung klickt.<br>
Das Frontend ist so gestaltet, dass sich die Anwendung sowohl auf einem Computer, wie auch auf einem Smartphone 
bedienen lässt.<br>

Hinweis: Sowohl die Nutzung der Kamera, sowie des Standortes und der Benachrichtigungen, werden vom Browser selbst 
noch einmal abgefragt. Hat man diese schon vorab verweigert, muss man sie in den Einstellungen des Browsers wieder
aktivieren.

Nach dem Klonen des Projektes von Github:
Im Projektordner IKT22_Projekt_Reiseblog befinden sich die Ordner frontend und backend. In beiden von ihnen muss einmal
der Befehl "npm install" ausgeführt werden. <br>
Außerdem muss die Variable DB_CONNECTION in der Datei .env im Ordner backend angepasst werden.<br>
Damit die Anwendung lokal nutzbar ist, muss im backend-Ordner der Befehl "npm run watch" und im frontend-Ordner der Befehl
"npm start" ausgeführt werden. Beachte bitte, dass das Backend, bei einer offline-Nutzung, möglicherweise neu gestartet 
werden muss, sobald man wieder mit dem Internet verbunden ist. Erst dann kann die Synchronisierung mit den zwischenzeitlich
hochgeladenen Bildern erfolgen.<br>

PS.:
Um einen ersten Eindruck von der Anwendung zu bekommen, besuche https://gweneckhardt.github.io/ .
Hier kannst du sehen, was du mit der Anwendung machen kannst und wie sie aussieht. 
Aber bedenke, dass die Eingaben, die du machst, nicht gespeichert werden.
(Repository: https://github.com/GWENECKHARDT/GWENECKHARDT.github.io)



