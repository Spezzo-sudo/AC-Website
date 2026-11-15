# klimafinder.ch

Eine ruhige, mehrsprachige Website für die erste Klima-Orientierung in der Schweiz. Ausschliessliches Repository: **Spezzo-sudo/AC-Website**.

## Ausprobieren

Node.js 22 oder neuer, keine Fremdpakete und keine Installation nötig.

```sh
npm run dev
```

Danach `http://localhost:5173` im Browser öffnen. Befehle im Stammordner dieses Repositories ausführen. Der lokale Entwicklungsserver ist kein Produktionsserver.

```sh
npm run check
npm test
npm run build
```

`dist/` ist das vollständige statische Deployment. Die relativen Assetpfade funktionieren auch unter einem Unterverzeichnis wie GitHub Pages. Navigation nutzt Hash-Routen, z. B. `#/de/compare`. Es werden keine API-Schlüssel benötigt.

## Enthalten

- Responsive Startseite mit eigener Raumillustration und Gerätevisualisierungen, keine externen Fonts oder Bilddienste.
- Fünfstufiger Finder: Raum/Nutzung, Fläche, Wärme, Miet-/Eigentumssituation, Montage, Kanton/Gemeinde, Priorität und Budget.
- Geräteart mit nachvollziehbarer Begründung, offengelegter Beispielrechnung für Kühlleistung und anpassbarem Stromkostenrechner.
- Vergleich und Händlerdialoge mit ausdrücklich fiktiven Geräteprofilen.
- 26 Kantone mit offenen Abklärungsfragen, ohne erfundene Rechtsauskunft.
- DE / FR / IT / EN, Ratgeber, Finanzierungsprinzip, Datenschutz- und Impressum-Platzhalter.
- Download eines lokalen Projektbriefs, keine Kontaktübermittlung, kein Tracking, keine Cookies, keine Speicherung von Finderantworten über das Neuladen hinaus.
- Native Dialoge, Tastaturbedienung, Fokusführung und reduzierte Bewegung.

## Bewusst noch offen

Die Website ist eine **funktionierende Konzeptversion**, kein angeschlossener Marktplatz. Es gibt keine echten Modelle, Händlerpreise, Lieferzusagen, Affiliate-Verträge, Rechtsbewertungen oder Montagepartner. Betreiber und Hosting sind zu ergänzen. Ein Banner kennzeichnet den Datenstand, `noindex` verhindert beabsichtigte Suchmaschinenindexierung; es ist keine Zugriffssperre. Eine öffentliche Vorschau enthält keine vertraulichen Daten.

Die Empfehlung wählt derzeit ausschliesslich eine Geräteart anhand Montageoption und Priorität. Fläche und Wärmeszenario verändern die illustrative Leistungsspanne. Raumnutzung, Wohnstatus und Budget werden für die spätere Fachabklärung erfasst; sie lösen noch keine validierte gerätespezifische Optimierung aus. Budget- und Lärmabgleich werden ausdrücklich als offen ausgewiesen. Geräteleistung und tatsächliche Eignung sind separat zu prüfen. Keine Fachplanung und keine Bewilligungsfreigabe.

## Architektur

| Pfad | Verantwortung |
| --- | --- |
| `src/app.js` | Routing, flüchtiger Zustand, Interaktionen |
| `src/components/` | Navigation, Dialog, Finder, Icons und Geräteillustrationen |
| `src/views/` | Getrennte Seiten: Start, Vergleich, Regeln, Ergebnis, Ratgeber |
| `src/domain/finder.js` | Reine Berechnungs- und Auswahlfunktionen |
| `src/data/` | Getrennte Geräte- und Kantonsdaten |
| `src/i18n/messages.js` | Vollständige Wörterbücher für vier Sprachen |
| `src/styles/` | Styles nach Oberfläche/Verantwortung getrennt |
| `scripts/` | Build, Modulprüfung, lokaler Server |
| `tests/` | Berechnungen, Validierung, Lieferdaten, Übersetzungen, Escaping |
| `docs/` | Geschäftsmodell, Datenverträge, Rechercheprompts und Übergabe |

## Hosting im gleichen Repository

Der Workflow **Check & build** prüft jeden Push/PR und stellt das gebaute `dist/` als Actions-Artefakt bereit. **Deploy preview to GitHub Pages** ist manuell auslösbar und veröffentlicht ausschliesslich aus diesem Repository. Vor der ersten Ausführung in GitHub unter **Settings → Pages → Build and deployment → Source: GitHub Actions** einstellen. Dafür sind Repository-Administratorrechte nötig. Diese Einstellung wird von den verfügbaren GitHub-Connector-Werkzeugen nicht angeboten und ist nicht Teil des Quellcodes. Kein Deployment auf `klimafinder.ch` und keine DNS-Änderung erfolgt automatisch.

Für dauerhaftes SEO und öffentliches Produktlaunch später statische Sprachpfade mit individuell generierten Metadaten statt Hash-Routen einführen. Der jetzige modulare Seitenaufbau kann dafür übernommen werden.
