// packages/client/src/features/tags/index.ts

// Pages
export { default as TagsListPage } from './pages/TagsListPage';
export { default as CreateTagModal } from './pages/CreateTagModal';
export { default as DeleteTagModal } from './pages/DeleteTagModal';
export { default as TagTendersDrawer } from './pages/TagTenderDrawer';

// Components
export { default as TagTable } from './components/TagTable';
export { default as TagStatsCards } from './components/TagStatsCards';
export { default as TagSearchBar } from './components/TagSearchBar';
export { default as VendorEmailToggle } from './components/VendorEmailToggle';

// Types
export * from './types/tagTypes';

// Data (for development)
export * from './data/dummyData';