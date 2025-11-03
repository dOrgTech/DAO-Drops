/**
 * DONE POPUP COMPONENT (Phase 2)
 *
 * Success confirmation modal shown after successfully submitting votes in Phase 2.
 *
 * FEATURES:
 * - Success message confirming vote submission
 * - Social sharing callout (Twitter/X)
 * - Close button (X)
 * - Click outside to close
 * - Same popup styling as nomination success
 *
 * WHEN SHOWN:
 * - After successful PATCH to /posts/score/:id
 * - Triggered by Header component after vote submission
 *
 * CUSTOMIZATION POINTS:
 * - Success message: Edit src/config.tsx under contentText.phase2.donePopup
 * - Social link: Edit src/config.tsx under externalLinks.twitter
 * - Popup background: Same as other popups (popup-bg.png)
 *
 * SIMILAR TO:
 * - Nomination success popup (Phase 1)
 * - Both use same popup styling and structure
 */

import React from 'react'
import Image from 'next/image'
import { DonePopupProps } from '@/types/types'
import { externalLinks, assetPaths, contentText } from '@/config'

/**
 * Done Popup Component - Vote Submission Success
 */
const DonePopup: React.FC<DonePopupProps> = ({ donePopupStatus, setDonePopupStatus }) => {
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Close popup when clicking on overlay background
   * Only closes if user clicks directly on overlay, not popup content
   */
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setDonePopupStatus(false)
    }
  }

  /**
   * Close popup when clicking X button
   */
  const handleCloseClick = () => {
    setDonePopupStatus(false)
  }

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================

  return (
    <>
      {/* Only render when donePopupStatus is true */}
      {donePopupStatus && (
        // Overlay - Full screen semi-transparent background
        <div
          className='fixed inset-0 z-30 flex items-center justify-center bg-popupOverlay'
          onClick={handleOverlayClick}
        >
          {/* Popup Container - Same styling as other popups */}
          <div
            className='popup-mobile 800px:popup scale-[85%] 600px:scale-100'
            style={{ backgroundPosition: '0 -75px' }}
          >
            {/* Close Button (X) - Top Right */}
            <Image
              className='absolute right-3 top-3 cursor-pointer'
              src={assetPaths.icons.close}
              alt='Close Popup'
              onClick={handleCloseClick}
              width={44}
              height={45}
            />

            {/* White Content Area with Rounded Top */}
            <div className='mt-[10rem] h-[calc(100%-10rem)] w-full rounded-t-[4.5rem] bg-white px-12 py-8 800px:px-16'>
              <div className='my-16 flex flex-col items-center justify-center 1000px:my-[100px]'>
                {/* Success Title - Two lines */}
                {/* CUSTOMIZATION: Edit in src/config.tsx under contentText.phase2.successTitle/Subtitle */}
                <h3 className='mb-14 text-center font-ibm text-3xl font-bold leading-[2.7rem] 800px:font-obWide 800px:font-semibold'>
                  {contentText.phase2.successTitle}
                  <br />
                  {contentText.phase2.successSubtitle}
                </h3>

                {/* Success Message - Gray text */}
                {/* CUSTOMIZATION: Edit in src/config.tsx under contentText.phase2.successMessage */}
                <div className='text-center font-ibm text-xl font-semibold text-gray6'>
                  {contentText.phase2.successMessage}
                </div>

                {/* Social Sharing Callout - Encourages users to share on Twitter/X */}
                <div className='mt-1 text-center'>
                  <a target='_blank' rel='noreferrer' href={externalLinks.twitter}>
                    {/* Call-to-action text with hover effect */}
                    <div className='mb-2 font-ibm text-xl font-semibold text-magentaDD2 underline hover:text-magentaDD3'>
                      {contentText.phase2.socialCallout}
                    </div>
                    {/* Twitter/X Icon with scale animation on hover */}
                    <Image
                      className='inline hover:scale-105'
                      src={assetPaths.icons.twitter2}
                      alt='Twitter'
                      width={24}
                      height={20}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DonePopup
