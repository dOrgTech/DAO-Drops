/**
 * PHASE 2 HEADER COMPONENT
 *
 * Fixed header for Phase 2 that displays wallet connection status, point balance,
 * and submit button for vote allocations.
 *
 * FEATURES:
 * - Wallet address display (truncated) with Jazzicon
 * - "Connect Wallet" button when disconnected
 * - Points remaining display when connected
 * - "Submit" button to send votes to backend
 * - Success popup after submission
 * - FAQ link
 * - Responsive layout (sticky on mobile)
 *
 * USER FLOW:
 * 1. User connects wallet (button triggers loadWeb3)
 * 2. Header shows address + points remaining
 * 3. User allocates points to projects (in Project components)
 * 4. Points remaining updates in real-time
 * 5. User clicks "Submit" button (only enabled when points === 0)
 * 6. Header sends votes to backend with web3-token auth
 * 7. Success popup shown, votesSubmitted set to 'true'
 * 8. Layout changes to show "Your Drops" + "Other Nominees" sections
 *
 * VOTE SUBMISSION:
 * - Creates web3-token with picks as statement (additional signature)
 * - PATCH to /posts/score/:id with token in request body
 * - Stores votes in localStorage during allocation
 * - Clears draft votes after successful submission
 *
 * CUSTOMIZATION POINTS:
 * - Header colors: Edit Tailwind classes (headerColor in tailwind.config.ts)
 * - Button text: Edit src/config.tsx under contentText.phase2
 * - Wallet modal styling: Edit src/context/Reown.tsx
 * - Success message: Edit in DonePopup component
 *
 * STATE MANAGEMENT:
 * - sendPointsNote: Show error if trying to submit with points remaining
 * - walletToggle: Show/hide wallet dropdown (disconnect option)
 * - donePopupStatus: Control success popup visibility
 * - votesSubmitted: 'false' | 'sending' | 'true' - tracks submission state
 */

import React, { useState, useEffect } from 'react'
import DonePopup from './DonePopup'
import { truncate } from '@/utils'
import { Phase2HeaderProps } from '@/types/types'
import Web3Token from 'web3-token'
import axios from 'axios'
import { apiEndpoints, externalLinks, contentText } from '@/config'

/**
 * Phase 2 Header Component
 */
const Header: React.FC<Phase2HeaderProps> = ({
  loadWeb3, // Function to connect wallet
  disconnectWeb3, // Function to disconnect wallet
  signer, // Ethers.js signer for signing messages
  address, // Connected wallet address
  addressDetails, // User's voting data from backend
  walletStatus, // Connection status
  points, // Remaining vote credits
  votes, // Current vote allocations
  setVotesSubmitted, // Update submission status
  votesSubmitted, // Submission status ('false' | 'sending' | 'true')
  setErrorPopupStatus, // Show error popup on submission failure
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * sendPointsNote: Controls error/info messages below submit button
   * - 'false': No message shown
   * - 'all': "Distribute all points" warning
   * - 'done': "All points sent" confirmation
   */
  const [sendPointsNote, setSendPointsNote] = useState('false')

  /**
   * walletToggle: Controls visibility of wallet dropdown menu
   * Shows disconnect option when true
   */
  const [walletToggle, setWalletToggle] = useState(false)

  /**
   * donePopupStatus: Controls success popup after vote submission
   */
  const [donePopupStatus, setDonePopupStatus] = useState(false)

  // ============================================================================
  // EFFECTS - Auto-detect if user has already submitted votes
  // ============================================================================

  /**
   * Check if user has previously submitted votes
   * Sets votesSubmitted to 'true' if addressDetails contains picks
   * This determines the layout (shows "Your Drops" vs "All Projects")
   */
  useEffect(() => {
    setVotesSubmitted(
      addressDetails !== 'none' && addressDetails.picks && addressDetails.picks.length && address ? 'true' : 'false',
    )
  }, [address, walletStatus, addressDetails, setVotesSubmitted])

  // ============================================================================
  // VOTE SUBMISSION FUNCTIONS
  // ============================================================================

  /**
   * Create web3-token with vote selections as statement
   * This provides cryptographic proof of the vote selections
   *
   * @param picksSelected - Array of vote allocations to sign
   * @returns web3-token string for authentication
   */
  async function submitSign(picksSelected: Array<{ id: string; points: number }>) {
    const token = await Web3Token.sign(async (msg: string) => await signer.signMessage(msg), {
      statement: JSON.stringify(picksSelected), // Encode picks in the signed message
    })
    return token
  }

  /**
   * Submit vote allocations to backend
   *
   * VALIDATION:
   * - Only submits if points === 0 (all points allocated)
   * - Shows warning if points remain
   * - Shows confirmation if already submitted
   *
   * FLOW:
   * 1. Convert votes object to array of picks
   * 2. Create web3-token with picks as statement (signature)
   * 3. Set votesSubmitted to 'sending'
   * 4. PATCH to backend with picks data and token
   * 5. On success: Set votesSubmitted to 'true', show success popup
   * 6. On error: Disconnect wallet, show error popup
   *
   * BACKEND REQUIREMENTS:
   * - Endpoint: PATCH /posts/score/:id (where id is from addressDetails._id)
   * - Body: { account, message (token), score, picks }
   * - Success: 200 OK
   * - Error: 500 Server Error
   */
  const submitPoints = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (points === 0 && votesSubmitted === 'false') {
      // All points allocated and not yet submitted - proceed with submission
      setSendPointsNote('false')
      e.preventDefault()

      // Convert votes object to array format for backend
      // { projectId: points } -> [{ id: projectId, points: points }]
      const picksSelected = Object.entries(votes).map(([k, v]) => ({ id: k, points: v }))

      // Create web3-token with picks encoded in statement
      const token = await submitSign(picksSelected)
      setVotesSubmitted('sending') // Show "Sending..." state

      // Prepare submission data
      const picksSubmission = {
        account: address.toLowerCase(),
        message: token, // web3-token for authentication
        score: points, // Should be 0 at this point
        picks: picksSelected, // Vote allocations
      }

      // Build API URL - update existing record if user has one, create new if not
      const url = apiEndpoints.score + (addressDetails !== 'none' ? addressDetails._id : '')

      // Submit to backend
      axios
        .patch(url, picksSubmission)
        .then((r) => {
          if (r.status === 200) {
            setVotesSubmitted('true') // Mark as submitted
            setDonePopupStatus(true) // Show success popup
          }
        })
        .catch(function (error) {
          if (error.response && error.response.status === 500) {
            // Server error - disconnect and show error popup
            setVotesSubmitted('false')
            disconnectWeb3()
            setErrorPopupStatus(true)
          } else {
            // Other errors - log to console
            console.error('Error', error.message)
          }
        })
    } else if (votesSubmitted === 'true') {
      // Already submitted - show confirmation message
      setSendPointsNote('done')
    } else {
      // Points remain - show warning to distribute all points
      setSendPointsNote('all')
    }
  }

  // ============================================================================
  // AUTO-HIDE MESSAGES
  // ============================================================================

  /**
   * Auto-hide error/info messages after 5 seconds
   * Clears sendPointsNote state after timeout
   */
  useEffect(() => {
    const timeOut = setTimeout(() => setSendPointsNote('false'), 5000)
    return () => {
      clearTimeout(timeOut)
    }
  }, [sendPointsNote])

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================

  return (
    <>
      {/* Main Header - Becomes fixed/sticky when wallet connected */}
      <header
        className={`z-20 flex w-full justify-end pt-4 ${
          walletStatus === 'connected' &&
          'fixed ml-[-5%] h-[65px] bg-headerColor px-[5%] pt-2 1000px:ml-[-10%] 1000px:pr-[10%] 1000px:pt-4'
        }`}
      >
        {/* FAQ Link - Left side, hidden on mobile when wallet connected */}
        {/* CUSTOMIZATION: Edit URL in src/config.tsx under externalLinks.faq */}
        <a
          className={`absolute left-[5%] top-5 z-20 font-ob text-xl font-semibold tracking-[4px] text-magentaDD hover:text-magentaDD4 1000px:left-[calc(10%+97px)] ${
            walletStatus === 'connected' && 'hidden 1000px:block'
          }`}
          href={externalLinks.faq}
          target='_blank'
          rel='noreferrer'
        >
          {contentText.common.faq}
        </a>

        {/* CONNECTED WALLET STATE - Shows address, points, and submit button */}
        {walletStatus === 'connected' ? (
          <div className='relative flex w-full flex-col 1000px:w-auto'>
            {/* Wallet Address Button - Desktop Only */}
            {/* Clicking opens dropdown menu with disconnect option */}
            {/* .aqua-dot class in globals.css adds decorative dot */}
            <div
              className='aqua-dot hidden w-[21rem] cursor-pointer border-[3px] border-aquaDD bg-white px-4 pb-2 pt-1 font-ob font-bold uppercase hover:text-indigoDD2 1000px:block'
              onClick={() => setWalletToggle(!walletToggle)}
            >
              {/* Truncate address to show first 11 and last 5 characters */}
              {truncate(address, 11)}
            </div>

            {/* Wallet Dropdown Menu - Shows when walletToggle is true */}
            {walletToggle && (
              <div
                className='absolute right-0 top-0 z-30 cursor-pointer bg-white 1000px:right-auto'
                onClick={() => setWalletToggle(!walletToggle)}
              >
                <div className='w-[21rem] border-4 border-aquaDD pt-2 text-center font-ob font-bold'>
                  {/* "Wallet Connected" label with decorative dot */}
                  <div className='aqua-dot px-4 after:top-0 after:mr-[3px] after:content-["•"] hover:text-indigoDD2'>
                    {contentText.phase2.walletConnected}
                  </div>

                  {/* Divider */}
                  <hr className='mt-3 border-[#CCCCCC]' />

                  {/* "Signed in as" label */}
                  <div className='mb-1 mt-3 px-4 text-left font-ob font-normal'>{contentText.phase2.signedInAs}</div>

                  {/* Full wallet address - not truncated */}
                  <div className='break-words px-4 pb-2 text-left leading-5'>{address}</div>

                  {/* Divider */}
                  <hr className='mt-3 border-[#CCCCCC]' />

                  {/* Disconnect button */}
                  <div
                    className='p-4 pb-[18px] text-left font-ob font-semibold hover:text-indigoDD2'
                    onClick={disconnectWeb3}
                  >
                    {contentText.phase2.disconnect}
                  </div>
                </div>
              </div>
            )}

            {/* If user has voting data (points assigned by backend) */}
            {addressDetails !== 'none' && addressDetails ? (
              <>
                {/* DESKTOP VIEW - Points Display + Submit Button */}
                <div className={`absolute top-[42px] z-20 hidden bg-white uppercase 1000px:block`}>
                  <div className='flex h-[74px] w-[21rem] items-center justify-around border-4 border-indigoDD text-center font-obWide font-bold text-indigoDD3'>
                    {/* Left Section - Points Remaining Display */}
                    <div className='h-full w-[53%] border-r-4 border-indigoDD p-1'>
                      <div className='flex items-center justify-center'>
                        {/* Points Number - Large magenta text */}
                        <div className='w-[76px] pr-1 text-right text-2xl tracking-[0.12rem] text-magentaDD5'>
                          {points}
                        </div>
                        {/* "pts" Label - Dynamic padding based on number length */}
                        <div
                          className={`self-end lowercase tracking-[0.12rem] ${
                            points > 99 ? 'pr-0' : points > 9 ? 'pr-4' : 'pr-9'
                          }`}
                        >
                          {' '}
                          {contentText.common.ptsLabel}
                        </div>
                      </div>
                      {/* "Vote Credits" Sublabel */}
                      <div className='mt-[3px] text-xs'>{contentText.phase2.voteCredits}</div>
                    </div>

                    {/* Right Section - Submit Button */}
                    {/* Button states:
                        - Default (points > 0): Grayscale, disabled hover
                        - Ready to submit (points === 0): Full color, active
                        - Sending: Shows "Sending..."
                        - Done: Shows "Done", grayscale
                    */}
                    <div
                      className={`flex h-full min-w-[157px] cursor-pointer items-center justify-center bg-aquaDD px-5 py-1 hover:bg-aquaDD2 hover:text-indigoDD2 ${points > 0 && 'brightness-150 grayscale hover:brightness-125'} ${
                        votesSubmitted === 'true' &&
                        'brightness-110 grayscale hover:bg-aquaDD hover:text-indigoDD3 hover:brightness-110'
                      }`}
                      onClick={submitPoints}
                    >
                      <div className='text-xl'>
                        {/* Button text changes based on submission state */}
                        {votesSubmitted === 'sending'
                          ? contentText.phase2.sendingButton // "Sending..."
                          : votesSubmitted === 'true'
                            ? contentText.phase2.doneButton // "Done"
                            : contentText.phase2.submitButton}{' '}
                        {/* "Submit" */}
                      </div>
                    </div>
                  </div>
                  {/* Terms Agreement Notice - Shown when ready to submit (points === 0) */}
                  {/* Only shown when votes not yet submitted */}
                  {votesSubmitted !== 'true' && points === 0 && (
                    <div
                      className={
                        'flex h-8 items-center justify-center border-4 border-t-0 border-indigoDD px-1 text-center font-ibm text-[11px] font-bold normal-case text-indigoDD'
                      }
                    >
                      <span>
                        {/* "By submitting you agree to Terms" message */}
                        {contentText.phase2.termsAgreement}&nbsp;
                        <a target='_blank' rel='noreferrer' href={externalLinks.terms} className='underline'>
                          {contentText.phase2.termsLink}
                        </a>
                      </span>
                    </div>
                  )}

                  {/* Warning Message - "Distribute all points" */}
                  {/* Shown when user tries to submit with points remaining */}
                  {sendPointsNote === 'all' && (
                    <div
                      className={
                        'note flex h-9 items-center justify-center pt-0.5 text-center font-ibm text-sm font-semibold normal-case text-[#181818]'
                      }
                    >
                      {contentText.phase2.distributeAllPoints}
                    </div>
                  )}

                  {/* Confirmation Message - "All points sent" */}
                  {/* Shown when user tries to submit again after already submitting */}
                  {sendPointsNote === 'done' && (
                    <div
                      className={
                        'note flex h-9 items-center justify-center pt-0.5 text-center font-ibm text-sm font-semibold normal-case text-[#181818]'
                      }
                    >
                      {contentText.phase2.allPointsSent}
                    </div>
                  )}
                </div>

                {/* MOBILE VIEW - Compact horizontal layout */}
                <div className='flex h-[50px] border-[3px] border-indigoDD bg-white 1000px:hidden'>
                  {/* Left Section - Points Display */}
                  {/* Disabled (grayscale) after votes submitted */}
                  <div
                    className={`flex w-full flex-1 items-center justify-center border-r-[3px] border-aquaDD px-2 font-ob font-bold uppercase 600px:px-4 ${
                      (votesSubmitted === 'true' ||
                        (typeof addressDetails === 'string' && addressDetails === 'none')) &&
                      'pointer-events-none grayscale'
                    } `}
                  >
                    {/* Points Number */}
                    <span className='min-w-[60px] pb-2 pr-2 font-obWide text-2xl font-extrabold text-magentaDD5'>
                      {points}{' '}
                    </span>
                    {/* "PTS VOTE CREDITS" Label */}
                    <span className='pb-0.5 text-[0.8rem] leading-3 700px:text-[0.9rem] 700px:leading-4'>
                      {contentText.common.ptsLabel.toUpperCase()} {contentText.phase2.voteCredits.toUpperCase()}
                    </span>
                  </div>

                  {/* Middle Section - Submit Button */}
                  {/* Disabled after votes submitted */}
                  <div
                    className={`flex-1 ${
                      (votesSubmitted === 'true' ||
                        (typeof addressDetails === 'string' && addressDetails === 'none')) &&
                      'pointer-events-none grayscale'
                    } `}
                  >
                    <div
                      className='button1-small m-auto mx-2 w-[7.5rem] border-b-4 pb-0 text-[0.6rem] 600px:mx-auto 700px:w-[10rem] 700px:text-[0.8rem]'
                      style={{ backgroundPosition: '100% 60%', backgroundSize: '14%' }}
                      onClick={submitPoints}
                    >
                      {/* Button text changes based on submission state */}
                      {votesSubmitted === 'sending'
                        ? contentText.phase2.sendingButton // "Sending..."
                        : votesSubmitted === 'true'
                          ? contentText.phase2.sentButton // "Sent"
                          : contentText.phase2.sendPointsButton}{' '}
                      {/* "Send Points" */}
                    </div>
                  </div>

                  {/* Right Section - Wallet Address (truncated) */}
                  {/* Clicking opens wallet dropdown */}
                  <div
                    className='aqua-dot flex w-full flex-1 cursor-pointer items-center justify-center border-l-[3px] border-aquaDD bg-white px-1 pb-1 pr-2 font-ob font-bold after:right-4 after:top-0 700px:after:content-["•"]'
                    onClick={() => setWalletToggle(!walletToggle)}
                  >
                    {/* Truncate address to show first 4 and last 5 characters */}
                    {truncate(address, 4)}
                  </div>
                  {/* Terms Agreement Notice - Mobile (below header) */}
                  {/* Only shown when ready to submit (points === 0 and not yet submitted) */}
                  {votesSubmitted !== 'true' && points === 0 && (
                    <div
                      className={
                        'absolute left-0 right-0 top-[50px] z-20 flex h-8 items-center justify-center border-[3px] border-t-0 border-indigoDD bg-white px-1 text-center font-ibm text-[11px] font-bold normal-case text-indigoDD'
                      }
                    >
                      <span>
                        {contentText.phase2.termsAgreement}&nbsp;
                        <a target='_blank' rel='noreferrer' href={externalLinks.terms} className='underline'>
                          {contentText.phase2.termsLink}
                        </a>
                      </span>
                    </div>
                  )}

                  {/* Warning Message - Mobile */}
                  {/* "Distribute all points first" */}
                  {sendPointsNote === 'all' && (
                    <div
                      className={
                        'note absolute left-0 right-0 top-[50px] z-20 flex h-9 items-center justify-center bg-white pt-0.5 text-center font-ibm text-sm font-semibold normal-case text-[#181818]'
                      }
                    >
                      {contentText.phase2.distributeAllPoints}
                    </div>
                  )}
                </div>
              </>
            ) : (
              // USER HAS NO POINTS - Show "No points assigned" message
              <>
                {/* Desktop View - "No Points" Message */}
                <div className='mt-[7px] hidden h-[140px] w-[21rem] flex-col items-center justify-center border-4 border-indigoDD3 bg-white p-5 text-center 1000px:flex'>
                  {/* Split message at ! for emphasis */}
                  <div className='mb-4 font-obWide font-bold'>{contentText.phase2.noPointsMessage.split('!')[0]}!</div>
                  <div className='font-ibm text-sm font-semibold'>
                    {contentText.phase2.noPointsMessage.split('! ')[1]}
                  </div>
                </div>

                {/* Mobile View - "No Points" Message */}
                <div className='flex h-[50px] border-[3px] border-indigoDD bg-white 1000px:hidden'>
                  {/* Left Section - Message */}
                  <div className={`flex w-3/4 items-center justify-center px-2 font-ob font-bold 600px:px-4`}>
                    <div className='font-ibm text-xs font-semibold leading-[13px]'>
                      {contentText.phase2.noPointsMessage}
                    </div>
                  </div>
                  {/* Right Section - Wallet Address */}
                  <div
                    className='aqua-dot flex w-1/4 min-w-[128px] cursor-pointer items-center justify-center border-l-[3px] border-indigoDD bg-white px-1 pb-1 pr-2 font-ob font-bold after:right-4 after:top-0 700px:after:content-["•"]'
                    onClick={() => setWalletToggle(!walletToggle)}
                  >
                    {truncate(address, 4)}
                  </div>
                </div>
              </>
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

      {/* Success Popup - Shown after vote submission */}
      <DonePopup donePopupStatus={donePopupStatus} setDonePopupStatus={setDonePopupStatus} />
    </>
  )
}

export default Header
