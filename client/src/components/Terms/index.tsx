/**
 * TERMS & CONDITIONS PAGE COMPONENT
 *
 * Displays the Terms of Service / Terms & Conditions for the DAO Drops platform.
 * Accessed via /terms route or links from nomination forms.
 *
 * FEATURES:
 * - Full-page layout with Phase 1 background
 * - DAO Drops logo (clickable - returns to main site)
 * - FAQ link in header
 * - Terms text content
 * - Footer with attribution and social links
 *
 * STRUCTURE:
 * - Layout: Similar to Phase 1 (same background)
 * - Content: TermsText component with actual terms
 * - Footer: Same footer as Phase 2 (with dOrg attribution)
 *
 * CUSTOMIZATION POINTS:
 * - Terms content: Edit src/components/Terms/text.tsx
 * - Header text: Edit src/config.tsx under contentText.common.termsTitle
 * - Background: Uses phase1-bg class from globals.css
 * - Footer styling: Matches Phase 2 footer
 *
 * LEGAL COMPLIANCE:
 * - Update text.tsx with your organization's actual terms
 * - Consult legal counsel for proper terms language
 * - Keep updated as your service evolves
 * - Consider adding last updated date
 *
 * NAVIGATION:
 * - Accessed via: /terms URL
 * - Linked from: Nomination form checkbox
 * - Logo link: Returns to main site (externalLinks.mainSite)
 */

import React from 'react'
import Image from 'next/image'
import TermsText from './text'
import { externalLinks, assetPaths, contentText } from '@/config'

/**
 * Terms & Conditions Component
 */
const Terms: React.FC = () => {
  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================

  return (
    <>
      {/* Main Container - Uses Phase 1 background */}
      <div className='phase1-bg-mobile 1000px:phase1-bg px-[5%] pt-9 1000px:px-[20%]'>
        {/* FAQ Link - Top Right */}
        <a
          className='relative -top-3 z-20 flex justify-end font-ob text-xl font-semibold tracking-[4px] text-magentaDD hover:text-magentaDD4 1200px:right-[-8.5%]'
          href={externalLinks.faq}
          target='_blank'
          rel='noreferrer'
        >
          FAQ
        </a>

        {/* Main Content Area */}
        <div className='relative flex items-start'>
          {/* DAO Drops Logo - Clickable, returns to main site */}
          {/* CUSTOMIZATION: Edit externalLinks.mainSite in src/config.tsx */}
          <a href={externalLinks.mainSite} className='min-h-[408] min-w-[49px]'>
            <Image
              src={assetPaths.logo}
              alt='DAO Drops Logo'
              className='z-10 h-[408] w-[49px]'
              width={49}
              height={408}
            />
          </a>

          {/* Terms Content Section */}
          <div className='flex flex-col'>
            <div className='z-10 my-10 ml-6 1000px:ml-10'>
              {/* Terms Title */}
              {/* CUSTOMIZATION: Edit in src/config.tsx contentText.common.termsTitle */}
              <h3 className='text-4xl'>{contentText.common.termsTitle}</h3>

              {/* Terms Text Content - max-w constrains width on mobile */}
              <div className='max-w-[370px] py-10 550px:max-w-max'>
                <TermsText />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Same as Phase 2 */}
      <footer className='flex h-24 w-full items-center justify-between bg-footerColor px-[4%]'>
        {/* Left Section - Attribution */}
        <div className='font-ob text-base text-magentaDD 600px:text-lg 1000px:w-1/3'>
          Built by{' '}
          <a target='_blank' rel='noreferrer' href={externalLinks.dOrg} className='font-semibold hover:underline'>
            {contentText.attribution.builtBy}
          </a>{' '}
          and supported
          <br />
          by the{' '}
          <a
            target='_blank'
            rel='noreferrer'
            href={externalLinks.ethereumFoundation}
            className='font-semibold hover:underline'
          >
            {contentText.attribution.supportedBy}
          </a>
        </div>

        {/* Center Section - FAQ Link */}
        <a
          className='text-center font-ob text-xl font-semibold tracking-[4px] text-magentaDD hover:text-magentaDD4 1000px:w-1/3'
          href={externalLinks.faq}
          target='_blank'
          rel='noreferrer'
        >
          {contentText.common.faq}
        </a>

        {/* Right Section - Social Links */}
        <div className='text-right 1000px:w-1/3'>
          <a target='_blank' rel='noreferrer' href={externalLinks.twitter}>
            <Image
              className='inline scale-150 hover:scale-[155%]'
              src={assetPaths.icons.twitter}
              alt='Twitter'
              width={24}
              height={20}
            />
          </a>
        </div>
      </footer>
    </>
  )
}

export default Terms
