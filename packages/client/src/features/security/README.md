# Security Module - Enterprise User Management UI

This module provides a complete enterprise-grade Security administration interface matching the screenshot specification. It includes user management, roles, permissions, and restrictions.

## Overview

The Security module implements a three-section layout:
1. **Left Navigation** - Security sub-menu (Users, Roles, Permissions, Restrictions)
2. **Center Panel** - Users list with search and selection
3. **Right Panel** - User details form with editable fields

## Architecture

### Components

#### SecurityPage.tsx (Container Component)
Main page component that orchestrates the entire Security module layout. Manages:
- State for selected security menu item (defaults to 'users')
- User list state
- Selected user state
- Form submission and cancellation logic
- Mock data initialization

**Key Features:**
- Auto-selects first user on mount
- Switches between Users/Roles/Permissions/Restrictions views
- Handles user save with local state updates
- Displays placeholders for non-users menu items

#### SecurityMenu.tsx
Vertical navigation menu component with icons for:
- Users
- Roles
- Permissions
- Restrictions

**Props:**
```typescript
interface SecurityMenuProps {
  selectedMenu: SecurityMenuItem;
  onMenuChange: (key: SecurityMenuItem) => void;
}
```

#### UsersList.tsx
Displays searchable list of users with filtering.

**Features:**
- Real-time search across first name, last name, and email
- User avatars with initials
- Visual selection state (highlighted row with blue left border)
- Add user button (placeholder)
- User count display
- Role count indicator per user

**Props:**
```typescript
interface UsersListProps {
  users: User[];
  selectedUserId: string | null;
  onUserSelect: (userId: string) => void;
  onAddUser: () => void;
}
```

#### UserDetailsForm.tsx
Editable form for user information with the following sections:

**User Details Section:**
- First Name (required)
- Middle Name (optional)
- Last Name (required)
- Username/UPN (read-only email field)

**User Roles Section:**
- Multi-select dropdown with tag display
- Pre-loaded with 5 mock roles

**User Restrictions Section:**
- Multi-select dropdown for restrictions
- Equipment Tag, Location, Department types

**Features:**
- Smart Save button (only enabled when form is dirty)
- Form validation on save
- Cancel button reverts to last saved state
- Active/Inactive toggle switch in header
- User avatar with initials in header

**Props:**
```typescript
interface UserDetailsFormProps {
  user: User | null;
  onSave: (updatedUser: User) => void;
  onCancel: () => void;
  roles: Role[];
  restrictions: Restriction[];
}
```

### Types

All types are defined in `types/index.ts`:

```typescript
interface User {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  roles: string[];
  restrictions: string[];
  isActive: boolean;
  roleCount: number;
}

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface Restriction {
  id: string;
  name: string;
  type: 'EquipmentTag' | 'Location' | 'Department';
}

type SecurityMenuItem = 'users' | 'roles' | 'permissions' | 'restrictions';
```

## Mock Data

The module includes 20 mock users with:
- Realistic names and email addresses
- Assigned roles (1-5 per user)
- Equipment/location restrictions
- Active/inactive status

To use real data, replace the mock data arrays in `SecurityPage.tsx` with API calls.

## Styling

CSS Modules are used for component-specific styling:
- `SecurityMenu.module.css` - Menu styling with clean typography
- `UsersList.module.css` - List styling with hover states and selection highlighting
- `UserDetailsForm.module.css` - Form layout with section headers
- `SecurityPage.module.css` - Container layout

All styles follow enterprise design patterns with:
- Consistent color palette (#0066cc for primary)
- Proper spacing and typography
- Smooth transitions and hover effects
- Responsive grid layout using Ant Design's Row/Col

## State Management

The component uses React hooks for state management:
- `useState` for UI state (selected user, search text, form dirty state)
- `useMemo` for filtered user lists (prevents unnecessary recalculations)
- `useEffect` for side effects (auto-select first user)
- Ant Design's `Form` component for form state

**Note:** This is a client-side only implementation. For production, integrate with a backend API for persistence.

## Integration with MainLayout

The SecurityPage is routed at `/security` and integrated into MainLayout:

```tsx
<Route path="/security" element={<SecurityPage />} />
```

When the "Security" menu item in the left sidebar is clicked, the MainLayout navigates to `/security`.

## How to Use

### Basic Usage
1. Click "Security" in the main navigation sidebar
2. The Security page loads with Users view selected by default
3. The first user is automatically selected
4. Edit user details in the right panel
5. Click Save to persist changes (button is only enabled when form is dirty)

### Search Users
1. Type in the search box in the Users list
2. Results filter in real-time by first name, last name, or email

### Switch Menu Items
Click on Roles, Permissions, or Restrictions to switch views (currently showing placeholders).

## Component Interaction Flow

```
SecurityPage (state manager)
  ├── SecurityMenu (navigation)
  ├── UsersList (selection + filtering)
  └── UserDetailsForm (editing)

User Selection Flow:
1. User clicks a user in UsersList
2. onUserSelect callback updates selectedUserId in SecurityPage
3. SecurityPage finds selected User object
4. UserDetailsForm receives user prop
5. Form automatically populates with user data

Save Flow:
1. User edits form fields
2. onValuesChange triggers handleFieldChange
3. isDirty state becomes true
4. Save button becomes enabled
5. User clicks Save
6. Form validates
7. onSave callback updates SecurityPage state
8. Component re-renders with new data
```

## Future Enhancements

- Replace mock data with API integration
- Implement Roles, Permissions, Restrictions views
- Add pagination for large user lists
- Add user creation/deletion
- Implement audit logging
- Add batch user operations
- Implement user filtering by role/restriction
- Add export functionality
- Implement real-time updates with WebSockets

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Ant Design 6.1** - UI component library
- **CSS Modules** - Component scoped styling
- **React Router** - Navigation

## File Structure

```
src/features/security/
├── components/
│   ├── SecurityMenu.tsx
│   ├── SecurityMenu.module.css
│   ├── UsersList.tsx
│   ├── UsersList.module.css
│   ├── UserDetailsForm.tsx
│   └── UserDetailsForm.module.css
├── pages/
│   ├── SecurityPage.tsx
│   └── SecurityPage.module.css
├── types/
│   └── index.ts
└── index.ts (exports)
```

## Performance Considerations

1. **Filtering** - Uses `useMemo` to prevent unnecessary recalculations during re-renders
2. **Component Splitting** - Logic is split into smaller components for better performance
3. **Lazy Loading** - The Roles/Permissions/Restrictions views can be lazy-loaded in future
4. **Virtual Scrolling** - For large user lists, consider implementing virtual scrolling with react-window

## Accessibility

- Keyboard navigation support on list items (Enter/Space to select)
- Proper ARIA labels and roles
- Color contrast meets WCAG standards
- Form inputs properly labeled
