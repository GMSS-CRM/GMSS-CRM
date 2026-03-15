# Search & Countdown Timer - Integration Guide

## 📋 What's Been Implemented

### 1. **Search & Vendor Management** ✅
- **SearchModal** component for global search
- **SearchResults** component showing results by section (Tenders, Vendors)
- Search service with GraphQL queries
- Backend search resolvers for tenders and vendors

### 2. **Countdown Timer** ✅
- **CountdownTimer** component with live countdown
- Pause/Resume functionality
- Stop countdown with options:
  - Mark as filled
  - Mark as not interested
  - Extend deadline with new due date

---

## 🔧 How to Integrate

### A. **Add Search Modal to Main Layout**

In your main App.tsx or layout component:

```tsx
import { SearchModal } from '@/features/search';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export const App = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Add search button to header */}
      <Button
        icon={<SearchOutlined />}
        onClick={() => setSearchOpen(true)}
        type="text"
      >
        Search
      </Button>

      {/* Or use keyboard shortcut */}
      <useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
          if ((e.ctrlKey || e.cmdKey) && e.key === 'k') {
            e.preventDefault();
            setSearchOpen(true);
          }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
      }, []);

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onTenderSelect={(tenderId) => navigate(`/tender/${tenderId}`)}
        onVendorSelect={(vendorId) => navigate(`/vendors/${vendorId}`)}
      />
    </>
  );
};
```

### B. **Add Countdown Timer to Tender List/Dashboard**

```tsx
import CountdownTimer from '@/features/tender-workflow/components/CountdownTimer';

export const TenderListPage = () => {
  const { tenders } = useGetTenders();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {tenders.map((tender) => (
        <CountdownTimer
          key={tender.id}
          tenderId={tender.id}
          tenderTitle={tender.name}
          dueDate={tender.submissionDeadline}
          onStop={(reason, details) => {
            if (reason === 'filled') {
              // Mark tender as filled
              updateTenderStatus(tender.id, 'FILLED');
            } else if (reason === 'not_interested') {
              // Mark as not interested
              updateTenderStatus(tender.id, 'NOT_INTERESTED', details);
            } else if (reason === 'extended') {
              // Update due date
              updateTenderDueDate(tender.id, details.newDueDate);
            }
          }}
        />
      ))}
    </div>
  );
};
```

### C. **Backend GraphQL Schema Integration**

The search schema has been created and needs to be registered. Update your GraphQL setup:

1. Add search typedefs to `src/graphql/typedefs.ts`:
```typescript
import { searchTypeDefs } from '../components/search/schema';

export const allTypeDefs = gql`
  ${userTypeDefs}
  ${tenderTypeDefs}
  ${vendorTypeDefs}
  ${searchTypeDefs}  // Add this
  // ... other schemas
`;
```

2. Register SearchResolver in `src/inversify/container.ts`:
```typescript
import { SearchResolver } from '../components/search/resolver';

container.bind(SearchResolver).toSelf().inSingletonScope();
```

3. Add to Apollo Schema build:
```typescript
const schema = await buildSchema({
  resolvers: [
    // ... existing resolvers
    SearchResolver,
  ],
});
```

---

## 📦 Features

### Search Modal
- Global search accessible via button or Ctrl+K
- Real-time search as user types (min 2 characters)
- Results organized by type (Tenders, Vendors)
- Click to navigate to detail page

### Countdown Timer
- Live countdown display (Days, Hours, Minutes, Seconds)
- Color indicators: Blue (normal), Yellow (urgent <3 days), Red (expired)
- Pause/Resume button to pause countdown
- Stop button with options:
  - **Filled Tender**: Mark as completed
  - **Not Interested**: Mark with reason
  - **Extend Deadline**: Pick new due date and restart countdown

---

## 🗂️ File Structure

```
packages/client/src/features/
├── search/
│   ├── components/
│   │   ├── SearchModal.tsx        # Main search modal
│   │   └── SearchResults.tsx      # Results display
│   ├── services/
│   │   └── search.service.ts      # GraphQL queries & hooks
│   └── index.ts                   # Exports

packages/server/src/components/
├── search/
│   ├── schema.ts                  # GraphQL type definitions
│   └── resolver.ts                # Query resolvers
```

---

## 🚀 Next Steps

1. **Register search resolver** on backend
2. **Add search button** to main layout header
3. **Add countdown timer** to tender list/dashboard views
4. **Add keyboard shortcut** (Ctrl+K) for search modal
5. **Configure stop action handlers** to update database

---

## 🔗 Dependencies

- `dayjs` - Date/time calculations for countdown
- `@apollo/client` - GraphQL queries
- `antd` - UI components

All are already installed in the project.
