# Event Reminder App

A small event reminder application** built with **React.js** (frontend) and **Node.js + Express + MongoDB** (backend). This app allows users to create, view, and manage events, with reminders and a clean, interactive dashboard. Focus is on **clean code, organized project structure, and smooth user experience**.

---


## Features

### 1. Sign Up & Login
- Secure sign-up and login system.
- Implemented  o **JWT**.

### 2. Home Page
- Modern **gradient background**.
- Widgets for **current time** and **weather**.
- **Upcoming events** displayed in a grid layout (2–3 cards per row).
- Each card shows:
  - Event image
  - Title
  - Date
  - Status (Upcoming / Completed)
- Smooth **motion animations** on hover, text, and cards.

### 3. Dashboard
- Displays event summaries:
  - Total events
  - Active events
  - Completed events
- Event list with filters: Active, Completed, etc.
- Micro-interactions for event creation:
  - Smooth **form animations** (slide-in, fade, or expand effect) for creating new events.

### 4. Reminders
- **Web Push Notifications** sent before an event starts (e.g., 30 minutes prior).

---

## Tech Stack

**Frontend**
- React.js + Tailwind CSS
- Framer Motion for animations
- React Router DOM for routing
- Axios for API calls

**Backend**
- Node.js + Express.js
- MongoDB (via Mongoose)
- JWT 
- Web Push Notifications

**Deployment**
- Backend: / Render
- Frontend: Render

---

## Setup Instructions

### Backend
1. Navigate to `backend` folder.
2. Install dependencies:

   npm install
   
Navigate to frontend folder
cd era 
npm install
 npm run dev 


 PORT=4000
MONGO_URI=<Your MongoDB URI>
JWT_SECRET=<Your JWT Secret>
Home page
<img width="1401" height="805" alt="Screenshot 2025-11-27 at 7 15 12 PM" src="https://github.com/user-attachments/assets/e686ed47-a0b8-40c4-b4a9-6285505c558d" />
signUP
<img width="1402" height="766" alt="Screenshot 2025-11-27 at 7 15 24 PM" src="https://github.com/user-attachments/assets/8fa3d907-8c50-49c4-a05b-65931b3a577a" />
login
<img width="1394" height="682" alt="Screenshot 2025-11-27 at 7 15 32 PM" src="https://github.com/user-attachments/assets/389ce5a7-5d6e-45f4-9f7a-188ab223cc76" />
Dashboard
<img width="1404" height="749" alt="Screenshot 2025-11-27 at 7 15 50 PM" src="https://github.com/user-attachments/assets/657c0262-22c5-4ad4-93bc-7d5318963c78" />
