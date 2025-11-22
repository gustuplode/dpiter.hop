"use client"

import { useState, useEffect, useRef } from "react"

export function OfflineGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const gameLoopRef = useRef<number | null>(null)
  const gameStateRef = useRef<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem("dinoHighScore")
    if (saved) setHighScore(Number.parseInt(saved))
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !gameStarted || gameOver) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const gameState = {
      dino: {
        x: 50,
        y: 0,
        width: 40,
        height: 40,
        velocityY: 0,
        isJumping: false,
        jumpForce: -15,
        gravity: 0.8,
      },
      obstacles: [] as Array<{ x: number; width: number; height: number; scored: boolean }>,
      ground: canvas.height - 50,
      gameSpeed: 6,
      frameCount: 0,
      score: 0,
    }

    gameState.dino.y = gameState.ground - gameState.dino.height
    gameStateRef.current = gameState

    const jump = () => {
      if (!gameState.dino.isJumping) {
        gameState.dino.velocityY = gameState.dino.jumpForce
        gameState.dino.isJumping = true
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault()
        jump()
      }
    }

    const handleClick = () => jump()

    document.addEventListener("keydown", handleKeyDown)
    canvas.addEventListener("click", handleClick)

    const gameLoop = () => {
      ctx.fillStyle = "#f7f7f7"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Ground
      ctx.fillStyle = "#8A3224"
      ctx.fillRect(0, gameState.ground + 40, canvas.width, 10)

      // Dino
      gameState.dino.velocityY += gameState.dino.gravity
      gameState.dino.y += gameState.dino.velocityY

      if (gameState.dino.y >= gameState.ground - gameState.dino.height) {
        gameState.dino.y = gameState.ground - gameState.dino.height
        gameState.dino.velocityY = 0
        gameState.dino.isJumping = false
      }

      ctx.fillStyle = "#FF6B35"
      ctx.fillRect(gameState.dino.x, gameState.dino.y, gameState.dino.width, gameState.dino.height)

      // Obstacles
      gameState.frameCount++
      if (gameState.frameCount % 90 === 0) {
        const height = 30 + Math.random() * 40
        gameState.obstacles.push({
          x: canvas.width,
          width: 20,
          height: height,
          scored: false,
        })
      }

      for (let i = gameState.obstacles.length - 1; i >= 0; i--) {
        const obs = gameState.obstacles[i]
        obs.x -= gameState.gameSpeed

        ctx.fillStyle = "#8A3224"
        ctx.fillRect(obs.x, gameState.ground + 40 - obs.height, obs.width, obs.height)

        // Collision
        if (
          gameState.dino.x < obs.x + obs.width &&
          gameState.dino.x + gameState.dino.width > obs.x &&
          gameState.dino.y + gameState.dino.height > gameState.ground + 40 - obs.height
        ) {
          setGameOver(true)
          const newScore = Math.floor(gameState.score)
          setScore(newScore)
          if (newScore > highScore) {
            setHighScore(newScore)
            localStorage.setItem("dinoHighScore", newScore.toString())
          }
          if (gameLoopRef.current) {
            cancelAnimationFrame(gameLoopRef.current)
          }
          return
        }

        // Score
        if (!obs.scored && obs.x + obs.width < gameState.dino.x) {
          obs.scored = true
          gameState.score += 1
        }

        if (obs.x < -obs.width) {
          gameState.obstacles.splice(i, 1)
        }
      }

      setScore(Math.floor(gameState.score))
      gameState.gameSpeed += 0.001

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      document.removeEventListener("keydown", handleKeyDown)
      canvas.removeEventListener("click", handleClick)
    }
  }, [gameStarted, gameOver, highScore])

  const handleStart = () => {
    setScore(0)
    setGameOver(false)
    setGameStarted(true)
  }

  const handleRestart = () => {
    setScore(0)
    setGameOver(false)
    setGameStarted(false)
    setTimeout(() => setGameStarted(true), 100)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 mb-4">
          <span className="material-symbols-outlined text-5xl text-[#8A3224]">cloud_off</span>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-text-primary-light dark:text-text-primary-dark">
          No Internet Connection
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Play while you wait for connection to restore!</p>
      </div>

      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="text-xl font-bold text-[#8A3224]">
            Score: {score} | HI: {highScore}
          </div>
          {gameOver && (
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-[#8A3224] text-white rounded-lg font-medium hover:bg-[#6B2619] transition-colors shadow-lg"
            >
              Restart
            </button>
          )}
        </div>

        {!gameStarted ? (
          <div className="flex flex-col items-center gap-4">
            <canvas ref={canvasRef} width={800} height={300} className="w-full border-4 border-[#8A3224] rounded-xl" />
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-[#8A3224] text-white rounded-lg font-medium hover:bg-[#6B2619] transition-colors shadow-lg"
            >
              Start Game
            </button>
          </div>
        ) : (
          <>
            <canvas ref={canvasRef} width={800} height={300} className="w-full border-4 border-[#8A3224] rounded-xl" />
            {gameOver && (
              <div className="text-center mt-4">
                <p className="text-2xl font-bold text-red-600 mb-2">Game Over!</p>
                <p className="text-gray-600 dark:text-gray-400">Tap Restart to play again</p>
              </div>
            )}
          </>
        )}

        <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          Tap screen or press Space/Arrow Up to jump
        </p>
      </div>
    </div>
  )
}
