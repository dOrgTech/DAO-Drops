import React from 'react'
import smallDots2 from '../../assets/phase2/dots-small2.svg'
import heart from '../../assets/icons/heart.svg'


// Project Component (Phase3)
// ------------------------------------------------------------------------------------------------------- //
const Project = (props) => {
    const colors = ['p-orange', 'p-green', 'p-pink', 'p-blue']
    const colorsPattern = [0,1,2,3,1,2,3,0,2,3,0,1,3,0,1,2]
    const color = colors[colorsPattern[props.index%16]]
  
    return (
      <div className={`w-52 h-48 700px:w-72 700px:h-64 rounded-[1.75rem] p-2 pl-5 700px:p-4 700px:pl-7 relative ${color} `}>
        <div className='font-ob font-black text-[1.65rem] 700px:text-4xl leading-8 700px:leading-10 pt-1 ellipsis'>{props.name}</div>
        <div className='mt-3 700px:mt-4 z-10 details-button' onClick={ () => { props.setPopupStatus('visible'); props.setPopupDetails({ name: props.name, message: props.desc, link: props.website, image: props.icon, points:props.points }); } }>view details</div>
  
        <div className='flex flex-col mt-2 700px:mt-5'>
          <div className='font-obWide font-black text-4xl 700px:text-5xl pb-0.5 700px:pb-1'>{props.points || '0'}</div>
          <div className='font-bold uppercase text-[0.6rem] 700px:text-[0.8rem]'>points Received</div>
        </div>
  
        { props.icon &&
          <>
            {color === 'p-pink' && <img className='absolute bottom-6 right-2 mr-3 mb-3 700px:mr-4 700px:mb-4 z-0 w-[42px] 700px:w-auto' src={smallDots2} alt='Dots' /> }
            <img className='absolute bottom-0 right-0 mr-3 mb-3 700px:mr-4 700px:mb-4 w-[55px] h-[55px] 700px:w-[82px] 700px:h-[82px] object-cover rounded-full' src={props.icon} alt={props.name} />
          </>
        }
  
        { props.votedProjects && props.votedProjects.includes(props.id) &&
          <div className='absolute top-2 700px:top-4 right-0 scale-75 700px:scale-100'>
            <img className='mr-3 mb-3 700px:mr-4 700px:mb-4 w-[55px] 700px:w-auto' src={heart} alt='voted' />
            <div className='absolute top-[14px] left-2 text-[10.5px] font-bold'>VOTED</div>
          </div>
        }
        
      </div>
)}
// ------------------------------------------------------------------------------------------------------- //

export default Project;
