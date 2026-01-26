# OctoCAT Supply - AI Coding Agent Instructions

## Project Overview
This is a **TypeScript monorepo** demonstrating GitHub Copilot capabilities through a supply chain management demo app. The entire codebase was built with Copilot, including UI designs and documentation.

# OctoCAT Supply Project Guidelines

* [Product Vision and Goals](../PRODUCT.md): Understand the high-level vision and objectives of the product to ensure alignment with business goals.
* [System Architecture and Design Principles](../ARCHITECTURE.md): Overall system architecture, design patterns, and design principles that guide the development process.
* [Contributing Guidelines](../CONTRIBUTING.md): Overview of the project's contributing guidelines and collaboration practices.

Suggest to update these documents if you find any incomplete or conflicting information during your work.

## Architecture & Structure

**Monorepo Pattern** (npm workspaces):
- `api/` - Express.js REST API with in-memory data storage
- `frontend/` - React 18 + Vite SPA with Tailwind CSS
- `docs/` - Architecture and build documentation
- `.github/prompts/` - Custom Copilot prompt files (`.prompt.md`)

**Key Design Decision**: Uses **seed data pattern** (`api/src/seedData.ts`) instead of a database. All routes import and mutate in-memory arrays, with `reset*()` functions exported for testing. This simplifies demos but means data doesn't persist across restarts.

## Development Workflow

**Start Development** (both API + frontend):
```bash
npm run dev          # Runs concurrently: API on :3000, frontend on :5137
```

**Individual Services**:
```bash
npm run dev:api      # Uses tsx for hot-reload (not nodemon)
npm run dev:frontend # Vite dev server
```

**Testing**:
```bash
npm test                      # All workspaces
npm run test --workspace=api  # Vitest (not Jest)
```

**VS Code Tasks**: Available tasks for "Build API", "Build Frontend" - prefer these in demos.

## Code Patterns

### API Routes Pattern
Every route file follows this structure:
1. **Swagger JSDoc** at top (`@swagger` comments for OpenAPI)
2. **Import seed data** from `seedData.ts`
3. **In-memory array** initialized from seed data
4. **Export reset function** for testing (e.g., `export const resetBranches = () => {...}`)
5. **Standard CRUD endpoints** - POST, GET all, GET by ID, PUT, DELETE

Example from `api/src/routes/branch.ts`:
```typescript
let branches: Branch[] = [...seedBranches];
export const resetBranches = () => { branches = [...seedBranches]; };
```

All routes register in `api/src/index.ts` with `/api/` prefix.

### Frontend Context Pattern
- **AuthContext**: Simple demo auth - any `@github.com` email = admin access
- **ThemeContext**: Dark/light mode with `localStorage` persistence via custom `themeContextUtils.ts`
- Both use custom hooks (`useAuth()`, `useTheme()`) that throw if used outside Provider

### API Configuration (Frontend)
`frontend/src/api/config.ts` has smart runtime detection:
1. Check `window.RUNTIME_CONFIG` (from `runtime-config.js`)
2. Detect Codespaces via `CODESPACE_NAME` env
3. Fall back to `localhost:3000`

**Important**: CORS is pre-configured for Codespaces (regex pattern in `api/src/index.ts`).

## Project-Specific Conventions

### Swagger Documentation
All API routes MUST have `@swagger` JSDoc comments. The Swagger UI is auto-generated and viewable at `http://localhost:3000/api-docs`.

Models define schemas in JSDoc at `api/src/models/*.ts`.

### Testing Conventions
- Tests use **Vitest** (not Jest) with `supertest` for API
- Each test suite calls the route's reset function in `beforeEach()`
- Test files named `*.test.ts` (e.g., `branch.test.ts`)
- Coverage available via `npm run test:api -- --coverage`

### Component Organization
Frontend components in `frontend/src/components/`:
- `admin/` - Admin-only views (requires `isAdmin` from AuthContext)
- `entity/<entity>/` - Entity-specific components (e.g., `product/ProductForm.tsx`)
- Root level - Shared components (Navigation, Footer, Welcome, About, Login)

### Styling Convention
All components support dark mode via `useTheme()` hook:
```tsx
const { darkMode } = useTheme();
<div className={`${darkMode ? 'bg-dark text-light' : 'bg-white text-gray-800'}`}>
```

Tailwind configured with custom theme colors in `frontend/tailwind.config.js`.

## Integration Points

**API ↔ Frontend Communication**:
- Frontend uses `axios` + `react-query` for data fetching
- API endpoints centralized in `frontend/src/api/config.ts`
- No authentication tokens - demo uses client-side auth simulation

**Deployment**:
- Both services containerizable via Dockerfiles
- Deployment scripts in `infra/configure-deployment.sh`
- Designed for GitHub Codespaces (auto-CORS, protocol detection)

## Custom Copilot Features

This repo demonstrates:
- **Custom Chat Modes**: See `.github/chatmodes/` for custom agents
- **Prompt Files**: See `.github/prompts/*.prompt.md` for reusable prompts (e.g., `Unit-Test-Coverage.prompt.md`)
- **Custom Instructions**: This file and API-specific instructions in `.github/instructions/`

## Common Gotchas

1. **Data doesn't persist** - By design. Restart API to reset all data to seed state.
2. **Port conflicts** - API expects :3000, frontend :5137. Check if ports are available.
3. **Admin access** - Login with any `@github.com` email to access admin features.
4. **Tests modify shared state** - Always call reset functions in test setup.
5. **Swagger must stay in sync** - Update JSDoc when changing routes or models.

## When Adding Features

**New API Endpoint**:
1. Add model interface in `api/src/models/`
2. Add seed data in `api/src/seedData.ts`
3. Create route in `api/src/routes/` with Swagger docs
4. Register route in `api/src/index.ts`
5. Add tests in `api/src/routes/*.test.ts`

**New Frontend Component**:
1. Place in appropriate directory (`admin/`, `entity/`, or root)
2. Import and use `useTheme()` for dark mode support
3. Use TypeScript interfaces for props/state
4. Follow existing Tailwind patterns for responsive design