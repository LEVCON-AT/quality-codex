# 14 — Mobile (Expo / React Native)

Tier-2-Doc. Lädt bei Mobile-Package-Änderungen.

Aktiv nur wenn Onboarding "Mobile-App: ja" gewählt hat.

## Stack

- **Expo SDK** (latest stable) — managed workflow, OTA-Updates
- **React Native** über Expo
- **Expo Router** (file-based routing)
- **TypeScript strict** wie überall
- **NativeWind** (Tailwind für RN) — Token-System aus `03-design.md` mappable
- **Zustand** für State (oder `@tanstack/query`)

## Workspace-Setup

```
packages/client-mobile/
├── app/                          ← Expo Router
│   ├── _layout.tsx
│   ├── (auth)/login.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx             ← Home
│   │   └── profile.tsx
│   └── +not-found.tsx
├── components/
├── lib/                          ← shared mit client-web wo möglich
├── assets/
│   ├── icon.png
│   ├── splash.png
│   └── adaptive-icon.png
├── app.json                      ← Expo-Config
├── package.json
└── eas.json                      ← EAS Build/Submit
```

## Code-Sharing mit client-web

Über `packages/shared/`:
- Types
- API-Client (Supabase mit Platform-spezifischen Auth-Adaptern)
- Validation-Schemas (Zod)
- Permission-Logic
- i18n-Strings
- Analytics-Events

NICHT geteilt:
- UI-Components (Web vs Native APIs)
- Routing
- Storage (LocalStorage vs MMKV/AsyncStorage)

## Offline-Sync

- **MMKV** für Key-Value-Cache
- **WatermelonDB** oder **expo-sqlite** für relationalen Offline-Sync
- Queue-pattern für Mutations (gleich wie web `safeMutation`-Wrapper, andere Storage)
- Sync-on-reconnect via `NetInfo` listener

## Push-Notifications

- **Expo Push Service** (free, abstrahiert APNS+FCM)
- Token-Registrierung beim Login → DB
- Backend sendet via `expo-server-sdk-node`
- Permission-Request mit User-friendly Erklärung warum
- Granulare Subscription-Topics (nicht ein-an/aus für alles)

## Auth-Flow

- Supabase Auth mit Expo-Adapter (`@supabase/auth-helpers-react-native`)
- Secure-Token-Storage: `expo-secure-store` (nicht AsyncStorage für Secrets)
- Biometric-Unlock optional (`expo-local-authentication`)
- Magic-Link via Deep-Link (`<scheme>://auth?token=...`)

## Navigation-Patterns

- **Tabs** für Top-Level (max 4-5 Tabs)
- **Stack** für Drilldown
- **Modal** für Sheets / Bottom-Up
- **Drawer** sparsam — Tabs sind besser für Mobile

## Performance

- **Hermes** Engine (Default in Expo SDK)
- **FlatList** für lange Listen mit `keyExtractor` + `getItemLayout`
- **Image-Optimization** via `expo-image` (Caching, WebP)
- **Re-Render-Vermeidung** — `React.memo` wo profitabel
- **60 FPS Ziel** auch auf Low-End-Android

## Testing

- **Unit:** Jest mit `react-native-testing-library`
- **E2E:** Detox (default) oder Maestro (einfacher) — Onboarding-Wahl
- **Devices:** Android Emulator + iOS Simulator in CI (EAS Build mit Test-Stage)

## App-Store-Release-Pipeline

`.github/workflows/mobile-release.yml`:
1. EAS Build (Android AAB + iOS IPA)
2. EAS Submit zu Play Console / App Store Connect
3. Phased-Rollout (1% → 10% → 100% über 1 Woche)
4. Crash-Free-Rate-Gate (>99.5% sonst Pause)

## Versionierung

- Marketing-Version: SemVer (gleich wie Web)
- Build-Number: monotonic (auto-increment via EAS)
- OTA-Updates für Patch-Level (über Expo Updates)
- Native-Builds nur bei Major/Minor (Native-Module-Änderungen)

## Anti-Patterns

- ❌ `Alert.alert()` für Bestätigung (eigene Modal-Component nutzen)
- ❌ Synchroner Zugriff auf AsyncStorage (immer await)
- ❌ Animation via `setState` (LayoutAnimation oder Reanimated nutzen)
- ❌ Inline-Styles ohne Token (NativeWind nutzen)
- ❌ Hardcoded Strings (i18next mit `react-i18next`)

## Detail

Detail-Lookup: `references/expo-patterns.md` (TODO v1.1)
