# Architecture Overview

This document describes the high-level architecture of the Minell's Salon appointment system.

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                    React + Vite                       │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐              │   │
│  │  │ Public  │  │ Client  │  │  Admin  │              │   │
│  │  │  Pages  │  │Dashboard│  │Dashboard│              │   │
│  │  └────┬────┘  └────┬────┘  └────┬────┘              │   │
│  │       └───────────┬┴───────────┘                     │   │
│  │                   │                                   │   │
│  │           ┌───────┴───────┐                          │   │
│  │           │ React Router  │                          │   │
│  │           │   (v6)        │                          │   │
│  │           └───────┬───────┘                          │   │
│  │                   │                                   │   │
│  │  ┌────────┬───────┴───────┬────────┐                │   │
│  │  │Context │   Services    │  Hooks │                │   │
│  │  │ (Auth) │   (API)       │        │                │   │
│  │  └────────┴───────────────┴────────┘                │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│                    Mock Data (current)                       │
│                    Supabase (future)                        │
└─────────────────────────────────────────────────────────────┘
```

## 🗂️ Module Responsibilities

### `/src/components`

Reusable UI components organized by domain:

| Folder | Purpose |
|--------|---------|
| `ui/` | Base shadcn/ui components (Button, Input, etc.) |
| `modals/` | Dialog/modal components |
| `notifications/` | Notification dropdown and list components |
| `auth/` | Protected route wrapper |
| `inquiry/` | Chat widget for public inquiries |

### `/src/layouts`

Page wrapper components that provide consistent structure:

- **PublicLayout**: Header, footer, navigation for public pages
- **ClientLayout**: Sidebar navigation for logged-in clients
- **AdminLayout**: Collapsible sidebar for admin dashboard
- **AuthLayout**: Minimal layout for login/register

### `/src/pages`

Page components mapped to routes:

```
pages/
├── Index.tsx           # Landing page
├── Services.tsx        # Service catalog
├── Gallery.tsx         # Photo gallery
├── admin/              # Admin-only pages
│   ├── Dashboard.tsx
│   ├── Appointments.tsx
│   └── ...
└── client/             # Client-only pages
    ├── Profile.tsx
    ├── Appointments.tsx
    └── ...
```

### `/src/services`

API abstraction layer. Currently uses mock data with simulated async delays.

```typescript
// Pattern for all services
export const someService = {
  async getAll(): Promise<Item[]> {
    await delay();
    return [...mockItems];
  },
  async getById(id: string): Promise<Item | undefined> { /* ... */ },
  async create(item: Omit<Item, 'id'>): Promise<Item> { /* ... */ },
  async update(id: string, updates: Partial<Item>): Promise<Item> { /* ... */ },
  async delete(id: string): Promise<boolean> { /* ... */ },
};
```

### `/src/contexts`

React Context for global state:

- **AuthContext**: User authentication state, login/logout functions

### `/src/types`

TypeScript interfaces for all domain objects:

- User, Staff, Service, Appointment
- Loyalty (Rewards, Transactions)
- Commission, Notification
- SiteContent, Navigation

---

## 🔄 Data Flow

### Read Flow

```
Component → useEffect/Query → Service → Mock Data → State → UI
```

### Write Flow

```
User Action → Handler → Service.update() → Mock Array Modified → State Update → Re-render
```

### Authentication Flow

```
Login Form → AuthContext.login() → Mock User Lookup → Set user + role → Protected Route Access
```

---

## 🛤️ Routing Structure

```typescript
// Public routes (no auth required)
/                    → Landing page
/about               → About page
/services            → Service catalog
/gallery             → Photo gallery
/hairstyles          → Hairstyle inspiration
/contact             → Contact form
/book                → Appointment booking wizard
/login               → Login page
/register            → Registration page

// Client routes (CLIENT role required)
/client              → Client profile
/client/appointments → Client's appointments
/client/loyalty      → Loyalty rewards
/client/notifications→ Notification center
/client/settings     → Account settings

// Admin routes (ADMIN role required)
/admin               → Admin dashboard
/admin/appointments  → Manage all appointments
/admin/users         → User management
/admin/staff         → Staff management
/admin/inquiries     → Customer inquiries
/admin/content       → Website content CMS
/admin/availability  → Schedule blocking
/admin/commissions   → Staff commissions
/admin/loyalty       → Loyalty program config
/admin/notifications → Notification templates
/admin/reports       → Analytics
/admin/media         → Media library
/admin/profile       → Admin profile
```

---

# 📦 Key Dependencies

| Package | Version (project) | Purpose |
|---------|-------------------:|---------|
| react | ^18.3.1 | UI framework |
| react-dom | ^18.3.1 | DOM renderer |
| react-router-dom | ^6.30.1 | Routing |
| @tanstack/react-query | ^5.83.0 | Server state |
| tailwindcss | ^3.4.17 | Styling |
| lucide-react | ^0.462.0 | Icons |
| date-fns | ^3.6.0 | Date utilities |
| zod | ^3.25.76 | Schema validation |
| react-hook-form | ^7.61.1 | Form handling |
| vite | ^5.4.19 | Dev tooling |

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build configuration |
| `tailwind.config.ts` | Tailwind theme + extensions |
| `tsconfig.json` | TypeScript configuration |
| `components.json` | shadcn/ui configuration |
| `eslint.config.js` | ESLint rules |

---

## 🚀 Adding New Pages/Features

### 1. Define Types

```typescript
// src/types/index.ts
export interface NewEntity {
  id: string;
  name: string;
  createdAt: string;
}
```

### 2. Add Mock Data

```typescript
// src/data/mockData.ts
export const mockNewEntities: NewEntity[] = [/*...*/];
```

### 3. Create Service

```typescript
// src/services/api.ts
export const newEntityService = {
  async getAll(): Promise<NewEntity[]> { /*...*/ },
};
```

### 4. Create Page Component

```typescript
// src/pages/admin/NewEntity.tsx
const NewEntity = () => {
  const [items, setItems] = useState<NewEntity[]>([]);
  useEffect(() => { newEntityService.getAll().then(setItems); }, []);
  return <div>...</div>;
};
export default NewEntity;
```

### 5. Add Route

```typescript
// src/App.tsx
import NewEntity from "./pages/admin/NewEntity";
// In routes:
<Route path="/admin/new-entity" element={<NewEntity />} />
```

### 6. Add Navigation

```typescript
// src/layouts/AdminLayout.tsx
const sidebarLinks = [
  // ...existing
  { href: '/admin/new-entity', icon: SomeIcon, label: 'New Entity' },
];
```
