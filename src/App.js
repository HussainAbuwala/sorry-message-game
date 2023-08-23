import Confetti from 'react-confetti'
import Card from './Card.js'
import Data from './data.js'
import { useEffect, useState, useRef, useCallback } from 'react'
import AnimatedNumbers from "react-animated-numbers";



function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let arr = [...Data]
const PAGE_SIZE = 5
const TOTAL_RECORDS = arr.length



function App() {

  const [isConfetti, setConfetti] = useState(false)
  const [messages, setMessages] = useState([])
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const observer = useRef()

  const lastMsgRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    }, {
      threshold: 1,
    })
    if (node) observer.current.observe(node)
  }, [loading])


  useEffect(() => {

    const cards = document.querySelectorAll(".card")
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle("show", entry.isIntersecting)
        if(entry.isIntersecting) obs.unobserve(entry.target)
      })
    },
    {
      threshold: 0.3,
    })

    cards.forEach(card => {
      obs.observe(card)
    })

  }, [messages])

  useEffect(() => {
    
    setLoading(true)

    let start_index = (pageNumber - 1) * PAGE_SIZE
    let end_index = start_index + PAGE_SIZE
    if (start_index >= TOTAL_RECORDS){
      setMessages(prevMessages => {
        return [...prevMessages].concat([...arr.slice(0, PAGE_SIZE)])
      })
    } else if(end_index >= TOTAL_RECORDS){
      let records_left = PAGE_SIZE - (TOTAL_RECORDS - start_index)
      setMessages(prevMessages => {
        return [...prevMessages].concat([...arr.slice(start_index, TOTAL_RECORDS), ...arr.slice(0, records_left)])
      })
    }else{
      setMessages(prevMessages => {
        return [...prevMessages].concat([...arr.slice(start_index, end_index)])
      })
    }

    setLoading(false)

  }, [pageNumber])

  console.log(messages, messages.length)

  function handleClick(){
    setConfetti(true)
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Optional: Adds smooth scrolling animation
    });
  }

  function handleRestart(){
    setConfetti(false)
    setMessages([])
    setPageNumber(1)
    setLoading(true)
    arr = shuffleArray(arr)
  }
  
  return (
    <>
      {isConfetti && 
      <div className='results-container'>
        <Confetti />
        <div className='results-content'>
        <AnimatedNumbers
        includeComma
        animateToNumber={messages.length}
        fontStyle={{ fontFamily: "Rubik", fontSize: '10rem' }}
        locale="en-US"
        config={{ tension: 89, friction: 40 }}
      >
      </AnimatedNumbers>
        <h2 className='results-content-header'>Sorry Messages to Forgive !</h2>
        <span className='results-content-text'>Not Happy Yet! &#128545;</span>
        <button className='results-btn' onClick={() => handleRestart()}>Play Again</button>
        </div>  
      </div>
      }
      {!isConfetti &&
        <div className='card-container'>
        {
          messages.map((sorry_msg, index) => {
            if(messages.length === index + 1){
              return <Card fRef={lastMsgRef} key={index} msg={sorry_msg} />
            }
            else{
              return <Card key={index} msg={sorry_msg} handleClick={handleClick} />
            }
          })
        }
        </div>
      }
    </>
    
  );
}

export default App;
