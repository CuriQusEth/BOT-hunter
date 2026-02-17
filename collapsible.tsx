'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Target, Trophy } from 'lucide-react'

interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-black to-blue-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
      
      <Card className="w-full max-w-2xl bg-black/90 border-purple-500/50 backdrop-blur-xl relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Zap className="w-20 h-20 text-purple-500 animate-pulse" />
              <div className="absolute inset-0 blur-xl bg-purple-500/50 animate-pulse"></div>
            </div>
          </div>
          <CardTitle className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            🤖 Bot Hunter
          </CardTitle>
          <CardDescription className="text-xl text-gray-300">
            Protect the Farcaster feed from spam invasion!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-purple-950/50 rounded-lg border border-purple-500/30">
              <Target className="w-8 h-8 mb-2 text-purple-400" />
              <h3 className="font-semibold text-purple-300">Hunt Bots</h3>
              <p className="text-sm text-gray-400 text-center mt-1">Tap spam posts to eliminate them</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-blue-950/50 rounded-lg border border-blue-500/30">
              <Zap className="w-8 h-8 mb-2 text-blue-400" />
              <h3 className="font-semibold text-blue-300">Build Combos</h3>
              <p className="text-sm text-gray-400 text-center mt-1">Chain hits for multipliers</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-purple-950/50 rounded-lg border border-purple-500/30">
              <Trophy className="w-8 h-8 mb-2 text-purple-400" />
              <h3 className="font-semibold text-purple-300">Save the Feed</h3>
              <p className="text-sm text-gray-400 text-center mt-1">Avoid hitting real users</p>
            </div>
          </div>

          <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <h3 className="font-semibold mb-2 text-purple-300">How to Play:</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Tap or click on spam bot posts to eliminate them</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Avoid real user posts or lose points</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Build combos for higher multipliers</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 mr-2">•</span>
                <span>Score as high as possible in 30 seconds</span>
              </li>
            </ul>
          </div>

          <Button 
            onClick={onStart}
            className="w-full h-14 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-purple-500/50"
          >
            Start Hunting 🎯
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
