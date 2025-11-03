/**
 * PHASE 3 PROJECT CARD COMPONENT
 *
 * Individual project card in results leaderboard.
 * Shows vote count, funding amount, and "voted" badge if applicable.
 *
 * FEATURES:
 * - Project name (truncated if needed)
 * - Total points received
 * - Calculated USDC funding amount
 * - Jazzicon or custom icon
 * - "Voted" heart badge (if user voted for this project)
 * - Click to open detailed popup
 * - Same gradient colors as Phase 2
 *
 * FUNDING CALCULATION:
 * - Formula: (projectPoints / totalPoints) * totalFundingPool
 * - Example: 100 votes out of 1000 total = 10% of pool
 * - Total pool defined in src/config.tsx appConfig.totalFundingPool
 *
 * CUSTOMIZATION POINTS:
 * - Total funding pool: Edit src/config.tsx appConfig.totalFundingPool
 * - Card colors: Same as Phase 2 (gradients in globals.css)
 * - Text labels: Edit src/config.tsx under contentText.phase3
 */

import React from 'react'
import Image from 'next/image'
import { numberWithCommas } from '@/utils'
import { Phase3ProjectProps } from '@/types/types'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { appConfig, assetPaths, contentText } from '@/config'

/**
 * Phase 3 Project Card Component
 */
const Project: React.FC<Phase3ProjectProps> = ({
  index, // Card index for color rotation
  id, // Project ID
  name, // Project name
  desc, // Project description (for popup)
  website, // Project website URL
  paddress, // Project Ethereum address (for Jazzicon)
  icon, // Project icon URL (or null for Jazzicon)
  points, // Total votes received
  setPopupStatus, // Open project details popup
  setPopupDetails, // Set popup data
  votedProjects, // Array of project IDs user voted for
  walletStatus, // User's wallet connection status
  pointsSum, // Total votes across all projects
}) => {
  // ============================================================================
  // CALCULATIONS
  // ============================================================================

  /**
   * Determine card background color based on index
   * Same color rotation pattern as Phase 2
   */
  const { colors, pattern } = appConfig.projectColors
  const color = colors[pattern[index % pattern.length]]

  /**
   * Check if user voted for this project
   * Shows heart badge if true
   */
  const voted = votedProjects && votedProjects.includes(id) && walletStatus === 'connected'

  /**
   * Calculate USDC funding amount
   * Formula: (projectVotes / totalVotes) * totalFundingPool
   *
   * CUSTOMIZATION: Edit totalFundingPool in src/config.tsx
   */
  const usd = (points / pointsSum) * appConfig.totalFundingPool
  // Alternative: use usdcAmount from backend if provided
  // const usd = usdcAmount

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================

  return (
    /* Project Card Container - Same size/shape as Phase 2 */
    <div
      className={`relative h-48 w-52 rounded-[1.75rem] p-2 px-5 700px:h-64 700px:w-72 700px:p-4 700px:px-7 ${color} `}
    >
      {/* Project Name - Truncated if too long */}
      {/* Width reduced when voted to make room for heart badge */}
      <div
        className={`ellipsis h-[68px] break-words pt-1 font-ob text-[1.4rem] font-extrabold leading-8 700px:h-[84px] 700px:text-[32px] 700px:leading-10 ${
          voted && 'w-[74%] 700px:w-[79%]'
        }`}
      >
        {name}
      </div>

      {/* "View Details" Button */}
      <div
        className='details-button z-10 mt-3 700px:mt-4'
        onClick={() => {
          setPopupStatus('visible')
          // Pass project data to popup (includes points received)
          setPopupDetails({ name: name, message: desc, link: website, paddress: paddress, image: icon, points: points })
        }}
      >
        {contentText.common.viewDetails}
      </div>

      {/* Results Display - Points and USDC */}
      <div className='mt-1.5 flex flex-col 700px:mt-4'>
        {/* Points Received - Large number */}
        {/* Font size adjusts for large numbers (> 999) */}
        <div
          className={`flex h-[34px] items-end pb-0.5 font-obWide font-extrabold 700px:h-[44px] 700px:pb-1 ${
            points > 999
              ? 'text-[28px] leading-7 700px:text-4xl' // Smaller for 4+ digits
              : 'text-[32px] leading-8 700px:text-[45px] 700px:leading-[43px]' // Larger for 1-3 digits
          }`}
        >
          {points || '0'}
        </div>

        {/* "Points Received" Label */}
        <div className='text-[0.6rem] font-bold uppercase 700px:text-[0.72rem]'>
          {contentText.phase3.pointsReceived}
        </div>

        {/* USDC Funding Amount */}
        {/* Calculated from (points / totalPoints) * totalFundingPool */}
        {/* Formatted with commas, no decimals */}
        <div className='text-[0.6rem] font-bold uppercase text-indigoDD4 700px:text-[0.82rem]'>
          ${numberWithCommas(usd.toFixed(0))}
        </div>
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
      {/* Only shown if user voted for this project (requires wallet connection) */}
      {voted && (
        <div className='absolute right-0 top-2 scale-75 700px:top-4 700px:scale-100'>
          <Image
            className='mb-3 mr-3 w-[55px] 700px:mb-4 700px:mr-4 700px:w-auto'
            src={assetPaths.icons.heart}
            alt='voted'
            width={56}
            height={56}
          />
          {/* "Voted" label overlaid on heart */}
          <div className='absolute left-2 top-[14px] text-[10.5px] font-bold'>{contentText.common.voted}</div>
        </div>
      )}
    </div>
  )
}

export default Project
