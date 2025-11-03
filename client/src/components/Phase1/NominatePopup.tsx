/**
 * NOMINATION POPUP COMPONENT (PHASE 1)
 *
 * This modal popup allows users to submit project/individual nominations for retroactive funding.
 * It includes form validation, Google reCAPTCHA protection, and success/error states.
 *
 * FEATURES:
 * - Multi-field nomination form (project name, description, website, contact)
 * - Character counter for description field (1000 char max)
 * - Contact method selector (Email, Twitter, Discord)
 * - Google reCAPTCHA v2 (invisible) for bot protection
 * - Terms & Conditions checkbox with link
 * - Success confirmation screen after submission
 * - Error handling with error popup fallback
 *
 * FORM FIELDS:
 * - Project Name: Required, max 256 characters
 * - Reason for Funding: Required, max 1000 characters (with counter)
 * - Website: Optional, max 2084 characters (URL max length)
 * - Contact Method: Required (dropdown: email, twitter, discord)
 * - Contact Value: Required, max 256 characters (validated by HTML5)
 * - Terms Acceptance: Required checkbox
 *
 * POPUP STATES (controlled by popupStatus prop):
 * - 'hidden': Popup not shown
 * - 'nominate': Nomination form displayed
 * - 'submitted': Success message displayed
 *
 * CUSTOMIZATION POINTS:
 * - All form text: Edit src/config.tsx under contentText.phase1 and contentText.forms.nominationForm
 * - API endpoint: Edit src/config.tsx under apiEndpoints.posts
 * - reCAPTCHA key: Set NEXT_PUBLIC_CAPTCHA_SITE_KEY in .env.local
 * - Popup background: Replace public/assets/phase1/popup-bg.png
 * - Form styling: Edit globals.css (.popup, input, textarea styles)
 *
 * BACKEND REQUIREMENTS:
 * - Endpoint: POST /posts
 * - Headers: { 'captcha-token': <token> }
 * - Body: { name, message, link, contactMethod, contact }
 * - Success Response: 201 Created
 * - Error Response: 500 Server Error
 */

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import axios from 'axios'
import ReCAPTCHA from 'react-google-recaptcha'
import { NominatePopupProps } from '@/types/types'
import { apiEndpoints, externalLinks, contentText, assetPaths } from '@/config'

/**
 * Nomination Popup Component
 */
const NominatePopup: React.FC<NominatePopupProps> = ({ popupStatus, setPopupStatus, setErrorPopupStatus }) => {
  // ============================================================================
  // CONFIGURATION
  // ============================================================================

  /**
   * Google reCAPTCHA site key from environment variable
   * SETUP: Get your site key from https://www.google.com/recaptcha/admin
   * Add to .env.local as NEXT_PUBLIC_CAPTCHA_SITE_KEY
   */
  const CAPTCHA_SITE_KEY = contentText.captchaSiteKey

  /**
   * Backend API endpoint for project submissions
   * CUSTOMIZATION: Edit in src/config.tsx under apiEndpoints.posts
   *
   * For testing errors, you can uncomment the line below:
   * const POSTS = 'https://httpstat.us/500' // Simulate 500 error
   */
  const POSTS = apiEndpoints.posts

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * Initial/empty project data structure
   */
  const newProject = { name: '', message: '', link: '', contactMethod: 'email', contact: '', image: null }

  /**
   * projectData: Form field values
   * Structure matches backend API requirements
   */
  const [projectData, setProjectData] = useState(newProject)

  /**
   * charCount: Remaining characters for description field
   * Starts at 1000, decreases as user types
   */
  const [charCount, setCharCount] = useState(1000)

  /**
   * Refs for reCAPTCHA and description textarea
   * - captchaRef: Used to trigger invisible reCAPTCHA on form submit
   * - descRef: Used for potential future text manipulation
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const captchaRef = useRef<any>(null)
  const descRef = useRef<HTMLTextAreaElement>(null)

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Submit nomination form to backend API
   *
   * FLOW:
   * 1. Prevent default form submission
   * 2. Execute reCAPTCHA challenge (invisible)
   * 3. Get captcha token
   * 4. Reset captcha for future use
   * 5. POST data to backend with captcha token in header
   * 6. On success (201): Show success message
   * 7. On server error (500): Show error popup
   * 8. On other errors: Log to console
   *
   * BACKEND REQUIREMENTS:
   * - Validate captcha token on backend
   * - Return 201 on successful creation
   * - Return 500 on server errors
   */
  const submitProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!captchaRef.current) return

    // Execute invisible reCAPTCHA
    const captchaToken = await captchaRef.current.executeAsync()
    captchaRef.current.reset()

    // Submit to backend
    axios
      .post(POSTS, projectData, { headers: { 'captcha-token': captchaToken } })
      .then((r) => {
        if (r.status === 201) {
          setPopupStatus('submitted') // Show success message
        }
      })
      .catch(function (error) {
        if (error.response && error.response.status === 500) {
          // Server error - show error popup
          setPopupStatus('hidden')
          setErrorPopupStatus(true)
        } else {
          // Other errors - log to console
          console.error('Error', error.message)
        }
      })
  }

  /**
   * Close popup when clicking outside (on overlay)
   * Also resets form data to initial state
   */
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setPopupStatus('hidden')
      setProjectData(newProject) // Reset form
    }
  }

  /**
   * Close popup when clicking X button
   * Also resets form data to initial state
   */
  const handleCloseClick = () => {
    setPopupStatus('hidden')
    setProjectData(newProject) // Reset form
  }

  // ============================================================================
  // COMPONENT RENDER
  // ============================================================================

  return (
    <>
      {/* NOMINATION FORM STATE */}
      {popupStatus === 'nominate' ? (
        <div
          className='fixed inset-0 z-30 flex items-center justify-center bg-popupOverlay'
          onClick={handleOverlayClick}
        >
          {/* Popup Container */}
          {/* CUSTOMIZATION: Popup styling in globals.css (.popup class) */}
          <div className='popup-mobile 800px:popup scale-[85%] 600px:scale-100'>
            {/* Close Button - Top Right */}
            <Image
              className='absolute right-3 top-3 cursor-pointer'
              src={assetPaths.icons.close}
              alt='Close Popup'
              onClick={handleCloseClick}
              width={44}
              height={45}
            />

            {/* Popup Content Area */}
            <div className='mt-[3.75rem] h-[calc(100%-3.75rem)] w-full rounded-t-[4.5rem] bg-white px-8 py-8 800px:px-16'>
              {/* Form Title with FAQ Link */}
              {/* CUSTOMIZATION: Edit text in src/config.tsx under contentText.phase1.nominationFormTitle */}
              <div className='mb-9 px-2 text-left font-ibm text-base font-bold 600px:text-lg 800px:px-4'>
                {contentText.phase1.nominationFormTitle}{' '}
                <a className='underline hover:text-indigoDD2' href={externalLinks.faq} target='_blank' rel='noreferrer'>
                  {contentText.common.faq}
                </a>
                .
              </div>

              <div className='flex'>
                {/* Nomination Form */}
                <form
                  className='mt-2 flex w-full flex-col font-ibm text-base font-bold 1000px:px-[10%]'
                  autoComplete='off'
                  onSubmit={submitProject}
                >
                  {/* Project Name Field - Required */}
                  <div className='mb-4 flex 800px:mb-0'>
                    <div className='flex w-full flex-col justify-end'>
                      <label htmlFor='project-name' className='required'>
                        {contentText.forms.nominationForm.projectNameLabel}
                      </label>
                      <input
                        className='mb-3 mt-1.5 h-10 w-full'
                        type='text'
                        id='project-name'
                        name='project-name'
                        maxLength={256}
                        value={projectData.name}
                        onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Reason for Funding Field - Required, with Character Counter */}
                  <span className='flex gap-3'>
                    <label htmlFor='funding-reason' className='required'>
                      {contentText.forms.nominationForm.reasonLabel}
                    </label>
                    {/* Character Counter - Shows remaining chars */}
                    <span className='my-auto ml-auto text-xs font-semibold text-gray4'>
                      {charCount} {contentText.forms.nominationForm.charLeft}
                    </span>
                  </span>
                  <textarea
                    ref={descRef}
                    className='mb-2 mt-1.5 h-28 w-full'
                    id='funding-reason'
                    name='funding-reason'
                    maxLength={1000}
                    value={projectData.message}
                    onChange={(e) => {
                      setProjectData({ ...projectData, message: e.target.value })
                      setCharCount(1000 - e.target.value.length) // Update counter
                    }}
                    required
                  />

                  {/* Website Field - Optional */}
                  {/* maxLength 2084 is the maximum URL length */}
                  <label htmlFor='website'>{contentText.forms.nominationForm.websiteLabel}</label>
                  <input
                    className='mb-3 mt-1.5 h-10 w-full'
                    type='text'
                    id='website'
                    name='website'
                    maxLength={2084}
                    value={projectData.link}
                    onChange={(e) => setProjectData({ ...projectData, link: e.target.value })}
                  />

                  {/* Contact Information - Required */}
                  {/* Dropdown + Text Input Combo */}
                  <label htmlFor='contact' className='required'>
                    {contentText.forms.nominationForm.contactLabel}
                  </label>
                  <div className='mb-6 mt-1.5 flex items-center'>
                    {/* Contact Method Dropdown */}
                    {/* CUSTOMIZATION: Edit options in src/config.tsx under contentText.forms.nominationForm.contactMethods */}
                    <select
                      className='mr-7 h-10 min-w-[9rem] rounded-[1.25rem] border border-gray3 px-7 font-bold text-gray5'
                      name='contact-method'
                      id='contact-method'
                      value={projectData.contactMethod}
                      onChange={(e) => setProjectData({ ...projectData, contactMethod: e.target.value })}
                    >
                      <option value='email'>{contentText.forms.nominationForm.contactMethods.email}</option>
                      <option value='twitter'>{contentText.forms.nominationForm.contactMethods.twitter}</option>
                      <option value='discord'>{contentText.forms.nominationForm.contactMethods.discord}</option>
                    </select>

                    {/* Contact Value Input - Placeholder changes based on selected method */}
                    <input
                      className='h-10 w-full'
                      type='text'
                      id='contact'
                      name='contact'
                      maxLength={256}
                      placeholder={
                        projectData.contactMethod === 'email'
                          ? contentText.forms.nominationForm.placeholders.email
                          : projectData.contactMethod === 'twitter'
                            ? contentText.forms.nominationForm.placeholders.twitter
                            : contentText.forms.nominationForm.placeholders.discord
                      }
                      value={projectData.contact}
                      onChange={(e) => setProjectData({ ...projectData, contact: e.target.value })}
                      required
                    />
                  </div>

                  {/* Google reCAPTCHA - Invisible */}
                  {/* Triggered on form submit via captchaRef.current.executeAsync() */}
                  <div className='recaptcha'>
                    <ReCAPTCHA sitekey={CAPTCHA_SITE_KEY} ref={captchaRef} size='invisible' />
                  </div>

                  {/* Terms Checkbox + Submit Button */}
                  <div className='flex items-center gap-3'>
                    <span>
                      {/* Terms & Conditions Checkbox - Required */}
                      <input type='checkbox' name='terms' id='terms' required />
                      <label htmlFor='terms' className='required ml-2'>
                        {contentText.forms.nominationForm.termsCheckbox}{' '}
                        <a target='_blank' rel='noreferrer' href={externalLinks.terms} className='underline'>
                          {' '}
                          {contentText.phase2.termsLink}
                        </a>
                      </label>
                    </span>
                    {/* Submit Button */}
                    {/* CUSTOMIZATION: Button styling in globals.css (.button2 class) */}
                    <button className='button2 ml-auto' type='submit'>
                      {contentText.forms.nominationForm.submitButton}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : popupStatus === 'submitted' ? (
        /* SUCCESS MESSAGE STATE */
        <div
          className='fixed inset-0 z-30 flex items-center justify-center bg-popupOverlay'
          onClick={handleOverlayClick}
        >
          {/* Popup Container - Different background position for success state */}
          <div
            className='popup-mobile 800px:popup scale-[85%] 600px:scale-100'
            style={{ backgroundPosition: '0 -75px' }}
          >
            {/* Close Button - Top Right */}
            <Image
              className='absolute right-3 top-3 cursor-pointer'
              src={assetPaths.icons.close}
              alt='Close Popup'
              onClick={handleCloseClick}
              width={44}
              height={45}
            />

            {/* Success Message Content */}
            <div className='mt-[10rem] h-[calc(100%-10rem)] w-full rounded-t-[4.5rem] bg-white px-12 py-8 800px:px-16'>
              <div className='my-16 flex flex-col items-center justify-center 1000px:my-[100px]'>
                {/* Success Title */}
                {/* CUSTOMIZATION: Edit text in src/config.tsx under contentText.phase1.success* */}
                <h3 className='mb-14 text-center font-ibm text-3xl font-bold leading-[2.7rem] 800px:font-obWide 800px:font-semibold'>
                  {contentText.phase1.successTitle}
                  <br />
                  {contentText.phase1.successSubtitle}
                </h3>

                {/* Success Message */}
                <div className='text-center font-ibm text-xl font-semibold text-gray6'>
                  {contentText.phase1.successMessage}
                </div>

                {/* Social Media Callout - Encourages sharing */}
                <div className='mt-1 text-center'>
                  <a target='_blank' rel='noreferrer' href={externalLinks.twitter}>
                    <div className='mb-2 font-ibm text-xl font-semibold text-magentaDD2 underline hover:text-magentaDD3'>
                      {contentText.phase1.socialCallout}
                    </div>
                    <Image
                      className='inline hover:scale-105'
                      src={assetPaths.icons.twitter2}
                      alt='Twitter'
                      width={24}
                      height={20}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* When popupStatus === 'hidden', render nothing */}
    </>
  )
}

export default NominatePopup
