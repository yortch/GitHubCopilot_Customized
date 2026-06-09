# OctoCAT Supply - GitHub Copilot Instructions

## Project Overview
This is a **demo/learning application** designed to showcase GitHub Copilot capabilities. It's a TypeScript monorepo with an Express API and React frontend implementing a supply chain management system. The entire app was originally generated from an ERD diagram using Copilot.

**Purpose**: Demonstrate Copilot Agent Mode, Vision, MCP Server integration, test generation, CI/CD, and custom instructions/prompts.

## Architecture & Data Model

### Monorepo Structure
- **Workspaces**: `api/` (Express API) and `frontend/` (React + Vite)
- **Run both**: `npm run dev` (uses concurrently from root)
- **Ports**: API on 3000, Frontend on 5137
- **Node**: Requires >=18 (see root `package.json`)

### Supply Chain ERD
```
Headquarters → Branch → Order → OrderDetail ← Product
                                      ↓
                          OrderDetailDelivery ← Delivery ← Supplier
```
All 8 entities follow identical patterns (see below).

### In-Memory Storage Pattern
**CRITICAL**: This app has NO DATABASE. Data is stored in-memory using arrays.

- Seed data defined in `api/src/seedData.ts` (exported constants: `suppliers`, `products`, etc.)
- Each route (e.g., `api/src/routes/branch.ts`) maintains its own array:
  ```typescript
  let branches: Branch[] = [...seedBranches];
  ```
- Each route exports a `reset{Entity}()` function for tests:
  ```typescript
  export const resetBranches = () => {
    branches = [...seedBranches];
  };
  ```
- Data resets on server restart
- **Why**: Simplifies demo environment, eliminates DB setup for workshops

## Development Patterns

### API Structure
**Every entity follows this 4-step pattern** (Branch, Product, Supplier, Order, etc.):

1. **Model** (`api/src/models/{entity}.ts`):
   - TypeScript interface with all properties
   - Swagger schema in JSDoc comments (used by swagger-jsdoc)
   ```typescript
   /**
    * @swagger
    * components:
    *   schemas:
    *     Branch:
    *       type: object
    *       required:
    *         - branchId
    *       properties:
    *         branchId:
    *           type: integer
    */
   export interface Branch { ... }
   ```

2. **Routes** (`api/src/routes/{entity}.ts`):
   - Express router with full CRUD operations
   - Swagger JSDoc for each endpoint (`@swagger` tags, paths, parameters)
   - In-memory array initialized from seed data
   - Export reset function for tests
   ```typescript
   import { branches as seedBranches } from '../seedData';
   let branches: Branch[] = [...seedBranches];
   
   router.post('/', (req, res) => { ... });      // Create
   router.get('/', (req, res) => { ... });       // List all
   router.get('/:id', (req, res) => { ... });    // Get by ID
   router.put('/:id', (req, res) => { ... });    // Update
   router.delete('/:id', (req, res) => { ... }); // Delete
   
   export const resetBranches = () => { branches = [...seedBranches]; };
   export default router;
   ```

3. **Tests** (`api/src/routes/{entity}.test.ts`):
   - Vitest + supertest (NOT Jest)
   - Reset data in `beforeEach()` hook using exported reset function
   - Test all CRUD operations + error cases (404, etc.)
   ```typescript
   import { resetBranches } from './branch';
   
   beforeEach(() => {
     app = express();
     app.use(express.json());
     app.use('/branches', branchRouter);
     resetBranches(); // Critical: Reset in-memory data
   });
   ```

4. **Registration** (`api/src/index.ts`):
   - Import route and mount to app: `app.use('/api/{plural}', {entity}Routes);`
   - Swagger auto-discovers via file glob: `apis: ['./src/models/*.ts', './src/routes/*.ts']`
   - Access Swagger UI at `http://localhost:3000/api-docs`

### Frontend Structure
- **React 18** with React Router v7 (routes defined in component files)
- **Styling**: Tailwind CSS (config in `tailwind.config.js`, no custom CSS-in-JS)
- **Data Fetching**: React Query (`useQuery` pattern, no Redux)
- **State Management**: Context API only - `AuthContext` (auth), `ThemeContext` (dark mode), `CartContext`
- **API Config**: `frontend/src/api/config.ts` auto-detects environment
  ```typescript
  // Auto-detects Codespaces vs localhost, handles protocol
  const API_BASE_URL = getBaseUrl(); 
  export const api = {
    endpoints: {
      products: '/api/products',
      suppliers: '/api/suppliers',
      // ... all 8 entities
    }
  };
  ```

### Testing
- **Framework**: Vitest (NOT Jest) - configured in `vitest.config.ts`
- **API Tests**: Located in `api/src/routes/*.test.ts`
- **Commands**:
  - `npm run test` (all workspaces)
  - `npm run test --workspace=api` (API only)
  - `npm run test:coverage --workspace=api` (coverage report)
- **Pattern**: Only `branch.test.ts` exists initially (demo shows adding others)

## Key Conventions

### File Naming
- Routes: `{entity}.ts` (singular, lowercase, e.g., `branch.ts`, `product.ts`)
- Models: `{entity}.ts` (singular, lowercase, matches route name)
- Tests: `{entity}.test.ts` (matches route name)
- Frontend components: PascalCase (e.g., `Products.tsx`, `AdminProducts.tsx`)

### API Endpoint Pattern
All APIs follow: `/api/{entity-plural}` (e.g., `/api/branches`, `/api/products`, `/api/order-details`)
- No versioning (this is a demo)
- Hyphenated plurals for compound words: `/api/order-details`, `/api/order-detail-deliveries`

### CORS Configuration
Configured in `api/src/index.ts` to allow:
- `localhost:5137` (frontend dev server)
- `localhost:3001` (alternative port)
- All Codespace domains via regex: `/^https:\/\/.*\.app\.github\.dev$/`
- Can override via `API_CORS_ORIGINS` environment variable (comma-separated)

### Context Pattern (Frontend)
All contexts follow this pattern (see `AuthContext.tsx`, `ThemeContext.tsx`):
- Define context and provider in same file
- Export custom hook (e.g., `useAuth()`, `useTheme()`)
- Hook throws error if used outside provider: `throw new Error('useAuth must be used within AuthProvider')`
- Provider wraps app in `main.tsx`
- **AuthContext**: Simple email-based login (no real backend), `@github.com` emails become admin
- **ThemeContext**: Persists to localStorage, uses Tailwind dark mode classes

## Development Workflow

### Running Locally
```bash
npm install                    # Install all workspace dependencies
npm run dev                    # Start API + Frontend concurrently
npm run dev:api                # API only (nodemon with auto-reload)
npm run dev:frontend           # Frontend only (Vite dev server)
```

### Building
```bash
npm run build                  # Build both workspaces
npm run build --workspace=api  # API only (compiles TypeScript to dist/)
npm run build --workspace=frontend  # Frontend only (Vite production build)
```

### VS Code Integration
- **Tasks**: Press `Ctrl+Shift+B` to see "Build API" or "Build Frontend" tasks
- **Debugger**: Use "Start API & Frontend" launch config (F5) - check `.vscode/launch.json`
- **API Docs**: Visit `http://localhost:3000/api-docs` for Swagger UI (auto-generated from JSDoc)
- **JSON Export**: `http://localhost:3000/api-docs.json` for OpenAPI spec

### Adding New Entities
Follow this exact sequence (use existing entities as templates):
1. Define interface in `api/src/models/{entity}.ts` with Swagger schema in JSDoc
2. Add seed data to `api/src/seedData.ts` (export as `export const {entities}: Entity[]`)
3. Create route in `api/src/routes/{entity}.ts`:
   - Import seed data from `seedData.ts`
   - Initialize in-memory array: `let entities: Entity[] = [...seedEntities];`
   - Implement all 5 CRUD operations (POST, GET all, GET by ID, PUT, DELETE)
   - Export reset function: `export const reset{Entities} = () => { entities = [...seedEntities]; };`
   - Add full Swagger JSDoc for all endpoints
4. Write tests in `api/src/routes/{entity}.test.ts`:
   - Import reset function from route file
   - Call reset in `beforeEach()` hook
   - Test all CRUD operations + 404 cases
5. Register route in `api/src/index.ts`: `app.use('/api/{entity-plural}', {entity}Routes);`
6. Add endpoint to `frontend/src/api/config.ts` in `api.endpoints` object

## Demo-Specific Features

This project showcases advanced GitHub Copilot capabilities:

### Custom Copilot Extensions (`.github/`)
- **Chat Modes** (`.github/chatmodes/`): 
  - `ImplementationIdeas.chatmode.md` - Custom chat mode for feature planning
  - Use with `@ImplementationIdeas` in Copilot Chat
  
- **Prompt Files** (`.github/prompts/`):
  - `Unit-Test-Coverage.prompt.md` - Generates tests for missing routes (Product, Supplier)
  - `plan.prompt.md` - Creates implementation plans
  - `model.prompt.md` - Model comparison and recommendations
  - Invoke with `/` slash commands in Copilot Chat
  
- **Instructions** (`.github/instructions/`):
  - Can create entity-specific instructions (e.g., `API.instructions.md`)
  - Auto-loaded by Copilot for contextual guidance

### Workshop Scenarios
This demo supports live demonstrations of:
1. **Agent Mode**: Use Copilot to build/run project, create PRs with `create_pull_request_with_copilot`
2. **Vision**: Drag design mockups (e.g., `docs/design/MonaFigurine.png`) into chat to generate features
3. **Test Generation**: Use Unit-Test-Coverage prompt to add tests for missing routes
4. **MCP Integration**: Playwright for browser testing, GitHub API for repo operations

### Design Assets
- `docs/design/` contains UI mockups for demo scenarios (e.g., `MonaFigurine.png`, `cart.png`)
- Use these with Copilot Vision to generate matching React components

### Demonstration Tips
- Point to `branch.test.ts` as exemplar pattern when generating new tests
- Reference `AuthContext.tsx` as template for new context providers
- Show Swagger auto-generation at `/api-docs` after adding new routes
- Demonstrate in-memory storage reset by restarting API server
