# Smart Curuza Mobile App

This directory is reserved for the Smart Curuza mobile application built with Flutter.

## ⚠️ Prerequisites Not Installed

It appears that **Flutter** is not currently installed on this system. As an AI, I cannot install system-level software like the Flutter SDK for you. You will need to install it manually.

### 1. Install Flutter
Please follow the official guide for Windows:
👉 [Install Flutter on Windows](https://docs.flutter.dev/get-started/install/windows)

**Key Steps:**
1. Download the Flutter SDK zip file.
2. Extract it to a location like `C:\src\flutter` (do not put it in `Program Files`).
3. Add `flutter\bin` to your System Path environment variable.
4. Run `flutter doctor` in a new terminal to verify.

### 2. Initialize the Project
Once Flutter is installed and running, open a terminal in this directory (`mobile`) and run:

```bash
flutter create .
```

This will generate all the necessary files for your Android/iOS app.

## Connecting to Backend

This mobile app is designed to consume the **Smart Curuza NestJS Backend**.

- **Base URL**: `http://<YOUR_PC_IP>:3001` (Use your local IP, not `localhost`, when testing on a physical device).
- **Authentication**: The app will use the same JWT tokens as the web app.
- **API Endpoints**: All endpoints defined in the `backend` folder are accessible here.
