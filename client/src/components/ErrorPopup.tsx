/**
 * ERROR POPUP COMPONENT
 *
 * A generic error modal that displays when something goes wrong during user actions.
 * Currently used for API request failures (nomination submission, vote submission).
 *
 * WHEN IT'S SHOWN:
 * - Nomination form submission fails (500 error from backend)
 * - Vote submission fails (server error)
 * - Can be triggered from any component by setting errorPopupStatus to true
 *
 * FEATURES:
 * - Modal overlay with semi-transparent background
 * - Close button (X) in top right
 * - Click outside overlay to close
 * - Centered error message
 * - Same popup styling as success/nomination popups
 *
 * CUSTOMIZATION POINTS:
 * - Error message text: Edit src/config.tsx under contentText.errors
 * - Popup background: Same as other popups (popup-bg.png)
 * - Styling: Edit globals.css (.popup class)
 *
 * PROPS:
 * - errorPopupStatus: boolean - controls visibility
 * - setErrorPopupStatus: function - closes the popup
 *
 * USAGE EXAMPLE:
 * ```tsx
 * const [errorPopupStatus, setErrorPopupStatus] = useState(false)
 *
 * // Trigger error:
 * setErrorPopupStatus(true)
 *
 * // Render:
 * {errorPopupStatus && <ErrorPopup errorPopupStatus={errorPopupStatus} setErrorPopupStatus={setErrorPopupStatus} />}
 * ```
 *
 * NOTE:
 * - Returns null if errorPopupStatus is false (not rendered)
 * - Doesn't require wallet connection
 * - Generic error - doesn't show specific error details
 */

import React from 'react'
import Image from 'next/image'
import { ErrorPopupProps } from '@/types/types'
import { assetPaths, contentText } from '@/config'

/**
 * Error Popup Component
 */
const ErrorPopup: React.FC<ErrorPopupProps> = ({ errorPopupStatus, setErrorPopupStatus }) => {
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Close popup when clicking on overlay
   */
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setErrorPopupStatus(false)
    }
  }

  /**
   * Close popup when clicking X button
   */
  const handleCloseClick = () => {
    setErrorPopupStatus(false)
  }

  // Don't render if not shown
  if (!errorPopupStatus) return null

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================

  return (
    // Overlay - Full screen semi-transparent background
    <div
      className='fixed inset-0 z-30 flex items-center justify-center bg-popupOverlay'
      id='error-popup-overlay'
      onClick={handleOverlayClick}
    >
      {/* Popup Container - Same styling as other popups */}
      <div className='popup-mobile 800px:popup scale-[85%] 600px:scale-100' style={{ backgroundPosition: '0 -75px' }}>
        {/* Close Button (X) - Top Right */}
        <Image
          className='absolute right-3 top-3 cursor-pointer'
          src={assetPaths.icons.close}
          alt='Close Popup'
          onClick={handleCloseClick}
          width={44}
          height={45}
        />

        {/* White Content Area */}
        <div className='mt-[10rem] h-[calc(100%-10rem)] w-full rounded-t-[4.5rem] bg-white px-12 py-8 800px:px-16'>
          <div className='my-16 flex flex-col items-center justify-center 1000px:my-[100px]'>
            {/* Error Title */}
            {/* CUSTOMIZATION: Edit in src/config.tsx contentText.errors.genericTitle */}
            <h3 className='mb-14 text-center font-ibm text-3xl font-bold leading-[2.7rem] 800px:font-obWide 800px:font-semibold'>
              {contentText.errors.genericTitle}
            </h3>

            {/* Error Message */}
            {/* CUSTOMIZATION: Edit in src/config.tsx contentText.errors.genericMessage */}
            <div className='text-center font-ibm text-2xl font-semibold text-gray6'>
              {contentText.errors.genericMessage}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorPopup
