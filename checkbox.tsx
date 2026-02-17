'use client'

import { useEffect, useState } from 'react'

export function MobileControls(): JSX.Element {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const checkMobile = (): void => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return (): void => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMobile) return <></>

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40">
      <div className="bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3">
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Mobile Controls</div>
          <div className="text-sm text-purple-300 font-semibold">
            👆 Tap on casts to eliminate spam bots!
          </div>
        </div>
      </div>
    </div>
  )
}
