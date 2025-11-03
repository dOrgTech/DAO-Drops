/**
 * PHASE 2 PROJECT CARD COMPONENT
 *
 * Individual project card with vote allocation controls (+/- buttons).
 * Used in Phase 2 voting interface.
 *
 * FEATURES:
 * - Project name (truncated if too long)
 * - Jazzicon based on project Ethereum address
 * - Points allocated display (shows when > 0)
 * - Increment button (+) - adds 1 vote
 * - Decrement button (-) - removes 1 vote
 * - Long-press for rapid increment/decrement (react-repeatable)
 * - Click card to open detailed popup
 * - Gradient background (rotates through 4 colors)
 * - Disabled state after votes submitted
 *
 * VOTE CONTROLS:
 * - Increment: Add 1 vote (if points available)
 * - Decrement: Remove 1 vote (if votes allocated to this project)
 * - Long press: Hold to rapidly add/remove votes
 * - Real-time localStorage update of votes
 * - Disabled when votesSubmitted === 'true'
 *
 * CARD COLORS:
 * - Rotates through: orange, green, pink, blue gradients
 * - Pattern defined in src/config.tsx under appConfig.projectColors
 * - Color classes defined in globals.css (.p-orange, .p-green, etc.)
 *
 * CUSTOMIZATION POINTS:
 * - Colors: Edit gradient definitions in globals.css
 * - Color rotation pattern: Edit src/config.tsx projectColors.pattern
 * - Card size: Modify Tailwind classes (h-48 w-52, h-64 w-72)
 * - Button icons: Replace SVGs in public/assets/icons/
 *
 * INTERACTIONS:
 * - Click card: Open ProjectPopup with full details
 * - Click +: Add vote (if points available)
 * - Click -: Remove vote (if allocated)
 * - Long press +/-: Rapid allocation (via react-repeatable)
 *
 * LOCALSTORAGE:
 * - Votes saved to votes_{address} on every increment/decrement
 * - Format: { projectId: allocatedPoints, ... }
 */

import React from 'react'
import Image from 'next/image'
import Repeatable from 'react-repeatable'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { Phase2ProjectProps } from '@/types/types'
import { appConfig, assetPaths, contentText } from '@/config'

/**
 * Phase 2 Project Card Component
 */
const Project: React.FC<Phase2ProjectProps> = ({
  index, // Card index for color rotation
  id, // Project ID (for votes object key)
  name, // Project name
  desc, // Project description (for popup)
  website, // Project website URL
  paddress, // Project Ethereum address (for Jazzicon)
  icon, // Project icon URL (or null for Jazzicon)
  setPopupStatus, // Open project details popup
  setPopupDetails, // Set popup data
  setVotes, // Update votes state
  votes, // Current vote allocations
  points, // Remaining vote credits
  setPoints, // Update points state
  votesSubmitted, // Submission status
  address, // User's wallet address
}) => {
  // ============================================================================
  // COLOR ASSIGNMENT
  // ============================================================================

  /**
   * Determine card background color based on index
   * Uses rotating pattern: [0, 1, 2, 3, 1, 2, 3, 0, ...]
   * Colors: orange, green, pink, blue
   *
   * CUSTOMIZATION: Edit pattern in src/config.tsx appConfig.projectColors.pattern
   */
  const { colors, pattern } = appConfig.projectColors
  const color = colors[pattern[index % pattern.length]]

  // ============================================================================
  // VOTE CONTROL FUNCTIONS
  // ============================================================================

  /**
   * Remove 1 vote from this project
   *
   * CONDITIONS:
   * - Votes not yet submitted
   * - This project has at least 1 vote allocated
   *
   * EFFECTS:
   * - Decrements vote count for this project by 1
   * - Increments user's remaining points by 1
   * - Updates localStorage automatically (via setVotes in parent)
   */
  function decrement() {
    if (votesSubmitted !== 'true' && votes && votes[id] !== 0) {
      setVotes((votes) => ({ ...votes, [id]: votes[id] - 1 }))
      setPoints(points + 1)
    }
  }

  /**
   * Add 1 vote to this project
   *
   * CONDITIONS:
   * - Votes not yet submitted
   * - User has points remaining
   *
   * EFFECTS:
   * - Increments vote count for this project by 1
   * - Decrements user's remaining points by 1
   * - Updates localStorage automatically (via setVotes in parent)
   */
  function increment() {
    if (votesSubmitted !== 'true' && votes && points !== 0) {
      setVotes((votes) => ({ ...votes, [id]: votes[id] + 1 }))
      setPoints(points - 1)
    }
  }

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================

  return (
    /* Project Card Container - Rounded corners with gradient background */
    /* Color class (p-orange, p-green, etc.) applied dynamically */
    <div
      className={`relative h-48 w-52 rounded-[1.75rem] p-2 px-5 700px:h-64 700px:w-72 700px:p-4 700px:px-7 ${color}`}
    >
      {/* Project Name - Truncated with ellipsis if too long */}
      {/* Width reduced when votes > 0 to make room for heart icon */}
      {/* .ellipsis class in globals.css handles text overflow */}
      <div
        className={`ellipsis h-[68px] break-words pt-1 font-ob text-[1.4rem] font-extrabold leading-8 700px:h-[84px] 700px:text-[32px] 700px:leading-10 ${
          votes && votes[id] > 0 && 'w-[74%] 700px:w-[79%]'
        }`}
      >
        {name}
      </div>

      {/* "View Details" Button - Opens popup with full project info */}
      {/* .details-button class in globals.css adds hover effects */}
      <div
        className='details-button z-10 mt-3 700px:mt-4'
        onClick={() => {
          setPopupStatus('visible')
          // Pass all project data to popup
          setPopupDetails({ name: name, message: desc, link: website, paddress: paddress, image: icon, id: id })
        }}
      >
        {contentText.common.viewDetails}
      </div>

      {/* Vote Controls - Minus/Plus buttons with current allocation display */}
      <div className='mt-6 flex items-center 700px:mt-10'>
        {/* Decrement Button - Repeatable for long press */}
        {/* Triggers decrement every 100ms when held */}
        <Repeatable repeatInterval={100} onPress={decrement} onHold={decrement}>
          {' '}
          <Image
            src={assetPaths.icons.minus}
            alt='minus'
            className='w-7 cursor-pointer hover:saturate-50 700px:w-auto'
            width={33}
            height={34}
          />{' '}
        </Repeatable>

        {/* Current Vote Allocation for this project */}
        <span className='mx-1.5 font-ibm text-[1.5rem] font-semibold 700px:mx-2.5 700px:text-[1.75rem]'>
          {address && votes ? votes[id] : '0'}
        </span>

        {/* Increment Button - Repeatable for long press */}
        {/* Triggers increment every 100ms when held */}
        <Repeatable repeatInterval={100} onPress={increment} onHold={increment}>
          {' '}
          <Image
            src={assetPaths.icons.plus}
            alt='plus'
            className='w-7 cursor-pointer hover:saturate-50 700px:w-auto'
            width={33}
            height={34}
          />{' '}
        </Repeatable>
      </div>

      {/* Project Icon/Avatar - Bottom Right */}
      <div className='absolute bottom-0 right-0 mb-3 mr-3 rounded-full 700px:mb-4 700px:mr-4'>
        {icon ? (
          // Custom icon provided
          <Image
            className='h-[55px] w-[55px] rounded-full object-cover 700px:h-[82px] 700px:w-[82px]'
            src={icon}
            alt={name}
            width={82}
            height={82}
          />
        ) : (
          // No icon - generate Jazzicon from Ethereum address
          // Different sizes for mobile (55px) and desktop (82px)
          <>
            <div className='flex 700px:hidden'>
              {' '}
              <Jazzicon diameter={55} seed={jsNumberForAddress(paddress)} />{' '}
            </div>
            <div className='hidden 700px:flex'>
              {' '}
              <Jazzicon diameter={82} seed={jsNumberForAddress(paddress)} />{' '}
            </div>
          </>
        )}
      </div>

      {/* "Voted" Heart Badge - Top Right */}
      {/* Only shown when user has allocated votes to this project */}
      <div
        className={`absolute right-0 top-2 scale-75 700px:top-4 700px:scale-100 ${
          address && votes && votes[id] > 0 ? 'block' : 'hidden'
        }`}
      >
        <Image
          className='mb-3 mr-3 w-[55px] 700px:mb-4 700px:mr-4 700px:w-auto'
          src={assetPaths.icons.heart}
          alt='voted'
          width={56}
          height={56}
        />
        {/* "Voted" label overlaid on heart icon */}
        <div className='absolute left-2 top-[14px] text-[10.5px] font-bold'>{contentText.common.voted}</div>
      </div>
    </div>
  )
}

export default Project
