# Medi-Backend

:white_check_mark: **Setup Checklist:** 
- NPM is installed 
- Node.js is installed  
- Git Bash is properly configured
- MongoDB is installed and running

### Instructions

1. Fork the repo
2. ```git clone <your-clone-link>```
3. ```cd ./Medi-Backend ```
4. ```npm install```
5. create a `.env` file in root directory and copy the contents of `.env.example` into it, then fill in with your own values. 
6. ```npm start```

### Testing Email Functionality

1. Enable 2-Step Verification in your Google Account.
2. Go to [Google Account Security](https://myaccount.google.com/apppasswords).
3. Create an App Password using any name you like (e.g., "mail").
4. Copy the generated App Passwword and paste it into the `GMAIL_PASS` field in your `.env` file.

Now open your browser and open ```localhost:8080```