# OctoCAT Supply: Copilot Instructions

This is a **GitHub Copilot demo project** showcasing AI-assisted development across full-stack TypeScript. It's a supply chain management system with Express API and React frontend, designed to demonstrate Copilot's capabilities in Agent Mode, MCP servers, custom instructions, and IaC.

## Architecture Overview

**Monorepo structure** (npm workspaces):
- `api/` - Express.js REST API (port 3000) with Swagger/OpenAPI docs
- `frontend/` - React 18+ with Vite (port 5137)

**Data model**: Headquarters → Branch → Order → OrderDetail → OrderDetailDelivery ← Delivery ← Supplier; OrderDetail references Product

**Key principle**: All APIs are documented via JSDoc in route files for auto-generated Swagger (`/api-docs`). The frontend calls APIs through `axios` configured in `frontend/src/api/config.ts`.

## Quick Start Commands

```bash
npm install              # Install all dependencies
npm run build            # Build API & Frontend (workspaces)
npm run dev              # Run both API (3000) & Frontend (5137) concurrently
npm run test             # Run tests in both workspaces (vitest)
npm run test:coverage    # API coverage with vitest
```

Alternatively, use VS Code tasks: `Ctrl+Shift+P` → "Run Task" → "Build API/Frontend"

## Critical Developer Patterns

### API Routes (Express + Swagger)
- **Structure**: `api/src/routes/{entity}.ts` files export Router with JSDoc `@swagger` blocks
- **Swagger location**: Routes auto-documented via JSDoc; schema definitions in `api/src/models/{entity}.ts`
- **Example**: `/api/products` → GET (list), POST (create), /{id} for GET/PUT/DELETE
- **CORS**: Configured in `index.ts`; origins include localhost and Codespace domains via `API_CORS_ORIGINS` env var
- **Seed data**: `api/src/seedData.ts` contains initial dataset; routes implement in-memory state (not persistent DB)

### Frontend Components & State
- **Routing**: React Router v7 in `App.tsx`; pages in `src/components/` (Products, About, Welcome, Login)
- **State management**: 
  - `AuthContext` - login/logout, admin detection (emails ending in `@github.com`)
  - `ThemeContext` - dark/light mode toggle, persisted to localStorage
- **Data fetching**: `react-query` + `axios` for API calls; see `Products.tsx` for pattern
- **Styling**: Tailwind CSS with theme-aware classNames (check `darkMode` boolean from `useTheme()`)
- **UI patterns**: Modal windows, dropdown menus, product carousels (via react-slick)

### Testing
- **API**: Vitest + supertest in `api/src/routes/*.test.ts`
- **Pattern**: Create Express app, mount router, test endpoints (GET/POST/PUT/DELETE)
- **Setup**: `beforeEach` resets seed data; tests verify status codes and response bodies
- **Frontend**: Vitest configured but minimal existing tests; use `@testing-library/react`

## Important Conventions

1. **TypeScript**: Strict mode everywhere; interfaces defined in model files, used across routes and components
2. **API contracts**: All entity types in `api/src/models/{entity}.ts` as interfaces with optional fields; reused in frontend
3. **Environment configuration**: 
   - API: `PORT` (default 3000), `API_CORS_ORIGINS` (comma-separated)
   - Frontend: `CODESPACE_NAME` automatically detected; frontend auto-configures API URL (localhost, Codespace, or runtime config)
4. **Admin features**: Check `isAdmin` from `useAuth()` in components; hides/shows admin menu in Navigation
5. **Discount logic**: Product model includes optional `discount` field (decimal, e.g., 0.25 = 25%); use in price calculations
6. **Error handling**: Routes return HTTP 404 when entity not found; frontend catches with axios error handling (see Products.tsx)

## File Organization Reference

```
api/src/
  index.ts              # Express app, CORS, Swagger setup, route imports
  seedData.ts           # Initial data for all entities
  models/               # TypeScript interfaces + Swagger schemas (JSDoc)
  routes/               # Express routers with CRUD endpoints + JSDoc @swagger

frontend/src/
  api/config.ts         # Axios baseURL configuration (auto-detects environment)
  components/           # React components (Navigation, Products, etc.)
  context/              # AuthContext, ThemeContext with providers
  App.tsx               # React Router setup
```

## Integration Points & Common Tasks

**Adding a new API endpoint**:
1. Define interface in `api/src/models/{entity}.ts` with `@swagger` schema block
2. Add route in `api/src/routes/{entity}.ts` with JSDoc `@swagger` operation blocks (GET/POST/PUT/DELETE)
3. Import route in `api/src/index.ts` and mount at `app.use('/api/{entities}', ...)`
4. Swagger docs auto-update at localhost:3000/api-docs

**Connecting frontend to new API**:
1. Import axios and API config in component
2. Use `useQuery('key', () => axios.get(...))` pattern (react-query)
3. Respect `api.baseURL` from config; it auto-switches between localhost/Codespace/production

**Theme-aware styling**:
- Use `const { darkMode } = useTheme()` in component
- Apply conditional classNames: `${darkMode ? 'bg-dark text-light' : 'bg-white text-gray-800'}`
- See Navigation.tsx for comprehensive example

## Demo Scenarios Hints

This repo is built for Copilot demos:
- **Custom Instructions**: Refer to fictional TAO observability framework (docs/tao.md) in your instructions
- **Agent Mode**: Implement Cart page from mockup (docs/design/cart.png) or new Product from image + natural language
- **Test Generation**: Analyze coverage gaps; prompt to add tests for uncovered routes
- **Vision**: Generate components from design files (docs/design/)
- **MCP Servers**: Use Playwright MCP to write BDD tests; GitHub API MCP to create PRs
- **IaC/Deployment**: Check docs/deployment.md for Bicep/Azure Container Apps patterns

## Notes for AI Agents

- **In-memory data**: Seed data resets on each test; routes use module-level arrays (not database)
- **No authentication**: AuthContext is mock (demo only); endpoints not protected
- **No cart persistence**: Cart functionality stub in Products.tsx; implement in new Cart component
- **Discounts**: Implemented in Product model but not applied in UI (add discount calculation when building Cart)
- **Images**: Product images in `frontend/public/`; referenced by `imgName` field; add new images and update seedData
