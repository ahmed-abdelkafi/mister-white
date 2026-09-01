# 🕵️ Mister White — Social Deduction Party Game

A real-time, multilingual (English, French, Arabic RTL) social deduction party game built natively for the **Cloudflare Serverless Ecosystem**.

---

## 🌟 Features

- **Multilingual & RTL Support**: English, French, and full Arabic RTL with native typography (*Tajawal* / *Outfit*).
- **Game Modes**:
  - **Online Multiplayer**: Real-time Edge WebSockets powered by **Cloudflare Durable Objects**.
  - **Pass & Play (Local)**: Single-device party mode with "Tap & Hold" privacy curtains between players.
- **Authoritative & Anti-Cheat**: Zero-knowledge role masking at the edge ensures secret identities can never be snooped via client network inspection.
- **Dynamic Clue & Guess Mechanics**: Unmasked Mister White gets a 30-second final guess to steal the victory.
- **Dark Glassmorphism Design System**: Modern mobile-first UI with procedural Web Audio sound effects and responsive layouts.
- **Cloudflare D1 SQL**: Curated database of 150+ categorized word pairs in EN, FR, and AR.

---

## 🏗️ Architecture

```
mister-white/
├── apps/
│   ├── web/           # Cloudflare Pages (Vite + React 19 + TypeScript)
│   └── worker/        # Cloudflare Worker + Durable Objects + D1 Database
│
├── packages/
│   ├── shared/        # Authoritative state machine & game types
│   └── i18n/          # Locales (en, fr, ar) and RTL layout helpers
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
cd mister-white
npm install
```

### 2. Run the Web App
```bash
npm run dev:web
```
Open `http://localhost:5173` in your browser.

### 3. Run the Cloudflare Worker Locally
```bash
npm run dev:worker
```

---

## ☁️ Cloudflare Deployment

### 1. Initialize D1 Database
```bash
cd apps/worker
wrangler d1 create mister-white-db
wrangler d1 execute mister-white-db --remote --file=./schema.sql
```

### 2. Deploy Cloudflare Worker & Durable Objects
```bash
wrangler deploy
```

### 3. Deploy Web App to Cloudflare Pages
Connect your repository to **Cloudflare Pages** with:
- **Build command**: `npm run build`
- **Build output directory**: `apps/web/dist`

---

## 📜 Game Rules Summary
- **Civilians**: Receive the secret word (e.g. *Pizza*). Give subtle clues to unmask the impostor.
- **Mister White**: Receives **NO word**. Must blend in, listen closely, and avoid suspicion.
- **Undercover**: Receives a closely related word (e.g. *Burger*).
- **Clutch Guess**: If Mister White is voted out, they have 30 seconds to guess the secret word and steal the win!
