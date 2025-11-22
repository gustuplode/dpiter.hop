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
    const timer = setTimeout(() => {
      if (!gameStarted && !gameOver) {
        setGameStarted(true)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [gameStarted, gameOver])

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
        x: 80,
        y: 0,
        width: 44,
        height: 48,
        velocityY: 0,
        isJumping: false,
        jumpForce: -16,
        gravity: 0.85,
      },
      obstacles: [] as Array<{ x: number; width: number; height: number; scored: boolean; type: string }>,
      ground: canvas.height - 60,
      gameSpeed: 7,
      frameCount: 0,
      score: 0,
      clouds: [] as Array<{ x: number; y: number; speed: number }>,
    }

    gameState.dino.y = gameState.ground - gameState.dino.height
    gameStateRef.current = gameState

    for (let i = 0; i < 3; i++) {
      gameState.clouds.push({
        x: Math.random() * canvas.width,
        y: 30 + Math.random() * 80,
        speed: 0.5 + Math.random() * 1,
      })
    }

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
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault()
      jump()
    }

    document.addEventListener("keydown", handleKeyDown)
    canvas.addEventListener("click", handleClick)
    canvas.addEventListener("touchstart", handleTouch)

    const gameLoop = () => {
      // Sky gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#87CEEB")
      gradient.addColorStop(1, "#E0F6FF")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Clouds
      gameState.clouds.forEach((cloud) => {
        cloud.x -= cloud.speed
        if (cloud.x < -60) cloud.x = canvas.width + 60

        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.beginPath()
        ctx.arc(cloud.x, cloud.y, 20, 0, Math.PI * 2)
        ctx.arc(cloud.x + 15, cloud.y - 5, 25, 0, Math.PI * 2)
        ctx.arc(cloud.x + 30, cloud.y, 20, 0, Math.PI * 2)
        ctx.fill()
      })

      // Ground
      ctx.fillStyle = "#8A3224"
      ctx.fillRect(0, gameState.ground + 48, canvas.width, 12)

      // Ground line
      ctx.strokeStyle = "#6B2619"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, gameState.ground + 48)
      ctx.lineTo(canvas.width, gameState.ground + 48)
      ctx.stroke()

      gameState.dino.velocityY += gameState.dino.gravity
      gameState.dino.y += gameState.dino.velocityY

      if (gameState.dino.y >= gameState.ground - gameState.dino.height) {
        gameState.dino.y = gameState.ground - gameState.dino.height
        gameState.dino.velocityY = 0
        gameState.dino.isJumping = false
      }

      // Draw dino body
      ctx.fillStyle = "#FF6B35"
      ctx.fillRect(gameState.dino.x, gameState.dino.y + 8, gameState.dino.width, gameState.dino.height - 8)

      // Dino head
      ctx.fillRect(gameState.dino.x + 24, gameState.dino.y, 20, 20)

      // Eye
      ctx.fillStyle = "#fff"
      ctx.fillRect(gameState.dino.x + 32, gameState.dino.y + 6, 6, 6)
      ctx.fillStyle = "#000"
      ctx.fillRect(gameState.dino.x + 34, gameState.dino.y + 8, 3, 3)

      // Legs
      ctx.fillStyle = "#FF6B35"
      const legOffset = Math.floor(gameState.frameCount / 8) % 2 === 0 ? 0 : 4
      ctx.fillRect(gameState.dino.x + 8, gameState.dino.y + gameState.dino.height - 8, 8, 8)
      ctx.fillRect(gameState.dino.x + 24 + legOffset, gameState.dino.y + gameState.dino.height - 8, 8, 8)

      // Tail
      ctx.fillRect(gameState.dino.x - 8, gameState.dino.y + 16, 12, 8)

      // Obstacles
      gameState.frameCount++
      if (gameState.frameCount % 75 === 0) {
        const types = ["cactus", "rock", "bird"]
        const type = types[Math.floor(Math.random() * types.length)]
        const height = type === "bird" ? 20 : 35 + Math.random() * 25

        gameState.obstacles.push({
          x: canvas.width,
          width: type === "bird" ? 30 : 20,
          height: height,
          scored: false,
          type: type,
        })
      }

      for (let i = gameState.obstacles.length - 1; i >= 0; i--) {
        const obs = gameState.obstacles[i]
        obs.x -= gameState.gameSpeed

        const obsY = obs.type === "bird" ? gameState.ground - obs.height - 60 : gameState.ground + 48 - obs.height

        // Draw obstacle based on type
        if (obs.type === "bird") {
          ctx.fillStyle = "#333"
          ctx.fillRect(obs.x, obsY, obs.width, obs.height)
          // Wings
          ctx.fillRect(obs.x - 5, obsY + 5, 10, 5)
          ctx.fillRect(obs.x + obs.width - 5, obsY + 5, 10, 5)
        } else {
          ctx.fillStyle = "#8A3224"
          ctx.fillRect(obs.x, obsY, obs.width, obs.height)
          // Details
          ctx.fillStyle = "#6B2619"
          ctx.fillRect(obs.x + 3, obsY + 3, obs.width - 6, 3)
        }

        // Collision detection
        if (
          gameState.dino.x < obs.x + obs.width - 5 &&
          gameState.dino.x + gameState.dino.width - 5 > obs.x &&
          gameState.dino.y < obsY + obs.height &&
          gameState.dino.y + gameState.dino.height > obsY
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

      // Update score display
      setScore(Math.floor(gameState.score))

      // Gradually increase speed
      gameState.gameSpeed += 0.002

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
      document.removeEventListener("keydown", handleKeyDown)
      canvas.removeEventListener("click", handleClick)
      canvas.removeEventListener("touchstart", handleTouch)
    }
  }, [gameStarted, gameOver, highScore])

  const handleRestart = () => {
    setScore(0)
    setGameOver(false)
    setGameStarted(false)
    setTimeout(() => setGameStarted(true), 50)
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

        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full border-4 border-[#8A3224] rounded-xl shadow-2xl"
        />

        {gameOver && (
          <div className="text-center mt-4">
            <p className="text-2xl font-bold text-red-600 mb-2">Game Over!</p>
            <p className="text-gray-600 dark:text-gray-400">Tap Restart to play again</p>
          </div>
        )}

        <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
          Tap screen or press Space/Arrow Up to jump
        </p>
      </div>
    </div>
  )
}
