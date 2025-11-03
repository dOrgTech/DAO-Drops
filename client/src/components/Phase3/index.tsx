/**
 * PHASE 3 COMPONENT - RESULTS & LEADERBOARD
 *
 * This is the final phase showing voting results, funding distribution, and POAP claims.
 * Displays a leaderboard of projects ranked by total votes received.
 *
 * KEY FEATURES:
 * - Leaderboard of projects sorted by votes (highest first)
 * - Funding distribution in USDC (calculated from total funding pool)
 * - Percentage of total votes for each project
 * - POAP claim button for participants (if eligible)
 * - Highlight projects user voted for (optional wallet connection)
 * - Background video with decorative elements
 * - Winner/top project special indicator
 *
 * USER EXPERIENCE:
 * - No wallet required to view results
 * - Connect wallet to:
 *   - See which projects you voted for (highlighted)
 *   - Claim POAP if eligible (poap === true)
 *
 * DATA FLOW:
 * 1. Fetch projects from backend (GET /posts/picks)
 * 2. Sort by currentScore (descending)
 * 3. Calculate USDC amounts based on vote percentages
 * 4. Display leaderboard with rankings
 * 5. If wallet connected: highlight user's voted projects
 *
 * FUNDING CALCULATION:
 * - Total funding pool defined in src/config.tsx (appConfig.totalFundingPool)
 * - Each project receives: (projectVotes / totalVotes) * totalFundingPool
 * - Example: Project with 100 votes out of 1000 total = 10% of pool
 *
 * POAP (Proof of Attendance Protocol):
 * - Shown to users who participated in voting
 * - Eligibility: poap === true (user spent all points)
 * - Claim button opens external POAP claim URL
 *
 * CUSTOMIZATION POINTS:
 * - All text content: Edit src/config.tsx under contentText.phase3
 * - Total funding pool: Edit src/config.tsx appConfig.totalFundingPool
 * - POAP link: Edit src/config.tsx externalLinks.poap
 * - Background: Uses Phase 1 background (phase1-bg)
 * - Card colors: Same gradient rotation as Phase 2
 *
 * STATE MANAGEMENT:
 * - projectsPicks: Sorted array of projects with scores
 * - pointsSum: Total votes across all projects
 * - votedProjects: Array of project IDs user voted for
 * - winner: ID of winning project (highest votes)
 * - popupStatus: Controls project detail popup
 */

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Header from './Header'
import Project from './Project'
import ProjectPopup from './ProjectPopup'
import { Phase3Props, Project as ProjectType, PopupDetails } from '@/types/types'
import axios from 'axios'
import { apiEndpoints, externalLinks, assetPaths, contentText } from '@/config'

/**
 * Phase 3 Component - Results & Leaderboard
 */
const Phase3: React.FC<Phase3Props> = ({
  loadWeb3, // Function to connect wallet
  disconnectWeb3, // Function to disconnect wallet
  address, // Connected wallet address
  addressDetails, // User's voting data from backend
  walletStatus, // Connection status
  poap, // POAP eligibility (true if user spent all points)
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * isVideoLoaded: Controls smooth transition from thumbnail to video
   */
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  /**
   * popupStatus: Controls project details popup visibility
   */
  const [popupStatus, setPopupStatus] = useState('hidden')

  /**
   * winner: POAP eligibility status for header display
   * - 'check': Initial state, checking eligibility
   * - 'winner': User is eligible for POAP
   * - 'no-winner': User is not eligible
   */
  const [winner, setWinner] = useState('check')

  /**
   * projectsPicks: Array of projects with voting results
   * Sorted by currentScore (highest to lowest) for leaderboard
   */
  const [projectsPicks, setProjectsPicks] = useState<ProjectType[]>()

  /**
   * popupDetails: Data for project currently shown in popup
   */
  const [popupDetails, setPopupDetails] = useState<PopupDetails>({
    name: '',
    message: '',
    link: '',
    paddress: '',
    image: '',
  })

  /**
   * pointsSum: Total votes across all projects
   * Used to calculate funding percentages
   */
  const [pointsSum, setPointsSum] = useState(0)

  // ============================================================================
  // DATA LOADING - Projects and Results
  // ============================================================================

  /**
   * Load projects from backend and calculate totals
   *
   * FLOW:
   * 1. Fetch projects from backend API (GET /posts/picks)
   * 2. Sort by currentScore (descending) for leaderboard ranking
   * 3. Calculate total points across all projects
   *
   * RUNS:
   * - Once on component mount
   * - Projects are read-only in Phase 3 (no voting)
   */
  useEffect(() => {
    axios
      .get<ProjectType[]>(apiEndpoints.picks)
      .then((r) => {
        // Sort projects by score - highest first (leaderboard order)
        const sortedProjects = r.data.sort((a, b) => (b.currentScore || 0) - (a.currentScore || 0))
        setProjectsPicks(sortedProjects)
        // Calculate total votes for funding distribution calculations
        setPointsSum(sortedProjects.reduce((a, b) => a + (b.currentScore || 0), 0))
      })
      .catch((e) => console.error(e))
  }, [])

  // ============================================================================
  // VOTED PROJECTS CALCULATION
  // ============================================================================

  /**
   * Calculate which projects the connected user voted for
   * Used to display "voted" badge on project cards
   *
   * MEMOIZED: Only recalculates when address or addressDetails changes
   *
   * RETURNS:
   * - Array of project IDs if wallet connected and user has voting history
   * - undefined if wallet not connected or no voting history
   */
  const votedProjects = useMemo(() => {
    if (address && addressDetails !== 'none') {
      const voted: string[] = []
      addressDetails.picks.forEach((pick) => {
        if (pick.points > 0) {
          voted.push(pick.id) // Add project ID to voted array
        }
      })
      return voted
    }
    return undefined
  }, [address, addressDetails])

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================

  return (
    <>
      {/* Main Container - Phase 2 background */}
      <div className='phase2-bg px-[5%] 1000px:px-[10%]'>
        {/* Header with wallet connection */}
        <Header
          loadWeb3={loadWeb3}
          disconnectWeb3={disconnectWeb3}
          address={address}
          walletStatus={walletStatus}
          winner={winner}
        />

        {/* Main Content Area - Logo + Rewards Box + Video */}
        <div
          className={`relative flex items-end ${
            walletStatus === 'connected'
              ? 'mt-0 pt-[5.55rem] 700px:pt-[6.9rem] 1000px:pt-[4.375rem]' // Extra top padding when header is fixed
              : 'mt-8 700px:mt-12 1000px:mt-2'
          }`}
        >
          {/* DAO Drops Logo - Left Side */}
          <Image
            className='mt-6 self-start 700px:mt-0'
            src={assetPaths.logo}
            alt='DAO Drops Logo'
            width={49}
            height={408}
          />

          {/* Rewards Box - Shows POAP claim or eligibility info */}
          <div className='absolute z-20 mb-16 ml-4 scale-75 1000px:relative 1000px:mb-0 1000px:ml-8 1000px:mt-8 1000px:scale-100'>
            {/* "Rewards" Label with decorative line */}
            <div className='endsin-line phase2 flex h-10 w-48 items-center justify-center border-l-[6px] border-t-[6px] border-indigoDD bg-white font-ob text-lg font-bold uppercase'>
              <div className='absolute pb-1 pl-1'>{contentText.phase3.phaseLabel}</div>
            </div>

            {/* Rewards Content Box */}
            {/* Shows different content based on wallet status and POAP eligibility */}
            <div className='flex !max-h-[45.1rem] !min-h-[29.1rem] w-[24rem] flex-col border-[6px] border-indigoDD bg-white font-obWide text-5xl font-extrabold 1000px:h-[calc(100vh-310px)] 1000px:w-[28rem]'>
              {/* "REWARDS" Title */}
              <div className='w-full border-b-[6px] border-indigoDD pb-6 pt-3 text-center text-4xl 1000px:text-5xl'>
                {contentText.phase3.rewardsTitle}
              </div>

              {/* WALLET NOT CONNECTED - Show connect prompt */}
              {walletStatus !== 'connected' && walletStatus !== 'connecting' ? (
                <div className='my-auto flex flex-col px-12'>
                  {/* Message encouraging users to connect */}
                  <div className='mb-6 font-ibm text-xl font-semibold 1000px:mb-10'>
                    {contentText.phase3.participatedMessage}
                  </div>
                  <div className='mb-8 font-ibm text-xl font-semibold 1000px:mb-12'>
                    {contentText.phase3.checkLeaderboardMessage}
                  </div>
                  {/* "Check Your Rewards" Button - Connects wallet */}
                  <button
                    className='button2 w-full text-sm uppercase'
                    style={{ backgroundPosition: '90% 50%' }}
                    // onClick={() => (walletStatus === 'connected' ? setWinner('winner') : loadWeb3('click'))}
                    onClick={() => loadWeb3('click')}
                  >
                    {contentText.phase3.checkRewardsButton}
                  </button>
                </div>
              ) : // WALLET CONNECTED + POAP ELIGIBLE - Show POAP claim
              poap ? (
                <div className='my-auto flex flex-col px-8 1000px:px-12'>
                  {/* POAP Image */}
                  {/* CUSTOMIZATION: Replace public/assets/phase3/poap.png */}
                  <Image className='mx-auto' src={assetPaths.phase3.poap} alt='poap' width={150} height={150} />

                  {/* POAP Title */}
                  <div className='mb-8 mt-4 text-center font-obWide text-xl font-medium'>
                    {contentText.phase3.poapClaimTitle}
                  </div>

                  {/* Claim Button - Opens external POAP URL */}
                  {/* CUSTOMIZATION: Edit externalLinks.poap in src/config.tsx */}
                  <a
                    href={externalLinks.poap}
                    target='_blank'
                    rel='noreferrer'
                    className='button2 flex w-full items-center justify-center text-sm uppercase'
                    style={{ backgroundPosition: '90% 50%' }}
                  >
                    {contentText.phase3.claimButton}
                  </a>
                </div>
              ) : // WALLET CONNECTED + NO POAP - Show "not eligible" message
              !poap ? (
                <div className='my-auto flex flex-col px-8 1000px:px-10'>
                  {/* No rewards message */}
                  <div className='mb-8 font-ibm text-lg font-semibold 1000px:mb-10'>
                    {contentText.phase3.noRewardsMessage}
                  </div>
                  {/* Encouragement to check leaderboard */}
                  <div className='font-ibm text-lg font-semibold 1000px:mb-12'>
                    {contentText.phase3.checkLeaderboardMessage}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Right Side - Hero Text + Video Frame */}
          <div className='ml-12 flex w-full flex-col items-end 1000px:ml-0 1000px:w-full'>
            {/* Hero Text */}
            {/* CUSTOMIZATION: Edit in src/config.tsx contentText.phase3.hero */}
            <h3 className='-ml-4 mb-16 mt-8 self-start pr-[5%] text-3xl 1000px:my-0 1000px:ml-0 1000px:self-end 1000px:pl-6 1000px:text-3xl 1200px:pl-12 1200px:pr-[25%] 1200px:text-[calc(1.3rem+1vw)] 1200px:leading-10'>
              {contentText.phase3.hero}
            </h3>

            {/* Video Frame with Border */}
            <div className='relative z-10 mt-24 !max-h-[39.5rem] !min-h-[23.5rem] w-full border-[6px] border-indigoDD 1000px:mt-[18px] 1000px:h-[calc(100vh-400px)] 1000px:border-l-0'>
              {/* Thumbnail Image - Shows while video loads */}
              <Image
                className={`absolute z-10 h-full w-full object-cover transition-opacity duration-300 ease-in ${
                  isVideoLoaded ? 'opacity-0' : 'opacity-100'
                }`}
                src={assetPaths.video.thumbnail}
                alt='Drops Thumbnail'
                width={1890}
                height={1080}
              />

              {/* Background Video - Fades in when loaded */}
              <video
                className={`absolute z-10 h-full w-full object-cover ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
                autoPlay
                loop
                playsInline
                muted
                onLoadedData={() => setIsVideoLoaded(true)}
              >
                <source src={assetPaths.video.mp4} type='video/mp4' />
                <source src={assetPaths.video.ogg} type='video/ogg' />
                <source src={assetPaths.video.webm} type='video/webm' />
              </video>

              {/* Decorative Elements */}

              {/* Animated Bubble - Complex responsive positioning */}
              <Image
                className='bubble-animation absolute left-[0%] top-[-20%] z-20 w-[50%] min-w-[90vw] max-w-[600px] opacity-95 600px:left-[10%] 600px:top-[10%] 600px:min-w-[55vw] 800px:left-[15%] 800px:top-[-25%] 1000px:left-0 1000px:top-[5%] 1000px:min-w-[500px] 1200px:left-[27%]'
                src={assetPaths.particles.bubble}
                alt='Bubble'
                width={1129}
                height={1156}
              />

              {/* Squiggle - Large screens only */}
              <Image
                className='absolute left-[10%] top-[35%] z-10 hidden 1200px:block'
                src={assetPaths.phase1.squiggle}
                alt='Squiggle'
                width={241}
                height={27}
              />

              {/* Dots Pattern - Large screens only */}
              <Image
                className='absolute right-[5%] top-[-10%] z-10 hidden 1200px:block'
                src={assetPaths.phase1.dots}
                alt='Dots'
                width={218}
                height={217}
              />
            </div>
          </div>
        </div>

        {/* Attribution + Social Links Section */}
        <div className='relative flex justify-between pb-8 1000px:ml-20 1000px:p-0'>
          {/* Attribution + Social Links - Desktop Only */}
          <div className='relative right-0 mt-8 hidden 1000px:block'>
            {/* Attribution Text */}
            <div className='w-full border-b border-magentaDD pb-4 font-ob text-xl text-magentaDD 1000px:w-[19rem] 1000px:text-sm'>
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

            {/* Social Media Links */}
            <div className='absolute right-4 top-4 scale-150 1000px:relative 1000px:inset-0 1000px:mt-2.5 1000px:scale-100'>
              <a target='_blank' rel='noreferrer' href={externalLinks.twitter}>
                <Image
                  className='inline hover:scale-105'
                  src={assetPaths.icons.twitter}
                  alt='Twitter'
                  width={24}
                  height={20}
                />
              </a>
              <a target='_blank' rel='noreferrer' href={externalLinks.github}>
                <Image
                  className='ml-3 inline h-[23px] w-[23px] hover:scale-105'
                  src={assetPaths.icons.github}
                  alt='Twitter'
                  width={24}
                  height={24}
                />
              </a>
            </div>
          </div>

          {/* Additional Decorative Elements - Shown if many projects */}
          {/* Position adjusts based on number of projects for better spacing */}
          {projectsPicks && projectsPicks.length > 6 && (
            <>
              {/* Dots Pattern - Right side */}
              <Image
                className={`absolute ${projectsPicks.length > 18 ? 'top-[83rem]' : 'top-[49rem]'} left-[80%] z-0 hidden 1000px:block`}
                src={assetPaths.phase2.dots3}
                alt='Dots'
                width={247}
                height={247}
              />
              {/* Squiggle - Left side */}
              <Image
                className={`absolute ${projectsPicks.length > 18 ? 'top-[90rem]' : 'top-[55rem]'} left-[10%] z-0 hidden 1000px:block`}
                src={assetPaths.phase2.squiggle2}
                alt='Squiggle'
                width={289}
                height={31}
              />
            </>
          )}
        </div>

        {/* Attribution + Social Links - Mobile Only */}
        <div className='relative mb-20 block w-full 1000px:hidden'>
          {/* Attribution Text */}
          <div className='w-full border-b border-magentaDD pb-4 font-ob text-xl text-magentaDD'>
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

          {/* Social Media Links */}
          <div className='absolute right-4 top-4 scale-150'>
            <a target='_blank' rel='noreferrer' href={externalLinks.twitter}>
              <Image
                className='inline hover:scale-105'
                src={assetPaths.icons.twitter}
                alt='Twitter'
                width={24}
                height={20}
              />
            </a>
            <a target='_blank' rel='noreferrer' href={externalLinks.github}>
              <Image
                className='ml-3 inline h-[23px] w-[23px] hover:scale-105'
                src={assetPaths.icons.github}
                alt='Twitter'
                width={24}
                height={24}
              />
            </a>
          </div>
        </div>

        {/* "Check Results" Button - Mobile Only */}
        {/* Anchor link scrolls to leaderboard section */}
        <a
          href='#leaderboard'
          className='button1-down mx-auto block w-[21rem] self-center text-2xl 600px:w-[26rem] 600px:text-3xl 1000px:mx-0 1000px:hidden 1000px:self-start'
        >
          {contentText.phase3.checkResultsButton}
        </a>

        {/* Divider - Mobile Only */}
        <div className='mx-auto mb-8 mt-32 h-[6px] w-72 rounded-full bg-[#ACBBC2] opacity-40 1000px:hidden' />

        {/* Leaderboard Section */}
        <div id='leaderboard' className='z-10 m-auto mb-20 mt-12 text-center 1000px:mt-32'>
          {/* Leaderboard Title */}
          <h3 className='mb-6 text-2xl 600px:text-3xl 800px:mb-10 1000px:text-[2.6rem]'>
            {contentText.phase3.leaderboardTitle}
          </h3>

          {/* Leaderboard Description */}
          {/* Preserves line breaks from config text */}
          <div className='m-auto mb-10 font-ibm text-base 600px:text-lg 800px:text-xl 1000px:px-[13%] 1800px:text-2xl'>
            {contentText.phase3.leaderboardDescription.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < contentText.phase3.leaderboardDescription.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Project Cards Grid - Leaderboard */}
        <div className={`flex flex-wrap justify-center gap-6 pb-16 700px:gap-10`}>
          {!projectsPicks ? (
            // Loading state
            <h4 className='mb-20 text-5xl'>{contentText.phase3.loadingProjects}</h4>
          ) : (
            // Render all projects in ranked order
            // Projects already sorted by currentScore (highest first)
            projectsPicks.map((project, index) => (
              <Project
                key={index}
                index={index}
                id={project._id}
                name={project.projectName}
                desc={project.projectDescription}
                website={project.website}
                paddress={project.address}
                icon={project.icon}
                points={project.currentScore || 0} // Total votes received
                usdcAmount={project.usdcAmount || 0} // Pre-calculated amount (not currently used)
                setPopupStatus={setPopupStatus}
                setPopupDetails={setPopupDetails}
                votedProjects={votedProjects} // User's voted projects for highlighting
                walletStatus={walletStatus}
                pointsSum={pointsSum} // Total for percentage calculation
              />
            ))
          )}
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
          <a target='_blank' rel='noreferrer' href={externalLinks.github}>
            <Image
              className='ml-8 inline h-[23px] w-[23px] scale-150 hover:scale-[155%]'
              src={assetPaths.icons.github}
              alt='Twitter'
              width={24}
              height={24}
            />
          </a>
        </div>
      </footer>

      {/* Project Details Popup */}
      <ProjectPopup popupStatus={popupStatus} setPopupStatus={setPopupStatus} popupDetails={popupDetails} />
    </>
  )
}

export default Phase3
