import React, { useState, useEffect, useRef } from 'react'
import * as constants from '../../Constants'
import Countdown from 'react-countdown'
import TermsText from './text'

import logo from '../../assets/logos/logo.svg'
import dropsVideo from '../../assets/video/drops.mp4'
import dropsVideoOGG from '../../assets/video/drops.ogg'
import dropsVideoWEBM from '../../assets/video/drops.webm'
import dropsThumbnail from '../../assets/video/drops-thumbnail.jpg'
import bubble from '../../assets/particles/bubble.png'
import squiggle from '../../assets/phase1/squiggle.svg'
import dots from '../../assets/phase1/dots.svg'
import smallDots from '../../assets/phase1/dots-small.svg'
import aquaBox from '../../assets/phase1/aqua-box.svg'
import twitter from '../../assets/icons/twitter.svg'


// Terms & Conditions Component
// ------------------------------------------------------------------------------------------------------- //
const Terms = () => {
  
  return (
    <>
      <div className='phase1-bg-mobile 1000px:phase1-bg px-[5%] 1000px:px-[20%] pt-9'>
      <a className='font-ob font-semibold text-magentaDD tracking-[4px] text-xl relative flex justify-end 1200px:right-[-8.5%] -top-3 z-20 hover:text-magentaDD4' href={constants.FAQ} target='_blank' rel='noreferrer'>FAQ</a>
          <div className='flex items-start relative'>
              <a href='https://daodrops.io' className='min-w-[49px] min-h-[408]'>
								<img src={logo} alt='DAO Drops Logo' className='z-10 w-[49px] h-[408]'/>
							</a>

              <div className='flex flex-col'>
                <div className='ml-6 1000px:ml-10 my-10 z-10'>
                  <h3 className='text-4xl'>Terms & Conditions</h3>
                  <div className='py-10 max-w-[370px] 550px:max-w-max'>
										<TermsText />
									</div>
                </div>
              </div>


          </div>

      </div>



			<footer className='w-full h-24 px-[4%] flex justify-between items-center bg-footerColor'>
					<div className='font-ob text-magentaDD text-base 600px:text-lg 1000px:w-1/3'>
            Built by <a target='_blank' rel='noreferrer' href='https://www.dorg.tech' className='font-semibold hover:underline'>dOrg</a> and supported<br/>
            by the <a target='_blank' rel='noreferrer' href='https://ethereum.foundation' className='font-semibold hover:underline'>Ethereum Foundation</a>
            </div>

            <a className='font-ob font-semibold text-magentaDD tracking-[4px] text-xl 1000px:w-1/3 text-center hover:text-magentaDD4' href={constants.FAQ} target='_blank' rel='noreferrer'>FAQ</a>

            <div className='1000px:w-1/3 text-right'>
            <a target='_blank' rel='noreferrer' href={constants.Twitter}>
                <img className='inline scale-150 hover:scale-[155%]' src={twitter} alt='Twitter' />
            </a>
					</div>
			</footer>
    </>
  )}
// ------------------------------------------------------------------------------------------------------- //

export default Terms;
