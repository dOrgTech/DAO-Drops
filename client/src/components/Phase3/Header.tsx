/**
 * PHASE 3 HEADER COMPONENT
 *
 * Header for Phase 3 (Results) showing wallet connection and POAP claim status.
 * Simpler than Phase 2 header since no voting controls needed.
 *
 * FEATURES:
 * - Wallet address display (truncated) with dropdown
 * - "Connect Wallet" button when disconnected
 * - POAP preview in wallet dropdown (if user is winner/eligible)
 * - Disconnect option
 * - FAQ link
 * - Responsive layout (fixed when connected)
 *
 * POAP DISPLAY:
 * - Shown in wallet dropdown if winner === 'winner'
 * - Shows POAP image and title
 * - User can click to claim on main page
 *
 * CUSTOMIZATION POINTS:
 * - Header background: Same as Phase 2 (headerColor)
 * - POAP image: public/assets/phase3/poap.png
 * - Text: Edit src/config.tsx under contentText.phase3
 *
 * SIMILAR TO:
 * - Phase 2 Header but without points/submit functionality
 * - Simplified for results viewing
 */

import React, { useState } from 'react'
import Image from 'next/image'
import { truncate } from '@/utils'
import { Phase3HeaderProps } from '@/types/types'
import { externalLinks, assetPaths, contentText } from '@/config'

/**
 * Phase 3 Header Component
 */
const Header: React.FC<Phase3HeaderProps> = ({
  loadWeb3, // Function to connect wallet
  disconnectWeb3, // Function to disconnect wallet
  address, // Connected wallet address
  walletStatus, // Connection status
  winner, // POAP eligibility ('check' | 'winner' | 'no-winner')
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * walletToggle: Controls wallet dropdown visibility
   * Shows wallet info and disconnect option when true
   */
  const [walletToggle, setWalletToggle] = useState(false)

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================

  return (
    // Main Header - Becomes fixed/sticky when wallet connected
    <header
      className={`z-30 flex w-full justify-end pt-4 ${
        walletStatus === 'connected' &&
        'fixed ml-[-5%] h-[65px] bg-headerColor px-[5%] pt-2 1000px:ml-[-10%] 1000px:pr-[10%] 1000px:pt-4'
      }`}
    >
      {/* FAQ Link - Left side */}
      {/* Hidden on small mobile when wallet connected */}
      <a
        className={`absolute left-[5%] top-4 z-20 font-ob text-xl font-semibold tracking-[4px] text-magentaDD hover:text-magentaDD4 1000px:left-[calc(10%+81px)] ${
          walletStatus === 'connected' && 'hidden 500px:block'
        }`}
        href={externalLinks.faq}
        target='_blank'
        rel='noreferrer'
      >
        {contentText.common.faq}
      </a>

      {/* CONNECTED WALLET STATE */}
      {walletStatus === 'connected' ? (
        <div className='relative flex flex-col'>
          {/* Wallet Address Button */}
          {/* Clicking toggles dropdown menu */}
          <div
            className='aqua-dot mb-2 w-[21rem] cursor-pointer border-[3px] border-aquaDD bg-white px-4 pb-2 pt-1 font-ob font-bold uppercase hover:text-indigoDD2'
            onClick={() => setWalletToggle(!walletToggle)}
          >
            {/* Truncated address display */}
            {truncate(address, 11)}
          </div>

          {/* Wallet Dropdown Menu */}
          {walletToggle && (
            <div className='absolute top-0 z-30 cursor-pointer bg-white' onClick={() => setWalletToggle(!walletToggle)}>
              <div className='w-[21rem] border-4 border-aquaDD pt-2 text-center font-ob font-bold'>
                {/* "Wallet Connected" label */}
                <div className='aqua-dot px-4 after:top-[0px] after:mr-[3px] after:content-["•"] hover:text-indigoDD2'>
                  {contentText.phase2.walletConnected}
                </div>

                {/* Divider */}
                <hr className='mt-3 border-[#CCCCCC]' />

                {/* "Signed in as" label */}
                <div className='mb-1 mt-3 px-4 text-left font-ob font-normal'>{contentText.phase2.signedInAs}</div>

                {/* Full wallet address */}
                <div className='break-words px-4 pb-2 text-left leading-5'>{address}</div>

                {/* Divider */}
                <hr className='mt-3 border-[#CCCCCC]' />

                {/* POAP Preview Section - Only shown if user is eligible (winner === 'winner') */}
                {winner === 'winner' && (
                  <>
                    <div className='flex items-center break-words px-4 py-5 text-left leading-5'>
                      {/* POAP Image */}
                      <Image className='w-20' src={assetPaths.phase3.poap} alt='poap' width={150} height={150} />

                      {/* POAP Info */}
                      <div className='ml-3 flex flex-col'>
                        <div className='text-left font-ob font-normal'>{contentText.phase3.rewardsTitle}:</div>
                        <div className=''>DAO DROPS poap</div>
                      </div>
                    </div>
                    {/* Divider */}
                    <hr className='border-[#CCCCCC]' />
                  </>
                )}

                {/* Disconnect Button */}
                <div
                  className='p-4 pb-[18px] text-left font-ob font-semibold hover:text-indigoDD2'
                  onClick={disconnectWeb3}
                >
                  {contentText.phase2.disconnect}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // DISCONNECTED WALLET STATE - Show "Connect Wallet" button
        <div
          className={`button1-small w-[18rem] border-b-[5px] pb-2 text-lg 600px:w-[20rem] 600px:border-b-[6px] 600px:pb-3 600px:text-xl 1000px:z-30`}
          onClick={() => loadWeb3('click')}
        >
          {contentText.phase2.connectWalletButton}
        </div>
      )}
    </header>
  )
}

export default Header
