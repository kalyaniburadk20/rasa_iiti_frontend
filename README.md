IIT Indore Chatbot Frontend
This repository hosts the React + Vite based frontend for the IIT Indore Campus Chatbot. It provides an interactive, user-friendly chat interface integrated with a Rasa-powered backend, designed to assist users with campus-related queries in real-time.


Demo
<img width="1658" alt="Chat UI Screenshot 1" src="https://github.com/user-attachments/assets/0face314-753f-44bc-bb8a-2dc384f3bf02" /> <img width="1656" alt="Chat UI Screenshot 2" src="https://github.com/user-attachments/assets/da5de52b-3799-448e-a0bd-1b64e153b90a" />
Demo Video:
https://github.com/user-attachments/assets/db9e5ea3-4161-40d6-a76b-633feb94039c

Features
Built with React + Vite

Simple, responsive chat UI

3D avatar with voice interaction

REST API integration with Rasa backend

Easily customizable UI/UX

Local development supported via npm run dev

Prerequisites
Node.js (v18.x or later)

npm (comes with Node.js)

Installation & Running Locally
Clone the repository:

bash
Copy
Edit
git clone https://github.com/Quantique-Realm/rasa_iiti_frontend.git
cd rasa_iiti_frontend
Install dependencies:

bash
Copy
Edit
npm install
Configure Rasa backend URL:

Create a .env file in the root directory with the following line:

bash
Copy
Edit
VITE_RASA_API_URL=http://localhost:5005/webhooks/rest/webhook
Change this URL if your Rasa backend is deployed elsewhere (e.g., Render, Railway).

Start the development server:

bash
Copy
Edit
npm run dev
Then open your browser at:

arduino
Copy
Edit
http://localhost:5173



Backend Repository
This frontend requires the Rasa backend server to function.
Refer to the backend repo for setup instructions:
https://github.com/Quantique-Realm/rasa-iiti-chatbot

This project is developed by:


Kalyani Buradkar – Contributed to frontend design enhancements, responsiveness, and 3D avatar integration.

and other team members.



