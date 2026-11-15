# Kompakter Finder: Ablauf und Grenzen

## Ziel

Schnelle, nachvollziehbare Einraum-Orientierung. Vier Kernansichten, kein gewichtetes Punktesystem und keine komplette technische Anlagenprüfung.

1. Raum: Schlafen, Wohnen oder Homeoffice. Keine vorausgewählte Antwort.
2. Grösse: grobe Fläche, optionale Sonne/Dachlage und Mehrraumwunsch.
3. Wunsch: Ruhe, Betriebskosten, Einstiegskosten oder noch offen. Freiwilliger expliziter Ausschluss fester Montage.
4. Räumliche Bestandsaufnahme: Fenster/Tür nach draussen, naher Aussenplatz, Aussenwand. Antworten können offen bleiben.

Danach höchstens zwei freiwillige Präzisierungen. Sie erscheinen nur, wenn genau ein noch unbeantworteter Fakt eine besser eingeordnete Geräteart grundsätzlich plausibel machen würde. Jede Präzisierung hat einen direkten überspringbaren Ergebnisausgang. Es wird nicht weitergefragt, um Platz 2 und 3 vollständig abzusichern. Kanton, Gemeinde, Wohnstatus und Budget werden erst nach dem Ergebnis freiwillig erfasst.

## Ein kleiner, deterministischer Kern

`src/domain/finder.js` liefert Zustände und Textschlüssel. Der Kern hat keinen DOM-, Netzwerk-, Speicher-, Provisions- oder Behördenzugriff.

| Geräteart | Grobe räumliche Voraussetzung |
| --- | --- |
| Mobiler Monoblock | öffnbares Fenster/Tür nach draussen |
| Mobiles Split | dieselbe Öffnung plus naher Aussenplatz |
| Festes Wandgerät ohne Ausseneinheit | Aussenwand |
| Festes Split | grundsätzliche Aussenplatz-Möglichkeit am Gebäude |

Diese Voraussetzungen bedeuten **grundsätzlich plausibel**, niemals baulich, rechtlich oder für ein konkretes Modell freigegeben. Öffnungsmasse, Verbindungsweg, Aufstellung, Wandaufbau, Kondensat, Schall und konkrete Montage sind nachgelagerte Checks.

Ein naher Aussenplatz liefert bei noch unbeantwortetem allgemeinem Aussenplatz einen abgeleiteten Hinweis. Nein zum nahen Platz bedeutet nicht Nein zu allen Standorten am Gebäude. Explizite Angaben werden nicht überschrieben. Abgeleitete Werte werden bei jeder Auswertung aus den aktuellen Rohantworten neu gebildet; es gibt keine veraltete Kopie und keine automatisch angeklickten unsichtbaren Elemente.

Faktenwerte sind `null` (nicht beantwortet), `unknown` (ausdrücklich unklar), `yes`, `no`. Ein unbeantworteter oder unbekannter Fakt bestätigt keine Voraussetzung. Keine feste Montage zu wünschen schliesst beide festen Klassen aus; fehlende Vermieterzustimmung schliesst eine technisch grundsätzlich plausible Richtung dagegen nicht automatisch aus.

## Qualitative Reihenfolge

- Günstiger Einstieg: mobiler Monoblock → mobiles Split → festes Wandgerät → festes Split.
- Ruhe bzw. Betriebskosten: festes Split → mobiles Split → festes Wandgerät → mobiler Monoblock.
- Noch offen: einfachere Richtung und, soweit vorhanden, eine langfristigere Alternative vergleichen; kein erzwungenes Siegerurteil.

Die Reihenfolgen sind redaktionelle Orientierung auf Klassenebene, keine gemessene Produktqualität und keine garantierten Kosten- oder Lärmaussagen. Vor echtem Produktlaunch fachlich validieren. Geräte mit realen Daten später separat vergleichen.

## Ergebniszustände

- passende Richtung mit grundsätzlich plausiblen Voraussetzungen
- passende Richtung und eine höher eingeordnete, noch offene Alternative
- mögliche Richtung mit ungeklärten Voraussetzungen
- zwei Richtungen zum Abwägen bei offenem Wunsch
- keine tragfähige Richtung, wenn alle betrachteten Wege ausgeschlossen sind
- Fachplanung bei mehreren Räumen oder mehr als 80 m² (Scope-Grenze des Finders, kein normativer Schwellenwert)

Bei fehlender Katalogabdeckung bleibt die Richtung erhalten. Die UI erfindet keine geprüften Geräte.

## Vergleich und Kosten

Persönlicher Vergleich und freie Auswahl bleiben getrennt. Persönliche Treffer müssen zur ersten oder alternativen Klasse passen, dürfen nicht räumlich ausgeschlossen sein und müssen die obere Grenze der illustrativen Leistungsspanne erreichen. Fehlende Preise bestätigen kein Budget. Bekannte Preise oberhalb des gewählten Höchstbudgets werden ausgeschlossen. Der freie Katalog hat keine persönlichen Trefferkennzeichen.

Die Berechnung ist weiter ausdrücklich Demo: 70 W/m² Basis, +20 bei Sonne, +40 bei Dachlage; ±20 %. Keine validierte Kühllastformel. Stromkosten verwenden eine separat editierbare angenommene elektrische Aufnahme und sind kein Verbrauchswert des empfohlenen Geräts.

## Zustand und Oberfläche

Ein expliziter Ereignispfad und ein Renderer. Ein temporärer Bearbeitungsentwurf wird erst beim erfolgreichen Ergebnis übernommen. Schliessen verwirft den Entwurf und erhält das vorherige Ergebnis. Antworten lassen sich gezielt ab Raum, Grösse, Wunsch oder Möglichkeiten bearbeiten. Sprachwechsel und Katalog-Rückkehr bewahren den bestätigten Zustand im Tab. Neuladen setzt ihn zurück. Keine Cookies oder dauerhafte Speicherung.

Vier Sprachversionen. Keine zusätzlichen Legacy-/Human-Layer, MutationObserver-Ketten, versteckten Synchronisierungsklicks oder Netzwerkabhängigkeit für die Empfehlung.
