import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

/**
 * ESLint Configuration for Hotel AI Booking Chatbot Frontend
 *
 * Includes:
 * - Next.js best practices and web vitals
 * - TypeScript linting rules
 * - Prettier integration (disables conflicting rules)
 *
 * @see https://nextjs.org/docs/app/building-your-application/configuring/eslint
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier, // Must be last to override other configs
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
