"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import {
  type GameState,
  CANVAS_HEIGHT,
  FIREFIGHTER_WIDTH,
  FIREFIGHTER_HEIGHT,
  GROUND_HEIGHT,
  OBSTACLE_WIDTH,
  OBSTACLE_HEIGHT,
  MAX_SHOOTS,
  POWERUP_WIDTH,
  POWERUP_HEIGHT,
  FIRE_WIDTH,
  FIRE_HEIGHT,
  updateDimensions,
  BASE_WIDTH,
  GREEN_TREE_WIDTH,
  GREEN_TREE_HEIGHT,
} from "../utils/gameConstants"
import { updateGameState, jump, sprayWater, moveLeft, moveRight, stopMoving } from "../utils/gameFunctions"
import StartScreen from "./StartScreen"
import GameOverScreen from "./GameOverScreen"
import OrientationDisclaimer from "./OrientationDisclaimer"

// Constantes para la animación
const ANIMATION_FRAME_DURATION = 150
const SHOOTING_DURATION = 200 // Duración para mostrar el frame de disparo en milisegundos

// Constantes para la barra de agua
const WATER_BAR_MARGIN = 10
const WATER_BAR_HEIGHT = 20

// Nueva constante para el desplazamiento vertical del juego
const GAME_VERTICAL_OFFSET = 50 // Reducido de 100 a 50 para ajustar la posición vertical

// Constantes para el proyectil de agua
const WATER_JET_WIDTH = 40
const WATER_JET_HEIGHT = 30

// Nueva constante para la posición inicial del jugador en móvil
const MOBILE_FIREFIGHTER_INITIAL_X = 100 // Cambiado de 300 a 100

const Game: React.FC = () => {
  // Estado para detectar si es un dispositivo móvil
  const [isMobile, setIsMobile] = useState(false)

  // Inicializar dimensiones
  const [dimensions, setDimensions] = useState(() => {
    if (typeof window !== "undefined") {
      return { width: window.innerWidth, height: window.innerHeight }
    }
    return { width: 1200, height: 600 } // Valores por defecto
  })

  // Inicializar el estado del juego
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialX = typeof window !== "undefined" && window.innerWidth <= 1024 ? MOBILE_FIREFIGHTER_INITIAL_X : 50
    return {
      firefighter: {
        x: initialX,
        y: CANVAS_HEIGHT - GROUND_HEIGHT - FIREFIGHTER_HEIGHT,
        vy: 0,
        isJumping: false,
        movingLeft: false,
        movingRight: false,
      },
      obstacles: [],
      fires: [],
      waterJets: [],
      score: 0,
      fireDanger: 0,
      gameOver: false,
      elapsedTime: 0,
      remainingShoots: MAX_SHOOTS,
      powerups: [],
    }
  })

  const [isGameStarted, setIsGameStarted] = useState(false)
  const [firefighterRunFrame1, setFirefighterRunFrame1] = useState<HTMLImageElement | null>(null)
  const [firefighterRunFrame2, setFirefighterRunFrame2] = useState<HTMLImageElement | null>(null)
  const [firefighterJumpingImage, setFirefighterJumpingImage] = useState<HTMLImageElement | null>(null)
  const [firefighterShootingImage, setFirefighterShootingImage] = useState<HTMLImageElement | null>(null)
  const [treeImage, setTreeImage] = useState<HTMLImageElement | null>(null)
  const [fireImage, setFireImage] = useState<HTMLImageElement | null>(null)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const [isShooting, setIsShooting] = useState(false)
  const [burnedTreeImage, setBurnedTreeImage] = useState<HTMLImageElement | null>(null)
  const [waterDropletImage, setWaterDropletImage] = useState<HTMLImageElement | null>(null)
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null)
  const [backgroundX, setBackgroundX] = useState(0)
  const [greenTreeImage, setGreenTreeImage] = useState<HTMLImageElement | null>(null)
  const [waterJetImage, setWaterJetImage] = useState<HTMLImageElement | null>(null)
  const [pixelBurnedTreeImage, setPixelBurnedTreeImage] = useState<HTMLImageElement | null>(null)
  const [groundTexture, setGroundTexture] = useState<HTMLImageElement | null>(null)
  const [showInstructions, setShowInstructions] = useState(true)
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  // Referencia al canvas
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Manejar el redimensionamiento y la orientación
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return

      const width = window.innerWidth
      const height = window.innerHeight

      // Actualizar dimensiones del juego
      updateDimensions(width, height)
      setDimensions({ width, height })

      // Actualizar tamaño del canvas
      if (canvasRef.current) {
        canvasRef.current.width = width
        canvasRef.current.height = height
      }

      // Detectar si es un dispositivo móvil o tablet
      setIsMobile(width <= 1024)

      // Mostrar el disclaimer si está en modo retrato en móvil
      setShowDisclaimer(isMobile && width < height)

      // Actualizar la posición del bombero si es necesario
      setGameState((prevState) => ({
        ...prevState,
        firefighter: {
          ...prevState.firefighter,
          x: isMobile ? MOBILE_FIREFIGHTER_INITIAL_X : 50,
          y: Math.min(prevState.firefighter.y, height - GROUND_HEIGHT - FIREFIGHTER_HEIGHT),
        },
      }))
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
    }
  }, [isMobile]) // Added isMobile to dependencies

  // Establecer el estado de montaje
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Cargar imágenes
  useEffect(() => {
    if (!isMounted) return

    // Cargar primer frame de carrera
    const imgRun1 = new Image()
    imgRun1.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1738941970473-OcfxEMac2pPzywLL8bfSk5FxTOFCKu.png"
    imgRun1.crossOrigin = "anonymous"
    imgRun1.onload = () => setFirefighterRunFrame1(imgRun1)

    // Cargar segundo frame de carrera
    const imgRun2 = new Image()
    imgRun2.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1738942522673-Z5Q8I9YDFXLY21tuIQd0JGXWPq4ADV.png"
    imgRun2.crossOrigin = "anonymous"
    imgRun2.onload = () => setFirefighterRunFrame2(imgRun2)

    // Cargar imagen de salto
    const imgJumping = new Image()
    imgJumping.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1738942240688-uRoXzftLJFMx7psM1bOwNamvuNArXS.png"
    imgJumping.crossOrigin = "anonymous"
    imgJumping.onload = () => setFirefighterJumpingImage(imgJumping)

    // Cargar imagen de disparo
    const imgShooting = new Image()
    imgShooting.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1738954040523-s2CoZKg6JzjeZk0e8qGGNPKGLNlneH.png"
    imgShooting.crossOrigin = "anonymous"
    imgShooting.onload = () => setFirefighterShootingImage(imgShooting)

    // Cargar imagen de árbol
    const imgTree = new Image()
    imgTree.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1738943415553-ay3doVZTwd3DzelXGAeLorCknTwWC6.png"
    imgTree.crossOrigin = "anonymous"
    imgTree.onload = () => setTreeImage(imgTree)

    // Cargar imagen de fuego
    const imgFire = new Image()
    imgFire.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1738947742211-yVRylmUXVXwEk1MuFH4hYTzdRXiRsQ.png"
    imgFire.crossOrigin = "anonymous"
    imgFire.onload = () => setFireImage(imgFire)

    // Cargar imagen del árbol quemado
    const imgBurnedTree = new Image()
    imgBurnedTree.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1738958997347-LBYvRGLBOw54IJtFk1HTYHsVLg7wGL.png"
    imgBurnedTree.crossOrigin = "anonymous"
    imgBurnedTree.onload = () => setBurnedTreeImage(imgBurnedTree)

    // Cargar imagen del power-up (extintor)
    const imgWaterDroplet = new Image()
    imgWaterDroplet.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1739206004798-WaafGTf8fOIidDSzmt3k34xtsRijAo.png"
    imgWaterDroplet.crossOrigin = "anonymous"
    imgWaterDroplet.onload = () => setWaterDropletImage(imgWaterDroplet)

    // Cargar imagen de fondo
    const imgBackground = new Image()
    imgBackground.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-3F828PecGFILQ3k1PVR4DW3ObYK8b7.png"
    imgBackground.crossOrigin = "anonymous"
    imgBackground.onload = () => setBackgroundImage(imgBackground)

    // Cargar imagen del árbol verde
    const imgGreenTree = new Image()
    imgGreenTree.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1739206179021-zpspDgzqY5lGb1VJVmpYzfO5XD795o.png"
    imgGreenTree.crossOrigin = "anonymous"
    imgGreenTree.onload = () => setGreenTreeImage(imgGreenTree)

    // Cargar imagen del proyectil de agua
    const imgWaterJet = new Image()
    imgWaterJet.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1739206092677-9ZIIJosFdJ3QQegyKK5lveQoIsARPh.png"
    imgWaterJet.crossOrigin = "anonymous"
    imgWaterJet.onload = () => setWaterJetImage(imgWaterJet)

    // Cargar imagen del árbol quemado pixelado
    const imgPixelBurnedTree = new Image()
    imgPixelBurnedTree.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1739205914900-5M4HD3l5zEE6LYud8MnFsaaZrn7Foe.png"
    imgPixelBurnedTree.crossOrigin = "anonymous"
    imgPixelBurnedTree.onload = () => setPixelBurnedTreeImage(imgPixelBurnedTree)

    // Cargar imagen de textura del suelo
    const imgGround = new Image()
    imgGround.src =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ground_texture-Rl9Ue0Hy9Hy7Hy9Hy9Hy9Hy9Hy9Hy.png"
    imgGround.crossOrigin = "anonymous"
    imgGround.onload = () => setGroundTexture(imgGround)
  }, [isMounted])

  // Temporizador de frame de animación
  useEffect(() => {
    if (!isGameStarted || gameState.gameOver) return

    const animationTimer = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % 2)
    }, ANIMATION_FRAME_DURATION)

    return () => clearInterval(animationTimer)
  }, [isGameStarted, gameState.gameOver])

  // Efecto principal del juego
  useEffect(() => {
    if (!isGameStarted || gameState.gameOver) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const render = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      // Dibujar fondo
      if (backgroundImage) {
        // Calcular la posición del fondo basada en el tiempo del juego
        const scrollSpeed = 0.5 // Ajusta la velocidad del desplazamiento
        setBackgroundX((prev) => (prev - scrollSpeed + backgroundImage.width) % backgroundImage.width) // Update here

        // Dibujar el fondo varias veces para crear el efecto infinito
        let currentX = backgroundX
        while (currentX < dimensions.width) {
          ctx.drawImage(backgroundImage, currentX, 0, backgroundImage.width, dimensions.height)
          currentX += backgroundImage.width
        }
        // Dibujar una copia adicional a la izquierda para el desplazamiento suave
        ctx.drawImage(backgroundImage, backgroundX - backgroundImage.width, 0, backgroundImage.width, dimensions.height)
      }

      // Aplicar el desplazamiento vertical
      ctx.save()
      ctx.translate(0, GAME_VERTICAL_OFFSET)

      // Dibujar suelo con textura
      if (groundTexture) {
        const pattern = ctx.createPattern(groundTexture, "repeat")
        if (pattern) {
          ctx.fillStyle = pattern
          ctx.fillRect(0, dimensions.height - GROUND_HEIGHT - GAME_VERTICAL_OFFSET, dimensions.width, GROUND_HEIGHT)
        }
      } else {
        // Fallback a color sólido si la textura no se ha cargado
        ctx.fillStyle = "#8B4513"
        ctx.fillRect(0, dimensions.height - GROUND_HEIGHT - GAME_VERTICAL_OFFSET, dimensions.width, GROUND_HEIGHT)
      }

      // Dibujar árboles quemados (ambos tipos)
      gameState.fires
        .filter((fire) => fire.type === "burned_tree" || fire.type === "pixel_burned_tree")
        .forEach((burnedTree) => {
          if (burnedTree.type === "pixel_burned_tree" && pixelBurnedTreeImage) {
            ctx.drawImage(pixelBurnedTreeImage, burnedTree.x, burnedTree.y, burnedTree.width, burnedTree.height)
          } else if (burnedTree.type === "burned_tree" && burnedTreeImage) {
            ctx.drawImage(burnedTreeImage, burnedTree.x, burnedTree.y, burnedTree.width, burnedTree.height)
          }
        })

      // Dibujar árboles verdes y normales
      gameState.fires
        .filter((fire) => fire.type !== "burned_tree" && fire.type !== "pixel_burned_tree")
        .forEach((fire) => {
          if (fire.type === "green_tree" && greenTreeImage) {
            ctx.drawImage(greenTreeImage, fire.x, fire.y, GREEN_TREE_WIDTH, GREEN_TREE_HEIGHT)
          } else if (treeImage) {
            ctx.drawImage(treeImage, fire.x, fire.y, FIRE_WIDTH, FIRE_HEIGHT)
          }
        })

      // Dibujar obstáculos (fuegos)
      if (fireImage) {
        gameState.obstacles.forEach((obstacle) => {
          ctx.drawImage(fireImage, obstacle.x, obstacle.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT)
        })
      }

      // Dibujar power-ups - Se dibujan antes que el bombero
      if (waterDropletImage) {
        gameState.powerups.forEach((powerup) => {
          ctx.drawImage(waterDropletImage, powerup.x, powerup.y, POWERUP_WIDTH, POWERUP_HEIGHT)
        })
      }

      // Dibujar bombero - Ahora se dibuja después de los árboles y obstáculos
      if (isShooting && firefighterShootingImage) {
        ctx.drawImage(
          firefighterShootingImage,
          gameState.firefighter.x,
          gameState.firefighter.y,
          FIREFIGHTER_WIDTH,
          FIREFIGHTER_HEIGHT,
        )
      } else if (gameState.firefighter.isJumping && firefighterJumpingImage) {
        ctx.drawImage(
          firefighterJumpingImage,
          gameState.firefighter.x,
          gameState.firefighter.y,
          FIREFIGHTER_WIDTH,
          FIREFIGHTER_HEIGHT,
        )
      } else {
        const currentImage = currentFrame === 0 ? firefighterRunFrame1 : firefighterRunFrame2
        if (currentImage) {
          ctx.drawImage(
            currentImage,
            gameState.firefighter.x,
            gameState.firefighter.y,
            FIREFIGHTER_WIDTH,
            FIREFIGHTER_HEIGHT,
          )
        }
      }

      // Dibujar chorros de agua con la nueva imagen
      if (waterJetImage) {
        gameState.waterJets.forEach((water) => {
          ctx.drawImage(waterJetImage, water.x, water.y, WATER_JET_WIDTH, WATER_JET_HEIGHT)
        })
      }

      // Restaurar el contexto
      ctx.restore()

      // Dibujar barra de agua (fuera del desplazamiento vertical)
      // Escalar tamaño de fuente basado en el ancho del canvas
      const fontSize = Math.max(16, Math.round((20 * dimensions.width) / BASE_WIDTH))
      ctx.fillStyle = "black"
      ctx.font = `${fontSize}px Arial`

      // Dibujar puntuación (en el margen superior izquierdo)
      const scoreText = `Score: ${Math.floor(gameState.score / 100).toLocaleString()}`
      const scoreBarWidth = Math.min(dimensions.width * 0.3, ctx.measureText(scoreText).width + 20) // 30% del ancho total o el ancho del texto + padding
      const scoreBarX = 10 // 10 píxeles desde el borde izquierdo
      const scoreBarY = 10 // 10 píxeles desde el borde superior
      const scoreBarHeight = fontSize + 10

      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fillRect(scoreBarX, scoreBarY, scoreBarWidth, scoreBarHeight)
      ctx.fillStyle = "white"
      ctx.fillText(scoreText, scoreBarX + 10, scoreBarY + fontSize + 5)

      // Dibujar barra de agua (fuera del desplazamiento vertical)
      const waterBarWidth = (dimensions.width - scoreBarWidth - WATER_BAR_MARGIN * 3) * 0.7 // 30% más pequeña
      const waterBarX = scoreBarWidth + WATER_BAR_MARGIN * 2
      const waterBarY = 10
      ctx.fillStyle = "#000000"
      ctx.fillRect(waterBarX, waterBarY, waterBarWidth, WATER_BAR_HEIGHT)
      const waterLevel = (gameState.remainingShoots / MAX_SHOOTS) * waterBarWidth
      ctx.fillStyle = "rgb(121, 159, 199)"
      ctx.fillRect(waterBarX, waterBarY, waterLevel, WATER_BAR_HEIGHT)

      // Restaurar el contexto y configurar para dibujar la puntuación
      ctx.restore()
      ctx.save()

      // Restaurar el contexto
      ctx.restore()
    }

    const gameLoop = () => {
      setGameState((prevState) => updateGameState(prevState))

      render()
      animationFrameId = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [
    isGameStarted,
    gameState.gameOver,
    gameState.firefighter,
    firefighterRunFrame1,
    firefighterRunFrame2,
    firefighterJumpingImage,
    firefighterShootingImage,
    treeImage,
    fireImage,
    currentFrame,
    gameState.fires,
    gameState.obstacles,
    gameState.powerups,
    gameState.remainingShoots,
    gameState.score,
    gameState.waterJets,
    dimensions,
    isShooting,
    burnedTreeImage,
    waterDropletImage,
    backgroundImage,
    backgroundX,
    greenTreeImage,
    waterJetImage,
    pixelBurnedTreeImage,
    groundTexture,
  ])

  // Manejar eventos de teclado y táctiles
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault()
        setGameState((prevState) => jump(prevState))
      } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        e.preventDefault()
        setGameState((prevState) => moveLeft(prevState))
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        e.preventDefault()
        setGameState((prevState) => moveRight(prevState))
      } else if (e.code === "Space" || e.code === "KeyS") {
        e.preventDefault()
        setIsShooting(true)
        setGameState((prevState) => sprayWater(prevState))
        setTimeout(() => setIsShooting(false), SHOOTING_DURATION)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "ArrowRight" || e.code === "KeyA" || e.code === "KeyD") {
        e.preventDefault()
        setGameState((prevState) => stopMoving(prevState))
      }
    }

    // Nuevo manejador para eventos táctiles
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      const touchX = touch.clientX
      const middleX = window.innerWidth / 2

      if (touchX < middleX) {
        handleShootClick()
      } else {
        handleJumpClick()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    if (isMobile) {
      window.addEventListener("touchstart", handleTouchStart)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      if (isMobile) {
        window.removeEventListener("touchstart", handleTouchStart)
      }
    }
  }, [isMobile]) // Added isMobile to dependencies

  // Manejar inicio del juego
  const handleStartGame = () => {
    setIsGameStarted(true)
    setShowInstructions(true)
    setGameState((prevState) => ({
      ...prevState,
      gameOver: false,
      score: 0,
      fireDanger: 0,
      obstacles: [],
      fires: [],
      waterJets: [],
      powerups: [],
      elapsedTime: 0,
      remainingShoots: MAX_SHOOTS,
    }))

    // Ocultar las instrucciones después de 2 segundos
    setTimeout(() => {
      setShowInstructions(false)
    }, 2000)
  }

  // Manejar fin del juego
  const handleGameOver = () => {
    setIsGameStarted(false)
  }

  // Manejar clic en el botón de salto
  const handleJumpClick = () => {
    setGameState((prevState) => jump(prevState))
  }

  // Manejar clic en el botón de disparo
  const handleShootClick = () => {
    setIsShooting(true)
    setGameState((prevState) => sprayWater(prevState))
    setTimeout(() => setIsShooting(false), SHOOTING_DURATION)
  }

  if (!isMounted) {
    return null // o un estado de carga
  }

  if (!isGameStarted) {
    return <StartScreen onStartGame={handleStartGame} />
  }

  if (gameState.gameOver) {
    return <GameOverScreen score={gameState.score} onRestart={handleStartGame} />
  }

  return (
    <div ref={containerRef} className="w-screen h-screen overflow-hidden relative">
      <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} className="w-full h-full" />
      {isMobile && (
        <>
          <div className="fixed inset-0 z-10 pointer-events-none">
            <div className="absolute left-0 top-0 w-1/2 h-full pointer-events-auto" onTouchStart={handleShootClick}>
              <div className="absolute bottom-4 left-8 bg-blue-500 bg-opacity-50 rounded-full p-4">
                <span className="text-white text-2xl">💧</span>
              </div>
            </div>
            <div className="absolute right-0 top-0 w-1/2 h-full pointer-events-auto" onTouchStart={handleJumpClick}>
              <div className="absolute bottom-4 right-4 bg-green-500 bg-opacity-50 rounded-full p-4">
                <span className="text-white text-2xl">↑</span>
              </div>
            </div>
          </div>
          {showDisclaimer && <OrientationDisclaimer onDisclaimerEnd={() => setShowDisclaimer(false)} />}
        </>
      )}
    </div>
  )
}

export default Game

