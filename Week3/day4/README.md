# 📦 Delivery Checker

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/)
[![License](https://img.shields.io/badge/license-Proprietary%20%7C%20All%20Rights%20Reserved-red.svg)]()
[![Stack](https://img.shields.io/badge/stack-Vanilla%20JS%20%7C%20CSS3%20%7C%20HTML5-orange.svg)](https://developer.mozilla.org/en-US/)

**Delivery Checker** is a premium Single-Page Application (SPA) designed to give logistics companies real-time visibility into the condition of shipments. From customer request, through transit checkpoints, to final delivery, the system tracks status, stores notes, captures image evidence, and hosts isolated messaging channels.

---

## 📋 Table of Contents
*   [Key Features](#-key-features)
*   [Technology Stack](#-technology-stack)
*   [User Roles & Permissions](#-user-roles--permissions)
*   [Getting Started](#-getting-started)
*   [Architecture Details](#-architecture-details)
*   [🤖 AI System Prompt (For Project Continuation)](#-ai-system-prompt-for-project-continuation)

---

## ✨ Key Features

*   **Request & Approval Flow**: Customers request shipments specifying goods, type, pickup, and destination. Managers approve and assign employees.
*   **Checkpoint Inspection**: Assigned employees add check-ins with text notes and actual photo uploads (parsed into Base64).
*   **Dual-Channel Chat**:
    *   *Internal Chat*: Secure messaging between Managers and Employees.
    *   *Client Chat*: Messaging between Customers and Employees.
*   **Chronological Timeline**: A visual timeline showing status markers, timestamped checkpoints, notes, and visual image evidence.
*   **Persistent Theme System**: Dark Mode and Light Mode support with settings saved in `localStorage`.

---

## 🛠️ Technology Stack

*   **HTML5**: Semantic elements.
*   **CSS3**: Custom variables, fluid animations, and glassmorphism cards.
*   **JavaScript**: Vanilla client-side JS (SPA routing, mock localStorage db state, FileReader APIs).
*   **Icons**: Phosphor Icons library (via CDN).

---

## 👥 User Roles & Permissions

| Feature / Action | Manager | Employee | Customer |
| :--- | :---: | :---: | :---: |
| **View Dashboard Stats** | ✅ (All/Active/Issues) | ❌ | ❌ |
| **Create Shipment Directly** | ✅ | ❌ | ❌ |
| **Approve / Reject Requests** | ✅ | ❌ | ❌ |
| **Assign Employees** | ✅ | ❌ | ❌ |
| **Record Check-Ins & Upload Photos** | ❌ | ✅ | ❌ |
| **View Shipment Timelines** | ✅ | ✅ | ✅ |
| **Request New Shipment** | ❌ | ❌ | ✅ |
| **Internal Chat (Manager ↔ Employee)**| ✅ | ✅ | ❌ |
| **Client Chat (Customer ↔ Employee)** | ❌ | ✅ | ✅ |

---

## 🚀 Getting Started

### Prerequisites
No servers, bundlers, or packages are needed. The application is completely client-side.

### Setup
1.  Clone the repository or download the folder.
2.  Double-click **`index.html`** to open the app directly in any modern web browser.

### Test Credentials
All test accounts use the password: **`password`**

*   **Manager**: `admin@delivery.com`
*   **Employee**: `john@delivery.com` or `jane@delivery.com`
*   **Customer**: `acme@corp.com` or `techflow@inc.com`

---

## 🏗️ Architecture Details

*   **Single Bundle**: To allow opening the file directly over the `file://` protocol without encountering CORS or module loading restrictions, all router, database, auth, and view templates are compiled into a single file at `js/bundle.js`.
*   **Routing**: Handled via simple hash changes (`window.addEventListener('hashchange')`).
*   **State Management**: Simulated in `Store` object using local storage key/value sets.

---

## 🤖 AI System Prompt (For Project Continuation)

Copy and paste the prompt block below to onboard another AI assistant onto this project:

```text
You are an expert Frontend Developer onboarding onto the "Delivery Checker" project. Your task is to maintain, debug, and expand the codebase while strictly adhering to the architectural constraints listed below.

### 1. Codebase Architecture
- The application is a Single-Page Application (SPA) designed to run over the file:// protocol (direct file double-click).
- DO NOT use ES6 Modules (import/export), npm bundlers (Vite, Webpack), or build pipelines.
- All application logic (router, views, auth, store wrapper) must reside in a single file: `js/bundle.js`.
- Custom styles are configured in `css/styles.css`.

### 2. Styling & UX Design Tokens
- Style rules must match the existing glassmorphic theme.
- Dark theme variables: Background (#0f172a), Card Surface (rgba(30, 41, 59, 0.7) with backdrop blur), Primary Accent (#3b82f6), Success (#10b981), Danger (#ef4444), Text Primary (#f8fafc).
- Light theme variables: Background (#f1f5f9), Card Surface (rgba(255, 255, 255, 0.8)), Text Primary (#0f172a).
- Transitions should be smooth (use `.animate-fade-in` and `transition: all 0.2s ease` on hover elements).

### 3. State Management & Data Handlers
- Use the `Store` global object to read/write state to `localStorage`.
- Photos are uploaded via FileReader `readAsDataURL` and stored directly inside the check-in object as Base64 strings.
- Chat updates must render instantly: re-fetch the latest shipment object from `Store` inside the rendering loop (`renderMessages`) rather than using cached copies.

### 4. Routing System
- Routing uses hash changes (e.g., `#manager-dashboard`, `#shipment?id=s1`).
- The router clears the `#app` container and appends view outputs.
- Guard routes strictly by role (manager, employee, customer) so unauthorized access is redirected.

### 5. Code Quality Guidelines
- Do not introduce inline elements with un-escaped innerHTML containing user-submitted text (XSS vectors). Always utilize document.createElement() or write a string sanitizer helper.
- Write clean, commented functions and avoid helper timing workarounds like setTimeout(fn, 0) for DOM mutations when possible.
```
