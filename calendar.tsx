'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { X } from 'lucide-react'

export function DesktopControls(): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const [isDesktop, setIsDesktop] = useState<boolean>(false)

  useEffect(() => {
    const checkDesktop = (): void => {
      setIsDesktop(window.innerWidth >= 768)
    }
    
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    
    const timer: NodeJS.Timeout = setTimeout(() => {
      setIsVisible(false)
    }, 5000)
    
    return (): void => {
      window.removeEventListener('resize', checkDesktop)
      clearTimeout(timer)
    }
  }, [])

  if (!isDesktop || !isVisible) return <></>

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-40 animate-fade-in">
      <Card className="bg-black/80 backdrop-blur-sm border-gray-700 p-3 relative">
        <button
          onClick={(): void => setIsVisible(false)}
          className="absolute -top-2 -right-2 bg-gray-800 hover:bg-gray-700 rounded-full p-1 transition-colors"
        >
          <X className="w-3 h-3 text-gray-400" />
        </button>
        
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-2">Controls</div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-gray-800 rounded text-purple-300 font-mono">Click</span>
              <span className="text-gray-400">-</span>
              <span className="text-gray-300">Eliminate Bot</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
