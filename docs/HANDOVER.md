# Übergabe

## Ziel und Abgrenzung

Nur Spezzo-sudo/AC-Website bearbeiten. Bestehende Domain nicht ohne konkreten Auftrag umstellen. Funktionale Konzeptwebsite mit Beispielprofilen; noch keine rechtliche oder technische Fachplanung und keine echte Partneranbindung.

## Stand

Startseite, Finder (5 Schritte), Ergebnis, Stromrechner, Vergleich/Händlerdialog, Kantonsübersicht, Ratgeber, Finanzierungsprinzip, Datenschutz/Impressum und lokaler Projektbrief sind umgesetzt. Vier Sprachen, modulare JS/CSS-Dateien, keine Fremdpakete. Alle Datenplatzhalter sichtbar. Der Finder darf unbekannte Montageoption nie als Genehmigung interpretieren. Produktive Empfehlungen nur mit geprüftem CH-Liefernachweis und Lagerstatus. Aktuelle Anzeige ist explizit Demo.

## Prüfungen

`npm run check`, `npm test` und `npm run build` erfolgreich. Acht Tests. Browserdurchlauf: Finder mit Dachgeschoss, ZH/Winterthur, unklarer Montage und Ruhepriorität ergibt mobiles Splitkonzept, 2,2–3,3 kW als Beispiel. Stromrechnung: 0,85 kW × 5 h × 60 Tage × CHF 0,30 = CHF 76,50; 10 h = CHF 153. Sprachwechsel zu Französisch bewahrt den flüchtigen Zustand. Händlerdialog kennzeichnet fiktive Angebote. Keine browserübergreifende oder echte Geräte-Labortestabdeckung.

## Vor echtem Launch

1. RESEARCH_PROMPTS.md abarbeiten und DATA.md befüllen.
2. Finder fachlich prüfen, Budget und vergleichbare Akustikdaten in echtes Eignungsranking einbauen.
3. Betreiber-/Hostingangaben und Geschäftsbedingungen vervollständigen.
4. Sprachpfade/SEO bei öffentlichem Produktlaunch von Hash-Routing auf vorgerenderte Seiten migrieren.
5. Echte Partnervermittlung mit benannten Empfängern und ausdrücklicher Nutzerentscheidung anschliessen.
6. Öffentliche Vorschau über GitHub Pages konfigurieren, dann Workflow manuell starten. Keine anderen Repositories anlegen oder verbinden.
