# Sidebar Layout Documentation

This document covers the sidebar implementations used in the admin and client dashboards.

## 📐 Overview

The application has two sidebar layouts:

| Layout | Location | Features |
|--------|----------|----------|
| **AdminLayout** | `/admin/*` | Collapsible, nested groups, notification bell |
| **ClientLayout** | `/client/*` | Fixed, simple navigation |

---

## 🎛️ Admin Sidebar

### File Location
`src/layouts/AdminLayout.tsx`

### Structure

```
┌─────────────────────┐
│  Logo + Badge       │ ← Fixed header
├─────────────────────┤
│  Navigation         │ ← Scrollable
│  ├── Dashboard      │
│  ├── Appointments   │
│  ├── Users ▼        │ ← Expandable group
│  │   ├── Admins     │
│  │   ├── Clients    │
│  │   └── Staff      │
│  ├── Inquiries (2)  │ ← Badge
│  ├── Content        │
│  └── ...            │
├─────────────────────┤
│  User Profile       │ ← Fixed footer
│  Avatar + Name      │
└─────────────────────┘
```

### Key Features

1. **Collapsible**: Toggles between 64px (icons only) and 256px (full)
2. **Scrollable Navigation**: Uses `ScrollArea` for overflow
3. **Nested Groups**: Users contains Admin/Clients/Staff
4. **Active State Detection**: Highlights current route
5. **Badge Indicators**: Shows counts (e.g., inquiries)

### Collapse Behavior

```tsx
// Sidebar width classes
className={cn(
  isSidebarOpen ? 'w-64' : 'w-20',
  // ...
)}

// Toggle button
<Button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
  <ChevronLeft className={cn(!isSidebarOpen && 'rotate-180')} />
</Button>
```

### Nested Navigation Groups

```tsx
// Using Collapsible from shadcn/ui
<Collapsible open={isExpanded}>
  <CollapsibleTrigger>
    <Users icon /> Users <ChevronDown />
  </CollapsibleTrigger>
  <CollapsibleContent>
    <Link to="/admin/users?type=admin">Admins</Link>
    <Link to="/admin/staff">Staff</Link>
  </CollapsibleContent>
</Collapsible>
```

### Mobile Behavior

- Hidden by default (off-screen left)
- Hamburger menu in header reveals it
- Overlay backdrop for dismissal
- Full-width on small screens

```tsx
// Mobile overlay
{isMobileSidebarOpen && (
  <div
    className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
    onClick={() => setIsMobileSidebarOpen(false)}
  />
)}

// Sidebar transform
className={cn(
  isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
)}
```

---

## 👤 Client Sidebar

### File Location
`src/layouts/ClientLayout.tsx`

### Structure

```
┌─────────────────────┐
│  Avatar + User Info │
│  Name, Email        │
│  Loyalty Badge      │
├─────────────────────┤
│  Profile            │
│  My Appointments    │
│  Loyalty Rewards    │
│  Notifications (2)  │
│  Settings           │
│  Logout             │
└─────────────────────┘
```

### Key Features

- Fixed width (256px)
- Sticky positioning
- User info card at top
- Simple flat navigation
- Logout as button (not link)

---

## 🎨 Styling Guidelines

### Semantic Tokens Used

```css
/* Sidebar-specific tokens from index.css */
--sidebar-background: 0 0% 8%;        /* Dark background */
--sidebar-foreground: 45 20% 90%;     /* Light text */
--sidebar-primary: 45 85% 50%;        /* Gold accent */
--sidebar-accent: 0 0% 15%;           /* Hover state */
--sidebar-border: 0 0% 20%;           /* Dividers */
```

### Active State

```tsx
className={cn(
  isActive(href)
    ? 'bg-sidebar-accent text-sidebar-primary'  // Active
    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'  // Default
)}
```

---

## ♿ Accessibility

### Requirements Met

1. **Keyboard Navigation**: All items focusable
2. **ARIA Labels**: Collapsible uses proper ARIA
3. **Focus Visible**: Focus rings on interactive elements
4. **Semantic HTML**: `nav`, `button` used appropriately

### Current Implementation

```tsx
// Toggle button has descriptive aria-label
<Button
  aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
>

// Navigation uses semantic nav element
<nav className="p-4 space-y-2">
```

---

## 🔧 Extending the Sidebar

### Adding a New Link

```tsx
// In sidebarLinks array
{ href: '/admin/new-page', icon: NewIcon, label: 'New Page' },
```

### Adding a New Group

```tsx
{
  href: '/admin/parent',
  icon: ParentIcon,
  label: 'Parent',
  children: [
    { href: '/admin/parent/child1', label: 'Child 1' },
    { href: '/admin/parent/child2', label: 'Child 2' },
  ]
}
```

### Adding a Badge

```tsx
{ href: '/admin/item', icon: Icon, label: 'Item', badge: 5 },
```

---

## 🐛 Common Issues

### Sidebar Overlapping Content

**Problem**: Profile info overlaps navigation

**Solution**: Use flex layout with proper footer positioning

```tsx
<aside className="flex flex-col h-full">
  <header>Logo</header>
  <ScrollArea className="flex-1">Navigation</ScrollArea>
  <footer className="flex-shrink-0">Profile</footer>
</aside>
```

### Mobile Sidebar Not Closing

**Problem**: Clicking link doesn't close mobile menu

**Solution**: Add `onClick` handler to links

```tsx
<Link
  to={href}
  onClick={() => setIsMobileSidebarOpen(false)}
>
```

### Group Not Expanding

**Problem**: Nested group stays collapsed

**Solution**: Check `expandedGroups` state and auto-expand on active child

```tsx
useEffect(() => {
  if (isChildActive && !expandedGroups.includes(parentHref)) {
    setExpandedGroups(prev => [...prev, parentHref]);
  }
}, [location.pathname]);
```
