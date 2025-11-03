/**
 * TERMS & CONDITIONS PAGE
 *
 * This page displays the Terms of Service / Terms & Conditions for the DAO Drops platform.
 * Accessible at /terms
 *
 * STRUCTURE:
 * - Route: /terms
 * - Component: Renders the <Terms /> component
 * - The actual terms content is in src/components/Terms/
 *
 * CUSTOMIZATION:
 * - Edit terms text in src/components/Terms/text.tsx
 * - Modify terms layout in src/components/Terms/index.tsx
 * - Link to this page is configured in src/config.tsx under externalLinks.terms
 *
 * IMPORTANT:
 * - This is a client component to match the Terms component's interactivity
 * - Users can access this from nomination forms and other parts of the app
 * - Keep terms updated according to your organization's legal requirements
 */

'use client'
import Terms from '@/components/Terms'

export default function TermsPage() {
  return <Terms />
}
