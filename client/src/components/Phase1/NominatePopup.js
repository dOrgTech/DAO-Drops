import React, { useState, useRef } from 'react'
import axios from 'axios'
import ReCAPTCHA from 'react-google-recaptcha'
import * as constants from '../../Constants'
import * as dotenv from 'dotenv'

import twitter from '../../assets/icons/twitter2.svg'
import closeIcon from '../../assets/icons/close.svg'

dotenv.config()


// Nominate Popup Component (Phase1)
// ------------------------------------------------------------------------------------------------------- //
const NominatePopup = ({ popupStatus, setPopupStatus }) => {

    const CAPTCHA_SITE_KEY = process.env.REACT_APP_CAPTCHA_SITE_KEY
    const POSTS = 'https://dao-drops.herokuapp.com/posts'

    const newProject = { name: '', message: '', link: '', contactMethod: 'email', contact: '', image: null }
    const [projectData, setProjectData] = useState(newProject)
    const captchaRef = useRef(null)

    const submitProject = async e => {
      e.preventDefault()
      const captchaToken = await captchaRef.current.executeAsync()
      captchaRef.current.reset()
      axios.post(POSTS, projectData, { headers: { 'captcha-token': captchaToken }})
            .then(r => { r.status === 201 && setPopupStatus('submitted')} )
            .catch(e => console.error(e))
    };
  
    return (
      <>
        { popupStatus === 'nominate' 
          ? <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay z-30' id='popup-overlay' 
                 onClick={(e) => e.target === document.querySelector('#popup-overlay') ? (document.querySelector('#popup-overlay').style.display = 'none', setPopupStatus('hidden'), setProjectData(newProject)) : null}>
                    
              <div className='popup-mobile 800px:popup scale-[85%] 600px:scale-100'>
                <img className='absolute right-3 top-3 cursor-pointer hover:brightness-75' src={closeIcon} alt='Close Popup' onClick={() => {document.querySelector('#popup-overlay').style.display = 'none'; setPopupStatus('hidden'); setProjectData(newProject); }} />
                <div className='rounded-t-[4.5rem] mt-[3.75rem] px-8 800px:px-16 py-8 bg-white w-full h-[calc(100%-3.75rem)]'>
                  <div className='font-ibm font-bold text-base 600px:text-lg text-left mb-9 px-2 800px:px-4'>Hello! Please nominate a project or individual that you think should receive retroactive funding for their contributions to the Ethereum Ecosystem. For more info on eligibility, you can see the <a className='underline hover:text-indigoDD2' href={constants.FAQ} target='_blank' rel='noreferrer'>FAQ</a>.</div>

                  <div className='flex'>

                    <form className='flex flex-col 1000px:px-[10%] w-full mt-2 font-ibm font-bold text-base' autoComplete='off' onSubmit={submitProject}>

                      <div className='flex mb-4 800px:mb-0'>
                        <div className='flex flex-col justify-end w-full'>
                          <label htmlFor='project-name' className='required'>Project / individual name (yes, you can nominate yourself)</label>
                          <input className='w-full h-10 mt-1.5 mb-3' type='text' id='project-name' name='project-name' maxLength= '150' value={projectData.name} onChange={ (e) => setProjectData({...projectData, name: e.target.value}) } required />
                        </div>
                      </div>

                      <label htmlFor='funding-reason' className='required'>Why should they receive the funding? Tell us more!</label>
                      <textarea className='w-full h-28 mt-1.5 mb-2' id='funding-reason' name='funding-reason' maxLength= '1400' value={projectData.message} onChange={ (e) => setProjectData({...projectData, message: e.target.value}) } required />

                      <label htmlFor='website'>Link to website/Gitcoin (optional)</label>
                      <input className='w-full h-10 mt-1.5 mb-3' type='text' id='website' name='website' maxLength= '2084' value={projectData.link} onChange={ (e) => setProjectData({...projectData, link: e.target.value}) }  />

                      <label htmlFor='contact' className='required'>Contact of project / individual (for verification)</label>
                      <div className='flex items-center mt-1.5 mb-6'>
                        <select className='border border-gray3 rounded-[1.25rem] h-10 px-7 min-w-[9rem] text-gray5 font-bold mr-7' name='contact-method' id='contact-method' value={projectData.contactMethod} onChange={ (e) => setProjectData({...projectData, contactMethod: e.target.value}) } >
                          <option value='email'>email</option>
                          <option value='twitter'>twitter</option>
                          <option value='discord'>discord</option>
                        </select>
                        <input className='w-full h-10' type='text' id='contact' name='contact' maxLength= '150' placeholder={projectData.contactMethod === 'email' ? 'example@example.com' : projectData.contactMethod === 'twitter' ? '@example' : 'Example@3456'} value={projectData.contact} onChange={ (e) => setProjectData({...projectData, contact: e.target.value}) } required />
                      </div>

                      <div className='recaptcha'>
                        <ReCAPTCHA sitekey={CAPTCHA_SITE_KEY} ref={captchaRef} size='invisible' />
                      </div>

                      <button className='button2 ml-auto' type='submit'>Submit</button>
                    </form>
                    
                  </div>
                </div>

              </div>
            </div>
  
          : popupStatus === 'submitted' 
            ? <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay z-30' id='popup-overlay' onClick={(e) => e.target === document.querySelector('#popup-overlay') ? (document.querySelector('#popup-overlay').style.display = 'none', setPopupStatus('hidden'), setProjectData(newProject)) : null}>
                <div className='popup-mobile 800px:popup scale-[85%] 600px:scale-100' style={{backgroundPosition: '0 -75px'}}>
                  <img className='absolute right-3 top-3 cursor-pointer hover:brightness-75' src={closeIcon} alt='Close Popup' onClick={() => {document.querySelector('#popup-overlay').style.display = 'none'; setPopupStatus('hidden'); setProjectData(newProject); }} />
                  <div className='rounded-t-[4.5rem] mt-[10rem] px-12 800px:px-16 py-8 bg-white w-full h-[calc(100%-10rem)]'>
                  
                  <div className='flex flex-col my-16 1000px:my-[100px] justify-center items-center'>
                      <h3 className='font-ibm 800px:font-obWide font-bold 800px:font-semibold leading-[2.7rem] mb-14 text-center text-3xl'>Awesome!<br/>Nomination done.</h3>
                      <div className='font-ibm font-semibold text-xl text-gray6 text-center'>Stay tuned for the next phase in:</div>

                      <div className='mt-1 text-center'>
                        <a target='_blank' rel='noreferrer' href={constants.Twitter}>
                          <div className='font-ibm font-semibold text-xl text-magentaDD2 underline mb-2 hover:text-magentaDD3'>DAO drops twitter</div>
                          <img className='inline hover:scale-105' src={twitter} alt='Twitter' />
                        </a>
                      </div>
                  </div>
                  </div>
        
                </div>
              </div>
    
          : null
        }
      </>
)}
// ------------------------------------------------------------------------------------------------------- //

export default NominatePopup;
