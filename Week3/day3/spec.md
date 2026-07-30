# Software Specification: Delivery Checker Migration

**Document**: `spec.md`  
**Task Type**: Full System Migration (Database & styling framework transition)  
**Target Architecture**: Client-Server SPA (Vanilla JS + BaaS Supabase + Tailwind CSS CDN)

---

## 🎯 1. Clear Objectives
The primary objective is to migrate the existing client-side single-page app **Delivery Checker** away from client-bound mock data storage to a live, cloud-synchronized relational database, while improving styling and UI modularity.

### Core Success Targets
1.  **Persistent Storage**: Replace all `localStorage` calls with active Supabase PostgreSQL API queries.
2.  **Asset Hosting**: Store check-in photos on Supabase Cloud Storage instead of mock names, enabling true image rendering.
3.  **Real-Time Subscriptions**: Establish a persistent WebSocket subscription channel for the chat views so messages are updated on the fly.
4.  **Modern UI Framework**: Migrate from custom styling rules in `styles.css` to Utility Classes using Tailwind CSS, updating the icon set to Lucide SVG Icons.

---

## 🔒 2. System Constraints

### ⚠️ Execution Constraints
*   **File Protocol (`file://`) Compatibility**: The app must run directly by double-clicking `index.html` in a web browser without a local server.
*   **No Build Tool Dependency**: Do not introduce npm compilation steps, Webpack, Vite, or bundle builders. Keep all JavaScript consolidated in `js/bundle.js` as non-ES Modules (standard `<script>` imports).
*   **Asset size limits**: Base64 data files generated from inspection uploads must be loaded as native File/Blob objects and streamed directly to Supabase storage to prevent local browser memory overflow.

### 🎨 Styling & Component Design Constraints
*   **Tailwind Mode**: The light/dark mode switch must be toggled by appending the class `.dark` to the `<html>` or `<body>` element.
*   **No Hardcoded Layout Measurements**: Use responsive layout grids (`grid-cols-1 md:grid-cols-2`) and Tailwind container constraints instead of absolute pixel widths.
*   **Clean DOM creation**: Do not inject plain HTML string arrays with user variables. Use DOM construction (`document.createElement`) or sanitization routines on input strings to prevent Cross-Site Scripting (XSS).

---

## 📥 3. System Inputs

The system will read the following inputs:

### Existing Codebase Files
*   **[index.html](file:///C:/Users/hanan/.gemini/antigravity/scratch/delivery-checker/index.html)**: The container layout shell.
*   **[js/bundle.js](file:///C:/Users/hanan/.gemini/antigravity/scratch/delivery-checker/js/bundle.js)**: The application code script.
*   **[css/styles.css](file:///C:/Users/hanan/.gemini/antigravity/scratch/delivery-checker/css/styles.css)**: Existing custom variable configurations and selectors.

### Environment & Configuration Parameters
*   `SUPABASE_URL`: API Endpoint for database connections.
*   `SUPABASE_ANON_KEY`: Client authorization token key.
*   `STORAGE_BUCKET_NAME`: Target object container folder name (default: `shipment-evidence`).

---

## 📤 4. System Outputs

The task is complete when the following outputs are produced:

### Modified Deliverables
1.  **`index.html`**:
    *   Imports for Tailwind, Lucide, SweetAlert2, and Supabase JS SDK.
    *   No links referencing `css/styles.css`.
2.  **`js/bundle.js`**:
    *   Fully functional Supabase Client instance logic.
    *   Rewritten views containing Tailwind CSS responsive classes.
    *   No legacy `localStorage` read/write calls.
3.  **`css/styles.css`**:
    *   **File Deleted** (or emptied) as all layouts are powered directly by utility classes.

---

## 🧪 5. Acceptance Test Cases

The migration must pass the following manual checks:

| Test Case ID | Test Scenario | Expected Result |
| :--- | :--- | :--- |
| **TC-001** | **User Authentication** | Entering valid credentials queries Supabase database, returns correct role details, and routes to user's dashboard. |
| **TC-002** | **Theme Persistent State** | Clicking Sun/Moon toggles `.dark` class on the body tag; theme stays unchanged after reloading the tab. |
| **TC-003** | **Check-in Photo Pipeline** | Uploading an image updates the checklist timeline showing the actual picture fetched from the public storage URL. |
| **TC-004** | **Real-time Live Chat** | Opening two screens side-by-side displays messages instantly upon submission without any refresh action. |
| **TC-005** | **Navigation Guards** | A user logged in as a Customer is redirected back when trying to manually navigate to `#manager-dashboard`. |
