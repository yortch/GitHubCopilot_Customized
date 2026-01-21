# OctoCAT Supply - AI Agent Development Guide

**Project Purpose**: Demo supply chain management system showcasing GitHub Copilot capabilities across full-stack TypeScript development.

## 🏗️ Architecture Overview

### Monorepo Structure (npm workspaces)
- **`/api`**: Express.js REST API with Swagger/OpenAPI integration
- **`/frontend`**: React 18+ with TypeScript, Tailwind CSS, Vite
- **`/sql` & `/infra`**: Infrastructure/deployment configurations
- **`/docs`**: Architecture and design documentation

### Data Model (ERD-driven)
The system is built from an Entity-Relationship Diagram (see [docs/architecture.md](../docs/architecture.md)):
```
Headquarters → Branch → Order → OrderDetail → OrderDetailDelivery ← Delivery ← Supplier
                                    ↓
                               Product (reference)
```

**Key Pattern**: All entities have corresponding Express routes and TypeScript models. Every route follows CRUD (Create, Read, Update, Delete) pattern.

## 🔧 Development Commands

### Build & Run
```bash
# Root level
npm run build              # Build both API and frontend
npm run dev               # Run both API and frontend concurrently
npm run dev:api           # Run only Express API (port 3000)
npm run dev:frontend      # Run only Vite frontend (port 5137)

# Workspace-specific
npm run build --workspace=api
npm run build --workspace=frontend
```

### Testing
```bash
npm run test              # Run all tests (Vitest for API, frontend)
npm run test:api          # Test API routes with supertest
npm run test:coverage     # Coverage report for API
```

### Key Ports
- **API**: `http://localhost:3000` (Express)
- **Frontend**: `http://localhost:5137` (Vite dev server)
- **Swagger Docs**: `http://localhost:3000/api-docs`

## 📝 Code Patterns

### API Routes (Express)
- **Location**: `/api/src/routes/*.ts`
- **Pattern**: One file per entity (product.ts, branch.ts, etc.)
- **Each route implements**: GET /, GET /:id, POST /, PUT /:id, DELETE /:id
- **State management**: In-memory arrays (not persistent database)
- **Example**: [api/src/routes/product.ts](../api/src/routes/product.ts)

### Swagger/OpenAPI Documentation
- **Defined inline** in route files using JSDoc-style `@swagger` tags
- **Centralized**: [api/src/index.ts](../api/src/index.ts#L40) configures swagger-jsdoc
- **Auto-generated**: Swagger UI at `/api-docs` from commented schemas

### Models
- **Location**: `/api/src/models/*.ts`
- **Pattern**: TypeScript interfaces with Swagger schema JSDoc comments
- **Example structure**:
  ```typescript
  /**
   * @swagger
   * components:
   *   schemas:
   *     Product:
   *       type: object
   *       required: [productId, name, price]
   */
  export interface Product {
    productId: number;
    name: string;
    price: number;
    // ...other fields
  }
  ```

### Frontend Components (React)
- **Location**: `/frontend/src/components/**/*.tsx`
- **Pattern**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes (see tailwind.config.js)
- **Contexts**: 
  - `AuthContext` - Login state and admin detection (email domain = @github.com)
  - `ThemeContext` - Dark/light mode toggle
- **Routing**: React Router v6 with paths: `/`, `/products`, `/admin/products`, `/login`

### Testing (Vitest + Supertest)
- **Location**: `/api/src/routes/*.test.ts`
- **Pattern**: 
  ```typescript
  // Express app created fresh in beforeEach
  // Seed data reset via resetX() function
  // Request tests with supertest
  ```
- **Example**: [api/src/routes/branch.test.ts](../api/src/routes/branch.test.ts)

## 🔄 API Integration Pattern

**Frontend → API Flow**:
1. Components call API endpoints from `/api/config.ts` (base URL configuration)
2. API routes handle requests and return JSON data
3. CORS is configured to accept `localhost:5137` and GitHub Codespace domains
4. Authentication is client-side only (mock in AuthContext)

## 📋 When Adding New Features

### To add a new entity:
1. **Create model**: `/api/src/models/entity.ts` with TypeScript interface + Swagger JSDoc
2. **Create route**: `/api/src/routes/entity.ts` with CRUD endpoints + Swagger decorators
3. **Add tests**: `/api/src/routes/entity.test.ts` using Vitest + supertest pattern
4. **Register route**: Import and `app.use('/api/entity', entityRoutes)` in [api/src/index.ts](../api/src/index.ts)
5. **Create UI component**: `/frontend/src/components/entity/*.tsx` with React hooks

### To add frontend page:
1. Create component in `/frontend/src/components/`
2. Use contexts (AuthContext, ThemeContext) if needed
3. Add route to `App.tsx` Routes section
4. Integrate with Navigation component for menu link

## 🎯 Project Philosophy

This is a **Copilot demonstration app**, not production code:
- **Design-driven**: Frontend UI created from mockups using Copilot Vision
- **ERD-first**: Backend entities defined in architecture docs first
- **Full-stack showcase**: Demonstrates code generation across TypeScript, React, Express, Docker
- **Conventions over customization**: Simple, predictable patterns that work well with AI generation

## 📚 Key Files for Reference

- **Architecture decisions**: [docs/architecture.md](../docs/architecture.md)
- **API scaffold**: [api/src/index.ts](../api/src/index.ts)
- **Example entity model**: [api/src/models/product.ts](../api/src/models/product.ts)
- **Example route**: [api/src/routes/product.ts](../api/src/routes/product.ts)
- **Frontend app config**: [frontend/src/App.tsx](../frontend/src/App.tsx)
- **Build config**: [api/tsconfig.json](../api/tsconfig.json), [frontend/vite.config.ts](../frontend/vite.config.ts)
