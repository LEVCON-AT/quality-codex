# Runbook: GitHub-Setup (Erstmals + Push)

So pushst du den Codex (oder ein neues Projekt) erstmals nach GitHub. Diese Vorgehensweise wird im Onboarding-Skript verwendet und ist projekt-übergreifend gültig.

## Voraussetzungen

- [ ] Git installiert (`git --version`)
- [ ] GitHub-Account vorhanden (z.B. https://github.com/LEVCON-AT)
- [ ] Globaler git-config gesetzt (oder lokal pro Repo)
- [ ] Credential-Speicher konfiguriert (Windows Credential Manager auf Windows)

## Schritt 1 — Globalen git-config setzen (einmalig pro Maschine)

```powershell
git config --global user.email "admin@levcon.at"
git config --global user.name "LEVCON-AT"
git config --global init.defaultBranch main
git config --global credential.helper manager  # Windows Credential Manager
git config --global pull.rebase false
```

Bei mehreren Identitäten: pro Repo lokal mit `git config user.email ...`.

## Schritt 2 — GitHub Personal Access Token (PAT) erzeugen

Für HTTPS-Push (alternativ SSH-Key, siehe unten).

1. https://github.com/settings/tokens/new öffnen
2. **Token-Name:** z.B. `windows-dev-machine-2026`
3. **Expiration:** 90 days (rotieren via Secret-Rotation-Runbook)
4. **Scopes:**
   - `repo` (full control of private repositories)
   - `workflow` (für GitHub Actions Workflow-Edits)
   - `delete_repo` (nur wenn du Repos löschen können willst)
5. Token kopieren — **wird nur einmal angezeigt!**
6. In 1Password/Bitwarden speichern

## Schritt 3 — GitHub-Repo manuell erstellen

Codex hat aktuell kein `gh` CLI Setup. Daher Web-UI:

1. https://github.com/new öffnen
2. **Owner:** LEVCON-AT (oder dein User)
3. **Repository name:** z.B. `quality-codex` (für den Codex), oder `<slug>` für ein neues Projekt
4. **Visibility:** Private (Default für interne Projekte) oder Public
5. **WICHTIG:** Keine README, .gitignore oder LICENSE auswählen — das Repo MUSS leer sein, sonst gibt es Merge-Konflikte beim ersten Push
6. "Create repository"

## Schritt 4 — Lokalen Remote setzen + erstes Push

```powershell
cd C:\node\<slug>
git remote add origin https://github.com/LEVCON-AT/<slug>.git
git branch -M main
git push -u origin main
```

Beim ersten Push fragt Windows Credential Manager nach:
- **Username:** dein GitHub-Username (z.B. `LEVCON-AT`)
- **Password:** dein **PAT** (NICHT GitHub-Account-Passwort!)

Danach werden Credentials gecacht — kein erneutes Auth nötig.

## Schritt 5 — Verifikation

```powershell
git remote -v
# Erwartung: origin → https://github.com/LEVCON-AT/<slug>.git

git push --tags origin
# Pusht alle Tags (z.B. v1.0.0)
```

Repo auf https://github.com/LEVCON-AT/<slug> sichtbar.

## Schritt 6 — Branch-Protection-Rules (für `main`)

Über Web-UI in den Repo-Settings:

- **Settings → Branches → Add rule** für `main`:
  - [x] Require pull request before merging
  - [x] Require status checks to pass (alle CI-Jobs)
  - [x] Require signed commits (wenn GPG/SSH-Sign aktiv)
  - [x] Require linear history (squash-merge)
  - [x] Restrict force pushes
  - [x] Restrict deletions

## Schritt 7 — Secrets für CI setzen

Web-UI: **Settings → Secrets and variables → Actions → New repository secret**

Mindest-Secrets je nach Variante:

**VPS:**
- `DEPLOY_SSH_KEY` (Private-Key für VPS-Deploy)
- `SSH_HOST`, `SSH_PORT`, `SSH_USER`
- `STAGING_SUPABASE_URL`, `STAGING_SUPABASE_ANON_KEY`
- `PROD_SUPABASE_URL`, `PROD_SUPABASE_ANON_KEY`
- `BACKUP_AGE_PRIVATE_KEY` (für backup-verify-Workflow)
- `SENTRY_AUTH_TOKEN`

**Cloud:**
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `STAGING_VERCEL_PROJECT_ID`, `PROD_VERCEL_PROJECT_ID`
- `SUPABASE_ACCESS_TOKEN`, `STAGING_SUPABASE_PROJECT_REF`, `PROD_SUPABASE_PROJECT_REF`
- `SENTRY_AUTH_TOKEN`

## Alternative: SSH-Key statt PAT

Statt HTTPS+PAT kannst du SSH-Keys nutzen:

```powershell
# Vorhandenen Key prüfen oder erzeugen
Test-Path "$env:USERPROFILE\.ssh\id_ed25519.pub"
ssh-keygen -t ed25519 -C "your_email@example.com"  # falls noch nicht vorhanden

# Key in Zwischenablage
Get-Content "$env:USERPROFILE\.ssh\id_ed25519.pub" | Set-Clipboard

# Auf GitHub einfügen: Settings → SSH and GPG keys → New SSH key
# Dann Remote-URL umstellen:
git remote set-url origin git@github.com:LEVCON-AT/<slug>.git
```

## Auth-Failure beim Push

**Symptom:** `remote: Support for password authentication was removed`
**Lösung:** Du nutzt vermutlich noch dein altes Account-Passwort. → PAT verwenden (siehe Schritt 2).

**Symptom:** `remote: Permission denied`
**Lösung:** PAT-Scopes prüfen (`repo` muss aktiv sein), oder Repo-Owner-Berechtigung prüfen.

**Symptom:** Credential-Manager fragt jedes Mal neu
**Lösung:** `git config --global credential.helper manager` (Windows) oder `cache --timeout=86400` (1 Tag).

## Token-Rotation

Alle 90 Tage:
1. Neuen PAT generieren (Schritt 2)
2. Windows Credential Manager öffnen → alten "git:https://github.com" Eintrag löschen
3. Beim nächsten Push neuen PAT eingeben
4. Audit-Eintrag in `secret-rotation.md`-Log

## Onboarding-Skript-Integration

Der `/onboard-project`-Skill durchläuft:
- Phase 1-2: Bootstrap (lokal)
- **Phase 2.5 NEU:** GitHub-Setup
  - Prüft ob `gh` CLI installiert → wenn nein: zeigt diese Doc, fragt User ob fortfahren mit `git push` (manuelles Repo-Erstellen) oder pause-and-install-gh
  - Bei `gh` verfügbar: `gh repo create $org/$slug --private --source=. --remote=origin --push`
- Phase 3-7: weiter im Skill-Flow

## Wenn `gh` CLI doch installiert wird

```powershell
winget install --id GitHub.cli
gh auth login   # interaktiv: HTTPS, Login mit Browser
```

Danach automatisiert:
```powershell
gh repo create LEVCON-AT/<slug> --private --source=. --remote=origin --push
```
