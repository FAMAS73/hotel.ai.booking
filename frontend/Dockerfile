# Dockerfile for Next.js Hotel Frontend
# Multi-stage build for optimized production image (~100MB)
#
# Build stages:
# 1. deps: Install dependencies
# 2. builder: Build Next.js application
# 3. runner: Production runtime image
#
# Based on Next.js standalone output mode for minimal image size

# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source code
COPY . .

# Set environment variables for build
# Next.js collects anonymous telemetry data about general usage
# Disable telemetry during build for thesis project
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js application
# This creates optimized production build in .next/standalone/
RUN npm run build

# Stage 3: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application from builder stage
# Standalone output includes minimal Node.js server
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port 3000 (Next.js default)
EXPOSE 3000

# Set port environment variable
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start Next.js server
# Uses standalone server from build output
CMD ["node", "server.js"]
