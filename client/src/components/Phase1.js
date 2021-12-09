import React, { useState, useEffect } from 'react';
import * as constants from '../Constants';
import Countdown from 'react-countdown';
import logo from '../assets/logos/logo.svg'
import dropsVideo from '../assets/video/drops.mp4'
import dropsVideoOGG from '../assets/video/drops.ogg'
import dropsVideoWEBM from '../assets/video/drops.webm'
import dropsThumbnail from '../assets/video/drops-thumbnail.jpg'
import bubble from '../assets/particles/bubble.png'
import squiggle from '../assets/phase1/squiggle.svg'
import dots from '../assets/phase1/dots.svg'
import smallDots from '../assets/phase1/dots-small.svg'
import aquaBox from '../assets/phase1/aqua-box.svg'
import twitter from '../assets/icons/twitter.svg'
import picture from '../assets/icons/picture.png'
import closeIcon from '../assets/icons/close.png'
import axios from "axios";
import FileBase64 from 'react-file-base64';

// Phase1 Component
// ------------------------------------------------------------------------------------------------------- //
const Phase1 = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const onLoadedData = () => setIsVideoLoaded(true);
  const [popupStatus, SetPopupStatus] = useState('hidden');

  const renderer = ({
    formatted: { days, hours, minutes, seconds },
    completed
    }) => {
    if (completed) {
      return <span> </span>;
    } else {
      return <span className='flex'>
                <span className='countdown-number'>{days}<div className='countdown-text'>days</div></span>
                <span className='countdown-number'>{hours}<div className='countdown-text'>hours</div></span>
                <span className='countdown-number'>{minutes}<div className='countdown-text'>min</div></span>
                <span className='mr-0 countdown-number'>{seconds}<div className='countdown-text'>sec</div></span>
            </span>;
    }
  };

  return (
    <>
      <div className='phase1-bg-mobile 1000px:phase1-bg 1800px:h-screen px-[5%] 1000px:px-[10%] pt-16'>
          <a className='font-ob font-semibold text-magentaDD tracking-[4px] text-xl absolute right-[5%] 1000px:right-[10%] 1200px:right-16 top-6 z-20' href={constants.FAQ} target='_blank'>FAQ</a>
          <div className='flex items-start relative'>
              <img src={logo} alt='DAO Drops Logo' />
              <div className='ml-8 600px:ml-12 w-full h-[31rem] 1000px:h-[38rem] border-[6px] border-indigoDD z-10 relative'>
                  <img className={`h-full w-full object-cover absolute transition-opacity ease-in duration-300 z-10 ${isVideoLoaded ? 'opacity-0' : 'opacity-100' }`} src={dropsThumbnail} alt='Drops Thumbnail' />
                  <video className={`h-full w-full object-cover absolute z-10 ${isVideoLoaded ? 'opacity-100' : 'opacity-0' }`} autoPlay loop playsInline muted onLoadedData={onLoadedData}>
                    <source src={dropsVideo} type="video/mp4"/>
                    <source src={dropsVideoOGG} type="video/ogg"/>
                    <source src={dropsVideoWEBM} type="video/webm"/>
                  </video>

                  <img className='absolute top-[-10%] left-[8%] 1000px:top-[-25%] 1000px:left-[18%] z-20 bubble-animation min-w-[60vw] 1000px:min-w-[700px] w-[60%] opacity-95' src={bubble} alt='Bubble' />
                  <img className='absolute top-[111%] left-[40%] 1000px:top-[20%] 1000px:left-[9%] z-10 scale-75 600px:scale-100' src={squiggle} alt='Squiggle' />
                  <img className='absolute top-[44%] right-[19%] z-10 hidden 1000px:block' src={dots} alt='Dots' />
                  <img className='absolute -bottom-32 left-[-4.5rem] 1000px:-bottom-1 1000px:left-[-3.125rem] z-0 scale-75 600px:scale-100' src={smallDots} alt='Dots' />

                  <div className='absolute bottom-0 z-20 w-full 800px:w-auto'>
                    <div className='w-48 h-10 bg-white border-t-[6px] border-indigoDD text-lg font-ob font-bold uppercase flex justify-center items-center endsin-line'>
                      <div className='absolute pb-0.5'>PHASE 1 ENDS IN:</div>
                    </div>

                    <div className='w-full 800px:w-[32rem] h-[6.5rem] bg-white border-t-[6px] 800px:border-r-[6px] border-indigoDD font-obWide font-black text-5xl flex justify-center items-center'>
                      <Countdown date={'2021-12-20T12:00:00.000+00:00'} renderer={renderer} />
                    </div>
                  </div>

              </div>
              <img className='absolute -bottom-20 z-0 -left-7 1000px:left-0 scale-75 1000px:scale-100' src={aquaBox} alt='Aqua Box' />
          </div>

          <div className='flex pb-8 1000px:p-0 flex-wrap 1000px:flex-nowrap'>
            <div className='mt-[6.25rem] order-2 1000px:order-1 w-full 1000px:w-auto relative'>
                <div className='font-ob text-magentaDD text-xl 1000px:text-sm border-b border-magentaDD pb-4 w-full 1000px:w-[19rem]'>
                  Built by <a target='_blank' rel='noreferrer' href='https://www.dorg.tech' className='font-semibold hover:underline'>dOrg</a> and funded<br/>
                  by the <a target='_blank' rel='noreferrer' href='https://ethereum.foundation' className='font-semibold hover:underline'>Ethereum Foundation</a>
                </div>

                <div className='1000px:mt-2.5 absolute 1000px:relative right-4 top-4 1000px:inset-0 scale-150 1000px:scale-100'>
                  <a target='_blank' rel='noreferrer' href={constants.Twitter}>
                    <img className='inline hover:scale-105' src={twitter} alt='Twitter' />
                  </a>
                </div>
            </div>

            <div className='1000px:ml-16 mt-40 1000px:mt-10 z-10 order-1 1000px:order-2'>
              <h3 className='text-3xl 600px:text-4xl 1000px:text-[calc(1.4rem+1vw)] mb-5 leading-10'>something big is about to drop.</h3>
              <div className='subtitle2 hidden 1000px:block text-[calc(0.8rem+1vw)]'>know a project or someone deserving?</div>
              <div className='button1-small 600px:button1 mt-8 1000px:mt-10 1000px:mb-8' onClick={ () => { SetPopupStatus('nominate'); } }>Nominate Them</div>
            </div>
          </div>

      </div>

      <NominatePopup popupStatus={popupStatus} SetPopupStatus={SetPopupStatus} />
    </>
  )}
// ------------------------------------------------------------------------------------------------------- //

const NominatePopup = (props) => {

  const newProject = { name: "", message: "", link: "", contactMethod: "email", contact: "", image: null };
  const [projectData, setProjectData] = useState(newProject);
  const { popupStatus, SetPopupStatus } = props;

  const submitProject = e => {
    e.preventDefault();
    axios.post("http://localhost:5000/posts", projectData).then(r => { r.status === 201 && SetPopupStatus('submitted')} ).catch(e => console.error(e));
  };

  useEffect(() => {
    document.querySelectorAll(".image-upload div input").forEach(el => el.setAttribute("accept","image/*"));
  }, [popupStatus]);

  return (
    <>
      { popupStatus === 'nominate' ?
          <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay z-30' id='popup-overlay' onClick={(e) => e.target === document.querySelector('#popup-overlay') ? (document.querySelector('#popup-overlay').style.display = 'none', SetPopupStatus('hidden'), setProjectData(newProject)) : null}>
              <div className='popup-mobile 800px:popup'>
                <img className='absolute -right-4 -top-4 cursor-pointer' src={closeIcon} alt="Close Popup" onClick={() => {document.querySelector('#popup-overlay').style.display = "none"; SetPopupStatus('hidden'); setProjectData(newProject); }} />
                <div className='rounded-t-[4.5rem] mt-[3.75rem] px-8 800px:px-16 py-8 bg-white w-full h-[calc(100%-3.75rem)]'>
                  <div className='font-ibm font-bold text-base 600px:text-lg text-left mb-9 px-2 800px:px-4'>Hello! Please nominate a project or individual that you think should receive funds. DAO drops focuses on retroactive public goods funding.</div>

                  <div className='flex'>
                    <div className='w-max mr-16 hidden 800px:block'>
                      <label className="image-upload">
                        <div className="hidden"><FileBase64 multiple={ false } accept="image/*" onDone={({base64}) => setProjectData({ ...projectData, image: base64})} /></div>
                        <div className='bg-gray1 border-gray2 border-[7px] rounded-full w-max mb-2 cursor-pointer'>
                          <img className='rounded-full w-[177px] h-[177px] object-contain' src={projectData.image ? projectData.image : picture} alt='Picture' />
                        </div>
                      </label>
                      <div className='font-ibm font-bold text-xl text-center'>Picture</div>
                    </div>

                    <form className='flex flex-col w-full mt-2 1000px:mr-16 font-ibm font-bold text-base' autoComplete='off' onSubmit={submitProject}>

                      <div className="flex mb-4 800px:mb-0">
                        <div className='w-max mr-8 block 800px:hidden'>
                          <label className="image-upload">
                            <div className="hidden"><FileBase64 multiple={ false } accept="image/*" onDone={({base64}) => setProjectData({ ...projectData, image: base64})} /></div>
                            <div className='bg-gray1 border-gray2 border-4 rounded-full w-max cursor-pointer'>
                              <img className='rounded-full w-24 h-24 object-contain' src={projectData.image ? projectData.image : picture} alt='Picture' />
                            </div>
                          </label>
                        </div>

                        <div className="flex flex-col justify-end w-full">
                          <label htmlFor='project-name' className='required'>Project or individual Name</label>
                          <input className='w-full h-10 mt-1.5 mb-3' type='text' id='project-name' name='project-name' value={projectData.name} onChange={ (e) => setProjectData({...projectData, name: e.target.value}) } required />
                        </div>
                      </div>

                      <label htmlFor='funding-reason' className='required'>Why should they receive the funding? Tell us more!</label>
                      <textarea className='w-full h-28 mt-1.5 mb-2' id='funding-reason' name='funding-reason' maxLength= "1400" value={projectData.message} onChange={ (e) => setProjectData({...projectData, message: e.target.value}) } required />

                      <label htmlFor='website'>Link to website/Gitcoin</label>
                      <input className='w-full h-10 mt-1.5 mb-3' type='text' id='website' name='website' value={projectData.link} onChange={ (e) => setProjectData({...projectData, link: e.target.value}) }  />

                      <label htmlFor='contact' className='required'>Contact of project (for verification)</label>
                      <div className='flex items-center mt-1.5 mb-6'>
                        <select className='border border-gray3 rounded-[1.25rem] h-10 px-7 min-w-[9rem] text-gray4 font-bold mr-7' name="contact-method" id="contact-method" value={projectData.contactMethod} onChange={ (e) => setProjectData({...projectData, contactMethod: e.target.value}) } >
                          <option value="email">email</option>
                          <option value="twitter">twitter</option>
                          <option value="discord">discord</option>
                        </select>
                        <input className='w-full h-10' type='text' id='contact' name='contact' value={projectData.contact} onChange={ (e) => setProjectData({...projectData, contact: e.target.value}) }  required />
                      </div>
                      
                      <button className='button2 ml-auto' type='submit'>Submit</button>
                    </form>
                  </div>
                </div>

              </div>
          </div>

        : popupStatus === 'submitted' ?
        <div className='flex items-center justify-center fixed inset-0 bg-popupOverlay z-30' id='popup-overlay' onClick={(e) => e.target === document.querySelector('#popup-overlay') ? (document.querySelector('#popup-overlay').style.display = 'none', SetPopupStatus('hidden'), setProjectData(newProject)) : null}>
        <div className='popup-mobile 800px:popup' style={{backgroundPosition: '0 -75px'}}>
          <img className='absolute -right-4 -top-4 cursor-pointer' src={closeIcon} alt="Close Popup" onClick={() => {document.querySelector('#popup-overlay').style.display = "none"; SetPopupStatus('hidden'); setProjectData(newProject); }} />
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


export default Phase1;