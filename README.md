# IIT Indore Chatbot Frontend 

This repository contains the **React-based frontend** for the **IIT Indore Campus Chatbot**, providing a user interface for chatting with the Rasa backend.

---<img width="1658" alt="Screenshot 2025-06-26 at 11 16 45 PM" src="https://github.com/user-attachments/assets/0face314-753f-44bc-bb8a-2dc384f3bf02" />


##  Features

-  Built with **React + Vite**
-  Simple and responsive chat UI
-  A avatar which can talk and guide you.
-  REST API-based connection with Rasa backend
-  Easily customizable for UI/UX changes
-  Supports local development using `npm run dev`

---


---
## Prerequisites

- Node.js (v18.x or above recommended)
- npm (comes with Node.js)

---

##  Installation & Running Locally

1. **Clone this repository:**

```bash
git clone https://github.com/Quantique-Realm/rasa_iiti_frontend.git
cd rasa_iiti_frontend
```
Install npm dependencies:
```
npm install
```
Configure Rasa Backend URL (if needed):

In the project root, create a .env file:
```
VITE_RASA_API_URL=http://localhost:5005/webhooks/rest/webhook
```
Change this URL if your Rasa backend is running on a different host (like Render, Railway, etc).

Run the frontend locally:

```
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173
```
 Production Build (Optional)
To create an optimized production build:
```
npm run build
```
Serve the build folder using any static file server like Vercel, Netlify, etc.

Backend Repo Link
You also need the Rasa backend server running.
Visit the backend repo for setup:
https://github.com/Quantique-Realm/rasa-iiti-chatbot
