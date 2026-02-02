# SousChef

## 1. Einleitung

In diesem Projekt wurde ein assistierende Kochapp programmiert, welche Rezepte aus der themealdb API lädt. Diese werden in ihre einzelnen Schritte heruntergebrochen, um den Nutzer einfacher und schneller durch das Rezept zu führen.

themealdb API: https://www.themealdb.com/

## Idee & Methodik

### 2.1 Konzeptentwicklung

Das Konzept entstand durch meine eigenen Erfahrungen beim Kochen von neuen Rezepten. Mein Problem dabei war, dass ich bei einem durchgehenden Text mit den Kochanweisungen oft nicht mehr direkt den Schritt wiedergefunden habe, bei dem ich weitermachen muss. Dadurch hatte ich sowohl den Text unnötig öfter lesen müssen, als auch mehr Stress beim Kochen.

### 2.2 Methodik & technische Umsetzung

Zuerst wurde in Figma ein grober klickbarer Prototyp erstellt, um die Screens und deren Navigation zu veranschaulichen. Nach Rücksprache mit meinem Dozenten konnte ich dann das daraus gewonnene Feedback direkt in meiner anschließenden technischen Umsetzung mit Code anwenden. Der Prototyp war dabei immer nur ein grober Leitfaden für die eigene Orientierung bei der Umsetzung, nie eine exakte Anleitung. 

### 2.3 Funktionsweise der Applikation

Zuerst befindet sich der Nutzer auf der Startseite. Hier sieht er die Rezepte als Kacheln bestehend aus einem Bild des Rezepts, dessen Namen und einem Tag, der es in eine Kathegorie einordnet. Dabei sind die Rezepte nach den Kathegorien und innerhalb dieser alphabetisch nach deren Namen sortiert. Im Header findet sich ein Lupen-Icon, mit dem sich eine Suchleiste öffnen lässt. Dort kann der Nutzer einen Tag auswählen und/oder einen Rezeptnamen eingeben, nach dem er filtern möchte. In der mobile Version ist immer nur eine Kachel in einer Zeile, in der Desktop Version sind es 3 Kacheln.
Klickt man auf eine dieser Kacheln, kommt man zu einer Vorschau des Rezepts. Dort findet man die Zutaten und die Zubereitungsschritte aufgelistet. 
Wenn man in dieser Ansicht auf den Play-Button klickt, kommt man weiter zum Kochmodus. Hier sind die Schritte des Rezeptes nun einzeln heruntergebrochen. Bei der mobile Version wird immer nur der aktuelle Schritt angezeigt, bei der Desktop Version zusätzlich noch ausgegraut links davon der vorherige und rechts davon der nächste Schritt. Die Navigation zwischen den Schritten erfolgt durch große Vor-/Zurück-Buttons, welche eine Navigation zB mit den Fingerknöcheln (durch "schmutzige") Hände leichter machen.

## 3. Reflexion der Umsetzung

### 3.1 Schwierigkeiten & Probleme

Zu Beginn war die erste Herausforderung das Svelte Projekt überhaupt erst einmal richtig aufzusetzen. Durch meine Unwissenheit darüber, dass meine Projektstruktur nicht geeignet war, musste ich das Projekt dann schließlich sogar nochmal neu aufsetzen. Von hier an arbeitete ich mit Copilot und ChatGPT zusammen. Ich schickte ChatGPT die 3 Beispielscreens aus meinem Figma Prototyp mit einer Beschreibung meiner Ansprüche an die Applikation und deren Ordnerstruktur. Diese sollte nun unterteilt werden in Backend/Frontend und das Frontend schließlich in Seiten und Komponenten. Die Seiten setzten dabei nur die benötigten Komponenten in ein Layout und gaben ggf. noch styling hinzu, welches als Komponente nicht sinnvoll war. ChatGPT hat mir dann aus dieser Beschreibung einen detaillierten Prompt ausgegeben, den ich Copilot schickte. Zuerst war dabei das Backend dran, Copilot konnte mit dem Prompt von ChatGPT viel leichter mein Vorhaben verstehen und hat direkt die passende Ordnerstruktur selbst erstellt. Als das Backend funktionierte ging ich über zum Frontend und nach ein paar Fehlerbehebungen war ich nach ca. 2,5 Stunden an einem besseren Stand wie zuvor, dank der logischen Projektstruktur. 
Von da an fügte ich nach und nach Funktionen ein und verbesserte das Design der App weiter. Wenn etwas mehrmals nicht mit meinen eigenen Prompts an Copilot klappte, ließ ich ChatGPT einen preziseren Prompt schreiben, indem ich ihm kurz mein Problem und meine Anforderungen erklärte. Zum Ende hin entdeckte ich zudem, dass Copilot Anforderungen besser ohne einen Error zu erzeugen umsetzen konnte, wenn ich ihm zusätzlich sagte, dass er 2-3 mal über den Code gehen und ihn auf Fehler überprüfen soll.

### 3.2 Erfolgsfaktoren

Momente des Erfolgs hatte ich, nachdem ich das Projekt nochmal neu aufgesetzt und 2,5 Stunden später zum Laufen gebracht hatte. Auch durch die besser verständliche und sinnvolle Struktur, welche das Projekt im weiteren Verlauf auch für Copilot leichter zu bearbeiten machte. Außerdem lernte ich, dass ChatGPT bei manchen Anforderungen ein guter Übersetzer zwischen mir un Copilot sein kann. Und letztendlich dass Copilot auch direkt seine eigen erstellten Fehler in 1-2 Kontrolldurchgängen selbst verbessern kann.

## 4. Ausblick

### 4.1 Weitere Möglichkeiten

Zum Ende hin habe ich noch eine Funktion hinzugefügt, dass man sich im Kochmodus den aktuellen Schritt vorlesen lassen kann, jedoch ist die Stimme dabei nicht sehr gut. Diese könnte man noch verbessern und auch einen Button einbauen, der den Schritt nochmal wiederholt. Außerdem könnte man auch eine Spracheingabe integrieren, sodass man gar nicht mehr unbedingt die Buttons benutzen müsste. Das Bearbeiten-Icon auf der Detailansicht der Rezepte ist nur ein Platzhalter den man noch technisch umsetzen könnte, für meine Projektanforderungen schien mir das jedoch als nicht sehr wichtig, da es nicht direkt zum Grundkonzept beiwirkt. Zusätzlich könnte man noch hinzufügen, dass Rezepte auch von anderen Websiten wie chefkoch importiert werden können um eine vielseitigere Anwendungsmöglichkeit der App zu erzielen.

Insgesamt bin ich sehr zufrieden über meinen finalen Stand des Projekts und was ich auf dem Weg hin zu diesem Stand lernen konnte.


