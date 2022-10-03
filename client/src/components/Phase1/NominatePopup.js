import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import FileBase64 from 'react-file-base64'
import ReCAPTCHA from 'react-google-recaptcha'

import picture from '../../assets/icons/picture.png'
import closeIcon from '../../assets/icons/close.png'

const POSTS = 'https://dao-drops.herokuapp.com/posts'
const CAPTCHA_SITE_KEY = '6Lco_04iAAAAAPtRPPRUizXXZNlRQxi3EJ1b9UZ2'


// Nominate Popup Component (Phase1)
// ------------------------------------------------------------------------------------------------------- //
const NominatePopup = ({ popupStatus, SetPopupStatus }) => {

    const newProject = { name: '', message: '', link: '', contactMethod: 'email', contact: '', image: null }
    const [projectData, setProjectData] = useState(newProject)
    const captchaRef = useRef(null)

    const submitProject = async e => {
      e.preventDefault()
      const captchaToken = await captchaRef.current.executeAsync()
      captchaRef.current.reset()
      axios.post(POSTS, projectData, { headers: { 'captcha-token': captchaToken }})
            .then(r => { r.status === 201 && SetPopupStatus('submitted')} )
            .catch(e => console.error(e))
    };
  
    useEffect(() => {
      document.querySelectorAll('.image-upload div input').forEach(el => el.setAttribute('accept','image/*'))
    }, [popupStatus])
  
    return (
      <>
        { popupStatus === 'nominate' 
          ? <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay z-30' id='popup-overlay' 
                 onClick={(e) => e.target === document.querySelector('#popup-overlay') ? (document.querySelector('#popup-overlay').style.display = 'none', SetPopupStatus('hidden'), setProjectData(newProject)) : null}>
                    
                <div className='popup-mobile 800px:popup'>
                  <img className='absolute -right-4 -top-4 cursor-pointer' src={closeIcon} alt='Close Popup' onClick={() => {document.querySelector('#popup-overlay').style.display = 'none'; SetPopupStatus('hidden'); setProjectData(newProject); }} />
                  <div className='rounded-t-[4.5rem] mt-[3.75rem] px-8 800px:px-16 py-8 bg-white w-full h-[calc(100%-3.75rem)]'>
                    <div className='font-ibm font-bold text-base 600px:text-lg text-left mb-9 px-2 800px:px-4'>Hello! Please nominate a project or individual that you think should receive funds. DAO drops focuses on retroactive public goods funding.</div>
  
                    <div className='flex'>
                      <div className='w-max mr-16 hidden 800px:block'>
                        <label className='image-upload'>
                          <div className='hidden'><FileBase64 multiple={ false } accept='image/*' onDone={({base64}) => setProjectData({ ...projectData, image: base64})} /></div>
                          <div className='bg-gray1 border-gray2 border-[7px] rounded-full w-max mb-2 cursor-pointer'>
                            <img className='rounded-full w-[177px] h-[177px] object-contain' src={projectData.image ? projectData.image : picture} alt='Picture' />
                          </div>
                        </label>
                        <div className='font-ibm font-bold text-xl text-center'>Picture</div>
                      </div>
  
                      <form className='flex flex-col w-full mt-2 1000px:mr-16 font-ibm font-bold text-base' autoComplete='off' onSubmit={submitProject}>
  
                        <div className='flex mb-4 800px:mb-0'>
                          <div className='w-max mr-8 block 800px:hidden'>
                            <label className='image-upload'>
                              <div className='hidden'><FileBase64 multiple={ false } accept='image/*' onDone={({base64}) => setProjectData({ ...projectData, image: base64})} /></div>
                              <div className='bg-gray1 border-gray2 border-4 rounded-full w-max cursor-pointer'>
                                <img className='rounded-full w-24 h-24 object-contain' src={projectData.image ? projectData.image : picture} alt='Picture' />
                              </div>
                            </label>
                          </div>
  
                          <div className='flex flex-col justify-end w-full'>
                            <label htmlFor='project-name' className='required'>Project or individual Name</label>
                            <input className='w-full h-10 mt-1.5 mb-3' type='text' id='project-name' name='project-name' value={projectData.name} onChange={ (e) => setProjectData({...projectData, name: e.target.value}) } required />
                          </div>
                        </div>
  
                        <label htmlFor='funding-reason' className='required'>Why should they receive the funding? Tell us more!</label>
                        <textarea className='w-full h-28 mt-1.5 mb-2' id='funding-reason' name='funding-reason' maxLength= '1400' value={projectData.message} onChange={ (e) => setProjectData({...projectData, message: e.target.value}) } required />
  
                        <label htmlFor='website'>Link to website/Gitcoin</label>
                        <input className='w-full h-10 mt-1.5 mb-3' type='text' id='website' name='website' value={projectData.link} onChange={ (e) => setProjectData({...projectData, link: e.target.value}) }  />
  
                        <label htmlFor='contact' className='required'>Contact of project (for verification)</label>
                        <div className='flex items-center mt-1.5 mb-6'>
                          <select className='border border-gray3 rounded-[1.25rem] h-10 px-7 min-w-[9rem] text-gray4 font-bold mr-7' name='contact-method' id='contact-method' value={projectData.contactMethod} onChange={ (e) => setProjectData({...projectData, contactMethod: e.target.value}) } >
                            <option value='email'>email</option>
                            <option value='twitter'>twitter</option>
                            <option value='discord'>discord</option>
                          </select>
                          <input className='w-full h-10' type='text' id='contact' name='contact' value={projectData.contact} onChange={ (e) => setProjectData({...projectData, contact: e.target.value}) } required />
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
            ? <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay z-30' id='popup-overlay' onClick={(e) => e.target === document.querySelector('#popup-overlay') ? (document.querySelector('#popup-overlay').style.display = 'none', SetPopupStatus('hidden'), setProjectData(newProject)) : null}>
                <div className='popup-mobile 800px:popup' style={{backgroundPosition: '0 -75px'}}>
                  <img className='absolute -right-4 -top-4 cursor-pointer' src={closeIcon} alt='Close Popup' onClick={() => {document.querySelector('#popup-overlay').style.display = 'none'; SetPopupStatus('hidden'); setProjectData(newProject); }} />
                  <div className='rounded-t-[4.5rem] mt-[13rem] px-8 800px:px-16 py-8 bg-white w-full h-[calc(100%-13rem)]'>
                  
                  <div className='flex flex-col 800px:flex-row mt-10 mb-24 1000px:my-[109.5px] justify-center items-center'>
                      <div className='w-max mb-8 800px:mb-0 800px:mr-16'>
                        <div className='bg-gray1 border-gray2 border-[6px] w-max rounded-full'>
                          <img className='rounded-full w-[150px] h-[150px] object-contain' src={projectData.image ? projectData.image : picture} alt='Picture' />
                        </div>
                      </div>
      
                      <div>
                        <h3 className='font-ibm 800px:font-obWide font-bold 800px:font-semibold leading-[3rem] mb-5 text-center 800px:text-left text-3xl 800px:text-4xl'>Awesome!<br/>Project nominated.</h3>
                        <div className='font-ibm font-normal 800px:font-semibold text-2xl 800px:text-[1.65rem] text-[#727272]'>Stay tuned for Phase 2!</div>
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
