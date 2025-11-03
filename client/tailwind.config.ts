/**
 * TAILWIND CSS CONFIGURATION
 *
 * This file configures Tailwind CSS theme customization including:
 * - Custom color palette
 * - Custom fonts
 * - Custom breakpoints
 * - Safelisted classes (dynamic classes that shouldn't be purged)
 *
 * CUSTOMIZATION GUIDE:
 *
 * 1. COLORS:
 *    - Brand colors: indigoDD, aquaDD, magentaDD, yellowDD
 *    - Grays: gray1-gray7 for text and backgrounds
 *    - Overlays: popupOverlay, headerColor, footerColor
 *    - TO CHANGE: Edit color hex values below
 *    - USAGE: className="bg-indigoDD text-aquaDD"
 *
 * 2. FONTS:
 *    - ob: Obviously font (headings, hero text)
 *    - obWide: Obviously Wide font (special emphasis)
 *    - ibm: IBM Plex Mono (body text, forms)
 *    - TO CHANGE: Update font files in public/assets/fonts/ and @font-face in src/app/fonts.css
 *    - USAGE: className="font-ob font-ibm"
 *
 * 3. BREAKPOINTS:
 *    - Custom pixel breakpoints: 500px, 600px, 700px, 800px, 1000px, 1200px, etc.
 *    - Height breakpoint: h870px for screens under 870px height
 *    - TO ADD: Add new breakpoint in screens object
 *    - USAGE: className="text-sm 600px:text-base 1000px:text-lg"
 *
 * 4. SAFELIST:
 *    - Classes that are used dynamically (won't be purged in production)
 *    - Currently: scrollbar utilities and project color classes
 *    - TO ADD: If you use dynamic class names like `className={colorClass}`, add them here
 *
 * NOTE:
 * - Default Tailwind classes are still available
 * - Extended classes are added on top of defaults
 * - Color names must be CSS-safe (no spaces or special chars)
 *
 * DOCUMENTATION:
 * https://tailwindcss.com/docs/configuration
 */

import type { Config } from 'tailwindcss'

const config: Config = {
  /**
   * Content paths - Files to scan for Tailwind classes
   * Tailwind will purge unused classes from production build
   */
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  /**
   * Safelist - Classes that should never be purged
   * Used for dynamically generated class names
   *
   * IMPORTANT: Add any classes used in template literals or computed properties
   * Example: const colorClass = `p-${color}` requires 'p-orange', 'p-green', etc. in safelist
   */
  safelist: ['show-scrollbar', 'hide-scrollbar', 'p-orange', 'p-green', 'p-pink', 'p-blue'],

  theme: {
    extend: {
      /**
       * Custom Color Palette
       *
       * BRAND COLORS:
       * - indigoDD*: Primary brand color (purple/indigo)
       * - aquaDD*: Accent color (cyan/aqua)
       * - magentaDD*: Secondary accent (pink/magenta)
       * - yellowDD: Tertiary accent (yellow)
       *
       * GRAYS:
       * - gray1-gray7: Grayscale from lightest to darkest
       *
       * SPECIAL:
       * - popupOverlay*: Semi-transparent overlays
       * - headerColor, footerColor: Background colors
       *
       * USAGE:
       * - Text: className="text-indigoDD"
       * - Background: className="bg-aquaDD"
       * - Border: className="border-magentaDD"
       * - Hover: className="hover:bg-indigoDD2"
       */
      colors: {
        // Brand Colors - Main palette
        indigoDD: '#3c1dfe', // Primary (purple)
        indigoDD2: '#2713A5', // Primary dark (hover state)
        indigoDD3: '#361AE5', // Primary medium
        indigoDD4: '#21108C', // Primary darker
        aquaDD: '#2bfae1', // Accent (cyan)
        aquaDD2: '#14CDB7', // Accent dark (hover state)
        magentaDD: '#ff6ce1', // Secondary (pink)
        magentaDD2: '#F500BB', // Secondary dark
        magentaDD3: '#920370', // Secondary darker
        magentaDD4: '#C50798', // Secondary medium dark
        magentaDD5: '#FF36D2', // Secondary medium
        yellowDD: '#ffec86', // Tertiary (yellow)

        // Grayscale
        gray1: '#fafafa', // Lightest
        gray2: '#f2f2f2',
        gray3: '#dedede',
        gray4: '#a4a4a4',
        gray5: '#373737',
        gray6: '#434343',
        gray7: '#636363', // Darkest

        // Special Colors
        popupOverlay: 'rgba(0, 0, 0, 0.40)', // Dark overlay (40% opacity)
        popupOverlay2: 'rgba(0, 0, 0, 0.20)', // Light overlay (20% opacity)
        popupOverlay3: 'rgba(191, 191, 191, 0.40)', // Gray overlay
        headerColor: 'rgba(253, 192, 254, 0.3)', // Phase 2 header background
        footerColor: '#FFF3FF', // Phase 2 footer background
      },

      /**
       * Custom Font Families
       *
       * FONTS:
       * - ob: Obviously - Main heading font
       * - obWide: Obviously Wide - Special emphasis font
       * - ibm: IBM Plex Mono - Monospace font for body text
       *
       * SETUP:
       * 1. Font files in public/assets/fonts/
       * 2. @font-face declarations in src/app/fonts.css
       * 3. Font family definitions here
       *
       * USAGE:
       * - className="font-ob" (headings)
       * - className="font-obWide" (countdown, special text)
       * - className="font-ibm" (body text, forms)
       */
      fontFamily: {
        ob: ['obviously', 'Arial', 'sans-serif'],
        obWide: ['obviously-wide', 'Arial', 'sans-serif'],
        // Commented alternatives for demo fonts:
        // ob: ['Obviously Demo', 'Arial', 'sans-serif'],
        // obWide: ['Obviously Demo Wide', 'Arial', 'sans-serif'],
        ibm: ['IBM Plex Mono', 'monospace'],
      },

      /**
       * Custom Breakpoints
       *
       * PIXEL BREAKPOINTS:
       * - Fine-grained control over responsive design
       * - Use like: className="text-sm 600px:text-base 1000px:text-lg"
       *
       * HEIGHT BREAKPOINT:
       * - h870px: For screens with limited vertical space
       * - Use like: className="text-base h870px:text-sm"
       *
       * NOTE:
       * - Default Tailwind breakpoints (sm, md, lg, xl, 2xl) still available
       * - These custom breakpoints are additions, not replacements
       */
      screens: {
        xs: '400px',
        '500px': '500px',
        '525px': '525px',
        '550px': '550px',
        '600px': '600px',
        '700px': '700px',
        '800px': '800px',
        '1000px': '1000px',
        '1200px': '1200px',
        '1600px': '1600px',
        '1800px': '1800px',
        '1860px': '1860px',
        h870px: { raw: '(max-height: 870px)' }, // Max height breakpoint
      },
    },
  },

  /**
   * Plugins
   *
   * No plugins currently used.
   * Popular plugins you might add:
   * - @tailwindcss/forms - Better form styling
   * - @tailwindcss/typography - Prose styling
   * - @tailwindcss/aspect-ratio - Aspect ratio utilities
   */
  plugins: [],
}

export default config
