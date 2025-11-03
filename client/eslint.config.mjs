/**
 * ESLINT CONFIGURATION
 *
 * ESLint is a code linting tool that helps catch errors and enforce code style.
 * This configuration uses ESLint v9+ flat config format (.mjs file).
 *
 * CONFIGURED RULE SETS:
 *
 * 1. next/core-web-vitals:
 *    - Essential rules for Next.js performance
 *    - Catches common Next.js mistakes (missing Image alt, etc.)
 *    - Required for Next.js best practices
 *
 * 2. next/typescript:
 *    - TypeScript-specific rules for Next.js
 *    - Type checking and TypeScript best practices
 *
 * 3. eslint-plugin-prettier:
 *    - Runs Prettier as an ESLint rule
 *    - Shows formatting issues as linting errors
 *    - Enables auto-fix with --fix flag
 *
 * 4. eslint-config-prettier:
 *    - Disables ESLint rules that conflict with Prettier
 *    - Prevents conflicts between ESLint and Prettier formatting
 *
 * IGNORED FILES:
 * - .next/ - Next.js build output
 * - out/ - Static export output
 * - build/ - Custom build output
 * - next-env.d.ts - Next.js TypeScript declarations (auto-generated)
 *
 * USAGE:
 * - npm run lint - Run ESLint
 * - npm run lint --fix - Auto-fix issues
 * - Editor integration: Install ESLint extension for your IDE
 *
 * CUSTOMIZATION:
 * - To disable a rule: Add rules object with rule: 'off'
 * - To add custom rules: Create new config object in array
 * - To ignore more files: Add patterns to globalIgnores array
 *
 * EXAMPLE CUSTOM RULE:
 * ```js
 * {
 *   rules: {
 *     'no-console': 'warn',  // Warn on console.log
 *   }
 * }
 * ```
 *
 * DOCUMENTATION:
 * https://eslint.org/docs/latest/use/configure/
 * https://nextjs.org/docs/app/building-your-application/configuring/eslint
 */

import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

const eslintConfig = defineConfig([
  // Next.js core web vitals rules (performance, accessibility)
  ...nextVitals,

  // TypeScript rules for Next.js
  ...nextTs,

  // Prettier integration (runs Prettier as ESLint rule)
  pluginPrettierRecommended,

  // Disable ESLint rules that conflict with Prettier
  eslintConfigPrettier,

  // Files/directories to ignore
  globalIgnores([
    '.next/**', // Next.js build output
    'out/**', // Static export output
    'build/**', // Custom build output
    'next-env.d.ts', // Next.js TypeScript declarations
  ]),
])

export default eslintConfig
