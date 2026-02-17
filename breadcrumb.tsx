'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Cast } from '@/types/game'

interface CastCardProps {
  cast: Cast
  onClick: (castId: string, castType: 'bot' | 'real') => void
  delay: number
}

export function CastCard({ cast, onClick, delay }: CastCardProps): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isClicked, setIsClicked] = useState<boolean>(false)

  useEffect(() => {
    const timer: NodeJS.Timeout = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    return (): void => clearTimeout(timer)
  }, [delay])

  const handleClick = (): void => {
    setIsClicked(true)
    onClick(cast.id, cast.type)
  }

  const borderColor: string = cast.type === 'bot' 
    ? 'border-red-500/70' 
    : 'border-blue-500/70'
  
  const bgColor: string = cast.type === 'bot'
    ? 'bg-red-950/40 hover:bg-red-900/60'
    : 'bg-blue-950/40 hover:bg-blue-900/60'

  return (
    <Card 
      className={`
        ${bgColor} ${borderColor} border-2 cursor-pointer
        transition-all duration-200
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${isClicked ? 'scale-95 opacity-0' : 'scale-100'}
        hover:scale-105 active:scale-95
      `}
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10 border-2 border-purple-500/50">
            <AvatarImage src={cast.avatar} alt={cast.username} />
            <AvatarFallback className="bg-purple-900 text-purple-300">
              {cast.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white truncate">
                {cast.username}
              </p>
              {cast.type === 'bot' && (
                <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full border border-red-500/50">
                  🤖 SPAM
                </span>
              )}
            </div>
            <p className="text-gray-300 mt-1 text-sm break-words">
              {cast.content}
            </p>
          </div>
        </div>
      </div>

      {/* Click effect */}
      {isClicked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`
            text-4xl font-bold animate-ping
            ${cast.type === 'bot' ? 'text-red-500' : 'text-blue-500'}
          `}>
            {cast.type === 'bot' ? '💥' : '❌'}
          </div>
        </div>
      )}
    </Card>
  )
}
