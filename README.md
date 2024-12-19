# UP Manila QAO (Quality Assurance Office) System

A web-based application designed for the UP Manila Quality Assurance Office to streamline their operations and enhance service delivery.

## Project Overview

This project consists of a React-based frontend and Node.js/Express backend with MongoDB as the database. It provides features for managing announcements, user authentication, and file uploads.

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.0 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (version 4.0 or higher)
- npm (comes with Node.js)

## Installation and Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd up-manila-qao
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with the following content:
MONGODB_URI=mongodb://localhost:27017/up-manila-qao
JWT_SECRET=your_jwt_secret
PORT=5001
```

### 3. Frontend Setup
```bash
# Navigate back to root directory
cd ..

# Install frontend dependencies
npm install
```

## Running the Application

### 1. Start MongoDB
Make sure MongoDB is running on your system:
- Windows: MongoDB should be running as a service
- Linux/Mac: Run `mongod` in a terminal

### 2. Start the Backend Server
```bash
# In the backend directory
cd backend
npm start
```
The backend server will start on port 5001.

### 3. Start the Frontend Development Server
```bash
# In the root directory
npm start
```
The frontend development server will start on port 3000.

## Accessing the Application

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5001](http://localhost:5001)

## Project Structure

```
up-manila-qao/
├── backend/                # Backend server code
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── server.js         # Server entry point
├── public/               # Static files
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   └── App.tsx          # Root component
└── package.json         # Project dependencies
```

## Features

- User Authentication (Login/Register)
- Announcement Management
- File Upload System
- Responsive UI Design
- Secure API Endpoints
- MongoDB Integration

## Technologies Used

### Frontend
- React
- TypeScript
- Material-UI
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer (for file uploads)
