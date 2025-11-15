# Technology Research: Next.js Hotel Frontend Website

**Feature**: Next.js Hotel Frontend Website
**Branch**: `001-nextjs-hotel-frontend`
**Research Date**: 2025-01-15
**Purpose**: Document all technology decisions and rationale for thesis demonstration

## Research Topics

### 1. Next.js 15 App Router vs Pages Router

**Decision**: Use App Router (Next.js 15 default)

**Rationale**:
- **Modern Standard**: App Router is the recommended approach for new Next.js applications as of Next.js 13+
- **Server Components**: Built-in React Server Components reduce client-side JavaScript and improve performance
- **Nested Layouts**: Simplified layout composition with nested routing structure
- **Streaming**: Automatic streaming and Suspense support for better perceived performance
- **Thesis Demonstration**: Shows understanding of latest Next.js features and modern React patterns
- **Better SEO**: Server-side rendering by default improves SEO for hotel website discoverability

**Alternatives Considered**:
- **Pages Router**: Older approach, still supported but not recommended for new projects
  - Rejected because: Less performant, requires manual data fetching optimization, thesis should demonstrate current best practices
- **Create React App (CRA)**: Pure client-side rendering
  - Rejected because: Deprecated, no SSR support, poor SEO, not suitable for hotel website requiring server-side rendering

**Implementation Details**:
```
app/
├── layout.tsx          # Root layout with theme provider
├── page.tsx            # Landing page
├── chat/
│   └── page.tsx        # Chat interface (client component)
├── rooms/
│   └── page.tsx        # Room catalog (server component with client filters)
└── admin/
    └── page.tsx        # Dashboard (protected route)
```

---

### 2. Tailwind CSS 4.x Setup and Dark Mode

**Decision**: Tailwind CSS 4.x (latest stable) with CSS variable-based dark mode

**Rationale**:
- **Rapid Development**: Utility-first approach accelerates UI development for thesis timeline
- **Dark Mode Built-in**: First-class dark mode support via `dark:` prefix
- **Constitution Compliance**: Avoid purple colors via custom theme configuration
- **Performance**: Minimal runtime overhead, PostCSS optimization during build
- **Consistency**: Design tokens ensure consistent spacing, colors, typography across all pages
- **Thesis Demonstration**: Shows modern CSS practices and responsive design skills

**Alternatives Considered**:
- **CSS Modules**: Scoped CSS with manual styling
  - Rejected because: Slower development, manual dark mode implementation, more code to demonstrate
- **Styled-components**: CSS-in-JS solution
  - Rejected because: Runtime overhead, larger bundle size, unnecessary complexity for thesis scope
- **Material-UI (MUI)**: Complete component library
  - Rejected because: Opinionated design limits customization, purple is default accent color, adds complexity

**Implementation Details**:
```typescript
// tailwind.config.ts
export default {
  darkMode: 'class', // Toggle via class on <html>
  theme: {
    extend: {
      colors: {
        primary: { /* blue shades - no purple */ },
        secondary: { /* green shades */ },
        accent: { /* amber/orange for CTAs */ },
      },
      // Ensure WCAG AA compliance
      contrast: {
        light: '4.5:1',  // Normal text
        large: '3:1',    // Large text
      }
    }
  }
}

// Dark mode implementation
localStorage.theme === 'dark' || (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ? document.documentElement.classList.add('dark')
  : document.documentElement.classList.remove('dark')
```

**Dark Mode Strategy**:
- System preference detection on first visit
- User preference persisted in localStorage
- Smooth transitions via CSS transitions on theme toggle
- All colors defined as CSS variables for consistent theming

---

### 3. State Management: Zustand vs React Context

**Decision**: Zustand for global state, React Context for theme only

**Rationale**:
- **Simplicity**: Zustand provides minimal boilerplate compared to Redux or MobX
- **Performance**: No re-render issues like Context, optimized selector-based subscriptions
- **TypeScript Support**: Excellent type inference for thesis code clarity
- **Scalability**: Handles authentication state, user profile, booking cart, admin data efficiently
- **Thesis Demonstration**: Shows understanding of modern state management beyond basic Context API
- **DevTools**: Built-in devtools support for debugging during thesis demonstration

**Alternatives Considered**:
- **React Context API**: Built-in React state management
  - Partially accepted: Used only for theme preference (lightweight, page-level state)
  - Rejected for global state: Re-render performance issues with large component trees
- **Redux Toolkit**: Industry standard state management
  - Rejected because: Excessive boilerplate for thesis scope, steeper learning curve for reviewers
- **Jotai/Recoil**: Atomic state management
  - Rejected because: Less mature ecosystem, thesis reviewers may be less familiar

**Implementation Details**:
```typescript
// lib/stores/authStore.ts
interface AuthState {
  user: Guest | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({ ... }));

// lib/stores/bookingStore.ts
interface BookingState {
  selectedDates: { checkIn: Date; checkOut: Date } | null;
  selectedRoom: Room | null;
  guestCount: number;
  setDates: (dates: { checkIn: Date; checkOut: Date }) => void;
}

export const useBookingStore = create<BookingState>((set) => ({ ... }));
```

**Context Usage** (limited to theme):
```typescript
// app/providers/ThemeProvider.tsx
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
// Only wraps <html> element, minimal re-render impact
```

---

### 4. Authentication: JWT Storage Strategy

**Decision**: httpOnly cookies for production, localStorage with warnings for thesis demo

**Rationale**:
- **Security Best Practice**: httpOnly cookies prevent XSS token theft (Constitution Principle IV)
- **Thesis Demonstration**: Shows security awareness and understanding of authentication vulnerabilities
- **Backend Integration**: Aligns with existing FastAPI JWT implementation
- **CSRF Protection**: Implement CSRF tokens for state-changing operations
- **Flexibility**: localStorage fallback for local development and demo scenarios

**Alternatives Considered**:
- **localStorage only**: Simple but vulnerable to XSS
  - Partially accepted: Used for thesis demo with inline comments explaining security tradeoff
  - Rejected for production: Violates security-first principle
- **sessionStorage**: Tokens lost on tab close
  - Rejected because: Poor UX, guests expect persistent login across sessions
- **In-memory only**: Most secure but poor UX
  - Rejected because: Requires re-login on page refresh, unacceptable for hotel booking flow

**Implementation Details**:
```typescript
// lib/api/auth.ts
export async function login(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include', // Send/receive httpOnly cookies
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  // Token set in httpOnly cookie by backend
  // Frontend only stores user profile in Zustand
  const user = await response.json();
  useAuthStore.setState({ user, isAuthenticated: true });
}

// Fallback for demo (with security warning comment)
// WARNING: localStorage used for thesis demonstration only
// Production deployment MUST use httpOnly cookies to prevent XSS attacks
if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
  localStorage.setItem('demo_token', token);
}
```

**Token Refresh Strategy**:
- Access tokens: 15-minute expiry
- Refresh tokens: 7-day expiry (httpOnly cookie)
- Automatic refresh before expiry using axios interceptors
- Graceful logout on refresh failure

---

### 5. Real-time Updates: Polling vs WebSocket

**Decision**: Polling (5-second interval) for admin dashboard

**Rationale**:
- **Simplicity**: Easier to implement and debug for thesis demonstration
- **Backend Compatibility**: No WebSocket infrastructure required in existing FastAPI setup
- **Sufficient for Scope**: Thesis demo involves <100 concurrent users, 5-second updates are acceptable
- **Reliability**: Works across all network configurations (corporate firewalls, proxies)
- **Resource Efficiency**: Predictable server load, easy to scale for demo environment

**Alternatives Considered**:
- **WebSocket (Socket.io)**: True real-time bidirectional communication
  - Rejected because: Requires additional backend infrastructure, overkill for thesis scope, adds complexity without demonstrable benefit
- **Server-Sent Events (SSE)**: Unidirectional push from server
  - Rejected because: Limited browser support, connection management complexity
- **Long Polling**: HTTP-based real-time simulation
  - Rejected because: More complex than simple polling, similar resource usage

**Implementation Details**:
```typescript
// app/admin/page.tsx (client component)
useEffect(() => {
  const fetchDashboardData = async () => {
    const data = await fetch('/api/admin/dashboard');
    setDashboardData(data);
  };

  // Initial fetch
  fetchDashboardData();

  // Poll every 5 seconds
  const interval = setInterval(fetchDashboardData, 5000);

  return () => clearInterval(interval); // Cleanup on unmount
}, []);
```

**Optimization Strategy**:
- Only poll when dashboard tab is active (Page Visibility API)
- Exponential backoff on API errors
- Conditional requests with ETag/Last-Modified headers
- Pause polling when user is idle (5+ minutes)

---

### 6. Image Optimization: Next.js Image Component

**Decision**: Next.js `<Image>` component with automatic optimization

**Rationale**:
- **Automatic Optimization**: Next.js optimizes images on-demand (WebP/AVIF format, responsive sizes)
- **Performance**: Lazy loading by default, LCP optimization for room catalog images
- **Developer Experience**: Simple API, automatic srcset generation for responsive images
- **Thesis Requirements**: Achieves LCP <2.5s goal for room catalog (Success Criteria SC-011)
- **Cost Efficiency**: No external CDN required for thesis demonstration

**Alternatives Considered**:
- **Standard `<img>` tags**: No optimization
  - Rejected because: Poor performance, manual responsive images, fails LCP requirements
- **Cloudinary/Imgix**: External image CDN
  - Rejected because: Unnecessary cost for thesis, adds deployment complexity
- **Manual WebP conversion**: Pre-process images
  - Rejected because: Maintenance burden, no dynamic optimization

**Implementation Details**:
```typescript
// components/rooms/RoomCard.tsx
import Image from 'next/image';

<Image
  src={`/images/rooms/${room.type}/main.jpg`}
  alt={`${room.name} - ${room.description}`}
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={index < 3} // LCP optimization for first 3 cards
  placeholder="blur"
  blurDataURL={room.blurHash} // Low-quality placeholder
/>
```

**Image Structure**:
```
public/images/
├── rooms/
│   ├── standard/
│   │   ├── main.jpg           # Primary card image
│   │   ├── gallery-1.jpg      # Additional gallery images
│   │   └── gallery-2.jpg
│   ├── deluxe/
│   ├── suite/
│   ├── executive/
│   └── presidential/
├── lobby/
│   ├── exterior.jpg
│   └── interior.jpg
└── amenities/
    ├── pool.jpg
    ├── restaurant.jpg
    └── spa.jpg
```

**Placeholder Strategy**:
- BlurHash or LQIP (Low-Quality Image Placeholder) for perceived performance
- Fallback to solid color if placeholder unavailable
- Error boundaries for missing images with hotel logo fallback

---

### 7. API Integration Patterns: SWR vs React Query vs Fetch

**Decision**: SWR for data fetching with stale-while-revalidate strategy

**Rationale**:
- **Next.js Integration**: Created by Vercel (Next.js maintainers), first-class Next.js support
- **Automatic Caching**: Reduces redundant API calls, improves performance
- **Optimistic UI**: Immediate UI updates with background revalidation
- **Focus Management**: Automatic refetch on window focus for fresh data
- **TypeScript Support**: Excellent type inference for thesis code clarity
- **Small Bundle**: Minimal size impact (~5KB gzipped)

**Alternatives Considered**:
- **React Query (TanStack Query)**: More feature-rich data fetching library
  - Rejected because: Larger bundle, more complex API, unnecessary features for thesis scope
- **Plain fetch with manual caching**: Maximum control
  - Rejected because: Reinventing the wheel, error-prone cache invalidation, thesis time constraints
- **Axios with manual caching**: HTTP client with interceptors
  - Rejected because: No automatic caching, manual loading/error state management

**Implementation Details**:
```typescript
// lib/hooks/useRooms.ts
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useRooms(checkIn?: Date, checkOut?: Date) {
  const params = new URLSearchParams();
  if (checkIn) params.append('check_in', checkIn.toISOString());
  if (checkOut) params.append('check_out', checkOut.toISOString());
  
  const { data, error, isLoading } = useSWR(
    `/api/rooms?${params}`,
    fetcher,
    {
      revalidateOnFocus: true,
      refreshInterval: 30000, // Refresh every 30s for availability
      dedupingInterval: 5000,  // Prevent duplicate requests within 5s
    }
  );

  return {
    rooms: data?.rooms as Room[] | undefined,
    isLoading,
    isError: error,
  };
}
```

**Caching Strategy**:
- Room catalog: 30-second cache with background revalidation
- Booking history: 60-second cache, manual revalidation on booking creation
- User profile: Cache until logout, revalidate on focus
- Admin dashboard: 5-second cache (align with polling requirement)

---

### 8. Theme Switching: CSS Variables vs Tailwind Dark Mode

**Decision**: Tailwind dark mode with CSS variables for colors

**Rationale**:
- **Hybrid Approach**: Combines Tailwind convenience with CSS variable flexibility
- **Performance**: No runtime JavaScript for color computation, pure CSS transitions
- **Maintainability**: Single source of truth for colors in Tailwind config
- **Smooth Transitions**: CSS transitions on theme toggle (Constitution Success Criteria SC-003: <300ms)
- **Thesis Demonstration**: Shows understanding of modern CSS architecture

**Implementation Details**:
```css
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-bg-primary: 255 255 255;      /* White */
    --color-bg-secondary: 249 250 251;    /* Gray-50 */
    --color-text-primary: 17 24 39;       /* Gray-900 */
    --color-text-secondary: 75 85 99;     /* Gray-600 */
    --color-accent: 37 99 235;            /* Blue-600 - no purple */
    --color-success: 22 163 74;           /* Green-600 */
    --color-error: 220 38 38;             /* Red-600 */
  }

  .dark {
    --color-bg-primary: 17 24 39;         /* Gray-900 */
    --color-bg-secondary: 31 41 55;       /* Gray-800 */
    --color-text-primary: 243 244 246;    /* Gray-100 */
    --color-text-secondary: 209 213 219;  /* Gray-300 */
    --color-accent: 96 165 250;           /* Blue-400 */
    --color-success: 74 222 128;          /* Green-400 */
    --color-error: 248 113 113;           /* Red-400 */
  }

  * {
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  }
}
```

```typescript
// tailwind.config.ts
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'rgb(var(--color-bg-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        },
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
      },
    },
  },
};
```

**Theme Toggle Implementation**:
```typescript
// components/layout/ThemeToggle.tsx
'use client';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Load preference or detect system theme
    const stored = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initial = stored as 'light' | 'dark' || systemTheme;
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return <button onClick={toggleTheme}>Toggle Theme</button>;
}
```

---

### 9. Accessibility: ARIA Labels, Keyboard Navigation, Screen Reader

**Decision**: Comprehensive WCAG 2.1 AA compliance with Radix UI primitives

**Rationale**:
- **Constitution Requirement**: WCAG 2.1 AA compliance explicitly stated in spec
- **Thesis Demonstration**: Shows professional-level accessibility implementation
- **Radix UI**: Unstyled accessible components (no purple defaults), fully keyboard navigable
- **Testing**: Automated accessibility testing with axe-core in E2E tests
- **Color Contrast**: All text meets 4.5:1 ratio (normal) or 3:1 (large text)

**Implementation Strategy**:

1. **Semantic HTML**: Use proper HTML5 elements (`<nav>`, `<main>`, `<article>`, `<section>`)
2. **ARIA Labels**: All interactive elements have descriptive labels
3. **Keyboard Navigation**: Tab order, focus indicators, keyboard shortcuts
4. **Screen Readers**: Meaningful alt text, skip links, landmark regions
5. **Focus Management**: Trap focus in modals, restore focus on close
6. **Error Handling**: Clear error messages associated with form fields

**Key Components**:
```typescript
// components/ui/Button.tsx
import { Button as RadixButton } from '@radix-ui/react-button';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, ariaLabel, variant = 'primary' }: ButtonProps) {
  return (
    <RadixButton
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'px-4 py-2 rounded-md font-medium',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
        variant === 'primary' && 'bg-accent text-white hover:bg-accent/90',
        variant === 'secondary' && 'bg-bg-secondary text-text-primary hover:bg-bg-secondary/80'
      )}
    >
      {children}
    </RadixButton>
  );
}
```

**Accessibility Checklist**:
- [ ] All images have meaningful alt text or empty alt="" for decorative images
- [ ] Form inputs have associated `<label>` elements or aria-label
- [ ] Color is not the only means of conveying information (use icons + text)
- [ ] Contrast ratios meet WCAG AA standards (4.5:1 minimum)
- [ ] Keyboard users can access all interactive elements
- [ ] Focus indicators are clearly visible
- [ ] Skip navigation link for keyboard users
- [ ] ARIA landmarks for page regions (banner, main, contentinfo)
- [ ] Error messages programmatically associated with inputs (aria-describedby)
- [ ] Loading states announced to screen readers (aria-live)

**Testing Tools**:
- **Automated**: axe-core via Playwright E2E tests
- **Manual**: NVDA (Windows), JAWS (Windows), VoiceOver (macOS) testing
- **Keyboard**: Tab through all pages without mouse
- **Contrast**: WebAIM Contrast Checker for all color combinations

---

### 10. Docker Deployment: Next.js Standalone Output

**Decision**: Next.js standalone output mode with multi-stage Docker build

**Rationale**:
- **Small Image Size**: Standalone mode includes only production dependencies (~100MB vs 1GB+ with node_modules)
- **Production Ready**: Optimized for serverless and container deployments
- **Constitution Alignment**: Docker deployment explicitly mentioned in project requirements
- **Integration**: Runs alongside existing FastAPI backend in docker-compose
- **Performance**: Faster startup, reduced memory footprint

**Docker Strategy**:
```dockerfile
# Dockerfile (multi-stage build)
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

# Environment variables for build time
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

# Copy standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

**Next.js Configuration**:
```javascript
// next.config.js
module.exports = {
  output: 'standalone', // Enable standalone mode
  images: {
    domains: ['localhost'], // Allow images from backend API
    formats: ['image/avif', 'image/webp'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
};
```

**Docker Compose Integration**:
```yaml
# docker-compose.yml (add frontend service)
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
    # Existing FastAPI backend configuration
    ...

networks:
  hotel-network:
    driver: bridge
```

**Deployment Workflow**:
1. Build Docker image: `docker build -t hotel-frontend:latest .`
2. Run with docker-compose: `docker-compose up -d`
3. Access frontend: http://localhost:3000
4. Backend API proxied through Next.js API routes or CORS enabled

---

## Research Summary

### Technology Stack Selected

| Category | Technology | Version | Rationale |
|----------|-----------|---------|-----------|
| Framework | Next.js App Router | 15.x | Modern, performant, server-side rendering |
| Language | TypeScript | 5.x | Type safety, thesis code clarity |
| Styling | Tailwind CSS | 4.x | Rapid development, dark mode support |
| State Management | Zustand | 5.x | Simple, performant, TypeScript-friendly |
| Data Fetching | SWR | 2.x | Next.js integration, automatic caching |
| UI Components | Radix UI | Latest | Accessible, unstyled, customizable |
| Authentication | httpOnly cookies + JWT | - | Security-first approach |
| Image Optimization | Next.js Image | Built-in | Automatic optimization, LCP <2.5s |
| Real-time Updates | Polling (5s interval) | - | Simple, reliable for thesis scope |
| Deployment | Docker standalone | - | Small image, production-ready |

### Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP (Largest Contentful Paint) | <2.5s | Next.js Image, priority loading, server components |
| FID (First Input Delay) | <100ms | Minimal client-side JS, code splitting, lazy loading |
| CLS (Cumulative Layout Shift) | <0.1 | Image dimensions, skeleton loaders, stable layouts |
| Bundle Size | <150KB (initial) | Tree shaking, dynamic imports, Tailwind purge |
| API Response Time | <500ms | SWR caching, optimistic updates, stale-while-revalidate |
| Theme Toggle | <300ms | CSS transitions, no re-render, class toggle |

### Accessibility Compliance

| Requirement | Implementation | Validation |
|-------------|----------------|------------|
| WCAG 2.1 AA | Radix UI + manual ARIA | axe-core automated tests |
| Contrast Ratios | 4.5:1 (normal), 3:1 (large) | WebAIM Contrast Checker |
| Keyboard Navigation | Full keyboard access | Manual tab testing |
| Screen Readers | Semantic HTML + ARIA | NVDA, JAWS, VoiceOver testing |
| No Purple Colors | Custom Tailwind theme | Visual design review |
| Color Blind Safe | Icons + text, not color alone | Coblis simulator testing |

### Security Implementation

| Threat | Mitigation | Constitution Alignment |
|--------|------------|------------------------|
| XSS (Cross-Site Scripting) | React auto-escaping + DOMPurify for rich content | Principle IV: Security-First |
| CSRF (Cross-Site Request Forgery) | CSRF tokens for state-changing operations | Principle IV: Security-First |
| Token Theft | httpOnly cookies, no localStorage (production) | Principle IV: Security-First |
| SQL Injection | Backend parameterized queries (frontend validates input) | Principle IV: Security-First |
| Unauthorized Access | JWT verification, protected routes, role-based access | Principle IV: Security-First |
| Sensitive Data Exposure | Environment variables, no hardcoded secrets | Principle IV: Security-First |

### Thesis Demonstration Readiness

| Feature | Demo Capability | Code Clarity |
|---------|----------------|--------------|
| Chat Interface | Full conversation flow with AI responses | Inline comments on state management, API integration |
| Room Catalog | Filter by dates, guest count, visual gallery | Comments on data fetching, caching, image optimization |
| Admin Dashboard | Real-time booking data, charts, management | Comments on polling, state updates, authorization |
| Theme Switching | Toggle light/dark with smooth transition | Comments on CSS variables, localStorage, accessibility |
| Authentication | Login, register, profile, logout flow | Comments on JWT handling, security considerations |
| Responsive Design | Mobile to desktop breakpoints | Comments on Tailwind responsive utilities |

### Dependencies Overview

**Production Dependencies** (~20-25 total):
```json
{
  "next": "^15.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "typescript": "^5.0.0",
  "zustand": "^5.0.0",
  "swr": "^2.0.0",
  "@radix-ui/react-*": "latest",
  "tailwindcss": "^4.0.0",
  "autoprefixer": "^10.0.0",
  "postcss": "^8.0.0",
  "dompurify": "^3.0.0",
  "date-fns": "^3.0.0"
}
```

**Development Dependencies** (~15-20 total):
```json
{
  "@types/node": "^20.0.0",
  "@types/react": "^19.0.0",
  "@types/react-dom": "^19.0.0",
  "eslint": "^8.0.0",
  "eslint-config-next": "^15.0.0",
  "prettier": "^3.0.0",
  "tailwindcss": "^4.0.0",
  "@playwright/test": "^1.40.0",
  "jest": "^29.0.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "@axe-core/playwright": "^4.8.0"
}
```

---

## Implementation Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Next.js 15 breaking changes | High | Medium | Use stable release, extensive testing, fallback to 14.x if critical issues |
| API integration complexity | High | Low | Mock API during development, comprehensive error handling, fallback UI |
| Docker deployment issues | Medium | Low | Test locally first, document troubleshooting, use proven base images |
| Performance targets not met | Medium | Medium | Progressive enhancement, lazy loading, profiling with Lighthouse |
| Accessibility compliance gaps | Medium | Low | Automated testing early, manual testing with screen readers, Radix UI defaults |
| Theme transition jank | Low | Low | CSS-only transitions, hardware acceleration, test on slower devices |
| Browser compatibility issues | Low | Low | Target modern browsers only, polyfills if needed, graceful degradation |
| Time constraints for thesis | High | Medium | Prioritize P1 features, reduce scope if needed, focus on working demo over polish |

---

## Next Steps

1. **Create data-model.md**: Define TypeScript interfaces for all entities
2. **Create contracts/**: Document API endpoints, component APIs, state management, routing
3. **Create quickstart.md**: Installation, development, build, testing, deployment instructions
4. **Fill plan.md**: Complete technical context, project structure, constitution check
5. **Proceed to /speckit.tasks**: Generate actionable task list for implementation

**Research Completion Date**: 2025-01-15
**Ready for Phase 1 (Design & Contracts)**: ✅
