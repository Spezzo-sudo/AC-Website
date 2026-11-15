# Datenverträge

## Geräte und Angebote

Jedes produktive Modell braucht eine stabile ID, Hersteller, vollständige Modellnummer (Innen-/Aussengerätekombination beachten), Geräteart, Kühlleistung in kW, elektrische Aufnahme mit Betriebsbedingungen, Effizienzkennwerte mit Standard, Kältemittel mit Quelle sowie relevante Aufstellbedingungen. Keine Leistungsaufnahme aus Kühlleistung ableiten.

Akustik getrennt speichern: Schallleistung oder Schalldruck, Einheit dB(A), Betriebsmodus, Messdistanz, Innen-/Ausseneinheit und Originalquelle. Werte nicht unterschiedslos vergleichen. Für Schlafen Nachtmodus und verbleibende Kühlleistung separat prüfen.

Für jeden Händler: Name, Produkt-URL, CH-Liefergebiet, tatsächlicher Bestandsstatus, Prüfzeitpunkt, Gerätepreis CHF, Versand, Mehrwertsteuer/Importkosten soweit nachweisbar, Lieferfrist, Garantie-/Servicebedingungen, Affiliate-Beziehung und Trackinglink erst nach Vertrag. «In die Schweiz importierbar» bedeutet nicht automatisch kurzfristig lieferbar oder inklusive Schweizer Service.

Produktive Auswahl ist standardmässig geschlossen: `rankProducts()` lässt nur `swissDeliveryVerified === true` UND `availability === 'inStock'` durch. Beispielprofile haben `availability: 'demo'`. Die aktuelle UI zeigt sie ausdrücklich als Demo. Vor echtem Launch die UI auf produktiven Katalogbetrieb umstellen; Demo-Modus niemals als Bestandsersatz verwenden.

Die aktuelle Produktskizze ist absichtlich klein. Vor Live-Daten um getrennte Tabellen/Objekte für Modelle, Messwerte, Händlerangebote und Quellen erweitern. Produktnamen und freie Daten beim Rendering escapen; derzeit werden feste redaktionelle Namen verwendet.

## Rechts- und Standortdaten

Kantonseintrag: Code, Name, `status`, `sources`, `reviewedAt`, Gemeindeausnahmen. Alle aktuellen Einträge sind `unverified` mit leeren Quellen.

Für spätere Datensätze ergänzen: Geräteart, feste/mobile Installation, Innen-/Aussenaufstellung, Gebäudetyp, zuständige Stelle, Gesetz/Verordnung/behördliches Merkblatt, Artikel/Abschnitt, Quelle-URL, Originalpassage, Gültigkeitsstand, Abrufdatum, Gemeindeanwendbarkeit, Prüfperson und Unsicherheiten. Nicht von kantonalem Merkblatt automatisch auf jede Gemeinde schliessen. Keine automatischen Ja/Nein-Freigaben aus unvollständigen Angaben.

## Berechnung

`estimateCapacity()` ist **nur ein nicht validiertes Demo-Modell**: 70 / 90 / 110 W/m² je Wärmeszenario, ±20 %. Diese Faktoren sind redaktionelle Beispielannahmen, keine behauptete Norm. Vor Veröffentlichung als belastbare Orientierung durch Fachperson und belastbare Quelle ersetzen.

`energyCost()` berechnet konstante elektrische Aufnahme × Stunden/Tag × Tage × CHF/kWh. Beispielprofile verwenden angenommene Aufnahmen von 0,65 / 0,85 / 1,0 kW; keine Herstellerdaten. Der Rechner modelliert weder Teillast noch Klima oder Wirkungsgradverlauf. Jahresverbrauch nie als garantierten Betrag ausgeben.

## Sprachen

`src/i18n/messages.js` hält alle funktionalen UI-Texte für DE/FR/IT/EN. Neue Sprache in `locales`, `localeNames` und jeder Zeile ergänzen. Ein Test prüft Vollständigkeit. Fach- und Rechtsübersetzungen brauchen vor Launch eine inhaltliche Prüfung. Kanton-Namen bleiben amtlich/gebräuchlich mehrsprachig. Technische Symbole und optionale englische Designbeschriftungen sind sprachübergreifend.
