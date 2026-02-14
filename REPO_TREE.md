# GMSS-CRM Repository Tree

This file lists the repository's nested folder and file structure (as visible in workspace during analysis).

- package.json
- tsconfig.base.json
- GSMCONTEXT.md

- packages/
  - client/
    - package.json
    - tsconfig.app.json
    - tsconfig.json
    - tsconfig.node.json
    - vite.config.ts
    - index.html
    - README.md
    - eslint.config.js
    - public/
    - src/
      - App.css
      - App.tsx
      - index.css
      - main.tsx
      - app/
        - apollo/
          - client.ts
        - config/
          - antd-theme.ts
          - firebase.ts
          - themes.ts
        - providers/
          - AuthProvider.tsx
          - index.ts
          - ThemeProvider.tsx
        - routes/
          - AppRoutes.tsx
          - ProtectedRoute.tsx
      - assets/
      - components/
        - avatar/
          - index.tsx
          - styles.module.css
        - button/
          - index.tsx
          - styles.css
        - confirm-modal/
          - index.tsx
        - input/
          - index.tsx
        - loader/
          - index.tsx
        - mobile-blocker/
          - index.tsx
          - styles.module.css
        - notifications/
          - index.tsx
          - styles.module.css
        - sub-menu/
          - index.tsx
          - styles.module.css
        - theme-switcher/
          - index.tsx
          - styles.module.css
      - features/
        - auth/
          - index.ts
          - pages/
            - login
            - reset-password
            - email-handler
            - verify-email
        - dashboard/
          - index.tsx
          - styles.module.css
        - security/
          - index.ts
          - pages/
            - users/
              - list/
              - details-form/
            - roles/
            - permissions/
          - services/
          - types/
        - settings/
        - tags/
          - index.ts
          - pages/
            - CreateTagModal.tsx
            - DeleteTagModal.tsx
            - EditTagModal.tsx
            - TagsListPage.tsx
            - TagTenderDrawer.tsx
          - components/
            - TagSearchBar.tsx
            - TagStatsCards.tsx
            - TagTable.tsx
            - VendorEmailToggle.tsx
          - hooks/
            - useTagData.ts
          - services/ (empty)
          - types/
            - tagTypes.ts
          - data/
            - dummyData.ts
          - styles/
            - tags.module.css (referenced)
        - tenders/
          - index.ts (export)
          - pages/
            - details-form/
              - index.tsx
              - styles.module.css
            - list/
              - index.tsx
              - styles.module.css
            - view/
              - index.tsx
              - styles.module.css
          - services/
            - tenders.service.ts
          - types/
            - index.ts
          - utils/
            - index.ts
          - constants/
            - index.ts
        - vendors/
          - pages/
            - index.tsx
            - list/
            - details-form/
          - services/
            - vendors.service.ts
          - types/
            - index.ts
      - layouts/
        - main-layout/
          - index.tsx
          - styles.module.css
      - pages/
        - NotFound/
      - styles/
        - theme.css
  - server/
    - package.json
    - tsconfig.json
    - nodemon.json
    - codegen.yml
    - TAG_BACKEND_OVERVIEW.md
    - src/
      - index.ts
      - server.ts
      - context.ts
      - config/
        - data-source.ts
      - inversify/
        - container.ts
        - types.ts
      - graphql/
        - base.schema.ts
        - index.ts
        - resolvers.ts
        - typedefs.ts
      - components/
        - common/
          - error-info.ts
          - utils.ts
          - hooks/
        - user/
          - index.ts
          - repository.ts
          - resolver.ts
          - schema.ts
          - service.ts
          - types.ts
        - role/
          - index.ts
          - repository.ts
          - resolver.ts
          - schema.ts
          - service.ts
          - types.ts
        - role-permission/
          - index.ts
          - repository.ts
          - resolver.ts
          - schema.ts
          - service.ts
          - types.ts
        - tag/
          - index.ts
          - repository.ts
          - resolver.ts
          - schema.ts
          - service.ts
          - types.ts
        - vendor/
          - index.ts
          - repository.ts
          - resolver.ts
          - schema.ts
          - service.ts
          - types.ts
        - vendor-tag/
          - index.ts
          - repository.ts
          - resolver.ts
          - schema.ts
          - service.ts
          - types.ts
        - vendor-contact-person/
          - index.ts
          - repository.ts
          - resolver.ts
          - schema.ts
          - service.ts
          - types.ts
        - vendor-document/
          - index.ts
          - repository.ts
          - resolver.ts
          - schema.ts
          - service.ts
          - types.ts
        - tender/
          - index.ts
          - repository.ts
          - resolver.ts
          - schema.ts
          - service.ts
          - types.ts
        - tender-document/
          - index.ts
          - repository.ts
          - resolver.ts
          - schema.ts
          - service.ts
          - types.ts
      - entities/
        - index.ts
        - User.ts
        - Role.ts
        - RolePermission.ts
        - Tag.ts
        - Vendor.ts
        - VendorTag.ts
        - VendorContactPerson.ts
        - VendorDocument.ts
        - Tender.ts
        - TenderDocument.ts
        - TenderTag.ts
  - types/
    - package.json
    - tsconfig.json
    - src/
      - graphql-types.ts
      - index.ts


Notes:
- Many frontend features still use dummy/in-memory data under `packages/client/src/features/*/data` or mock services.
- Backend GraphQL modules are organized per-domain and merged in `packages/server/src/graphql/typedefs.ts` and `resolvers.ts`.
- `packages/server/src/inversify/container.ts` binds repositories and services for dependency injection.

## Theme usage (how UI applies theme tokens)

Where the theme is implemented:

- `packages/client/src/app/providers/ThemeProvider.tsx` — writes the selected theme into CSS variables on `:root` and exposes `useTheme()`.
- `packages/client/src/App.tsx` — reads `currentTheme` (from `useTheme()`), builds Ant Design `theme` tokens and wraps the app in `ConfigProvider` so Ant Design components use the theme.
- `packages/client/src/app/config/antd-theme.ts` — helper showing how to read CSS variables with `getComputedStyle` (used as an alternate approach).

Key implementation excerpts (copy/paste-ready):

Theme provider: (from `packages/client/src/app/providers/ThemeProvider.tsx`)

```tsx
// applyTheme writes many CSS variables to :root
const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.style.setProperty('--bg-app', theme.colors.bgApp);
  root.style.setProperty('--bg-panel', theme.colors.bgPanel);
  root.style.setProperty('--text-primary', theme.colors.textPrimary);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--color-success', theme.colors.colorSuccess);
  root.style.setProperty('--color-error', theme.colors.colorError);
  // ...more variables
};

const setTheme = (themeId: string) => {
  const theme = themes.find(t => t.id === themeId);
  if (theme) {
    applyTheme(theme);
    setCurrentTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  }
};
```

Using theme tokens with Ant Design: (from `packages/client/src/App.tsx`)

```tsx
import { ConfigProvider } from 'antd';
import { useTheme } from './app/providers/ThemeProvider';

function ThemedApp() {
  const { currentTheme } = useTheme();

  const antdTheme = useMemo(() => ({
    token: {
      colorPrimary: currentTheme.colors.accent,
      colorSuccess: currentTheme.colors.colorSuccess,
      colorError: currentTheme.colors.colorError,
      colorTextBase: currentTheme.colors.textPrimary,
      colorBgBase: currentTheme.colors.bgPanel,
      colorBgLayout: currentTheme.colors.bgApp,
      colorBorder: currentTheme.colors.borderColor,
      // ...other token overrides
    },
    components: { /* per-component tokens */ },
  }), [currentTheme]);

  return (
    <ConfigProvider theme={antdTheme}>
      <MobileBlocker>
        <AppRoutes />
      </MobileBlocker>
    </ConfigProvider>
  );
}
```

Reading CSS variables directly (helper pattern): (from `packages/client/src/app/config/antd-theme.ts`)

```ts
const getCssVar = (varName: string): string => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
  }
  return '';
};

// then use getCssVar('--accent') when building tokens if needed
```

Recommended example snippet to show your senior how UI components should read theme values (use in new Tender UI):

```tsx
// packages/client/src/features/tenders/components/TenderCard.tsx
import React from 'react';
import { Card, Tag } from 'antd';
import { useTheme } from '../../../app/providers/ThemeProvider';

export default function TenderCard({ title, status }: { title: string; status: string }) {
  const { currentTheme } = useTheme();

  // Use theme colors directly for small inline styles or rely on AntD tokens
  return (
    <Card style={{ borderColor: currentTheme.colors.borderColor }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>{title}</div>
        <Tag color={currentTheme.colors.accent}>{status}</Tag>
      </div>
    </Card>
  );
}
```

Notes and guidance for your senior:

- The canonical source of theme values is the `ThemeProvider`'s `currentTheme`. Prefer `useTheme()` to access semantic values in JS/TS (colors, spacing) when you need immediate values for inline styles or logic.
- Prefer Ant Design theming via `ConfigProvider` tokens for component-level look & feel. Use `currentTheme.colors` to build the `token` object (as `App.tsx` already does).
- For CSS authors, prefer the CSS variables (e.g., `var(--accent)`) for stylesheets; `ThemeProvider` writes these variables to `:root`.
- For server-side rendering or build-time code, `packages/client/src/app/config/antd-theme.ts` demonstrates a fallback approach reading CSS variables via `getComputedStyle`.
- If you want, I can also generate a ready-to-add `TenderCard.tsx` (full file) and a small example page wiring it to the existing `Tenders` route. This will give your senior a drop-in example of the theme in action.
If you want, I can also generate a tree with file sizes, or produce a filtered tree only for specific packages or file types (e.g., `.ts`/`.tsx`).
