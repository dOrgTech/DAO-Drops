/**
 * PAUSE PHASE COMPONENT
 *
 * This is a transition phase displayed between the main phases (1, 2, and 3).
 * It informs users to stay tuned for the next phase and directs them to social media for updates.
 *
 * WHEN IT'S SHOWN:
 * - Between Phase 1 and Phase 2 (after nominations are collected)
 * - Between Phase 2 and Phase 3 (after voting closes)
 * - Automatically triggered when countdown completes in Phase 1 or Phase 2
 *
 * FEATURES:
 * - Background video (same as Phase 1)
 * - Hero message explaining the pause
 * - Social media links for announcements (Twitter/X)
 * - FAQ link
 * - Attribution footer
 * - Decorative elements (bubble, squiggle, dots, aqua box)
 *
 * CUSTOMIZATION POINTS:
 * - All text content: Edit src/config.tsx under contentText.pause
 * - Background: Uses same assets as Phase 1 (phase1-bg class in globals.css)
 * - Social links: Edit src/config.tsx under externalLinks
 * - Remove this phase: Modify phase transition logic in Phase1/Phase2 components
 *
 * LAYOUT:
 * - Similar structure to Phase 1 but simplified (no countdown)
 * - Responsive layout with dynamic height calculation
 * - Video background with decorative overlays
 * - Mobile and desktop optimized spacing
 *
 * NOTE:
 * - This component has no interactive elements other than external links
 * - No wallet connection required
 * - Purely informational/transitional
 */

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { externalLinks, assetPaths, contentText } from '@/config'

/**
 * Pause Component - Transition Phase
 */
const Pause: React.FC = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * isVideoLoaded: Controls smooth transition from thumbnail to video
   */
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  /**
   * height: Dynamic height for responsive layout
   * Used to calculate video container height
   */
  const [height, setHeight] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  /**
   * Update height when footer dimensions change
   */
  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight)
    }
  }, [height])

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================

  return (
    <>
      {/* Main Container - Uses Phase 1 background */}
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

        {/* Main Content Area */}
        <div className='relative flex items-start'>
          {/* DAO Drops Logo - Left Side */}
          <Image src={assetPaths.logo} alt='DAO Drops Logo' className='z-10' width={49} height={408} />

          <div className='flex flex-col'>
            {/* Hero Text Section */}
            <div className='z-10 ml-8 mt-10 600px:ml-12'>
              {/* Hero Heading */}
              {/* CUSTOMIZATION: Edit in src/config.tsx contentText.pause.hero */}
              <h3 className='mb-6 text-3xl leading-10 600px:text-4xl 1000px:text-[calc(1.4rem+1vw)] h870px:text-[calc(1.1rem+1vw)]'>
                {contentText.pause.hero}
              </h3>

              {/* Pause Message with Social Link */}
              {/* CUSTOMIZATION: Edit in src/config.tsx contentText.pause */}
              <div className='font-obWide text-base font-medium leading-snug 1000px:w-[70%] 1000px:text-[calc(0.5rem+0.55vw)]'>
                {contentText.pause.message}&nbsp;
                {/* Twitter/X link for announcements */}
                <a
                  className='font-semibold text-magentaDD5 underline hover:text-magentaDD4'
                  href={externalLinks.twitter}
                  target='_blank'
                  rel='noreferrer'
                >
                  {contentText.pause.socialCallout}
                </a>
                &nbsp;{contentText.pause.announcement}
              </div>
            </div>

            {/* Video Frame - Same as Phase 1 but smaller */}
            <div
              className='relative z-10 ml-8 mt-14 !min-h-[20.5rem] w-auto border-[6px] border-indigoDD 600px:ml-12'
              style={{ height: `calc(100vh - ${height + 350}px)` }}
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

              {/* Decorative Elements - Same as Phase 1 */}

              {/* Animated Bubble */}
              <Image
                className='bubble-animation absolute left-[8%] top-[-10%] z-20 w-[50%] min-w-[60vw] opacity-95 1000px:left-[40%] 1000px:top-[-25%] 1000px:min-w-[600px]'
                src={assetPaths.particles.bubble}
                alt='Bubble'
                width={1129}
                height={1156}
              />

              {/* Squiggle Decoration */}
              <Image
                className='absolute left-[40%] top-[111%] z-10 scale-75 600px:scale-100 1000px:left-[9%] 1000px:top-[40%]'
                src={assetPaths.phase1.squiggle}
                alt='Squiggle'
                width={241}
                height={27}
              />

              {/* Dots Pattern - Hidden on mobile */}
              <Image
                className='absolute right-[8%] top-[-133px] z-10 hidden max-h-[60%] 1000px:block'
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
            </div>
          </div>

          {/* Aqua Box Decoration - Bottom left */}
          <Image
            className='absolute -bottom-20 -left-7 z-0 scale-75 1000px:left-0 1000px:scale-100'
            src={assetPaths.phase1.aquaBox}
            alt='Aqua Box'
            width={304}
            height={153}
          />
        </div>

        {/* Footer - Attribution + Social Links */}
        {/* This ref is used to calculate height for video container */}
        <div className='flex flex-wrap pb-8 1000px:flex-nowrap 1000px:p-0' ref={ref}>
          <div className='relative order-2 mt-44 w-auto 1000px:order-1 1000px:mt-[6.25rem]'>
            {/* Attribution Text */}
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
        </div>
      </div>
    </>
  )
}

export default Pause
