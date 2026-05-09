# Spike Ticket

Time-boxed Research-Ticket. Wird gebraucht wenn Lösungsweg vor Implementierung unklar ist.

## Format

```markdown
## Spike: <Frage in einem Satz>

**Wave:** N (oder pre-wave)
**Time-Box:** 2h / 4h / 8h (max 1 Tag — sonst zu viel)
**Owner:** <user oder Claude>

### Frage
<Konkrete Frage, die beantwortet werden muss>

### Constraints
- <Technische Bedingung>
- <Budget>
- <Zeit-Limit>

### Deliverable
- ADR unter docs/decisions/ADR-XXXX-<slug>.md
- Optional: Proof-of-Concept-Branch (NICHT in main mergen!)

### Akzeptanz
- [ ] Entscheidung dokumentiert mit 3 Begründungspunkten
- [ ] Mind. 1 verworfene Alternative dokumentiert
- [ ] Falls PoC: getestet auf relevantem Pfad
- [ ] Folge-Wave-Items klar (welche Stories ergeben sich aus der Entscheidung)

### Time-Box-Verletzung
Bei Überschreitung: stop, eskalieren. Spike darf nicht zur Implementierung mutieren.
```

## Beispiel

```markdown
## Spike: Welche Mobile-E2E-Bibliothek für client-mobile?

**Wave:** pre-wave (vor Wave 5 "Mobile-MVP")
**Time-Box:** 4h
**Owner:** Claude

### Frage
Detox vs Maestro vs Appium für E2E-Tests von client-mobile (Expo SDK 50)?

### Constraints
- CI muss in <10min durchlaufen
- iOS Simulator + Android Emulator support
- Single-Author-Maintenance (low-overhead bevorzugt)

### Deliverable
- ADR-0007-mobile-e2e.md

### Akzeptanz
- [ ] Empfehlung mit Begründung (Setup-Aufwand, Test-Reliability, CI-Integration, Community-Support)
- [ ] Min. 2 verworfene Alternativen
- [ ] Mini-PoC: 1 Login-Test in der gewählten Lib
- [ ] Wave-5-Items angepasst (welche Tests auf welcher Lib)
```

## Anti-Patterns

- ❌ Spike, der zur Implementierung wird (Time-Box brechen → Stop)
- ❌ Mehrere Spikes parallel zum gleichen Thema
- ❌ Spike ohne klare Frage ("Mobile-Architektur evaluieren")
- ❌ Spike ohne Deliverable
- ❌ Spike-PoC in main mergen (PoC ist disposable)

## Wann KEIN Spike

- Wenn Lösungsweg bekannt ist (auch wenn ungewohnt) → direkt implementieren mit Tests
- Wenn Frage durch 30min Reading klar wird → kein Ticket nötig
- Wenn 3 verschiedene Tools alle akzeptabel wären → einfach das default nehmen, später wechseln falls nötig
