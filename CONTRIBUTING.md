# Contributing to Minell's Salon System

Thank you for contributing to this project. Please follow these guidelines to maintain code quality and consistency.

## 📋 Table of Contents

- [Branching Strategy](#branching-strategy)
- [Commit Message Conventions](#commit-message-conventions)
- [Pull Request Checklist](#pull-request-checklist)
- [Code Style](#code-style)
- [Testing Expectations](#testing-expectations)
- [Adding New Features](#adding-new-features)

---

## 🌿 Branching Strategy

We follow a simplified Git Flow:

```
main (production)
  └── develop (integration)
        ├── feature/feature-name
        ├── fix/bug-description
        └── refactor/component-name
```

### Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/short-description` | `feature/loyalty-redemption` |
| Bug Fix | `fix/issue-description` | `fix/calendar-timezone` |
| Refactor | `refactor/component-name` | `refactor/appointment-modal` |
| Docs | `docs/topic` | `docs/api-integration` |

### Rules

1. **Never push directly to `main` or `develop`**
2. Create feature branches from `develop`
3. Keep branches short-lived (< 1 week ideally)
4. Delete branches after merging

---

## 💬 Commit Message Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code refactoring |
| `test` | Adding/updating tests |
| `chore` | Build process, tooling |

### Examples

```bash
# Feature
feat(appointments): add reschedule modal with date picker

# Bug fix
fix(loyalty): correct points calculation on redemption

# Refactor
refactor(dashboard): extract stats widgets to components

# Docs
docs(readme): update local setup instructions
```

### Rules

- Use imperative mood: "add" not "added" or "adds"
- Keep first line under 72 characters
- Reference issues when applicable: `fix(auth): session timeout (#42)`

---

## ✅ Pull Request Checklist

Before submitting a PR, ensure:

### Code Quality
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] ESLint passes (`npm run lint`)
- [ ] No console.log statements in production code
- [ ] No hardcoded colors (use design tokens)

### Functionality
- [ ] Feature works as expected
- [ ] Edge cases handled
- [ ] Responsive design verified (mobile + desktop)
- [ ] Dark mode compatibility checked

### Documentation
- [ ] Code is self-documenting or has comments for complex logic
- [ ] README updated if adding new features
- [ ] Types exported if reusable

### Review
- [ ] Self-reviewed the diff
- [ ] Removed debugging code
- [ ] Meaningful variable/function names
- [ ] No unused imports or variables

---

## 🎨 Code Style

### TypeScript + React

```tsx
// ✅ Good: Typed functional component
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <div className="card-luxury p-4">
      <h3 className="font-semibold text-foreground">{user.name}</h3>
      <Button onClick={() => onEdit(user.id)}>Edit</Button>
    </div>
  );
};

// ❌ Bad: Untyped, inline styles
const UserCard = (props) => {
  return (
    <div style={{ background: 'white', padding: '16px' }}>
      <h3 style={{ color: 'black' }}>{props.user.name}</h3>
    </div>
  );
};
```

### Styling

```tsx
// ✅ Good: Use semantic tokens
<div className="bg-background text-foreground border-border">
<Button className="bg-primary text-primary-foreground">

// ❌ Bad: Hardcoded colors
<div className="bg-white text-black border-gray-200">
<Button className="bg-yellow-500 text-black">
```

### File Organization

```
// ✅ Good: Focused components
src/components/appointments/
├── AppointmentCard.tsx
├── AppointmentList.tsx
├── AppointmentFilters.tsx
└── index.ts

// ❌ Bad: Monolithic files
src/components/
└── Appointments.tsx (500+ lines)
```

---

## 🧪 Testing Expectations

### Current State

The project uses manual testing. When adding tests:

1. **Unit Tests**: For utility functions and hooks
2. **Component Tests**: For complex interactive components
3. **Integration Tests**: For critical user flows

### Test File Naming

```
src/
├── utils/
│   ├── dateTime.ts
│   └── dateTime.test.ts
├── hooks/
│   ├── useAppointments.ts
│   └── useAppointments.test.ts
```

### Manual Testing Checklist

Before PR submission, manually verify:

1. [ ] Feature works on desktop (1920x1080)
2. [ ] Feature works on tablet (768x1024)
3. [ ] Feature works on mobile (375x812)
4. [ ] Light mode appearance
5. [ ] Dark mode appearance
6. [ ] Form validation messages
7. [ ] Loading states
8. [ ] Error states

---

## 🚀 Adding New Features Safely

### 1. Plan First

- Identify affected components
- Check existing patterns in codebase
- Review related types in `src/types/index.ts`

### 2. Create Types

```typescript
// src/types/index.ts
export interface NewFeature {
  id: string;
  name: string;
  // ...
}
```

### 3. Add Mock Data

```typescript
// src/data/mockData.ts
export const mockNewFeatures: NewFeature[] = [
  { id: 'nf-1', name: 'Example' },
];
```

### 4. Create Service Layer

```typescript
// src/services/api.ts
export const newFeatureService = {
  async getAll(): Promise<NewFeature[]> {
    await delay();
    return [...mockNewFeatures];
  },
  // ...
};
```

### 5. Build Components

- Start with a page component
- Extract reusable pieces
- Use existing UI components from `src/components/ui/`

### 6. Add Routes

```tsx
// src/App.tsx
<Route path="/admin/new-feature" element={<NewFeaturePage />} />
```

### 7. Update Navigation

```tsx
// src/layouts/AdminLayout.tsx - Add to sidebarLinks
{ href: '/admin/new-feature', icon: NewIcon, label: 'New Feature' },
```

---

## 📞 Getting Help

- Check existing code for patterns
- Review `src/types/index.ts` for data structures
- Look at similar features for implementation guidance
- Ask questions in PR comments
