/**
 * PHASE 1 COMPONENT - PROJECT NOMINATION
 *
 * This is the first phase of the DAO Drops application where users can nominate
 * projects or individuals deserving retroactive funding from the Ethereum ecosystem.
 *
 * FEATURES:
 * - Background video with animated elements
 * - Countdown timer showing time remaining until phase ends
 * - "Nominate Them" button to open nomination form popup
 * - Automatic phase transition when countdown completes
 * - FAQ link for user guidance
 * - Social media links (Twitter, GitHub)
 * - Attribution to dOrg and Ethereum Foundation
 *
 * CUSTOMIZATION POINTS:
 * - All text content: Edit src/config.tsx under contentText.phase1
 * - Background video: Replace files in public/assets/video/
 * - Background images: Replace files in public/assets/phase1/
 * - Phase end date: Edit src/config.tsx under phases.phase1End
 * - External links: Edit src/config.tsx under externalLinks
 * - Styling: Edit globals.css (.phase1-bg classes) and Tailwind classes
 *
 * STATE MANAGEMENT:
 * - errorPopupStatus: Shows error popup when nomination submission fails
 * - isVideoLoaded: Controls smooth transition from thumbnail to video
 * - popupStatus: Controls nomination popup visibility ('hidden' | 'nominate' | 'submitted')
 * - countdownCompleted: Triggers phase transition when countdown reaches zero
 * - height: Dynamic height calculation for responsive layout
 *
 * PHASE TRANSITION:
 * - When countdown completes, automatically switches to 'p' (Pause phase)
 * - This is triggered by the countdownCompleted state change
 * - Change target phase in the useEffect if needed
 */

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import NominatePopup from './NominatePopup'
import ErrorPopup from '../ErrorPopup'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import { Phase1Props } from '@/types/types'
import { externalLinks, phases, assetPaths, contentText } from '@/config'

/**
 * Phase 1 Component - Nomination Phase
 */
const Phase1: React.FC<Phase1Props> = ({ setPhaseView }) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * errorPopupStatus: Controls visibility of error popup
   * Shown when nomination submission fails (server error)
   */
  const [errorPopupStatus, setErrorPopupStatus] = useState(false)

  /**
   * isVideoLoaded: Tracks video load state for smooth transition
   * - false: Show thumbnail image
   * - true: Show video (fade in)
   */
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  /**
   * isMounted: Prevents hydration mismatch by only rendering countdown on client
   */
  const [isMounted, setIsMounted] = useState(false)

  /**
   * popupStatus: Controls nomination popup state
   * - 'hidden': No popup shown
   * - 'nominate': Nomination form shown
   * - 'submitted': Success message shown
   */
  const [popupStatus, setPopupStatus] = useState('hidden')

  /**
   * countdownCompleted: Triggers phase transition
   * Set to true when countdown reaches zero
   */
  const [countdownCompleted, setCountdownCompleted] = useState(false)

  /**
   * phase1End: Countdown target date
   * CUSTOMIZATION: Edit in src/config.tsx under phases.phase1End
   *
   * For testing, you can uncomment the line below to set a shorter countdown:
   * const phase1End = Date.now() + 10000 // 10 seconds from now
   */
  const phase1End = phases.phase1End

  /**
   * height: Dynamic height for responsive layout
   * Used to calculate the video container height
   */
  const [height, setHeight] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  /**
   * Set isMounted to true on client side to prevent countdown hydration mismatch
   */
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Update height when footer dimensions change
  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight)
    }
  }, [height])

  /**
   * Handle phase transition when countdown completes
   *
   * CUSTOMIZATION:
   * - Change setPhaseView('p') to setPhaseView('2') to go directly to Phase 2
   * - Or change to setPhaseView('3') to go directly to Phase 3
   */
  useEffect(() => {
    if (countdownCompleted) {
      setPhaseView('p') // Switch to Pause phase
    }
  }, [countdownCompleted, setPhaseView])

  /**
   * Callback for countdown completion
   * Triggers the countdownCompleted state change
   */
  const handleComplete = () => {
    setCountdownCompleted(true)
  }

  // ============================================================================
  // COUNTDOWN RENDERER
  // ============================================================================

  /**
   * Custom countdown renderer
   *
   * Displays countdown in the format: DD days HH hours MM min SS sec
   * Shows empty span when completed (phase transition happens via useEffect)
   *
   * CUSTOMIZATION:
   * - Modify the JSX structure to change countdown appearance
   * - Change labels (days, hours, min, sec) in the countdown-text divs
   * - Adjust styling via CSS classes (.countdown-number, .countdown-text in globals.css)
   */
  const renderer = ({ formatted: { days, hours, minutes, seconds }, completed }: CountdownRenderProps) => {
    if (completed) {
      return <span> </span>
    } else {
      return (
        <span className='flex'>
          <span className='countdown-number'>
            {days}
            <div className='countdown-text'>days</div>
          </span>
          <span className='countdown-number'>
            {hours}
            <div className='countdown-text'>hours</div>
          </span>
          <span className='countdown-number'>
            {minutes}
            <div className='countdown-text'>min</div>
          </span>
          <span className='countdown-number mr-0'>
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
      {/* Main Phase 1 Container with background */}
      <div className='phase1-bg-mobile 1000px:phase1-bg h-screen px-[5%] pt-9 1000px:px-[10%]'>
        {/* FAQ Link - Top Right */}
        <a
          className='relative -top-3 z-20 flex justify-end font-ob text-xl font-semibold tracking-[4px] text-magentaDD hover:text-magentaDD4 1200px:right-[-8.5%]'
          href={externalLinks.faq}
          target='_blank'
          rel='noreferrer'
        >
          {contentText.common.faq}
        </a>

        {/* Main Content Area - Logo + Video Frame */}
        <div className='relative flex items-start'>
          {/* DAO Drops Logo - Left Side */}
          <Image src={assetPaths.logo} alt='DAO Drops Logo' className='z-10' width={49} height={408} />

          {/* Video/Image Frame with Border */}
          <div
            className='relative z-10 ml-8 !min-h-[31rem] w-full border-[6px] border-indigoDD 600px:ml-12'
            style={{ height: `calc(100vh - ${height + 105}px)` }}
          >
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
            {/* CUSTOMIZATION: Replace video files in public/assets/video/ */}
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
            {/* CUSTOMIZATION: Replace SVG/PNG files in public/assets/phase1/ and public/assets/particles/ */}

            {/* Animated Bubble - has .bubble-animation CSS in globals.css */}
            <Image
              className='bubble-animation absolute left-[8%] top-[-10%] z-20 w-[60%] min-w-[60vw] opacity-95 1000px:left-[18%] 1000px:top-[-25%] 1000px:min-w-[700px]'
              src={assetPaths.particles.bubble}
              alt='Bubble'
              width={1129}
              height={1156}
            />

            {/* Squiggle Decoration */}
            <Image
              className='absolute left-[40%] top-[111%] z-10 scale-75 600px:scale-100 1000px:left-[9%] 1000px:top-[20%]'
              src={assetPaths.phase1.squiggle}
              alt='Squiggle'
              width={241}
              height={27}
            />

            {/* Dots Pattern - Hidden on mobile */}
            <Image
              className='absolute right-[19%] top-[44%] z-10 hidden 1000px:block'
              src={assetPaths.phase1.dots}
              alt='Dots'
              width={218}
              height={217}
            />

            {/* Small Dots - Bottom left */}
            <Image
              className='absolute -bottom-32 left-[-4.5rem] z-0 scale-75 600px:scale-100 1000px:-bottom-1 1000px:left-[-3.125rem]'
              src={assetPaths.phase1.dotsSmall}
              alt='Dots'
              width={104}
              height={104}
            />

            {/* Countdown Container - Bottom of video frame */}
            <div className='absolute bottom-0 z-20 w-full 800px:w-auto'>
              {/* "Ends In" Label */}
              <div className='endsin-line flex h-10 w-48 items-center justify-center border-t-[6px] border-indigoDD bg-white font-ob text-lg font-bold uppercase'>
                <div className='absolute pb-0.5 text-[15px] uppercase'>{contentText.phase1.phaseLabel}</div>
              </div>

              {/* Countdown Timer Display */}
              <div className='flex h-[6.5rem] w-full items-center justify-center border-t-[6px] border-indigoDD bg-white font-obWide text-5xl font-extrabold 800px:w-[32rem] 800px:border-r-[6px]'>
                {isMounted && <Countdown date={phase1End} renderer={renderer} onComplete={handleComplete} />}
              </div>
            </div>
          </div>

          {/* Aqua Box Decoration - Bottom left of video frame */}
          <Image
            className='absolute -bottom-20 -left-7 z-0 scale-75 1000px:left-0 1000px:scale-100'
            src={assetPaths.phase1.aquaBox}
            alt='Aqua Box'
            width={304}
            height={153}
          />
        </div>

        {/* Footer Section - Attribution + CTA */}
        {/* This ref is used to calculate height for the video container */}
        <div className='flex flex-wrap pb-8 1000px:flex-nowrap 1000px:p-0' ref={ref}>
          {/* Attribution + Social Links - Left side on desktop */}
          <div className='relative order-2 mt-20 w-auto 1000px:order-1 1000px:mt-[6.25rem]'>
            {/* Attribution Text */}
            {/* CUSTOMIZATION: Edit text in src/config.tsx under contentText.attribution */}
            <div className='w-[19rem] border-b border-magentaDD pb-4 font-ob text-sm text-magentaDD'>
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
            {/* CUSTOMIZATION: Edit URLs in src/config.tsx under externalLinks */}
            <div className='relative inset-0 mt-2.5'>
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

          {/* Hero Text + CTA Button - Right side on desktop */}
          <div className='z-10 order-1 mt-32 1000px:order-2 1000px:ml-16 1000px:mt-7'>
            {/* Hero Heading */}
            {/* CUSTOMIZATION: Edit text in src/config.tsx under contentText.phase1.hero */}
            <h3 className='mb-6 text-3xl leading-10 600px:text-4xl 1000px:text-[calc(1.4rem+1vw)] h870px:text-[calc(1rem+1vw)]'>
              {contentText.phase1.hero}
            </h3>

            {/* Subtitle - Hidden on mobile */}
            {/* CUSTOMIZATION: Edit text in src/config.tsx under contentText.phase1.subtitle */}
            <div className='subtitle2 hidden text-[calc(0.4rem+1vw)] leading-snug 1000px:block'>
              {contentText.phase1.subtitle}
            </div>

            {/* CTA Button - Opens nomination popup */}
            {/* CUSTOMIZATION: Edit button text in src/config.tsx under contentText.phase1.ctaButton */}
            <div
              className='button1-small 600px:button1 h870px:button1-small mt-6 1000px:mb-8 1000px:mt-7'
              onClick={() => {
                setPopupStatus('nominate')
              }}
            >
              {contentText.phase1.ctaButton}
            </div>
          </div>
        </div>
      </div>

      {/* Nomination Popup - Controlled by popupStatus state */}
      <NominatePopup
        popupStatus={popupStatus}
        setPopupStatus={setPopupStatus}
        setErrorPopupStatus={setErrorPopupStatus}
      />

      {/* Error Popup - Shows when API submission fails */}
      {errorPopupStatus && <ErrorPopup errorPopupStatus={errorPopupStatus} setErrorPopupStatus={setErrorPopupStatus} />}
    </>
  )
}

export default Phase1
