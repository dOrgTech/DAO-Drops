/**
 * POSTCSS CONFIGURATION
 *
 * PostCSS processes CSS files and applies transformations via plugins.
 * This file configures which PostCSS plugins to use.
 *
 * CURRENT PLUGINS:
 *
 * 1. tailwindcss:
 *    - Processes Tailwind directives (@tailwind, @apply, @layer)
 *    - Generates utility classes based on tailwind.config.ts
 *    - Required for Tailwind CSS to work
 *
 * 2. autoprefixer:
 *    - Adds vendor prefixes to CSS rules (-webkit-, -moz-, -ms-, -o-)
 *    - Ensures cross-browser compatibility
 *    - Example: transform -> -webkit-transform, -ms-transform, transform
 *
 * CUSTOMIZATION:
 * - Usually no changes needed
 * - To add plugins: npm install <plugin> then add to plugins object
 *
 * COMMON ADDITIONAL PLUGINS:
 * - cssnano: Minifies CSS (usually added for production only)
 * - postcss-preset-env: Use modern CSS features with fallbacks
 * - postcss-import: Inline @import rules
 *
 * DOCUMENTATION:
 * https://postcss.org/
 * https://github.com/postcss/autoprefixer
 */

module.exports = {
  plugins: {
    tailwindcss: {}, // Process Tailwind CSS
    autoprefixer: {}, // Add vendor prefixes
  },
}
