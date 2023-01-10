import React from 'react'
import { numberWithCommas } from '../../Utils'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import heart from '../../assets/icons/heart.svg'


// Project Component (Phase3)
// ------------------------------------------------------------------------------------------------------- //
const Project = ({index, id, name, desc, website, paddress, icon, points, usdcAmount, setPopupStatus, setPopupDetails, votedProjects, walletStatus, pointsSum}) => {
    const colors = ['p-orange', 'p-green', 'p-pink', 'p-blue']
    const colorsPattern = [0,1,2,3,1,2,3,0,2,3,0,1,3,0,1,2]
    const color = colors[colorsPattern[index%16]]
    const voted = votedProjects && votedProjects.includes(id) && walletStatus === 'connected'
    const usd = (points / pointsSum) * 250000
    // const usd = usdcAmount

    return (
      <div className={`w-52 h-48 700px:w-72 700px:h-64 rounded-[1.75rem] p-2 px-5 700px:p-4 700px:px-7 relative ${color} `}>
        <div className={`font-ob font-extrabold text-[1.4rem] 700px:text-[32px] leading-8 700px:leading-10 pt-1 ellipsis h-[68px] 700px:h-[84px] break-words ${ voted && 'w-[74%] 700px:w-[79%]' }`}>{name}</div>
        <div className='mt-3 700px:mt-4 z-10 details-button' onClick={ () => { setPopupStatus('visible'); setPopupDetails({ name: name, message: desc, link: website, paddress: paddress, image: icon, points: points }); } }>view details</div>
  
        <div className='flex flex-col mt-1.5 700px:mt-4'>
          <div className={`font-obWide font-extrabold pb-0.5 700px:pb-1 h-[34px] 700px:h-[44px] flex items-end ${points > 999 ? 'text-[28px] leading-7 700px:text-4xl' : 'text-[32px] leading-8 700px:leading-[43px] 700px:text-[45px]' }`}>{points || '0'}</div>
          <div className='font-bold uppercase text-[0.6rem] 700px:text-[0.72rem]'>points Received</div>
          <div className='font-bold uppercase text-indigoDD4 text-[0.6rem] 700px:text-[0.82rem]'>${numberWithCommas(usd.toFixed(0))} - USDC</div>
        </div>
  
        <div className='absolute bottom-0 right-0 mr-3 mb-3 700px:mr-4 700px:mb-4 rounded-full '>
          { icon 
            ? <img className='object-cover w-[55px] h-[55px] 700px:w-[82px] 700px:h-[82px] rounded-full' src={icon} alt={name} /> 
            : <>
                <div className='flex 700px:hidden'> <Jazzicon diameter={55} seed={jsNumberForAddress(paddress)} /> </div>
                <div className='hidden 700px:flex'> <Jazzicon diameter={82} seed={jsNumberForAddress(paddress)} /> </div>
              </>
          }
          </div>
  
        {  voted &&
          <div className='absolute top-2 700px:top-4 right-0 scale-75 700px:scale-100'>
            <img className='mr-3 mb-3 700px:mr-4 700px:mb-4 w-[55px] 700px:w-auto' src={heart} alt='voted' />
            <div className='absolute top-[14px] left-2 text-[10.5px] font-bold'>VOTED</div>
          </div>
        }
        
      </div>
)}
// ------------------------------------------------------------------------------------------------------- //

export default Project;
