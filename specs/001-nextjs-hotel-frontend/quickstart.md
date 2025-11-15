# Quickstart Guide: Next.js Hotel Frontend

**Feature**: Next.js Hotel Frontend Website
**Branch**: `001-nextjs-hotel-frontend`
**Created**: 2025-01-15
**Purpose**: Step-by-step guide for development, testing, and deployment

## Prerequisites

Before starting development, ensure you have the following installed:

### Required Software

- **Node.js**: Version 20.x or higher
  ```bash
  node --version  # Should show v20.x.x or higher
  ```
  
- **npm or yarn**: Latest version
  ```bash
  npm --version   # Should show 10.x.x or higher
  # OR
  yarn --version  # Should show 1.22.x or higher
  ```

- **Git**: For version control
  ```bash
  git --version
  ```

- **Docker** (optional, for full-stack development): Version 24.x or higher
  ```bash
  docker --version
  docker-compose --version
  ```

### Recommended Tools

- **Visual Studio Code** with extensions:
  - ESLint
  - Prettier - Code formatter
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features
  
- **Browser Extensions**:
  - React Developer Tools
  - Redux DevTools (for Zustand debugging)
  - axe DevTools (for accessibility testing)

---

## Installation

### Step 1: Clone the Repository

```bash
# Navigate to project root
cd /Users/pitthawatrichdech/Development/THESIS/ai.chatbot

# Ensure you're on the correct branch
git checkout 001-nextjs-hotel-frontend

# Or create the branch if it doesn't exist
git checkout -b 001-nextjs-hotel-frontend
```

### Step 2: Navigate to Frontend Directory

```bash
# Create frontend directory (if not exists)
mkdir -p frontend
cd frontend
```

### Step 3: Initialize Next.js Project

```bash
# Create Next.js app with TypeScript and Tailwind CSS
npx create-next-app@latest . --typescript --tailwind --app --import-alias "@/*"

# Answer prompts:
# ✔ Would you like to use ESLint? … Yes
# ✔ Would you like to use Tailwind CSS? … Yes
# ✔ Would you like to use `src/` directory? … Yes
# ✔ Would you like to use App Router? … Yes
# ✔ Would you like to customize the default import alias? … No
```

### Step 4: Install Dependencies

```bash
# Install production dependencies
npm install zustand swr @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select date-fns

# Install development dependencies
npm install -D @types/node @playwright/test jest @testing-library/react @testing-library/jest-dom @axe-core/playwright prettier eslint-config-prettier
```

### Step 5: Setup Environment Variables

Create `.env.local` file in the frontend directory:

```bash
# frontend/.env.local

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Demo mode (uses localStorage for tokens - thesis demonstration only)
NEXT_PUBLIC_DEMO_MODE=true

# Enable debug logging
NEXT_PUBLIC_DEBUG=true
```

**Note**: Never commit `.env.local` to git. Add it to `.gitignore`:

```bash
echo ".env.local" >> .gitignore
```

### Step 6: Configure TypeScript

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Step 7: Configure Tailwind CSS

Update `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'rgb(var(--color-bg-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--color-bg-tertiary) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        },
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
        warning: 'rgb(var(--color-warning) / <alpha-value>)',
        info: 'rgb(var(--color-info) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};

export default config;
```

### Step 8: Setup Global Styles

Update `src/styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Light theme colors */
    --color-bg-primary: 255 255 255;
    --color-bg-secondary: 249 250 251;
    --color-bg-tertiary: 243 244 246;
    --color-text-primary: 17 24 39;
    --color-text-secondary: 75 85 99;
    --color-text-muted: 156 163 175;
    --color-accent: 37 99 235;
    --color-success: 22 163 74;
    --color-error: 220 38 38;
    --color-warning: 234 179 8;
    --color-info: 59 130 246;
    --color-border: 229 231 235;
  }

  .dark {
    /* Dark theme colors */
    --color-bg-primary: 17 24 39;
    --color-bg-secondary: 31 41 55;
    --color-bg-tertiary: 55 65 81;
    --color-text-primary: 243 244 246;
    --color-text-secondary: 209 213 219;
    --color-text-muted: 156 163 175;
    --color-accent: 96 165 250;
    --color-success: 74 222 128;
    --color-error: 248 113 113;
    --color-warning: 250 204 21;
    --color-info: 96 165 250;
    --color-border: 75 85 99;
  }

  * {
    @apply border-border;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  }

  body {
    @apply bg-bg-primary text-text-primary;
  }
}
```

---

## Development

### Start Development Server

```bash
# From frontend directory
npm run dev

# Server will start on http://localhost:3000
```

### Access the Application

Open your browser and navigate to:

- **Home Page**: http://localhost:3000
- **Chat Interface**: http://localhost:3000/chat
- **Room Catalog**: http://localhost:3000/rooms
- **Admin Dashboard**: http://localhost:3000/admin (requires admin login)

### Development Workflow

1. **Create a new component**:
   ```bash
   # Example: Create a new UI component
   mkdir -p src/components/ui
   touch src/components/ui/Button.tsx
   ```

2. **Edit the component** with inline comments:
   ```typescript
   /**
    * Button component with multiple variants and states.
    * Used throughout the application for consistent UI.
    */
   export function Button({ children, variant = 'primary', ...props }) {
     // Implementation with comments
   }
   ```

3. **Test the component** in the browser:
   - Make changes and save
   - Hot reload automatically updates the browser
   - Check for TypeScript errors in the terminal

4. **Commit changes**:
   ```bash
   git add .
   git commit -m "[component]: Add Button component with variants
   
   - Created reusable Button component
   - Supports primary, secondary, outline variants
   - Includes loading and disabled states
   - Inline comments explain design decisions
   
   🤖 Generated with Claude Code"
   ```

### Available npm Scripts

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Start production server (after build)
npm run start

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Type check without building
npm run type-check

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run accessibility tests
npm run test:a11y
```

---

## Backend Integration

### Option 1: Connect to Existing Backend (Recommended)

Ensure the FastAPI backend is running:

```bash
# In a separate terminal, navigate to backend directory
cd /Users/pitthawatrichdech/Development/THESIS/ai.chatbot/ai-virtual-assistant

# Start the backend (follow backend README)
# Typically:
docker-compose up -d
# OR
python -m uvicorn main:app --reload --port 8000
```

Verify backend is running:
```bash
curl http://localhost:8000/docs
# Should return Swagger UI HTML
```

### Option 2: Mock API Responses (Offline Development)

For developing UI without backend:

```typescript
// src/lib/api/__mocks__/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/rooms', (req, res, ctx) => {
    return res(
      ctx.json({
        rooms: [
          { id: 1, type: 'Standard', name: 'Standard Room', price: 2500 },
          // ... more mock data
        ],
      })
    );
  }),
];

// src/lib/api/__mocks__/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

Enable MSW in development:
```typescript
// src/app/layout.tsx
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_MOCK_API === 'true') {
  import('@/lib/api/__mocks__/browser').then(({ worker }) => {
    worker.start();
  });
}
```

---

## Testing

### Setup Testing Environment

#### Jest Configuration

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-dom';
```

#### Playwright Configuration

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Run Component Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

Example component test:

```typescript
// src/components/ui/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Run E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/e2e/booking-flow.spec.ts
```

Example E2E test:

```typescript
// tests/e2e/booking-flow.spec.ts
import { test, expect } from '@playwright/test';

test('complete booking flow', async ({ page }) => {
  // Navigate to room catalog
  await page.goto('/rooms');

  // Select dates
  await page.fill('[name="check_in"]', '2025-02-01');
  await page.fill('[name="check_out"]', '2025-02-03');

  // Select a room
  await page.click('text=Deluxe Room');
  await page.click('text=Book Now');

  // Fill booking details
  await page.fill('[name="special_requests"]', 'Late check-in');

  // Confirm booking
  await page.click('text=Confirm Booking');

  // Verify success
  await expect(page.locator('text=Booking confirmed')).toBeVisible();
});
```

### Run Accessibility Tests

```bash
# Run accessibility tests
npm run test:a11y
```

Example accessibility test:

```typescript
// tests/a11y/home.spec.ts
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test('home page accessibility', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
  });
});
```

---

## Build

### Production Build

```bash
# Create optimized production build
npm run build

# Output will be in .next/ directory
```

### Verify Build

```bash
# Start production server locally
npm run start

# Access at http://localhost:3000
```

### Build with Standalone Output (for Docker)

Enable standalone mode in `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
```

Build and check standalone output:

```bash
npm run build

# Standalone output is in .next/standalone/
ls -la .next/standalone/
```

---

## Docker Deployment

### Step 1: Create Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
# Multi-stage build for Next.js

FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Step 2: Create .dockerignore

Create `frontend/.dockerignore`:

```
node_modules
.next
.git
.env.local
npm-debug.log
README.md
.DS_Store
```

### Step 3: Build Docker Image

```bash
# From frontend directory
docker build -t hotel-frontend:latest .

# Verify image
docker images | grep hotel-frontend
```

### Step 4: Run Docker Container

```bash
# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://backend:8000 \
  hotel-frontend:latest

# Access at http://localhost:3000
```

### Step 5: Docker Compose Integration

Update root `docker-compose.yml` to include frontend:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend
    networks:
      - hotel-network

  backend:
    # Existing backend configuration
    build:
      context: ./ai-virtual-assistant
    ports:
      - "8000:8000"
    networks:
      - hotel-network
    # ... other backend config

networks:
  hotel-network:
    driver: bridge
```

Run full stack:

```bash
# From project root
docker-compose up -d

# Access frontend: http://localhost:3000
# Access backend: http://localhost:8000
```

---

## Troubleshooting

### Common Issues

#### Issue 1: Port 3000 already in use

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
npm run dev -- -p 3001
```

#### Issue 2: Backend API not accessible

**Solution**:
```bash
# Check backend is running
curl http://localhost:8000/docs

# Check CORS configuration in backend
# Ensure frontend origin is allowed

# Check environment variable
echo $NEXT_PUBLIC_API_URL
```

#### Issue 3: TypeScript errors

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Run type check
npm run type-check
```

#### Issue 4: Docker build fails

**Solution**:
```bash
# Clear Docker cache
docker builder prune -a

# Build without cache
docker build --no-cache -t hotel-frontend:latest .

# Check logs
docker logs <container-id>
```

---

## Thesis Demonstration Checklist

Before thesis presentation, ensure:

- [ ] All pages are accessible and functional
- [ ] Theme toggle works (light/dark mode)
- [ ] Chat interface sends messages and receives AI responses
- [ ] Room catalog displays with images
- [ ] Admin dashboard shows real-time data
- [ ] Authentication flow works (login/register/logout)
- [ ] All code has inline comments explaining logic
- [ ] No console errors in browser
- [ ] Accessibility tests pass
- [ ] Docker deployment works
- [ ] Demo data is loaded in backend

### Quick Demo Script

1. **Start application**:
   ```bash
   docker-compose up -d
   open http://localhost:3000
   ```

2. **Demonstrate features**:
   - Home page → Theme toggle
   - Chat interface → Send message to AI
   - Room catalog → Filter and view rooms
   - Login → Access profile
   - Admin dashboard → View statistics

3. **Show code**:
   - Open VS Code
   - Show component with inline comments
   - Explain architecture diagram
   - Show API integration

---

## Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **Zustand Documentation**: https://github.com/pmndrs/zustand
- **SWR Documentation**: https://swr.vercel.app
- **Playwright Documentation**: https://playwright.dev
- **Testing Library**: https://testing-library.com/react

---

## Getting Help

If you encounter issues:

1. Check this quickstart guide
2. Review the contracts in `specs/001-nextjs-hotel-frontend/contracts/`
3. Check backend API documentation at http://localhost:8000/docs
4. Review Next.js error messages in terminal
5. Check browser console for frontend errors

---

**Quickstart Version**: 1.0.0
**Last Updated**: 2025-01-15
**Status**: Ready for development
