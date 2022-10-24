import React from 'react'
import Repeatable from 'react-repeatable'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import plus from '../../assets/icons/plus.svg'
import minus from '../../assets/icons/minus.svg'
import heart from '../../assets/icons/heart.svg'
// import smallDots2 from '../../assets/phase2/dots-small2.svg'


// Project Component (Phase2)
// ------------------------------------------------------------------------------------------------------- //
const Project = ({index, id, name, desc, website, paddress, icon, setPopupStatus, setPopupDetails, setVotes, votes, points, setPoints, votesSubmitted, address}) => {

    const colors = ['p-orange', 'p-green', 'p-pink', 'p-blue']
    const colorsPattern = [0,1,2,3,1,2,3,0,2,3,0,1,3,0,1,2]
    const color = colors[colorsPattern[index%16]]
  
    function decrement() {
      if(votesSubmitted !== 'true' && votes && votes[id] !== 0) {
        setVotes(votes => ({...votes, [id]: votes[id]-1}))
        setPoints(points+1)
      }
    }
  
    function increment() {
      if(votesSubmitted !== 'true' && votes && points !==0) {
        setVotes(votes => ({...votes, [id]: votes[id]+1}))
        setPoints(points-1)
      }
    }
  
    return (
      <div className={`w-52 h-48 700px:w-72 700px:h-64 rounded-[1.75rem] p-2 px-5 700px:p-4 700px:px-7 relative ${color}`}>
        <div className={`font-ob font-extrabold text-[1.65rem] 700px:text-[34px] leading-8 700px:leading-10 pt-1 ellipsis h-[68px] 700px:h-[84px] break-words ${ votes && votes[id] > 0 && 'w-[74%] 700px:w-[79%]' }`}>{name}</div>
        <div className='mt-3 700px:mt-4 z-10 details-button' onClick={ () => { setPopupStatus('visible'); setPopupDetails({ name: name, message: desc, link: website, paddress: paddress, image: icon, id: id }); } }>view details</div>
   
          <div className='flex mt-6 700px:mt-10 items-center'>
            <Repeatable repeatInterval={100} onPress={decrement} onHold={decrement}> <img src={minus} alt='minus' className='cursor-pointer w-7 700px:w-auto hover:saturate-50' /> </Repeatable>
            <span className='font-ibm font-semibold text-[1.5rem] 700px:text-[1.75rem] mx-1.5 700px:mx-2.5'>{address && votes ? votes[id] : '0'}</span>
            <Repeatable repeatInterval={100} onPress={increment} onHold={increment}> <img src={plus} alt='plus' className='cursor-pointer w-7 700px:w-auto hover:saturate-50' /> </Repeatable>
            {/* <input className='font-ibm font-semibold text-[1.5rem] 700px:text-[1.75rem] mx-1.5 700px:mx-2 w-[50px]' type='number' value={votes[id]}onChange={ (e) => { setVotes({...votes, [id]: Number(e.target.value)}); setPoints(0); } } /> */}
          </div>

          {/* {color.includes('p-pink') && <img className='absolute bottom-6 right-2 mr-3 mb-3 700px:mr-4 700px:mb-4 z-0 w-[42px] 700px:w-auto' src={smallDots2} alt='Dots' /> } */}
          <div className='absolute bottom-0 right-0 mr-3 mb-3 700px:mr-4 700px:mb-4 rounded-full '>
            { icon 
              ? <img className='object-cover w-[55px] h-[55px] 700px:w-[82px] 700px:h-[82px] rounded-full' src={icon} alt={name} /> 
              : <>
                  <div className='flex 700px:hidden'> <Jazzicon diameter={55} seed={jsNumberForAddress(paddress)} /> </div>
                  <div className='hidden 700px:flex'> <Jazzicon diameter={82} seed={jsNumberForAddress(paddress)} /> </div>
                </>
            }
          </div>
          
          <div className={`absolute top-2 700px:top-4 right-0 scale-75 700px:scale-100 ${address && votes && votes[id] > 0 ? 'block' : 'hidden'}`}>
            <img className='mr-3 mb-3 700px:mr-4 700px:mb-4 w-[55px] 700px:w-auto' src={heart} alt='voted' />
            <div className='absolute top-[14px] left-2 text-[10.5px] font-bold'>VOTED</div>
          </div>

      </div>
)}
// ------------------------------------------------------------------------------------------------------- //

export default Project;
