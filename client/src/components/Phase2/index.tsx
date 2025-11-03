/**
 * PHASE 2 COMPONENT - VOTING & POINT ALLOCATION
 *
 * This is the voting phase where connected wallet users distribute their allocated vote credits
 * among nominated projects using a quadratic voting style interface with increment/decrement controls.
 *
 * KEY FEATURES:
 * - Wallet connection requirement (via Header component)
 * - Project list fetched from backend API
 * - Vote allocation interface with +/- controls on each project card
 * - LocalStorage persistence for draft votes
 * - Vote submission to backend with web3-token authentication
 * - Countdown timer for phase end
 * - Automatic phase transition when countdown completes
 * - Responsive layout with background video
 * - "Your Drops" section showing voted projects (after submission)
 * - "Other Nominees" section showing unvoted projects
 *
 * USER FLOW:
 * 1. User arrives at Phase 2 page
 * 2. If not connected: Shows "Connect Wallet" CTA
 * 3. User connects wallet (handled by Header component)
 * 4. Backend returns user's point balance
 * 5. User allocates points to projects using +/- buttons
 * 6. Votes saved to localStorage in real-time (draft saving)
 * 7. User clicks "Submit" in Header
 * 8. Votes sent to backend via POST request with auth token
 * 9. On success: Shows submitted votes in "Your Drops" section
 * 10. User can continue editing and resubmit
 *
 * CUSTOMIZATION POINTS:
 * - All text content: Edit src/config.tsx under contentText.phase2
 * - API endpoints: Edit src/config.tsx under apiEndpoints
 * - Background assets: Replace files in public/assets/phase2/
 * - Phase end date: Edit src/config.tsx under phases.phase2End
 * - Project card colors: Edit src/config.tsx under appConfig.projectColors
 * - Footer links: Edit src/config.tsx under externalLinks
 *
 * STATE MANAGEMENT:
 * - projectsPicks: List of projects fetched from backend
 * - votes: Object mapping project IDs to allocated points { projectId: points }
 * - points: User's remaining vote credits
 * - votesSubmitted: 'true' | 'false' string indicating if user has submitted
 * - popupStatus: Controls project details popup visibility
 * - popupDetails: Data for currently viewed project in popup
 *
 * LOCALSTORAGE KEYS:
 * - votes_{address}: Draft vote allocations
 * - Cleared on disconnect (handled in parent component)
 *
 * BACKEND REQUIREMENTS:
 * - GET /posts/picks: Returns array of Project objects
 * - PATCH /posts/score/:id: Accepts { account, score, picks, message } with token in body
 * - GET /posts/score/:address: Returns { score, picks, _id } for loading saved votes
 */

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from './Header'
import Project from './Project'
import ProjectPopup from './ProjectPopup'
import ErrorPopup from '../ErrorPopup'
import { shuffle } from '@/utils'
import { Phase2Props, Project as ProjectType, PopupDetails } from '@/types/types'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import axios from 'axios'
import { apiEndpoints, externalLinks, phases, assetPaths, contentText } from '@/config'

/**
 * Phase 2 Component - Voting Phase
 */
const Phase2: React.FC<Phase2Props> = ({
  loadWeb3, // Function to connect wallet
  disconnectWeb3, // Function to disconnect wallet
  signer, // Ethers.js signer for signing transactions
  address, // Connected wallet address
  addressDetails, // User's vote data from backend (score, picks)
  walletStatus, // Connection status ('disconnected' | 'connecting' | 'connected')
  points, // Remaining vote credits
  setPoints, // Update points state
  votes, // Current vote allocations
  setVotes, // Update votes state
  setPhaseView, // Switch to different phase
}) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * errorPopupStatus: Shows error popup when vote submission fails
   */
  const [errorPopupStatus, setErrorPopupStatus] = useState(false)

  /**
   * countdownCompleted: Triggers phase transition when countdown reaches zero
   */
  const [countdownCompleted, setCountdownCompleted] = useState(false)

  /**
   * isVideoLoaded: Controls smooth transition from thumbnail to video
   */
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  /**
   * isMounted: Prevents hydration mismatch by only rendering countdown on client
   */
  const [isMounted, setIsMounted] = useState(false)

  /**
   * popupStatus: Controls project details popup ('hidden' | project index)
   */
  const [popupStatus, setPopupStatus] = useState('hidden')

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
   * projectsPicks: Array of projects available for voting
   * Fetched from backend and shuffled for fair display order
   */
  const [projectsPicks, setProjectsPicks] = useState<ProjectType[]>()

  /**
   * votesSubmitted: String boolean indicating if user has submitted votes
   * 'true' = votes submitted, 'false' = not submitted yet
   * Controls layout: shows "Your Drops" and "Other Nominees" sections when 'true'
   */
  const [votesSubmitted, setVotesSubmitted] = useState('false')

  /**
   * phase2End: Countdown target date
   * CUSTOMIZATION: Edit in src/config.tsx under phases.phase2End
   * For testing: uncomment line below to set 10-second countdown
   */
  const phase2End = phases.phase2End
  // const phase2End = Date.now() + 10000

  // ============================================================================
  // CLIENT-SIDE MOUNT DETECTION
  // ============================================================================

  /**
   * Set isMounted to true on client side to prevent countdown hydration mismatch
   */
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // ============================================================================
  // DATA LOADING - Projects and Votes
  // ============================================================================

  /**
   * Load projects from backend and initialize votes
   *
   * FLOW:
   * 1. Fetch projects from backend API (GET /posts/picks)
   * 2. Shuffle projects for fair display order (prevents bias towards first items)
   * 3. Check localStorage for saved draft votes for this address
   * 4. If draft votes exist: restore them
   * 5. If no draft votes but addressDetails has picks: load from API
   * 6. If no draft votes and no picks: initialize all projects with 0 votes
   *
   * RUNS:
   * - On component mount
   * - When address changes (wallet connects/switches)
   * - When addressDetails changes (after API loads user data)
   *
   * CUSTOMIZATION:
   * - To show projects in a different order, modify shuffle logic
   * - Commented lines show alternative sorting methods (random, alphabetical)
   */
  useEffect(() => {
    axios
      .get<ProjectType[]>(apiEndpoints.picks)
      .then((r) => {
        // Alternative sorting methods (commented out):
        // let randomProjects = r.data.sort(() => Math.random() - 0.5)
        // let sortedProjects = r.data.sort((a, b) => a.address.localeCompare(b.address))

        // Create a copy of projects and shuffle them
        const projects = r.data.map((a) => ({ ...a }))
        shuffle(projects) // Custom shuffle from utils.ts

        // Restore or initialize votes for connected wallet
        if (address) {
          const votesStorage = localStorage.getItem(`votes_${address}`)
          if (votesStorage) {
            // Restore saved draft votes from localStorage
            setVotes(JSON.parse(votesStorage))
          } else if (addressDetails !== 'none' && addressDetails.picks && addressDetails.picks.length > 0) {
            // Load submitted votes from backend API
            const votesFromApi: Record<string, number> = {}
            // Initialize all projects with 0
            r.data.forEach((project) => {
              votesFromApi[project._id] = 0
            })
            // Set votes from picks array
            addressDetails.picks.forEach((pick) => {
              votesFromApi[pick.id] = pick.points
            })
            setVotes(votesFromApi)
          } else {
            // Initialize all projects with 0 votes
            r.data.forEach((project) => setVotes((votes) => ({ ...votes, [project._id]: 0 })))
          }
        }

        setProjectsPicks(projects)
      })
      .catch((e) => console.error(e))
  }, [address, addressDetails, setVotes])

  // ============================================================================
  // PHASE TRANSITION
  // ============================================================================

  /**
   * Handle phase transition when countdown completes
   * Switches to Pause phase ('p')
   *
   * CUSTOMIZATION:
   * - Change 'p' to '3' to go directly to Phase 3 (Results)
   */
  useEffect(() => {
    if (countdownCompleted) {
      setPhaseView('p')
    }
  }, [countdownCompleted, setPhaseView])

  const handleComplete = () => {
    setCountdownCompleted(true)
  }

  // ============================================================================
  // COUNTDOWN RENDERER
  // ============================================================================

  /**
   * Custom countdown renderer for Phase 2
   * Similar to Phase 1 but with different styling (.countdown-number2)
   *
   * CUSTOMIZATION:
   * - Modify JSX/classes to change appearance
   * - Labels defined inline (days, hours, min, sec)
   */
  const renderer = ({ formatted: { days, hours, minutes, seconds }, completed }: CountdownRenderProps) => {
    if (completed) {
      return <div> </div>
    } else {
      return (
        <span className='flex'>
          <span className='countdown-number2 mr-5'>
            {days}
            <div className='countdown-text'>days</div>
          </span>
          <span className='countdown-number2 mr-5'>
            {hours}
            <div className='countdown-text'>hours</div>
          </span>
          <span className='countdown-number2 mr-5'>
            {minutes}
            <div className='countdown-text'>min</div>
          </span>
          <span className='countdown-number2'>
            {seconds}
            <div className='countdown-text'>sec</div>
          </span>
        </span>
      )
    }
  }

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================

  return (
    <>
      {/* Main Container - Phase 2 background */}
      <div className='phase2-bg px-[5%] 1000px:px-[10%]'>
        {/* Header with wallet connection and submit controls */}
        <Header
          loadWeb3={loadWeb3}
          disconnectWeb3={disconnectWeb3}
          signer={signer}
          address={address}
          addressDetails={addressDetails}
          walletStatus={walletStatus}
          points={points}
          votes={votes}
          setVotesSubmitted={setVotesSubmitted}
          votesSubmitted={votesSubmitted}
          setErrorPopupStatus={setErrorPopupStatus}
        />

        {/* Main Content Area - Logo + Video Frame + Countdown */}
        {/* Padding adjusts based on wallet status (fixed header when connected) */}
        <div
          className={`relative flex items-start ${
            walletStatus === 'connected'
              ? 'mt-0 pt-[6.85rem] 700px:pt-[8.2rem] 1000px:pt-[4.375rem]' // Extra padding for fixed header
              : 'mt-8 700px:mt-12 1000px:mt-2'
          }`}
        >
          {/* DAO Drops Logo - Left Side */}
          <Image className='mt-6 700px:mt-0' src={assetPaths.logo} alt='DAO Drops Logo' width={49} height={408} />

          {/* Video Frame with Border */}
          <div className='relative z-10 ml-12 mt-16 !min-h-[30rem] w-full border-[6px] border-indigoDD 1000px:mt-32 1000px:h-[calc(100vh-500px)] 1000px:!max-h-[38rem] 1000px:!min-h-[21rem]'>
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

            {/* Decorative Elements - Overlaid on video */}

            {/* Animated Bubble */}
            <Image
              className='bubble-animation absolute left-[10%] top-[10%] z-20 w-[50%] min-w-[55vw] opacity-95 800px:left-[15%] 800px:top-[-25%] 1000px:left-[32%] 1000px:top-[-45%] 1000px:min-w-[700px]'
              src={assetPaths.particles.bubble}
              alt='Bubble'
              width={1129}
              height={1156}
            />

            {/* Squiggle - Hidden on mobile */}
            <Image
              className='absolute left-[5%] top-[20%] z-20 hidden 1000px:block'
              src={assetPaths.phase1.squiggle}
              alt='Squiggle'
              width={241}
              height={27}
            />

            {/* Dots Pattern - Hidden on mobile */}
            <Image
              className='absolute right-[23%] top-[34%] z-10 hidden 1000px:block'
              src={assetPaths.phase1.dots}
              alt='Dots'
              width={218}
              height={217}
            />

            {/* Small Dots - Always visible */}
            <Image
              className='absolute -left-10 top-14 z-0'
              src={assetPaths.phase1.dotsSmall}
              alt='Dots'
              width={104}
              height={104}
            />

            {/* Additional Dots - Phase 2 specific, far left */}
            <Image
              className='absolute -left-60 top-[51rem] z-10 hidden 1000px:block'
              src={assetPaths.phase2.dots2}
              alt='Dots'
              width={150}
              height={150}
            />

            {/* Countdown Container - Top left of video frame */}
            <div className='absolute left-[-6.7rem] top-[-5.5rem] z-20 scale-75 700px:-left-10 700px:-top-24 700px:scale-100 1000px:-left-1.5'>
              {/* "Ends In" Label with decorative line */}
              <div className='endsin-line phase2 flex h-10 w-48 items-center justify-center border-l-[6px] border-t-[6px] border-indigoDD bg-white font-ob text-lg font-bold uppercase'>
                <div className='absolute pb-1 pl-1 text-[15px] uppercase'>{contentText.phase2.phaseLabel}</div>
              </div>

              {/* Countdown Timer Display */}
              <div className='flex h-[6.5rem] w-[31rem] items-center justify-center border-[7px] border-indigoDD bg-white font-obWide text-5xl font-extrabold 700px:w-[32rem] 700px:border-[6px]'>
                {isMounted && <Countdown date={phase2End} renderer={renderer} onComplete={handleComplete} />}
              </div>
            </div>
          </div>

          {/* Aqua Box Decorations - Bottom right of video frame */}
          {/* Different sizes for mobile and desktop */}
          <Image
            className='absolute bottom-[-9.125rem] right-[-1px] z-0 hidden scale-100 1000px:block'
            src={assetPaths.phase1.aquaBox}
            alt='Aqua Box'
            width={304}
            height={153}
          />
          <Image
            className='absolute bottom-[-11.1rem] right-[9px] z-0 block scale-125 1000px:hidden'
            src={assetPaths.phase2.aquaBoxMobile}
            alt='Aqua Box'
            width={68}
            height={162}
          />
        </div>

        {/* Hero Section + Attribution */}
        <div className='relative flex justify-between pb-8 1000px:ml-24 1000px:p-0'>
          {/* Hero Text - Changes based on wallet status */}
          {walletStatus === 'connected' ? (
            // CONNECTED STATE - Show welcome message + CTA button
            <div className='flex flex-col'>
              <div className='z-10 mt-4 pl-8 pr-[6.3rem] 1000px:mt-10 1000px:pl-0 1000px:pr-6'>
                {/* Hero Heading - "You are now part of the DAO" */}
                <h3 className='mb-5 text-3xl 600px:text-4xl 700px:mb-8 1000px:text-[calc(1.4rem+1vw)] h870px:text-[calc(1.15rem+1vw)]'>
                  {contentText.phase2.heroConnected}
                </h3>
                {/* Hero Subtitle */}
                <div className='subtitle2 mb-14 text-[calc(0.7rem+1vw)] leading-6 800px:leading-7 1000px:mb-10 1000px:leading-8 1200px:leading-10'>
                  {contentText.phase2.heroSubtitle}
                </div>
              </div>
              {/* "Drop Points" Button - Scrolls to voting section */}
              <a
                href='#drop-points'
                className='button1-down mx-auto block w-[24rem] self-center text-3xl 1000px:mx-0 1000px:self-start'
              >
                {contentText.phase2.ctaButton}
              </a>
            </div>
          ) : (
            // DISCONNECTED STATE - Show connection prompt
            <div className='z-10 mt-4 pl-8 pr-[6.3rem] 1000px:mt-10 1000px:pl-0 1000px:pr-6'>
              {/* Hero Heading - Prompts connection */}
              <h3 className='mb-6 text-3xl 600px:text-4xl 1000px:text-[calc(1.4rem+1vw)]'>
                {contentText.phase2.heroDisconnected}
              </h3>
              {/* Hero Subtitle - Explains next steps */}
              <div className='subtitle2 text-[calc(0.75rem+1vw)] leading-6 800px:leading-7 1000px:text-[calc(0.65rem+1vw)] 1000px:leading-8 1200px:leading-10'>
                {contentText.phase2.heroDisconnectedSubtitle}
              </div>
            </div>
          )}

          {/* Attribution + Social Links - Desktop Only */}
          <div className='relative right-0 mt-[10.5rem] hidden 1000px:block'>
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
          {/* Position adjusts based on number of projects */}
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

        {/* WALLET NOT CONNECTED - Show large "Connect Wallet" CTA */}
        {walletStatus !== 'connected' ? (
          <>
            {/* "To Play" Box with Connect Button */}
            <div className='mb-20 mt-16 flex justify-center 1000px:mb-32 1200px:mt-12'>
              <div className='relative z-10 w-full 800px:w-auto'>
                {/* "To Play" Label with decorative line */}
                <div className='endsin-line toplay flex h-10 w-32 items-center justify-center border-l-[6px] border-t-[6px] border-indigoDD bg-white font-ob text-lg font-bold uppercase'>
                  <div className='absolute pb-1'>{contentText.phase2.toPlayLabel}</div>
                </div>

                {/* Connect Wallet Button Container */}
                <div className='flex h-[7.5rem] w-full items-center justify-center border-[6px] border-indigoDD bg-white font-obWide text-5xl font-extrabold 800px:h-[8.5rem] 800px:w-[43rem]'>
                  <div
                    className='button1-small 800px:button1 w-[24rem] text-[1.5rem] 800px:w-[32rem] 800px:text-[2rem]'
                    onClick={() => loadWeb3('click')}
                  >
                    {contentText.phase2.connectWalletButton}
                  </div>
                </div>
              </div>
            </div>

            {/* Attribution + Social - Mobile Only (when not connected) */}
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

              {/* Social Media Link - Twitter only on mobile */}
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
              </div>

              {/* Divider */}
              <div className='mx-auto mb-8 mt-16 h-[6px] w-72 rounded-full bg-[#ACBBC2] opacity-40'></div>
            </div>
          </>
        ) : (
          // WALLET CONNECTED - Show "How To" instructions
          <div id='drop-points' className='z-10 m-auto mb-20 mt-12 text-center 1000px:mt-[6.5rem]'>
            {/* "How To" Title */}
            <h3 className='mb-6 text-2xl 600px:text-3xl 800px:mb-10 1000px:text-[2.6rem]'>
              {contentText.phase2.howToTitle}
            </h3>

            {/* "How To" Description - Preserves line breaks */}
            <div className='m-auto mb-10 font-ibm text-base 600px:text-lg 800px:text-xl 1000px:px-[13%] 1800px:text-2xl'>
              {contentText.phase2.howToDescription.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < contentText.phase2.howToDescription.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </div>

            {/* Divider - Mobile only */}
            <div className='mx-auto mb-8 mt-16 h-[6px] w-72 rounded-full bg-[#ACBBC2] opacity-40 1000px:hidden' />
          </div>
        )}

        {/* "YOUR DROPS" SECTION - Only shown after votes submitted */}
        {votesSubmitted === 'true' && (
          <>
            <h3 className='my-12 text-center text-2xl 600px:text-3xl 1000px:mb-14 1000px:mt-32 1000px:text-left 1000px:text-[2.3rem]'>
              {contentText.phase2.yourDropsTitle}
            </h3>

            {/* Project Cards - Only projects user voted for */}
            {/* Disabled (grayscale) if wallet disconnected */}
            <div
              className={`flex flex-wrap justify-center gap-6 pb-16 700px:gap-10 ${
                walletStatus !== 'connected' && 'pointer-events-none grayscale'
              } `}
            >
              {projectsPicks ? (
                // Filter to show only projects with votes > 0
                projectsPicks
                  .filter((project) => votes && votes[project._id] > 0)
                  .map((project, index) => (
                    <Project
                      key={index}
                      index={index}
                      id={project._id}
                      name={project.projectName}
                      desc={project.projectDescription}
                      website={project.website}
                      paddress={project.address}
                      icon={project.icon}
                      setPopupStatus={setPopupStatus}
                      setPopupDetails={setPopupDetails}
                      setVotes={setVotes}
                      votes={votes}
                      points={points}
                      setPoints={setPoints}
                      votesSubmitted={votesSubmitted}
                      address={address}
                    />
                  ))
              ) : (
                // Loading state
                <h4 className='mb-20 text-5xl'>{contentText.phase2.loadingDrops}</h4>
              )}
            </div>
          </>
        )}

        {/* "OTHER NOMINEES" SECTION TITLE - Only shown after votes submitted */}
        {votesSubmitted === 'true' && (
          <h3 className='mb-12 mt-16 text-center text-2xl 600px:text-3xl 1000px:mb-14 1000px:mt-16 1000px:text-left 1000px:text-[2.3rem]'>
            {contentText.phase2.otherNomineesTitle}
          </h3>
        )}

        {/* ALL PROJECTS SECTION */}
        {/* Shows all projects if not submitted, or unvoted projects if submitted */}
        {/* Disabled (grayscale) if wallet disconnected */}
        <div
          className={`flex flex-wrap justify-center gap-6 pb-16 700px:gap-10 ${
            walletStatus !== 'connected' && 'pointer-events-none grayscale'
          } `}
        >
          {projectsPicks ? (
            // Filter logic:
            // - If votes submitted: Show only projects with 0 votes (unvoted)
            // - If not submitted: Show all projects
            projectsPicks
              .filter((project) => (votes && votesSubmitted === 'true' ? votes[project._id] === 0 : project._id))
              .map((project, index) => (
                <Project
                  key={index}
                  index={index}
                  id={project._id}
                  name={project.projectName}
                  desc={project.projectDescription}
                  website={project.website}
                  paddress={project.address}
                  icon={project.icon}
                  setPopupStatus={setPopupStatus}
                  setPopupDetails={setPopupDetails}
                  setVotes={setVotes}
                  votes={votes}
                  points={points}
                  setPoints={setPoints}
                  votesSubmitted={votesSubmitted}
                  address={address}
                />
              ))
          ) : (
            // Loading state - Different message based on submission status
            <h4 className='mb-20 text-5xl'>
              {votesSubmitted === 'true' ? contentText.phase2.loadingOtherNominees : contentText.phase2.loadingProjects}
            </h4>
          )}
        </div>
      </div>

      {/* Footer - Same as Phase 3 */}
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
      <ProjectPopup
        popupStatus={popupStatus}
        setPopupStatus={setPopupStatus}
        popupDetails={popupDetails}
        setVotes={setVotes}
        votes={votes}
        points={points}
        setPoints={setPoints}
        votesSubmitted={votesSubmitted}
      />

      {/* Error Popup - Shown when vote submission fails */}
      {errorPopupStatus && <ErrorPopup errorPopupStatus={errorPopupStatus} setErrorPopupStatus={setErrorPopupStatus} />}
    </>
  )
}

export default Phase2
