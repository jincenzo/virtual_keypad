# Secure Access Virtual Keypad Web Application

A modern, minimalist, mobile-first virtual keypad web application built with **React**, **Vite**, and **Tailwind CSS**. Designed with premium Apple-like dark mode aesthetics, this application provides an interactive, tactile, and secure passcode-entry terminal optimized for smart devices to unlock physical door security systems.

---

## Features

- **Mobile-First Glassmorphic Design**: Sleek dark layout featuring frosted containers, high-quality typography (Outfit & Plus Jakarta Sans), and subtle ambient background glows.
- **Tactile Visual Feedback**: Buttons scale down and shift colors on tap/click, mimicking haptic key-press responses. Alphanumeric secondary descriptors are printed on number keys for realistic entry feedback.
- **Dynamic Masked Display**: Renders a dedicated passcode visualizer that shows active slots filling up with illuminated dots as you type (supports up to 8 digits).
- **Interactive Animations**:
  - **Success**: The display container transitions to a vivid emerald green glow, showcases an unlocked status, bounces a checkmark badge, and automatically resets the application after 3 seconds.
  - **Failure/Error**: The display container flashes rose-red, triggers a horizontal shake keyframe animation, clears the invalid PIN, and shows the server failure message.
- **Dynamic Environment Modes**:
  - **Development Mode**: Renders a "Demo Sandbox" panel in the footer. You can toggle "Demo Mode" on to test success (PIN `1234` or `12345678`) and error sequences immediately without starting a backend server.
  - **Production Mode**: Automatically hides and disables the Demo Sandbox. Bypasses emulation safeguards and points exclusively to the live backend server.

---

## File Structure

```
virtual_keypad/
├── .env.example          # Environment template for live endpoints
├── .env                  # Local dev environment configurations
├── .dockerignore         # Docker context exclusions
├── Dockerfile            # Container build specification (multi-stage Nginx)
├── docker-compose.yml    # Docker Compose environment definition
├── package.json          # Dependency specifications and task scripts
├── vite.config.js        # React HMR bundler configuration
├── tailwind.config.js    # Custom shake keyframe animations extension
├── postcss.config.js     # PostCSS styles processor configuration
├── index.html            # Static entry page with web fonts loading
└── src/
    ├── main.jsx          # React bootstrapping entry point
    ├── index.css         # Tailwind directives and viewport configurations
    ├── App.jsx           # Core app shell, security state, and API routing
    └── components/
        └── Keypad.jsx    # Numeric layout grid and press states handling

```

---

## Setup & Running Locally

### Prerequisites
Make sure you have Node.js (version 20+ recommended) and npm installed.

### 1. Install Dependencies
Initialize and pull package packages from the root directory:
```bash
npm install
```

### 2. Configure Environment Variables
Create a local `.env` file (you can copy `.env.example` as a starting point):
```bash
cp .env.example .env
```
Inside `.env`, define the API URL of your backend:
```env
VITE_API_ENDPOINT=https://your-backend-api.com/api/unlock
```

### 3. Start Development Server
Launch Vite's hot-reload local server:
```bash
npm run dev
```
The application will launch on your local host (usually `http://localhost:5173/`). You can access it on your smartphone via the local network address printed in the terminal logs.

### 4. Build for Production
Bundle and optimize static assets for production deployment:
```bash
npm run build
```
This produces optimized files in the `/dist` directory. The "Demo Sandbox" panel is automatically stripped out in this build.

---

### 5. Running with Docker

You can build and run the application as a lightweight Docker container served via Nginx.

#### Build the Docker Image
To bake environment variables into the static production bundle, pass them as build arguments:
```bash
docker build \
  --build-arg VITE_API_ENDPOINT="https://your-backend-api.com/api/unlock" \
  --build-arg VITE_LABEL_SYSTEM_SECURED="System Secured" \
  --build-arg VITE_LABEL_ENTER_PASSCODE="Enter Passcode" \
  -t virtual-keypad .
```

#### Run the Container
Run the container and expose it on port `8080`:
```bash
docker run -d -p 8080:80 --name virtual-keypad virtual-keypad
```
The application will be accessible at `http://localhost:8080/`.

---

### 6. Running with Docker Compose

For a smoother deployment setup, Docker Compose can automatically load configurations from your local `.env` file and feed them into the build process:

```bash
docker compose up -d --build
```
This will build and run the container in the background, serving the virtual keypad at `http://localhost:8080/`.

---

## Backend API Integration Guide

When personnel click the keypad's **Submit** (lock icon) button, the frontend sends a POST request to the configured `VITE_API_ENDPOINT`.

### 1. JSON Request Format
The request is sent using `fetch` with header `Content-Type: application/json`.

**Headers:**
```http
POST /api/unlock HTTP/1.1
Content-Type: application/json
```

**Body Payload:**
```json
{
  "pin": "12345678"
}
```
*Note: The `pin` is always passed as a string representation of digits. The frontend restricts inputs to a maximum of 8 digits.*

### 2. JSON Response Format
The backend must return a JSON response with status codes reflecting authentication success (e.g. `200 OK`) or denial (e.g. `401 Unauthorized` / `403 Forbidden` / `400 Bad Request`). The body must comply with the following schema:

#### Successful Unlock
```json
{
  "success": true,
  "message": "Access Granted. Welcome."
}
```

#### Denied/Failed Unlock
```json
{
  "success": false,
  "message": "Access Denied. Invalid passcode."
}
```

---

## Example Node/Express Mock Backend

Here is a simple mock backend written in Node.js and Express. You can use this code block to set up a server and test the live integration.

```javascript
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS so the client can query this API
app.use(cors());
app.use(express.json());

// Valid passcodes database simulation
const VALID_PASSCODES = ['123456', '88888888', '24681357'];

app.post('/api/unlock', (req, res) => {
  const { pin } = req.body;

  console.log(`Received authentication request for PIN: ${pin}`);

  // Validation checks
  if (!pin) {
    return res.status(400).json({
      success: false,
      message: "Bad Request. PIN field is missing."
    });
  }

  if (VALID_PASSCODES.includes(pin)) {
    return res.status(200).json({
      success: true,
      message: "Door unlocked! Welcome."
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Incorrect security PIN. Please try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Lock security API listening at http://localhost:${PORT}`);
  console.log(`Set VITE_API_ENDPOINT=http://localhost:${PORT}/api/unlock in .env to connect!`);
});
```
