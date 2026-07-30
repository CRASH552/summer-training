# AI Context Document: Delivery Checker Migration Task

Use this document to onboard an AI coding assistant to implement the migration of the Delivery Checker project from client-side localStorage to Supabase (PostgreSQL + Object Storage) and style the UI using Tailwind CSS.

## 🎯 1. Task Goal

Migrate the mock Single-Page Application (SPA) Delivery Checker into a database-backed, real-time tracking dashboard using:

- **Database:** Supabase (PostgreSQL) for storing users, shipments, messages, and check-ins.
- **Realtime:** Supabase Postgres Changes subscription for chat functionality.
- **Storage:** Supabase Storage Bucket for checkpoint photo uploads.
- **UI System:** Tailwind CSS (CDN link) + Lucide Icons (CDN link) + SweetAlert2 (CDN link) to replace standard CSS files.

## 📂 2. Current Codebase Structure

The application currently runs over the `file://` protocol as a Single Page Application. It consists of three files:

```
delivery-checker/
│
├── index.html          # Shell layout (references css/styles.css & js/bundle.js)
│
├── css/
│   └── styles.css      # Deprecated. Contains dark/light mode custom CSS rules.
│
└── js/
    └── bundle.js       # Core logic. Contains: Store, Auth, Router, Views, and Utils.
```

## 💾 3. Database Schema (PostgreSQL)

Run this SQL script in the Supabase SQL editor to initialize tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('manager', 'employee', 'customer')),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Shipments Table
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    customer_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    employee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Pending Approval',
    goods_type VARCHAR(50) DEFAULT 'Standard',
    pickup_location VARCHAR(255) NOT NULL,
    final_destination VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Checkins Table
CREATE TABLE checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) CHECK (status IN ('OK', 'Issue Found')) NOT NULL,
    note TEXT,
    photo_url TEXT,
    is_final BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. Messages Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    channel VARCHAR(20) CHECK (channel IN ('internal', 'client')),
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

## 🔌 4. Libraries & API Client Integrations

Include the following scripts in the `<head>` of `index.html`:

```html
<!-- Tailwind CSS CDN -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    darkMode: 'class', // support .dark-theme toggles
  }
</script>

<!-- Supabase JS Client library CDN -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- SweetAlert2 library CDN -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<!-- Lucide Icons library -->
<script src="https://unpkg.com/lucide@latest"></script>
```

## 📝 5. Detailed Implementation Checklist

### Phase 1: Supabase Initialization
- [ ] Initialize the client inside `js/bundle.js`:
  ```javascript
  const supabase = supabase.createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');
  ```
- [ ] Update `Store.init()` to check connection and verify authentication status.

### Phase 2: Auth Layer Migration
- [ ] Modify `Auth.login` to query Supabase auth API or fetch matching records from the database using secure password verification.
- [ ] Update `Auth.logout()` to drop active sessions.

### Phase 3: Storage (Photo Uploads)
- [ ] Update the save handler in `AddCheckinView` to take a file upload blob and push it into a Supabase storage bucket named `shipment-evidence`:
  ```javascript
  const { data, error } = await supabase.storage
    .from('shipment-evidence')
    .upload(`${shipmentId}/${Date.now()}-${file.name}`, file);
  ```
- [ ] Retrieve the public URL and write it to `checkins.photo_url`.

### Phase 4: Chat Realtime Implementation
- [ ] In `ShipmentView`, replace standard refresh rendering loop with active channel listeners:
  ```javascript
  const chatSubscription = supabase
    .channel('chat-room')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
      if (payload.new.shipment_id === currentShipmentId) {
        appendMessageToDOM(payload.new);
      }
    })
    .subscribe();
  ```

### Phase 5: Tailwind CSS & Lucide Refactoring
- [ ] Rewrite view functions (e.g. `LoginView`, `ManagerDashboard`, `ShipmentView`) replacing old styles with Tailwind class equivalents:
  - `card` Class → `bg-slate-800 border border-slate-700/50 rounded-xl p-6 shadow-xl`
  - `btn-primary` Class → `bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors`
- [ ] Replace old `<i class="ph ph-..."></i>` tags with `<i data-lucide="..."></i>` and execute `lucide.createIcons()` at the end of every view render pass.

## 🔍 6. How to Verify Changes

1. **Login Verification:** Ensure users can log in, receive a valid user profile object, and redirect to their specific role dashboard.
2. **Customer Request Approval:** Create a request as a customer, switch to manager dashboard, verify request appears under "Pending Shipment Requests", click "Accept & Assign", and confirm it appears in the employee assignments.
3. **Real-time Chat:** Open two browsers side-by-side (one manager, one employee), send messages, and confirm they render immediately in both screens without refreshes.
4. **Photo Rendering:** Upload a real JPG file on `AddCheckinView`, verify it reaches the storage bucket, and confirm it renders on the shipment view timeline.
