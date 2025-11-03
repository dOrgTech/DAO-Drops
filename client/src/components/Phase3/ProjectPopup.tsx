/**
 * PROJECT POPUP COMPONENT (Phase 3)
 *
 * Detailed project view modal for Phase 3 (Results).
 * Similar to Phase 2 popup but read-only (no voting controls).
 *
 * FEATURES:
 * - Full project name
 * - Complete project description
 * - Project website link
 * - Ethereum address (commented out, can be uncommented)
 * - Total points received display
 * - Same popup styling as Phase 2
 *
 * DIFFERENCES FROM PHASE 2 POPUP:
 * - No +/- voting buttons
 * - Shows total points received (read-only)
 * - Simpler layout (no vote controls)
 *
 * CUSTOMIZATION POINTS:
 * - Popup background: Same as Phase 2 (.project-popup-bg in globals.css)
 * - Text labels: Edit src/config.tsx
 * - Uncomment Etherscan link section to show project address
 */

import React from 'react'
import Image from 'next/image'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { withHttp } from '@/utils'
import { Phase3ProjectPopupProps } from '@/types/types'
import { assetPaths, contentText } from '@/config'

/**
 * Phase 3 Project Popup Component - Results View (Read-Only)
 */
const ProjectPopup: React.FC<Phase3ProjectPopupProps> = ({
  popupStatus, // 'hidden' | 'visible'
  setPopupStatus, // Close popup function
  popupDetails, // Project data including points received
}) => {
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Close popup when clicking on overlay
   */
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setPopupStatus('hidden')
    }
  }

  /**
   * Close popup when clicking X button
   */
  const handleCloseClick = () => {
    setPopupStatus('hidden')
  }

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================

  return (
    <>
      {/* Only render when popupStatus is 'visible' */}
      {popupStatus === 'visible' ? (
        // Overlay - Full screen semi-transparent background
        <div
          className='fixed inset-0 z-30 flex items-center justify-center bg-popupOverlay'
          onClick={handleOverlayClick}
        >
          {/* Popup Container - .project-popup class in globals.css */}
          <div className='project-popup'>
            {/* Close Button (X) - Left side */}
            <Image
              className='absolute -left-4 top-5 cursor-pointer'
              src={assetPaths.icons.closePng}
              alt='Close Popup'
              onClick={handleCloseClick}
              width={44}
              height={44}
            />

            {/* Popup Content Area */}
            <div className='project-popup-bg relative mt-[86px] h-[calc(100%-89px)] w-full border-b-[6px] border-l-[6px] border-r-[6px] border-indigoDD 600px:mt-[89px]'>
              {/* Project Icon - Centered at top, overlapping edge */}
              <div className='absolute inset-x-0 top-[-4.4rem] m-auto w-max'>
                <div className='flex items-center justify-center rounded-full border-[7px] border-indigoDD bg-white'>
                  {popupDetails.image ? (
                    // Custom icon provided
                    <Image
                      className='h-32 w-32 rounded-full object-cover'
                      src={popupDetails.image}
                      alt={popupDetails.name}
                      width={128}
                      height={128}
                    />
                  ) : (
                    // No icon - generate Jazzicon
                    <div className='h-32 w-32 rounded-full object-cover'>
                      {' '}
                      <Jazzicon
                        diameter={128}
                        seed={jsNumberForAddress(popupDetails.paddress)}
                        paperStyles={{ borderRadius: 99 }}
                      />{' '}
                    </div>
                  )}
                </div>
              </div>

              {/* Main Content Section */}
              <div className='px-8 pl-[30px] pt-20 text-indigoDD 600px:px-8'>
                {/* Project Name - Full, not truncated */}
                <h4 className='mb-6 font-ob text-3xl font-extrabold'>{popupDetails.name}</h4>

                {/* Project Description - Full text with scrolling */}
                <div className='h-[20.5rem] overflow-y-auto whitespace-pre-wrap font-ibm text-lg'>
                  {popupDetails.message}
                </div>

                {/* Website Link Section */}
                <div className='mt-6 border-[6px] border-[#CAFEF7] bg-white p-6'>
                  <div className='font-ob font-bold uppercase'>{contentText.common.projectLink}</div>
                  <a target='_blank' rel='noreferrer' href={withHttp(popupDetails.link)} className='break-all font-ibm'>
                    {popupDetails.link}
                  </a>

                  {/* Optional: Etherscan Link for Project Address */}
                  {/* Uncomment to show Ethereum address with Etherscan link */}
                  {/* <div className='font-ob font-bold uppercase mt-6'>Address:</div>
                        <a target='_blank' rel='noreferrer' href={`https://etherscan.io/address/${popupDetails.paddress}`} className='font-ibm'>{popupDetails.paddress}</a> */}
                </div>

                {/* Points Received Display - Read-only */}
                {/* No vote controls in Phase 3 */}
                <div className='mb-6 mt-8 flex justify-center'>
                  <span className='mx-4 font-ibm text-[1.75rem] font-semibold'>
                    {popupDetails.points || '0'} {contentText.phase3.pointsReceived}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default ProjectPopup
