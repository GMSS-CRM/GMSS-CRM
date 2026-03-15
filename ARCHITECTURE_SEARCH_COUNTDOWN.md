# 🏗️ Architecture Overview - Search & Countdown

## Component Hierarchy

```
App/MainLayout
├── SearchModal
│   ├── Input (search field)
│   └── SearchResults
│       ├── Tender Results Section
│       │   └── TenderCard[] (clickable)
│       └── Vendor Results Section
│           └── VendorCard[] (clickable)
│
├── TenderList/Dashboard
│   └── CountdownTimer[]
│       ├── Display (Days/Hours/Mins/Sec)
│       ├── Pause/Resume Button
│       └── Stop Menu
│           ├── Filled option
│           ├── Not Interested option
│           └── Extend Date Picker
```

## Data Flow

### Search Flow:
```
User Input
    ↓
SearchModal (onChange)
    ↓
useSearchTenders/useSearchVendors hooks
    ↓
GraphQL Query (searchTenders/searchVendors)
    ↓
SearchResolver (backend)
    ↓
Database Query (ILIKE matching)
    ↓
Results returned
    ↓
SearchResults component displays
    ↓
User clicks result
    ↓
onSelect callback → navigate
```

### Countdown Flow:
```
TenderDetailPage
    ↓
Pass [dueDate, tenderId, title]
    ↓
CountdownTimer component
    ↓
useEffect calculates time remaining
    ↓
Updates state every 1 second
    ↓
Renders Statistic components
    ↓
User clicks Pause ↔ Resume / Stop
    ↓
onStop callback with [reason, details]
    ↓
Parent handles action (update DB)
```

## Backend Architecture

```
Server GraphQL
├── Query Type
│   ├── searchTenders(searchTerm: String!)
│   │   └── SearchResolver.searchTenders()
│   │       ├── TenderRepository
│   │       │   └── QueryBuilder + ILIKE filter
│   │       └── Returns: [Tender!]!
│   │
│   └── searchVendors(searchTerm: String!)
│       └── SearchResolver.searchVendors()
│           ├── VendorRepository
│           │   └── QueryBuilder + ILIKE filter
│           └── Returns: [Vendor!]!
```

## State Management

### SearchModal Local State:
```
searchTerm: string              // Current search input
```

### CountdownTimer Local State:
```
timeRemaining: {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}
isPaused: boolean               // Pause state
showStopOptions: boolean        // Show stop menu
newDueDate: dayjs.Dayjs | null  // For extension
```

## Event Handling

### SearchModal Events:
```
Input onChange → setSearchTerm → useSearchTenders/useSearchVendors
TenderCard onClick → onTenderSelect callback → Parent navigates
VendorCard onClick → onVendorSelect callback → Parent navigates
```

### CountdownTimer Events:
```
Pause Button → setIsPaused(!isPaused) → Stop timer interval
Stop Button → Show PopOver menu
  - Filled → onStop('filled', {}) → Parent action
  - Not Interested → onStop('not_interested', {}) → Parent action
  - Extend → DatePicker → onStop('extended', {newDueDate}) → Parent action
```

## Performance Optimizations

### Search:
- ✅ Minimum 2-character requirement (fewer requests)
- ✅ Cache-and-network fetch policy (instant UI + fresh data)
- ✅ Limit 20 results (fast rendering)
- ✅ Lazy query (skip when searchTerm < 2 chars)

### Countdown:
- ✅ useEffect cleanup (prevents memory leaks)
- ✅ Conditional interval (respects pause state)
- ✅ Statistic component (optimized re-renders)
- ✅ Memoization-ready (can add React.memo if needed)

## Integration Checklist

- [ ] Add SearchModal to main layout/header
- [ ] Add Ctrl+K keyboard shortcut
- [ ] Add CountdownTimer to tender list
- [ ] Register SearchResolver in container.ts
- [ ] Add searchTypeDefs to GraphQL typedefs.ts
- [ ] Implement onStop handlers for countdown
- [ ] Test search with various inputs
- [ ] Test countdown pause/resume/extend
- [ ] Add loading states if needed
- [ ] Add error boundaries

## Files Summary

| File | Lines | Purpose |
|------|-------|---------|
| SearchModal.tsx | 95 | Search UI modal |
| SearchResults.tsx | 150 | Results display logic |
| search.service.ts | 110 | GraphQL queries + hooks |
| search/index.ts | 3 | Exports |
| CountdownTimer.tsx | 200 | Countdown UI + logic |
| search/schema.ts | 10 | GraphQL types |
| search/resolver.ts | 60 | Backend queries |
| **TOTAL** | **~630** | **Complete implementation** |

## Testing Recommendations

### Search Tests:
```javascript
✓ Search with < 2 chars (should show "enter 2 characters")
✓ Search with 2 chars (should show results)
✓ Search tender by number
✓ Search tender by title
✓ Search vendor by name
✓ Click tender result (navigate)
✓ Click vendor result (navigate)
✓ No results case
✓ Loading state
```

### Countdown Tests:
```javascript
✓ Display counts down every second
✓ Color changes based on days remaining
✓ Pause button stops countdown
✓ Resume button restarts countdown
✓ Stop→Filled triggers callback
✓ Stop→Not Interested triggers callback
✓ Stop→Extend with date picks new date
✓ Expired countdown shows red
```
