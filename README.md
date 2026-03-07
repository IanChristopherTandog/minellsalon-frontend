# Minell's Hair, Nail & Lashes Salon - Appointment System

A modern, web-based appointment booking and management system built for Minell's Salon. This application is a recreation of an original capstone project, rebuilt from the ground up using modern frameworks and technologies to demonstrate modern web development best practices. This provides a complete solution for clients to book appointments and for administrators to manage services, staff, and business operations.

## 🎨 Project Overview

**What it is:** A full-featured salon management system with appointment booking, customer loyalty program, staff management, and administrative dashboards.

**Who it's for:** 
- **Clients:** Book appointments, manage profiles, track loyalty points, view rewards
- **Admins:** Manage appointments, staff, services, content, and business analytics

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Component library |
| **React Router v6** | Client-side routing |
| **TanStack Query** | Server state management |
| **Lucide React** | Icon library |

## 🚀 Local Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/IanChristopherTandog/minellsalon-frontend.git
cd salon-frontend

# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start development server
npm run dev
# or
bun run dev
```

The app will be available at `http://localhost:4100`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## 📁 Folder Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── modals/         # Modal dialogs
│   ├── notifications/  # Notification components
│   └── auth/           # Auth-related components
├── contexts/           # React contexts (Auth)
├── data/               # Mock data for development
├── hooks/              # Custom React hooks
├── layouts/            # Page layout components
│   ├── AdminLayout.tsx
│   ├── ClientLayout.tsx
│   └── PublicLayout.tsx
├── lib/                # Utility libraries
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   ├── auth/           # Login/Register pages
│   └── client/         # Client dashboard pages
├── services/           # API service layer
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🔐 Environment Variables

Currently using mock data. When integrating a backend:

```env
VITE_API_URL= https://localhost:4100
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🎯 Key Features

### Public Website
- Landing page with services, gallery, testimonials
- Service catalog with filtering
- Hairstyle inspiration gallery
- Contact form with inquiry system

### Client Features
- 4-step appointment booking wizard
- Appointment management (reschedule/cancel)
- Loyalty points tracking and rewards
- Notification center

### Admin Features
- Dashboard with analytics widgets
- Appointment management
- User/Staff management (nested navigation)
- Service & content management
- Commission tracking
- Notification templates
- Availability blocking

## 🐛 Quick Troubleshooting

### Common Issues

**Port already in use:**
```bash
kill -9 $(lsof -ti:5173)
npm run dev
```

**Dependencies issues:**
```bash
rm -rf node_modules bun.lockb package-lock.json
npm install
```

**TypeScript errors after changes:**
```bash
npm run build  # Check for compilation errors
```

## 📚 Documentation

- [Architecture Overview](./docs/architecture.md)
- [UI Sidebar Layout](./docs/ui/sidebar-layout.md)
- [Appointments Feature](./docs/features/appointments.md)
- [Services Feature](./docs/features/services.md)
- [Troubleshooting Guide](./docs/troubleshooting.md)

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📄 License

Private project for Minell's Salon.
