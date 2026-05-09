# Risk Register

**Projekt:** <Slug>
**Stand:** YYYY-MM-DD
**Owner:** <Name>

## Probability × Impact Matrix

| Probability ↓ / Impact → | Low (1) | Medium (3) | High (5) | Critical (10) |
|---|---|---|---|---|
| **Sehr wahrscheinlich (5)** | 5 | 15 | 25 | 50 |
| **Wahrscheinlich (3)** | 3 | 9 | 15 | 30 |
| **Möglich (2)** | 2 | 6 | 10 | 20 |
| **Unwahrscheinlich (1)** | 1 | 3 | 5 | 10 |

**Severity-Zonen:**
- 1-5: 🟢 Acceptable (monitor)
- 6-15: 🟡 Manage (mitigate)
- 16-30: 🟠 Important (treat or transfer)
- 31-50: 🔴 Critical (treat immediately)

## Aktive Risiken

| ID | Risiko | Kategorie | Prob | Impact | Score | Mitigation | Owner | Status |
|---|---|---|---|---|---|---|---|---|
| R001 | DB-Backup-Restore schlägt im Ernstfall fehl | Operational | 2 | 10 | 20 | Wöchentliche Restore-Drills + zweiter Backup-Standort | <user> | active |
| R002 | Supabase-Cloud-Outage länger 1h | External | 2 | 5 | 10 | Status-Page-Subscription, Failover-Plan dokumentiert | — | monitored |
| R003 | Solo-Dev fällt aus | People | 1 | 10 | 10 | Runbooks vollständig, Doku-Wiki up-to-date, 2nd-Person-Notfallzugang | <user> | mitigated |
| R004 | Pricing-Änderung Anthropic API → Cost-Explosion | External | 3 | 3 | 9 | Cost-Logging täglich, Modell-Tier-Switch-Plan | <user> | monitored |
| R005 | Major-Library-Vulnerability ohne Fix-Pfad | Technical | 2 | 5 | 10 | Snyk + Dependabot, License-Check, Fork-Notfallplan | — | monitored |

## Kategorien

- **Technical** — Bugs, Architektur-Limits, Tech-Debt
- **Security** — Vuln, Data-Breach, Compliance-Verstoss
- **Operational** — Deploy-Fehler, Backup-Fehler, Service-Down
- **External** — Provider-Outage, Pricing, Sub-Prozessor-Issue
- **People** — Solo-Risk, Wissens-Silos
- **Compliance** — DSGVO-Verstoss, License-Konflikt

## Workflow

1. Bei jedem neuen Wave-Item: Risiko-Walk-Through (DoR-Punkt)
2. Neue Risiken hier eintragen, Score berechnen
3. Quartalsweise Review: Status, neue Mitigations, Verzicht-Begründungen
4. Bei Score ≥ 16: ADR mit Mitigation-Plan
5. Bei Score ≥ 31: sofort eskalieren, Wave-Item für Mitigation

## Risk-Treatment-Strategien

- **Avoid** — Risiko-Quelle eliminieren (z.B. Feature droppen)
- **Reduce** — Probability oder Impact senken (z.B. Backup-Verify)
- **Transfer** — Risiko an Dritte (z.B. Versicherung, Cloud-Provider-SLA)
- **Accept** — bewusst tragen (mit dokumentierter Begründung)
