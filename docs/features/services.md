# Services Feature

Documentation for the service catalog and management system.

## Data Model

```typescript
interface Service {
  id: string;
  category: 'Hair' | 'Nail' | 'Lashes';
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  mediaUrls: string[];
  pointsEarned?: number;
}
```

## User Stories

- Clients browse services by category
- Clients see pricing and duration before booking
- Admins create/edit/deactivate services
- Services can be toggled active/inactive without deletion

## UI Behavior

- Public: Card grid with category filters
- Admin: Table view with edit modal
- Inactive services hidden from public, visible in admin

## Related Code

- `src/pages/Services.tsx` - Public catalog
- `src/pages/admin/Content.tsx` - Admin management
- `src/services/api.ts` - `serviceService`
