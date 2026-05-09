# Client-Mobile (Expo)

Optional — wird im `/onboard-project`-Skill aktiviert wenn "Mobile-App: ja".

## Setup wenn aktiviert

```bash
cd packages/client-mobile
npx create-expo-app@latest . --template default
# Anschließend:
# - tsconfig.json extended von ../../tsconfig.base.json
# - biome.json extended von ../../biome.json
# - app.json mit Projekt-Slug
# - eas.json für EAS Build/Submit
```

## Stack (wenn aktiviert)

- Expo SDK (latest)
- expo-router (file-based)
- NativeWind (Tailwind for RN)
- expo-secure-store (Auth-Token)
- @supabase/supabase-js + react-native-adapter
- expo-notifications

## Manifesto

→ `docs/claude/14-mobile.md`

## Status

Skelett-Stub. Nicht initialisiert wenn Onboarding "Mobile-App: nein" gewählt hat.
