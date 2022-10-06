import React from 'react'
import Repeatable from 'react-repeatable'
import plus from '../../assets/icons/plus.svg'
import minus from '../../assets/icons/minus.svg'
import smallDots2 from '../../assets/phase2/dots-small2.svg'


// Project Component (Phase2)
// ------------------------------------------------------------------------------------------------------- //
const Project = ({index, id, name, desc, website, icon, setPopupStatus, setPopupDetails, setVotes, votes, points, setPoints, votesSubmitted}) => {

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
      <div className={`w-52 h-48 700px:w-72 700px:h-64 rounded-[1.75rem] p-2 pl-5 700px:p-4 700px:pl-7 relative ${color} `}>
        <div className='font-ob font-black text-[1.65rem] 700px:text-4xl leading-8 700px:leading-10 pt-1 ellipsis'>{name}</div>
        <div className='mt-3 700px:mt-4 z-10 details-button' onClick={ () => { setPopupStatus('visible'); setPopupDetails({ name: name, message: desc, link: website, image: icon, id:id }); } }>view details</div>
    
        {!votes
          ? <div className='flex mt-6 700px:mt-10 font-medium'>Loading...</div>
          : <div className='flex mt-6 700px:mt-10 items-center'>
              <Repeatable repeatInterval={100} onPress={decrement} onHold={decrement}> <img src={minus} alt='minus' className='cursor-pointer w-7 700px:w-auto' /> </Repeatable>
              <span className='font-ibm font-semibold text-[1.5rem] 700px:text-[1.75rem] mx-1.5 700px:mx-2.5'>{votes ? votes[id] : '0'}</span>
              <Repeatable repeatInterval={100} onPress={increment} onHold={increment}> <img src={plus} alt='plus' className='cursor-pointer w-7 700px:w-auto' /> </Repeatable>
              {/* <input className='font-ibm font-semibold text-[1.5rem] 700px:text-[1.75rem] mx-1.5 700px:mx-2 w-[50px]' type='number' value={votes[id]}onChange={ (e) => { setVotes({...votes, [id]: Number(e.target.value)}); setPoints(0); } } /> */}
            </div>
        }
    
        { icon &&
          <>
            {color.includes('p-pink') && <img className='absolute bottom-6 right-2 mr-3 mb-3 700px:mr-4 700px:mb-4 z-0 w-[42px] 700px:w-auto' src={smallDots2} alt='Dots' /> }
            <img className='absolute bottom-0 right-0 mr-3 mb-3 700px:mr-4 700px:mb-4 w-[55px] h-[55px] 700px:w-[82px] 700px:h-[82px] object-cover rounded-full' src={icon} alt={name} />
          </>
        }
      </div>
)}
// ------------------------------------------------------------------------------------------------------- //

export default Project;
