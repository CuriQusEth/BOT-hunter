'use client'

import { useEffect, useState } from 'react'
import type { Cast } from '@/types/game'
import { CastCard } from './CastCard'

interface CastFeedProps {
  casts: Cast[]
  onCastClick: (castId: string, castType: 'bot' | 'real') => void
}

export function CastFeed({ casts, onCastClick }: CastFeedProps): JSX.Element {
  const [visibleCasts, setVisibleCasts] = useState<Cast[]>([])

  useEffect(() => {
    setVisibleCasts(casts.slice(-6))
  }, [casts])

  return (
    <div className="fixed inset-0 pt-32 pb-8 md:pt-40 md:pb-12 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto h-full flex flex-col-reverse gap-3 overflow-y-auto scrollbar-hide">
        {visibleCasts.map((cast: Cast, index: number) => (
          <CastCard
            key={cast.id}
            cast={cast}
            onClick={onCastClick}
            delay={index * 100}
          />
        ))}
      </div>
    </div>
  )
}
