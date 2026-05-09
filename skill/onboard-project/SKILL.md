---
name: onboard-project
description: Onboards a new project from the Quality-Codex template. Triggers when user says "neues Projekt", "onboard project", "starte X", or invokes /onboard-project. Asks for name, slug, stack, tenancy, mobile, locales, infra, domain, GitHub repo, backup-target — then bootstraps directory, initializes git, configures secrets, runs verify-setup. Output: usable project under C:\node\<slug>\ with green CI, deployable staging.
---
