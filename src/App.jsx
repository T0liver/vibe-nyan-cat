import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import './App.css'

// Deterministic pseudo-random number generator
function seededRandom(seed) {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function Star({ style }) {
  return <div className="star" style={style} />
}

function Stars() {
  const stars = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      style: {
        left: `${seededRandom(i * 7) * 100}%`,
        top: `${seededRandom(i * 13) * 100}%`,
        width: `${seededRandom(i * 17) * 4 + 2}px`,
        height: `${seededRandom(i * 23) * 4 + 2}px`,
        animationDelay: `${seededRandom(i * 29) * 2}s`,
        animationDuration: `${seededRandom(i * 31) * 1 + 0.5}s`,
      }
    }))
  }, [])

  return (
    <div className="stars">
      {stars.map(star => (
        <Star key={star.id} style={star.style} />
      ))}
    </div>
  )
}

function Rainbow() {
  return (
    <div className="rainbow">
      <div className="rainbow-stripe" />
      <div className="rainbow-stripe" />
      <div className="rainbow-stripe" />
      <div className="rainbow-stripe" />
      <div className="rainbow-stripe" />
      <div className="rainbow-stripe" />
    </div>
  )
}

function Sprinkles() {
  const sprinkles = useMemo(() => {
    const colors = ['#ff3366', '#ff6699', '#ff0000', '#ff66cc', '#ff3399']
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      style: {
        left: `${10 + (i % 4) * 15}px`,
        top: `${8 + Math.floor(i / 4) * 18}px`,
        background: colors[i % colors.length],
      }
    }))
  }, [])

  return (
    <>
      {sprinkles.map(sprinkle => (
        <div key={sprinkle.id} className="sprinkle" style={sprinkle.style} />
      ))}
    </>
  )
}

function NyanCat() {
  return (
    <div className="nyan-cat">
      {/* Cat tail */}
      <div className="cat-tail" />
      
      {/* Pop-tart body */}
      <div className="poptart">
        <div className="frosting">
          <Sprinkles />
        </div>
      </div>
      
      {/* Cat head */}
      <div className="cat-head">
        {/* Ears */}
        <div className="cat-ear left" />
        <div className="cat-ear right" />
        <div className="cat-ear-inner left" />
        <div className="cat-ear-inner right" />
        
        {/* Eyes */}
        <div className="cat-eyes">
          <div className="cat-eye" />
          <div className="cat-eye" />
        </div>
        
        {/* Cheeks */}
        <div className="cat-cheeks">
          <div className="cat-cheek" />
          <div className="cat-cheek" />
        </div>
        
        {/* Mouth */}
        <div className="cat-mouth" />
      </div>
      
      {/* Cat legs */}
      <div className="cat-legs">
        <div className="cat-leg" />
        <div className="cat-leg" />
        <div className="cat-leg" />
        <div className="cat-leg" />
      </div>
    </div>
  )
}

function PlayOverlay({ onPlay }) {
  return (
    <div className="play-overlay" onClick={onPlay}>
      <button className="play-button" aria-label="Play Nyan Cat">
        <div className="play-icon" />
      </button>
      <p className="play-text">Click to start Nyan Cat!</p>
    </div>
  )
}

// Nyan Cat melody notes (simplified version of the tune)
const NYAN_MELODY = [
  { note: 'F#5', duration: 0.125 },
  { note: 'G#5', duration: 0.125 },
  { note: 'C#5', duration: 0.125 },
  { note: 'D#5', duration: 0.125 },
  { note: 'B4', duration: 0.25 },
  { note: 'D#5', duration: 0.125 },
  { note: 'C#5', duration: 0.125 },
  { note: 'B4', duration: 0.125 },
  { note: 'C#5', duration: 0.125 },
  { note: 'D#5', duration: 0.125 },
  { note: 'F#5', duration: 0.125 },
  { note: 'G#5', duration: 0.125 },
  { note: 'D#5', duration: 0.125 },
  { note: 'F#5', duration: 0.125 },
  { note: 'C#5', duration: 0.125 },
  { note: 'D#5', duration: 0.125 },
  { note: 'B4', duration: 0.125 },
  { note: 'C#5', duration: 0.125 },
  { note: 'B4', duration: 0.125 },
  { note: 'D#5', duration: 0.25 },
  { note: 'F#5', duration: 0.125 },
  { note: 'G#5', duration: 0.25 },
  { note: 'D#5', duration: 0.125 },
  { note: 'F#5', duration: 0.125 },
  { note: 'C#5', duration: 0.125 },
  { note: 'D#5', duration: 0.125 },
  { note: 'B4', duration: 0.125 },
  { note: 'D#5', duration: 0.125 },
  { note: 'D#5', duration: 0.125 },
  { note: 'C#5', duration: 0.125 },
  { note: 'B4', duration: 0.125 },
  { note: 'C#5', duration: 0.125 },
]

// Convert note names to frequencies
const NOTE_FREQUENCIES = {
  'B4': 493.88,
  'C#5': 554.37,
  'D#5': 622.25,
  'F#5': 739.99,
  'G#5': 830.61,
}

function useNyanMusic(isPlaying) {
  const audioContextRef = useRef(null)
  const isPlayingRef = useRef(false)

  const playMelody = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    
    const ctx = audioContextRef.current
    let currentTime = ctx.currentTime
    
    while (isPlayingRef.current) {
      for (const { note, duration } of NYAN_MELODY) {
        if (!isPlayingRef.current) break
        
        const frequency = NOTE_FREQUENCIES[note]
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        
        oscillator.type = 'square'
        oscillator.frequency.setValueAtTime(frequency, currentTime)
        
        gainNode.gain.setValueAtTime(0.15, currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + duration * 0.9)
        
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        
        oscillator.start(currentTime)
        oscillator.stop(currentTime + duration)
        
        currentTime += duration
      }
      
      // Wait for the melody to complete before looping
      const waitTime = (currentTime - ctx.currentTime) * 1000
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
      currentTime = ctx.currentTime
    }
  }, [])

  useEffect(() => {
    if (isPlaying) {
      isPlayingRef.current = true
      playMelody()
    } else {
      isPlayingRef.current = false
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
    
    return () => {
      isPlayingRef.current = false
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [isPlaying, playMelody])
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  
  useNyanMusic(isPlaying)

  const handlePlay = () => {
    setIsPlaying(true)
  }

  return (
    <div className="nyan-cat-container">
      <Stars />
      <Rainbow />
      <div className="nyan-cat-wrapper">
        <NyanCat />
      </div>
      
      {!isPlaying && <PlayOverlay onPlay={handlePlay} />}
    </div>
  )
}

export default App
