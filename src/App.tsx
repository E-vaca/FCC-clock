import { useState, useEffect } from 'react'
import { DisplayState } from './helpers'
import TimeSetter from './TimeSetter'
import Display from './Display'
import AlarmSound from './assets/AlarmSound.mp3'
import './App.css'

const defaultBreakLength = 5 * 60
const defaultSessionLength = 25 * 60
const min = 60
const max = 60 * 60
const interval = 60

function App() {

  const [breakLength, setBreakLength] = useState(defaultBreakLength)
  const [sessionLength, setSessionLength] = useState(defaultSessionLength)
  const [displayState, setDisplayState] = useState<DisplayState>({
    time: sessionLength,
    timeType: 'Session',
    timerRunning: false,
  })

  useEffect(() => {
    let timerId: number
    if (!displayState.timerRunning) return

    if (displayState.timerRunning) {
      timerId = window.setInterval(decrementDisplay, 1000)
    }

    return () => {
      window.clearInterval(timerId)
    }

  }, [displayState.timerRunning])

  useEffect(() => {
    if (displayState.time === 0) {
      const audio = document.getElementById('beep') as HTMLAudioElement
      audio.currentTime = 2
      audio.play().catch((error) => console.log(error))
      setDisplayState((previousState) => ({
        ...previousState,
        time: previousState.timeType === 'Session' ? breakLength : sessionLength,
        timeType: previousState.timeType === 'Session' ? 'Break' : 'Session'
      }))
    }
  },[displayState, breakLength, sessionLength])

  const reset = () => {
    setBreakLength(defaultBreakLength)
    setSessionLength(defaultSessionLength)
    setDisplayState({
      time: defaultSessionLength,
      timeType: 'Session',
      timerRunning: false,
    })
    const audio = document.getElementById('beep') as HTMLAudioElement
    audio.pause()
    audio.currentTime = 0
    console.log('reset')
  }

  const startStop = () => {
    setDisplayState((previousState) => ({
      ...previousState,
      timerRunning: !previousState.timerRunning
    }))
    console.log('startStop')
  }

  const changeBreakTime = (time: number) => {
    if (displayState.timerRunning) return
    setBreakLength(time)
    console.log('changeBreakTime')
  }

  const decrementDisplay = () => {
    setDisplayState((previousState) => ({
      ...previousState,
      time: previousState.time - 1,
    }))
  }

  const changeSessionTime = (time: number) => {
    if (displayState.timerRunning) return
    setSessionLength(time)
    setDisplayState({
      time: time,
      timeType: 'Session',
      timerRunning: false,
    })
    console.log('changeSessionTime')
  }

  return (
    <>
      <div className='clock'>
        <div className='setters'>
          <div className="break">
            <h4 id="break-label">Break Length</h4>
            <TimeSetter 
              time={breakLength} 
              setTime={changeBreakTime}
              min={min} 
              max={max} 
              interval={interval} 
              type='break'
            />
          </div>
          <div className="session">
            <h4 id="session-label">Session Length</h4>
            <TimeSetter 
              time={sessionLength}
              setTime={changeSessionTime}
              min={min} 
              max={max}
              interval={interval}  
              type='session'
              />
          </div>
        </div>
        <Display 
          displayState={displayState}
          reset={reset}
          startStop={startStop}
        />
        <audio id="beep" src={AlarmSound} />
      </div>
    </>
  )
}

export default App
