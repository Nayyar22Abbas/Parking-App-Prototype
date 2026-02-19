# 🅿 ParkWise — React Native App Prototype

A smart parking discovery and booking app built with React Native (Expo).

---

## 📁 Project Structure

```
parkwise/
├── App.js                          # Root entry point
├── index.js                        # Expo registration
├── app.json                        # Expo config
├── package.json                    # Dependencies
├── babel.config.js                 # Babel config
└── src/
    ├── data/
    │   └── parkingData.js          # Mock parking spots + color system
    ├── components/
    │   ├── ParkingMarker.js        # Custom map pin markers
    │   ├── SpotCard.js             # Bottom sheet spot preview card
    │   ├── SlotsModal.js           # Slot selection + booking modal
    │   └── BookingConfirmation.js  # Success confirmation modal
    └── screens/
        └── HomeScreen.js           # Main map screen (single-page app)
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (iOS/Android)

### Setup

```bash
# 1. Navigate into the project
cd parkwise

# 2. Install dependencies
npm install

# 3. Start the Expo development server
npx expo start

# 4. Scan the QR code with your Expo Go app
```

### Run on specific platform
```bash
npx expo start --ios       # iOS Simulator
npx expo start --android   # Android Emulator
npx expo start --web       # Web browser (limited map support)
```

---

## 🗺 Google Maps API Key (Required)

For full map functionality, add your Google Maps API key:

**iOS** — in `app.json`:
```json
"ios": {
  "config": {
    "googleMapsApiKey": "YOUR_IOS_API_KEY"
  }
}
```

**Android** — in `app.json`:
```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_ANDROID_API_KEY"
    }
  }
}
```

Get a free API key at: https://console.cloud.google.com/

---

## ✨ Features

### Map Interface
- 🗺 **Google Maps** integration via `react-native-maps`
- 📍 **5 parking spots** with custom price-bubble markers
- 🔍 **Zoom** in/out with standard map gestures
- 🛰 **Satellite/Standard** map toggle
- 🎯 **Re-center** button to snap back to current area
- 🔵 **User location** dot on map

### Search & Filter
- 🔍 **Search bar** with live text input and clear button
- 🏷 **Filter chips**: All / Covered / Open / EV Charging / Cheap

### Spot Discovery
- Tap any **marker** → animated bottom card appears
- Card shows: name, price, distance, rating, availability bar, features
- **Availability urgency** — red markers + "Almost Full" badge when ≤ 3 slots
- Smooth spring animation on card appearance

### Booking Flow
1. Tap **"Book Now"** on a spot card
2. **Slot Selection Modal** — visual grid of all parking slots
   - Green = Available (tap to select)
   - Gray = Occupied (has a 🚗 icon)
   - Blue = Your selection ✓
3. **Duration picker** — 1 to 12 hours
4. **Cost summary** — itemized with service fee
5. Tap **"Confirm"** → booking confirmed!

### Booking Confirmation
- Animated success screen with ✓ checkmark
- Unique booking reference (e.g. `PW-K7X3M9`)
- Slot number, duration, total cost, date/time
- QR code placeholder for entry

### Bottom Bar ("Book Me" CTA)
- Shows real-time stats: total available slots, number of locations, starting price
- **"Book Me"** button shows the nearest/first available spot
- Badge shows count of matching spots for active filter

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#1A6FE8` | Blue — main brand, markers, prices |
| `secondary` | `#2DBD6E` | Green — CTAs, available slots |
| `accent` | `#FF6B35` | Orange — highlights |
| `warning` | `#FFB627` | Yellow — almost full, stars |
| `danger` | `#E53E3E` | Red — full/critical markers |

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `expo ~51` | React Native toolchain |
| `react-native-maps` | Google Maps integration |
| `expo-location` | Device GPS |
| `@react-navigation/native` | Screen navigation |
| `expo-linear-gradient` | Gradient UI effects |
| `@expo/vector-icons` | Icon set |

---

## 🔄 Extending the App

### Add real parking data
Replace the mock data in `src/data/parkingData.js` with an API call:
```js
const spots = await fetch('https://your-api.com/parking/spots?lat=33.7&lng=73.0').then(r => r.json());
```

### Add user authentication
Install: `expo install expo-auth-session expo-web-browser`

### Add real payments
Integrate JazzCash or EasyPaisa SDK for Pakistan market.

### Add push notifications
```bash
expo install expo-notifications
```

---

## 🧱 Architecture Notes

- **Single screen app** (`HomeScreen.js`) — all UI state managed locally with `useState`
- **Modals** for slot selection and booking confirmation (no extra screens needed)
- **Animated** using React Native's built-in `Animated` API — no third-party animation library needed
- **Mock data** is fully self-contained in `parkingData.js` — easy to swap for a real API

---

## 📱 Screenshots (Prototype States)

1. **Default** — Map with Book Me CTA and stats
2. **Marker selected** — Spot card slides up from bottom
3. **Slots modal** — Interactive visual slot grid
4. **Booking confirmed** — Animated success + QR

---

*Built with ❤️ using React Native & Expo*
