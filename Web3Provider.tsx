'use client'
import { useState, useEffect } from 'react'
import { GameScreen } from '@/components/game/GameScreen'
import { StartScreen } from '@/components/game/StartScreen'
import { GameOverScreen } from '@/components/game/GameOverScreen'
import type { GameState } from '@/types/game'
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";

export default function Home(): JSX.Element {
    const { addMiniApp } = useAddMiniApp();
    const isInFarcaster = useIsInFarcaster()
    useQuickAuth(isInFarcaster)
    useEffect(() => {
      const tryAddMiniApp = async () => {
        try {
          await addMiniApp()
        } catch (error) {
          console.error('Failed to add mini app:', error)
        }

      }

    

      tryAddMiniApp()
    }, [addMiniApp])
    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100));
          if (document.readyState !== 'complete') {
            await new Promise(resolve => {
              if (document.readyState === 'complete') {
                resolve(void 0);
              } else {
                window.addEventListener('load', () => resolve(void 0), { once: true });
              }

            });
          }

          await sdk.actions.ready();
          console.log("Farcaster SDK initialized successfully - app fully loaded");
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error);
          setTimeout(async () => {
            try {
              await sdk.actions.ready();
              console.log('Farcaster SDK initialized on retry');
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError);
            }

          }, 1000);
        }

      };
      initializeFarcaster();
    }, []);
  const [gameState, setGameState] = useState<GameState>('start')
  const [finalScore, setFinalScore] = useState<number>(0)
  const [accuracy, setAccuracy] = useState<number>(0)
  const [botsDestroyed, setBotsDestroyed] = useState<number>(0)
  const [highestCombo, setHighestCombo] = useState<number>(0)

  const handleStartGame = (): void => {
    setGameState('playing')
    setFinalScore(0)
    setAccuracy(0)
    setBotsDestroyed(0)
    setHighestCombo(0)
  }

  const handleGameOver = (score: number, acc: number, bots: number, combo: number): void => {
    setFinalScore(score)
    setAccuracy(acc)
    setBotsDestroyed(bots)
    setHighestCombo(combo)
    setGameState('gameover')
  }

  const handleRestart = (): void => {
    setGameState('start')
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {gameState === 'start' && <StartScreen onStart={handleStartGame} />}
      {gameState === 'playing' && <GameScreen onGameOver={handleGameOver} />}
      {gameState === 'gameover' && (
        <GameOverScreen
          score={finalScore}
          accuracy={accuracy}
          botsDestroyed={botsDestroyed}
          highestCombo={highestCombo}
          onRestart={handleRestart}
        />
      )}
      
      {/* Quick Access Links */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        <a
          href="/test-attribution"
          className="px-4 py-2 bg-purple-600/90 hover:bg-purple-700 text-white text-sm rounded-lg shadow-lg transition-all backdrop-blur-sm border border-purple-400/20"
        >
          🔗 Test Attribution
        </a>
        <a
          href="/spend-permissions"
          className="px-4 py-2 bg-blue-600/90 hover:bg-blue-700 text-white text-sm rounded-lg shadow-lg transition-all backdrop-blur-sm border border-blue-400/20"
        >
          🛡️ Spend Permissions
        </a>
      </div>
    </div>
  )
}
