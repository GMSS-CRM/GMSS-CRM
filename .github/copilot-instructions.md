# GMSS-CRM Codebase Instructions

## Architecture Overview
This is a **monorepo** using Yarn workspaces with three packages:
- **client**: React 19 + TypeScript + Vite frontend (ports to Ant Design UI library)
- **server**: Apollo GraphQL API with Express, TypeORM, and PostgreSQL
- **types**: Shared TypeScript types auto-generated from GraphQL schema

**Data Flow**: Client → Apollo Client → GraphQL → Resolvers → Services → Repositories → TypeORM → PostgreSQL

## Critical Build & Development Workflows

### Codegen Pipeline (Server-Driven Type Safety)
The server generates TypeScript types from GraphQL schemas, which are consumed by both server and client:
1. **Server** defines GraphQL schemas in `src/components/<domain>/schema.ts` and base schema in `src/graphql/base.schema.ts`
2. **Codegen** (via `yarn workspace server codegen`) generates `packages/types/src/graphql-types.ts`
3. **Client imports** from `@gmss/types` for type-safe Apollo operations
4. **Dev watch mode**: `yarn workspace server dev` runs `dev:codegen --watch` alongside `dev:server`

**Important**: Always run codegen after modifying GraphQL schemas. The build will fail if types are out of sync.

### Build Order
- `yarn workspaces run build` compiles TypeScript in all packages with `tsc -b` (build mode for incremental builds)
- Client also runs Vite build after TypeScript compilation

## Project-Specific Patterns

### Server Component Architecture (DDD-inspired)
Each domain component (`src/components/<domain>/`) has a fixed structure:
- `schema.ts` - GraphQL type definitions (drives type generation)
- `resolver.ts` - Apollo resolver functions (imported into `graphql/resolvers.ts`)
- `service.ts` - Business logic, injected via Inversify
- `repository.ts` - Data access layer using TypeORM
- `types.ts` - Service/repository interfaces
- `index.ts` - Barrel exports

**Example**: User domain files (`packages/server/src/components/user/`) all follow this pattern.

### Dependency Injection (Inversify)
Server uses Inversify IoC container (`src/inversify/container.ts`) for singleton-scoped services:
- Services are bound to interfaces (e.g., `IUserService`)
- Repositories access `AppDataSource` (TypeORM data source) injected from container
- Add new services/repos by binding them in `container.ts` with `TYPES` enum

### Client Feature-Based Structure
Client organizes features in `src/features/<domain>/`:
- `pages/` - Route components for feature
- `services/` - Apollo client queries/mutations (if needed)
- `types/` - Feature-specific types
- `index.ts` - Barrel exports of page components

**Example**: `src/features/auth/pages/login` exports LoginPage via `auth/index.ts`

### Providers & Context Composition
Client wraps app in three providers in `main.tsx`:
1. **ApolloProvider** - GraphQL client with HTTP link to `VITE_GRAPHQL_URL` env var
2. **AuthProvider** - Manages user auth state and tokens
3. **BrowserRouter** - React Router v7 for SPA routing

All wrapped in `ThemeProvider` (App-level) which reads CSS variables for theme switching.

### Ant Design Theme Integration
Ant Design theme is dynamically computed from CSS variables in `app/config/themes.ts` and applied via `ConfigProvider` in `App.tsx`. Theme colors are sourced from CSS, not hardcoded TypeScript objects.

## Cross-Package Communication

### Type Imports
- **Server → Types**: Server code can `import { GraphQL types } from '@gmss/types'` (auto-generated)
- **Client → Types**: Client can `import { GraphQL types } from '@gmss/types'`
- **Server & Client**: Both consume the same `graphql-types.ts`, ensuring consistency

### Path Aliases (tsconfig.base.json)
- `~/` in server resolves to `packages/server/src/`
- `@gmss/types` resolves to `packages/types/src/`

## Key Integration Points

### Apollo Client Setup
Located in `packages/client/src/app/apollo/client.ts`:
- Uses HTTP link (not WebSocket)
- Credentials `include` for cross-origin auth
- InMemoryCache for client-side state management

### Express/Apollo Server Setup
Located in `packages/server/src/server.ts`:
- Merges TypeDefs from all components via `graphql/typedefs.ts`
- Merges resolvers from all components via `graphql/resolvers.ts`
- Auth context extracted from `Authorization` header (stored in GraphQLContext)
- Listens on `PORT` env var (default 4000)

### Database Configuration
TypeORM data source (`src/config/data-source.ts`) connects to PostgreSQL using environment variables. Entity definitions in `src/entities/` are synchronized with database on startup.

## Development Commands
- `yarn dev` (root): Runs all packages in dev mode
- `yarn workspace server dev`: Server + codegen watch
- `yarn workspace client dev`: Vite dev server
- `yarn workspace server codegen`: Generates types once
- `yarn workspaces run build`: Full build (tsc + Vite)

## External Dependencies Worth Knowing
- **Firebase**: Auth & Realtime DB (client config in `app/config/firebase.ts`)
- **RxJS**: Reactive programming (used in auth provider or services)
- **React Router v7**: Latest major version, updated API from v6
- **TypeORM**: ORM with Inversify integration for entity management
- **Express Middleware**: Custom middleware can be added before graphql mount
