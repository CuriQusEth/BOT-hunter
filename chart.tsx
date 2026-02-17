'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { CastFeed } from './CastFeed'
import { GameHUD } from './GameHUD'
import { MobileControls } from './MobileControls'
import { DesktopControls } from './DesktopControls'
import type { Cast, GameStats } from '@/types/game'
import { generateCast } from '@/lib/castGenerator'

interface GameScreenProps {
  onGameOver: (score: number, accuracy: number, bots: number, combo: number) => void
}

const GAME_DURATION = 30
const CAST_SPAWN_INTERVAL = 1200

export function GameScreen({ onGameOver }: GameScreenProps): JSX.Element {
  const [casts, setCasts] = useState<Cast[]>([])
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    combo: 0,
    botsDestroyed: 0,
    totalClicks: 0,
    correctClicks: 0,
    timeRemaining: GAME_DURATION
  })
  const [comboMultiplier, setComboMultiplier] = useState<number>(1)
  const [maxCombo, setMaxCombo] = useState<number>(0)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const spawnRef = useRef<NodeJS.Timeout | null>(null)
  const castIdCounter = useRef<number>(0)

  // Timer countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setStats((prev: GameStats): GameStats => {
        const newTime: number = prev.timeRemaining - 1
        if (newTime <= 0) {
          handleEndGame()
          return { ...prev, timeRemaining: 0 }
        }
        return { ...prev, timeRemaining: newTime }
      })
    }, 1000)

    return (): void => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Spawn casts
  useEffect(() => {
    spawnRef.current = setInterval(() => {
      const newCast: Cast = generateCast(`cast-${castIdCounter.current++}`)
      setCasts((prev: Cast[]): Cast[] => [...prev, newCast])
    }, CAST_SPAWN_INTERVAL)

    return (): void => {
      if (spawnRef.current) clearInterval(spawnRef.current)
    }
  }, [])

  // Remove old casts
  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(() => {
      setCasts((prev: Cast[]): Cast[] => 
        prev.filter((cast: Cast): boolean => Date.now() - cast.timestamp < 8000)
      )
    }, 500)

    return (): void => clearInterval(interval)
  }, [])

  const handleEndGame = useCallback((): void => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (spawnRef.current) clearInterval(spawnRef.current)
    
    const accuracy: number = stats.totalClicks > 0 
      ? Math.round((stats.correctClicks / stats.totalClicks) * 100)
      : 0
    
    onGameOver(stats.score, accuracy, stats.botsDestroyed, maxCombo)
  }, [stats, maxCombo, onGameOver])

  const handleCastClick = useCallback((castId: string, castType: 'bot' | 'real'): void => {
    setCasts((prev: Cast[]): Cast[] => prev.filter((c: Cast): boolean => c.id !== castId))
    
    const isCorrect: boolean = castType === 'bot'
    
    setStats((prev: GameStats): GameStats => {
      const newTotalClicks: number = prev.totalClicks + 1
      const newCorrectClicks: number = prev.correctClicks + (isCorrect ? 1 : 0)
      const newCombo: number = isCorrect ? prev.combo + 1 : 0
      const newBotsDestroyed: number = isCorrect ? prev.botsDestroyed + 1 : prev.botsDestroyed
      
      // Update combo multiplier
      const newMultiplier: number = Math.min(1 + Math.floor(newCombo / 5) * 0.5, 3)
      setComboMultiplier(newMultiplier)
      
      // Track max combo
      if (newCombo > maxCombo) {
        setMaxCombo(newCombo)
      }
      
      // Calculate score change
      let scoreChange: number = 0
      if (isCorrect) {
        scoreChange = Math.round(100 * newMultiplier)
        if (newCombo >= 5) scoreChange += 50
      } else {
        scoreChange = -200
        setComboMultiplier(1)
      }
      
      const newScore: number = Math.max(0, prev.score + scoreChange)
      
      return {
        ...prev,
        score: newScore,
        combo: newCombo,
        botsDestroyed: newBotsDestroyed,
        totalClicks: newTotalClicks,
        correctClicks: newCorrectClicks
      }
    })
  }, [maxCombo])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-blue-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-pulse"></div>
      
      {/* Game HUD */}
      <GameHUD 
        stats={stats}
        multiplier={comboMultiplier}
      />
      
      {/* Desktop Controls Display */}
      <DesktopControls />
      
      {/* Cast Feed */}
      <CastFeed 
        casts={casts}
        onCastClick={handleCastClick}
      />
      
      {/* Mobile Controls */}
      <MobileControls />
    </div>
  )
}
