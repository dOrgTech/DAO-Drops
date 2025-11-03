/**
 * PROJECT POPUP COMPONENT (Phase 2)
 *
 * Detailed project view modal with full description and voting controls.
 * Opened when clicking on a project card in Phase 2.
 *
 * FEATURES:
 * - Full project name
 * - Complete project description (not truncated)
 * - Project website link (opens in new tab)
 * - Ethereum address with Jazzicon
 * - Points allocated display
 * - Increment/decrement buttons (+/-)
 * - Long-press for rapid allocation
 * - Close button (X)
 * - Click outside to close
 *
 * VOTE CONTROLS:
 * - Same +/- functionality as project cards
 * - Increment: Add 1 vote (if points available)
 * - Decrement: Remove 1 vote (if allocated)
 * - Long press: Rapid allocation
 * - Real-time localStorage updates
 * - Disabled when votes submitted
 *
 * CUSTOMIZATION POINTS:
 * - Popup background: public/assets/phase2/popup-bg.png
 * - Button icons: public/assets/icons/plus.svg, minus.svg
 * - Styling: Edit globals.css (.popup class)
 * - Button text: Edit src/config.tsx under contentText
 *
 * WEBSITE HANDLING:
 * - Uses withHttp() utility to add http:// if missing
 * - Opens in new tab (target="_blank")
 * - Shows "Visit Website" button if URL provided
 */

import React from 'react'
import Image from 'next/image'
import Repeatable from 'react-repeatable'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { withHttp } from '@/utils'
import { Phase2ProjectPopupProps } from '@/types/types'
import { assetPaths, contentText } from '@/config'

/**
 * Phase 2 Project Popup Component
 */
const ProjectPopup: React.FC<Phase2ProjectPopupProps> = ({
  popupStatus, // 'hidden' | 'visible'
  setPopupStatus, // Close popup function
  popupDetails, // Project data to display
  setVotes, // Update votes state
  votes, // Current vote allocations
  points, // Remaining vote credits
  setPoints, // Update points state
  votesSubmitted, // Submission status
}) => {
  // ============================================================================
  // VOTE CONTROL FUNCTIONS
  // ============================================================================

  /**
   * Remove 1 vote from this project
   * Same logic as Project card component
   */
  function decrement() {
    if (votesSubmitted !== 'true' && votes && votes[popupDetails.id!] !== 0) {
      setVotes((v) => ({ ...v, [popupDetails.id!]: v[popupDetails.id!] - 1 }))
      setPoints(points + 1)
    }
  }

  /**
   * Add 1 vote to this project
   * Same logic as Project card component
   */
  function increment() {
    if (votesSubmitted !== 'true' && votes && points !== 0) {
      setVotes((v) => ({ ...v, [popupDetails.id!]: v[popupDetails.id!] + 1 }))
      setPoints(points - 1)
    }
  }

  /**
   * Close popup when clicking outside (on overlay)
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
          className='fixed inset-0 z-20 flex items-center justify-center bg-popupOverlay'
          onClick={handleOverlayClick}
        >
          {/* Popup Container - .project-popup class in globals.css */}
          <div className='project-popup'>
            {/* Close Button (X) - Left side for Phase 2 popup style */}
            <Image
              className='absolute -left-4 top-5 cursor-pointer'
              src={assetPaths.icons.closePng}
              alt='Close Popup'
              onClick={handleCloseClick}
              width={44}
              height={44}
            />

            {/* Popup Content Area - .project-popup-bg class in globals.css */}
            <div className='project-popup-bg relative mt-[78px] h-[calc(100%-89px)] w-full border-b-[6px] border-l-[6px] border-r-[6px] border-indigoDD 525px:mt-[82px] 550px:mt-[86px] 600px:mt-[89px]'>
              {/* Project Icon - Centered at top, overlapping popup edge */}
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
                    // No icon - generate Jazzicon from Ethereum address
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
              <div className='pl-[30px] pr-8 pt-20 text-indigoDD 600px:px-8'>
                {/* Project Name - Full, not truncated */}
                <h4 className='mb-6 font-ob text-3xl font-extrabold'>{popupDetails.name}</h4>

                {/* Project Description - Full text with scrolling */}
                {/* whitespace-pre-wrap preserves line breaks from backend */}
                <div className='h-[20.5rem] overflow-y-auto whitespace-pre-wrap font-ibm text-lg'>
                  {popupDetails.message}
                </div>

                {/* Website Link Section */}
                <div className='mt-6 border-[6px] border-[#CAFEF7] bg-white p-6'>
                  <div className='font-ob font-bold uppercase'>{contentText.common.projectLink}</div>
                  {/* withHttp() adds http:// if missing */}
                  {/* Opens in new tab */}
                  <a target='_blank' rel='noreferrer' href={withHttp(popupDetails.link)} className='break-all font-ibm'>
                    {popupDetails.link}
                  </a>
                </div>

                {/* Vote Controls - Centered at bottom */}
                <div className='mb-6 mt-8 flex items-center justify-center'>
                  {/* Decrement Button - Repeatable for long press */}
                  <Repeatable repeatInterval={100} onPress={decrement} onHold={decrement}>
                    {' '}
                    <Image
                      className='scale-[135%] cursor-pointer'
                      src={assetPaths.icons.minus}
                      alt='minus'
                      width={33}
                      height={34}
                    />{' '}
                  </Repeatable>

                  {/* Current Vote Allocation */}
                  <span className='mx-4 font-ibm text-[2.5rem] font-semibold'>
                    {votes && popupDetails.id ? votes[popupDetails.id] : '0'}
                  </span>

                  {/* Increment Button - Repeatable for long press */}
                  <Repeatable repeatInterval={100} onPress={increment} onHold={increment}>
                    {' '}
                    <Image
                      className='scale-[135%] cursor-pointer'
                      src={assetPaths.icons.plus}
                      alt='plus'
                      width={33}
                      height={34}
                    />{' '}
                  </Repeatable>
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
