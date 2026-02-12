# Real-Time Chat Application – Lab Test 1

## About this project

This project is a full-stack real-time chat application created for COMP 3133 Lab Test 1. The main purpose of the project was to practice building a complete application using Node.js, MongoDB, Socket.io, and React.

The application allows users to create an account, log in, join chat rooms, send real-time messages to other users, and also send private messages with a typing indicator.

---

## Features

The application includes the following functionality:

* User signup with username and password
* User login with session stored in localStorage
* Selection of predefined chat rooms
* Real-time group chat inside rooms
* Ability to leave a room and log out
* Private messaging between users
* Typing indicator in private chat
* All users and messages are stored in MongoDB

---

## Technologies Used

### Frontend

* React (Vite)
* Tailwind CSS
* Socket.io Client
* React Router

### Backend

* Node.js
* Express
* Socket.io
* MongoDB with Mongoose
* dotenv

---

## Project Structure

```
101357023_lab_test1_chat_app/
│
├── server/        (backend: API, Socket.io, database models)
├── client/        (frontend: React application)
└── README.md
```

---

## How to Run the Application

### 1. Clone the repository

```
git clone https://github.com/aradthf/101357023_lab_test1_chat_app.git
cd 101357023_lab_test1_chat_app
```

### 2. Run the backend

```
cd server
npm install
npm run dev
```

Create a `.env` file inside the `server` folder with:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 3. Run the frontend

Open a new terminal and run:

```
cd client
npm install
npm run dev
```

Then open this URL in your browser:

```
http://localhost:5173
```

---

## Lab Requirements Completed

* User signup
* User login with localStorage
* Room selection
* Real-time group chat
* Leave room and logout
* Private chat
* Typing indicator
* MongoDB storage for messages
* React frontend
* Socket.io communication

---

## Author

Arad
COMP 3133 – Lab Test 1
