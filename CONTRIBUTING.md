# Contributing to OctoCAT Supply

Thank you for your interest in contributing to OctoCAT Supply! This document provides guidelines and best practices for contributing to this project.

## Getting Started

### Prerequisites
- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js
- **Git**: For version control
- **VS Code** (recommended): For optimal GitHub Copilot integration

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/microsoft/GitHubCopilot_Customized.git
cd GitHubCopilot_Customized

# Install dependencies
npm install

# Build all workspaces
npm run build

# Start development mode
npm run dev
```

## Development Workflow

### Branch Strategy
1. **Fork** the repository and create a new branch from `main`
2. Use descriptive branch names: `feature/add-cart-page`, `fix/product-search-bug`, `docs/update-readme`
3. Keep branches focused on a single feature or fix

### Making Changes

**Code Style & Standards:**
- **TypeScript**: Use strict mode with proper type annotations
- **Formatting**: Follow existing code style (2-space indentation)
- **Naming Conventions**: 
  - Components: PascalCase (`ProductCard.tsx`)
  - Functions/Variables: camelCase (`fetchProducts`)
  - Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **ESLint**: Run `npm run lint` before committing (frontend)

**Best Practices:**
- Write self-documenting code with clear variable and function names
- Keep functions small and focused (single responsibility principle)
- Use TypeScript interfaces for data structures
- Add JSDoc comments for API endpoints
- Leverage GitHub Copilot for boilerplate and tests

### Testing

**Run Tests:**
```bash
# All tests
npm test

# API tests only
npm run test:api

# Frontend tests only
npm run test:frontend

# With coverage
npm run test:api -- --coverage
```

**Test Requirements:**
- Add unit tests for new functions and components
- Maintain or improve test coverage
- Use Vitest for all testing (both API and frontend)
- Include test cases for edge cases and error handling

### Commit Guidelines

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body (optional)>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(products): add discount badge to product cards
fix(api): correct CORS configuration for Codespaces
docs: update ARCHITECTURE.md with deployment details
test(orders): add integration tests for order creation
```

## Project Structure

```
├── api/              # Express.js backend
│   ├── src/
│   │   ├── index.ts       # API entry point
│   │   ├── models/        # TypeScript interfaces
│   │   └── routes/        # REST API endpoints
│   └── package.json
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # State management
│   │   └── api/           # API client configuration
│   └── package.json
└── docs/            # Project documentation
```

## Workspace Commands

**Development:**
- `npm run dev` - Start both API and frontend
- `npm run dev:api` - Start API only (port 3000)
- `npm run dev:frontend` - Start frontend only (port 5137)

**Building:**
- `npm run build` - Build both workspaces
- `npm run build --workspace=api` - Build API only
- `npm run build --workspace=frontend` - Build frontend only

**Testing:**
- `npm test` - Run all tests
- `npm run lint` - Lint frontend code

## Pull Request Process

1. **Before Submitting:**
   - Run tests: `npm test`
   - Run linter: `npm run lint`
   - Build successfully: `npm run build`
   - Update documentation if needed

2. **PR Description Should Include:**
   - Summary of changes
   - Related issue numbers (if applicable)
   - Screenshots for UI changes
   - Breaking changes (if any)

3. **Review Process:**
   - PRs require at least one approval
   - Address reviewer feedback promptly
   - Keep PRs focused and reasonably sized
   - Be respectful and constructive in discussions

## API Development

**Adding New Endpoints:**
1. Create/update model in `api/src/models/`
2. Create route in `api/src/routes/`
3. Add Swagger documentation (JSDoc comments)
4. Register route in `api/src/index.ts`
5. Write tests in corresponding `.test.ts` file

**Swagger Documentation:**
```typescript
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Returns all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 */
```

## Frontend Development

**Adding Components:**
1. Create component in appropriate directory
2. Use TypeScript with proper interfaces
3. Implement responsive design with Tailwind CSS
4. Support dark/light themes via `useTheme()` hook
5. Add proper accessibility attributes

**State Management:**
- Use Context API for global state (Auth, Theme)
- Use React Query for server state
- Keep component state local when possible

## Getting Help

- **Documentation**: Check [docs/architecture.md](docs/architecture.md) and [PRODUCT.md](PRODUCT.md)
- **Issues**: Search existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help create a welcoming environment for all contributors

---

**Thank you for contributing to OctoCAT Supply! 🐱✨**