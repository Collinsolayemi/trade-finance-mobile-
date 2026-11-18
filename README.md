# Trade Finance Mobile App (`trade-mobile-app`)

A cross-platform React Native (Expo + TypeScript) mobile application designed for the **Trade API** (`trade-api`) backend. It provides monitoring, authorization workflows, regulatory form tracking, and audit log visibility on iOS and Android.

---

## Features

- **Executive & Approver Dashboard:** Real-time visibility into active Letters of Credit (LC), total portfolio exposure, and pending authorizations.
- **Letter of Credit Management:**
  - Filter portfolios by status (`Approved`, `In-Review`, `Pending`, `Draft`).
  - Search by LC number, applicant, or counterparty.
  - Maker-checker authorization & rejection workflow directly from mobile.
- **Regulatory Forms Tracking:** Monitor submission and approval statuses for **Form M** (Imports), **Form NXP** (Commercial Exports), and **Form A** (Invisible Trade).
- **Live Audit Trail:** Real-time audit log stream tracking all trade finance system and user events.
- **Dynamic API Configurator:** Switch between local testing endpoints (`localhost` for iOS simulator, `10.0.2.2` for Android emulator, LAN IP for physical devices, or remote staging) with built-in offline demo fallback.

---

## Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 58)
- **Language:** TypeScript
- **Icons:** `@expo/vector-icons` (Ionicons)
- **Architecture:** Context-based Authentication (`AuthContext`), modular REST API client (`ApiClient`), and screen-level domain separation

---

## Project Structure

```text
trade-mobile-app/
├── App.tsx                     # Main navigation shell with bottom tab bar
├── src/
│   ├── api/
│   │   ├── client.ts           # HTTP client with Bearer auth injection & timeout handling
│   │   ├── config.ts           # Dynamic endpoint configuration
│   │   ├── letterOfCredit.api.ts # LC service endpoints + mock fallback
│   │   ├── regulatoryForm.api.ts # Form M / NXP / A service endpoints
│   │   └── activityLog.api.ts  # Audit log service endpoints
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication and user permission state
│   ├── components/
│   │   ├── Header.tsx          # App header with user profile badge
│   │   ├── MetricCard.tsx      # KPI stat cards
│   │   └── StatusBadge.tsx     # Visual status pills
│   ├── screens/
│   │   ├── DashboardScreen.tsx # Portfolio overview & quick actions
│   │   ├── LetterOfCreditScreen.tsx # LC listing, search, filters & approval modal
│   │   ├── RegulatoryFormsScreen.tsx # Regulatory form tracker
│   │   ├── ActivityLogScreen.tsx # Audit trail event feed
│   │   └── SettingsScreen.tsx  # API endpoint switcher & profile info
│   └── types/
│       └── trade.types.ts      # TypeScript interfaces mirroring backend DTOs & enums
└── package.json
```

---

## Getting Started

### 1. Prerequisites
- Node.js (v20+)
- Expo CLI (`npm install -g expo-cli` or use `npx expo`)
- [Expo Go](https://expo.dev/go) app installed on your physical iOS/Android device, or an iOS Simulator / Android Studio Emulator.

### 2. Install Dependencies
```bash
cd trade-mobile-app
npm install
```

### 3. Start the Development Server
```bash
npm start
# or
npx expo start
```

### 4. Running on Device / Simulator
- **iOS Simulator:** Press `i` in the terminal.
- **Android Emulator:** Press `a` in the terminal.
- **Physical Device:** Scan the QR code shown in the terminal using the Expo Go app (Android) or the default Camera app (iOS).
- **Web Preview:** Press `w` in the terminal to test in the browser.

---

## Connecting to `trade-api` Backend

By default, the app points to `http://localhost:3000/v1` (or `http://10.0.2.2:3000/v1` on Android).

1. Ensure the `trade-api` backend is running:
   ```bash
   cd ../trade-api
   yarn start:dev
   ```
2. In the mobile app, navigate to **Settings** tab.
3. If running on a physical phone on the same Wi-Fi network, enter your machine's LAN IP address:
   ```text
   http://192.168.x.x:3000/v1
   ```
4. Toggle **Offline Demo Mode** to test with mock data even when disconnected from the backend.

