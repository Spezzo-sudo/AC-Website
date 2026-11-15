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
- Vier Kernansichten: Raum, Grösse/Wärme, Wunsch, räumliche Möglichkeiten. Maximal zwei überspringbare Präzisierungen; Kanton, Wohnstatus und Budget danach freiwillig.
- Geräteart mit nachvollziehbarer Begründung, offengelegter Beispielrechnung für Kühlleistung und anpassbarem Stromkostenrechner.
- Vergleich und Händlerdialoge mit ausdrücklich fiktiven Geräteprofilen.
- 26 Kantone mit offenen Abklärungsfragen, ohne erfundene Rechtsauskunft.
- DE / FR / IT / EN, Ratgeber, Finanzierungsprinzip, Datenschutz- und Impressum-Platzhalter.
- Download eines lokalen Projektbriefs, keine Kontaktübermittlung, kein Tracking, keine Cookies, keine Speicherung von Finderantworten über das Neuladen hinaus.
- Native Dialoge, Tastaturbedienung, Fokusführung und reduzierte Bewegung.

## Bewusst noch offen

Die Website ist eine **funktionierende Konzeptversion**, kein angeschlossener Marktplatz. Es gibt keine echten Modelle, Händlerpreise, Lieferzusagen, Affiliate-Verträge, Rechtsbewertungen oder Montagepartner. Betreiber und Hosting sind zu ergänzen. Ein Banner kennzeichnet den Datenstand, `noindex` verhindert beabsichtigte Suchmaschinenindexierung; es ist keine Zugriffssperre. Eine öffentliche Vorschau enthält keine vertraulichen Daten.

Die Empfehlung verwendet vier Gerätearten und wenige explizite Voraussetzungen, qualitative Wunsch-Reihenfolgen und eigene Zustände für offene bzw. ausgeschlossene Wege. Bekannte Angaben werden wiederverwendet; Zustimmung wird separat geprüft. Bei mehreren Räumen oder mehr als 80 m² verweist sie auf Fachplanung. Der persönliche Beispielvergleich trennt Haupttreffer und Alternativen und filtert nach der oberen Grenze der ausdrücklich unvalidierten Beispiel-Leistungsspanne. Fehlende Preise bleiben ein offener Budgetabgleich. Fachliche Details und Grenzen stehen in [docs/FINDER.md](docs/FINDER.md).

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

Cloudflare Pages veröffentlicht `main` aus **Spezzo-sudo/AC-Website** automatisch. Projekt: `klimafinder-preview`, URL: https://klimafinder-preview.pages.dev. Build: `npm run build`, Ausgabe: `dist`, Node.js 22. Es ist keine eigene Domain verbunden. `klimafinder.ch` wird nicht umgestellt.

Der Workflow **Check & build** prüft Pushes und PRs. Der frühere manuelle GitHub-Pages-Workflow ist als ungenutzte Hostingalternative vorhanden; für Cloudflare ist keine Pages-Aktivierung in GitHub nötig.

Für dauerhaftes SEO und öffentliches Produktlaunch später statische Sprachpfade mit individuell generierten Metadaten statt Hash-Routen einführen. Der jetzige modulare Seitenaufbau kann dafür übernommen werden.
