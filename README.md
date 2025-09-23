# 🌏 Yatraksha – Smart Tourist Safety App

The **Yatraksha App** is a React Native + Expo-powered mobile application designed to enhance tourist safety and experience.  
It integrates seamlessly with the **Yatraksha Hotel Portal** and the **Police/Tourism Department Dashboard** to form a secure, smart travel ecosystem.

---

## ✨ Overview

Yatraksha ensures that tourists can travel **safely, confidently, and with peace of mind** by combining:

- ✅ **Digital Trip ID** issued securely at trip registration  
- ✅ **Live Navigation & Nearby Recommendations**  
- ✅ **SOS & Live Location Sharing** with emergency contacts  
- ✅ **Real-Time Announcements, News & Schemes** from tourism authorities  
- ✅ **Health + Emergency Data Management** (blood group, allergies, contacts)

---

## 📱 Key Features

### 🔐 Digital Tourist ID
- Blockchain-based **unique trip-specific ID** generated at registration.
- Stores tourist KYC, trip itinerary, and emergency contacts.
- Automatically expires after the trip ends.

### 🏠 Home Dashboard
- Sleek landing screen with **quick action buttons**:
  - Explore destinations  
  - Plan trip routes  
  - View history of past trips  
  - Safety tools & alerts  

### 📝 Trip Registration
- Register start and end dates, destination cities, and generate **unique trip ID**.
- Data linked to hotels and tourism department for monitoring.

### 📰 Live News, Schemes & Alerts
- Auto-refreshes every **10 minutes**.
- Pushes announcements, weather alerts, and government schemes.

### 👤 Profile & Consent Management
- Editable profile: Name, email, phone, blood group.
- Add emergency contacts with name, relation, phone.
- Manage health conditions and allergies.
- **Privacy Control:** Opt-in for live tracking and auto E-FIR generation.

### 🛰️ Navigation & Multi-Stop Routing
- Uses **live GPS** location as starting point.
- Add multiple destinations.
- Displays animated route on map with polyline.

### 🗺️ Nearby Recommendations
- Real-time suggestions for **hotels, markets, events** based on current location.
- Distance updates dynamically as you move.

### 📡 Live Location Sharing
- One-tap SMS sharing with emergency contacts.
- Works continuously while activated.

---

## 🛠 Tech Stack

| Layer             | Technology        |
|------------------|-----------------|
| **Framework**    | React Native + Expo |
| **Styling**      | NativeWind (Tailwind CSS for RN) |
| **Navigation**   | React Navigation |
| **Maps & Routes**| Mappls APIs |
| **Data Storage** | AsyncStorage (Secure Local Storage) |
| **Backend**      | Blockchain-based Trip & ID verification (Optional) |

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-org/yatraksha-app.git
cd yatraksha-app
```

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo
