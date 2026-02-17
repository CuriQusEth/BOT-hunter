'use client'

import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import type { GameStats } from '@/types/game'
import { Zap, Target, Clock } from 'lucide-react'

interface GameHUDProps {
  stats: GameStats
  multiplier: number
}

export function GameHUD({ stats, multiplier }: GameHUDProps): JSX.Element {
  const timePercentage: number = (stats.timeRemaining / 30) * 100

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-black/80 backdrop-blur-sm border-b border-purple-500/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Score */}
          <div className="flex items-center space-x-2 bg-purple-900/50 px-4 py-2 rounded-lg border border-purple-500/50">
            <Target className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-xs text-gray-400">Score</div>
              <div className="text-xl font-bold text-purple-300">{stats.score}</div>
            </div>
          </div>

          {/* Combo */}
          <div className="flex items-center space-x-2 bg-blue-900/50 px-4 py-2 rounded-lg border border-blue-500/50">
            <Zap className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-xs text-gray-400">Combo</div>
              <div className="text-xl font-bold text-blue-300">
                {stats.combo}x
                {multiplier > 1 && (
                  <span className="text-sm ml-1 text-yellow-400">({multiplier}x)</span>
                )}
              </div>
            </div>
          </div>

          {/* Bots Destroyed */}
          <div className="flex items-center space-x-2 bg-purple-900/50 px-4 py-2 rounded-lg border border-purple-500/50">
            <div className="text-2xl">🤖</div>
            <div>
              <div className="text-xs text-gray-400">Eliminated</div>
              <div className="text-xl font-bold text-purple-300">{stats.botsDestroyed}</div>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center space-x-2 bg-blue-900/50 px-4 py-2 rounded-lg border border-blue-500/50">
            <Clock className="w-5 h-5 text-blue-400" />
            <div className="flex-1">
              <div className="text-xs text-gray-400">Time</div>
              <div className={`text-xl font-bold ${stats.timeRemaining <= 5 ? 'text-red-400 animate-pulse' : 'text-blue-300'}`}>
                {stats.timeRemaining}s
              </div>
            </div>
          </div>
        </div>

        {/* Timer Progress Bar */}
        <div className="mt-3">
          <Progress 
            value={timePercentage} 
            className="h-2 bg-gray-800"
          />
        </div>

        {/* Combo Badge */}
        {stats.combo >= 5 && (
          <div className="mt-2 flex justify-center">
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white animate-pulse">
              🔥 {stats.combo} Hit Combo! +{multiplier}x Multiplier
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}
