import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import './App.css'

// Deterministic pseudo-random number generator
function seededRandom(seed) {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function Star({ style, size }) {
  return <div className={`star ${size}`} style={style} />
}

function Stars() {
  const stars = useMemo(() => {
    const sizes = ['small', 'medium', 'large']
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      size: sizes[Math.floor(seededRandom(i * 41) * 3)],
      style: {
        left: `${seededRandom(i * 7) * 100}%`,
        top: `${seededRandom(i * 13) * 100}%`,
        animation: `star-twinkle ${seededRandom(i * 31) * 1 + 0.5}s ${seededRandom(i * 29) * 2}s infinite`,
      }
    }))
  }, [])

  return (
    <div className="stars">
      {stars.map(star => (
        <Star key={star.id} style={star.style} size={star.size} />
      ))}
    </div>
  )
}

function Rainbow() {
  return (
    <div className="rainbow">
      <div className="rainbow-segment">
        <div className="rainbow-stripe" />
        <div className="rainbow-stripe" />
        <div className="rainbow-stripe" />
        <div className="rainbow-stripe" />
        <div className="rainbow-stripe" />
        <div className="rainbow-stripe" />
      </div>
    </div>
  )
}

function NyanCat() {
  return (
    <div className="nyan-cat">
      <div className="nyan-sprite frame1" />
      <div className="nyan-sprite frame2" />
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
