# Medi-Backend

A backend server for Medi, a medical record management application. Where user-doctor interactions are managed efficiently.
---

## Table of Contents

1. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
   - [Environment Variables](#environment-variables)  
   - [Running the Server](#running-the-server) 
2. [Project Structure](#project-structure)  
3. [API Endpoints](#api-endpoints)  
4. [Testing Email Functionality](#testing-email-functionality) 
5. [Scripts](#scripts)   
6. [Contact](#contact)  

---

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Git

### Installation

1. Fork the repo
2. ```git clone <your-clone-link>```
3. ```cd ./Medi-Backend ```
4. ```npm install```

### Environment Variables

Create a `.env` file in root directory and copy the contents of `.env.example` into it, then fill in with your own values. 

### Running the Server
Run the following command to start the server in development mode with auto-reloading
```bash
npm run dev
```
Server will start at `http://localhost:8080`

---

## Project Structure

```bash
medi-backend/
├── .github/
│   └── pull_request_template.md
├── config/
│   ├── email.js
│   └── gmail.js
├── controllers/
│   ├── doctor.js
│   ├── reportcard.js
│   └── user.js
├── models/
│   ├── doctor.js
│   ├── otp.js
│   ├── reportcard.js
│   └── user.js
├── routers/
│   ├── auth.js
│   ├── index.js
│   ├── reportcard.js
│   └── user.js
├── services/
│   └── emailService.js
├── .gitignore
├── connections.js
├── index.js
├── .env.example
├── README.md
└── package.json
```

---

## API Endpoints

API endpoints are organized in the `routers` directory. Each router file handles specific functionalities such as user authentication, report card management etc.

### Base URL:
```bash
http://localhost:8080
```
### Available Endpoints:
- `GET /` - Welcome Message
- **User Endpoints**
    - `POST /api/auth/user/signup` - User Signup
    - `POST /api/auth/user/login` - User Login
    - `GET /api/user/:id` - Get User Details
- **Doctor Endpoints**
    - `POST /api/auth/doctor/signup` - Doctor Signup
    - `POST /api/auth/doctor/login` - Doctor Login
    - `POST /api/doctor/reportcard` - Create Reportcard and generate OTP
    - `POST /api/doctor/reportcard/verify` - Verify OTP and add reportcard to user

---

### Testing Email Functionality

1. Enable 2-Step Verification in your Google Account.
2. Go to [Google Account Security](https://myaccount.google.com/apppasswords).
3. Create an App Password using any name you like (e.g., "mail").
4. Copy the generated App Passwword and paste it into the `GMAIL_PASS` field in your `.env` file.

---

## Scripts

| Command           | Description                            |
|------------------|----------------------------------------|
| `npm start`       | Start the server in production mode     |
| `npm run dev`     | Start the server with auto-reloading using Nodemon |
| `npm install`     | Install all project dependencies        |
| `npm test`        | (Optional) Run test suites              |

### Add scripts to `package.json`

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js",
  "test": "echo \"No test specified\" && exit 0"
}
```

---

## Contact

For questions, suggestions, or support, feel free to reach out:

- **Name**: Puspak Samanta  
- **GitHub**: [@Puspak29](https://github.com/Puspak29)
- **Email**: [puspak290504@proton.me](mailto:puspak290504@proton.me)

---

> Contributions, feedback, and issues are always welcome!