'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Target, Zap, Share2 } from 'lucide-react'

interface GameOverScreenProps {
  score: number
  accuracy: number
  botsDestroyed: number
  highestCombo: number
  onRestart: () => void
}

export function GameOverScreen({ 
  score, 
  accuracy, 
  botsDestroyed, 
  highestCombo, 
  onRestart 
}: GameOverScreenProps): JSX.Element {
  
  const getRank = (): string => {
    if (score >= 5000) return '🏆 Bot Slayer'
    if (score >= 3000) return '⚡ Feed Guardian'
    if (score >= 1500) return '🎯 Spam Hunter'
    return '🧹 Spam Janitor'
  }

  const handleShare = (): void => {
    const shareText: string = `🧹 Eliminated ${botsDestroyed} spam bots with ${accuracy}% accuracy — feed is clean again! 💪 #BotHunter\nScore: ${score} | Best Combo: ${highestCombo}x\n\nCan you beat my score?`
    
    if (navigator.share) {
      navigator.share({
        title: 'Bot Hunter Score',
        text: shareText
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText)
      })
    } else {
      navigator.clipboard.writeText(shareText)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-black to-blue-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
      
      <Card className="w-full max-w-2xl bg-black/90 border-purple-500/50 backdrop-blur-xl relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Trophy className="w-20 h-20 text-yellow-400 animate-bounce" />
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Mission Complete!
          </CardTitle>
          <CardDescription className="text-xl text-gray-300">
            {getRank()}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 rounded-lg border border-purple-500/30">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">{score}</div>
              <div className="text-gray-400">Final Score</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-purple-950/50 rounded-lg border border-purple-500/30">
              <Target className="w-8 h-8 mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-white">{accuracy}%</div>
              <div className="text-sm text-gray-400">Accuracy</div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-blue-950/50 rounded-lg border border-blue-500/30">
              <div className="text-3xl mb-2">🤖</div>
              <div className="text-2xl font-bold text-white">{botsDestroyed}</div>
              <div className="text-sm text-gray-400">Bots Eliminated</div>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-purple-950/50 rounded-lg border border-purple-500/30">
              <Zap className="w-8 h-8 mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-white">{highestCombo}x</div>
              <div className="text-sm text-gray-400">Best Combo</div>
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-400 mb-2">Achievements:</div>
            <div className="flex flex-wrap gap-2">
              {botsDestroyed >= 25 && (
                <Badge className="bg-purple-900/50 text-purple-300 border-purple-500/50">
                  🧹 Spam Janitor
                </Badge>
              )}
              {botsDestroyed >= 50 && (
                <Badge className="bg-blue-900/50 text-blue-300 border-blue-500/50">
                  🛡️ Feed Guardian
                </Badge>
              )}
              {highestCombo >= 10 && (
                <Badge className="bg-yellow-900/50 text-yellow-300 border-yellow-500/50">
                  🔥 Combo Master
                </Badge>
              )}
              {accuracy >= 90 && (
                <Badge className="bg-green-900/50 text-green-300 border-green-500/50">
                  🎯 Sharpshooter
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleShare}
              variant="outline"
              className="flex-1 border-purple-500/50 text-purple-300 hover:bg-purple-900/50"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Score
            </Button>
            <Button 
              onClick={onRestart}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500"
            >
              Play Again 🎯
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
