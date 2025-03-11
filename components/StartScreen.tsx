"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import OrientationDisclaimer from "./OrientationDisclaimer"
import Link from "next/link"

interface StartScreenProps {
  onStartGame: () => void
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame }) => {
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [isLandscape, setIsLandscape] = useState(true)

  useEffect(() => {
    const checkOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight
      setIsLandscape(isLandscape)
      setShowDisclaimer(!isLandscape)
    }

    checkOrientation()

    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)

    if (!isLandscape) {
      const timer = setTimeout(() => {
        setShowDisclaimer(false)
      }, 4000)

      return () => clearTimeout(timer)
    }

    return () => {
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [isLandscape])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-orange-400 to-red-500 cursor-fire">
      <h1 className="text-4xl font-bold mb-8 text-white">Bombero Patagonico</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <p className="text-lg mb-4">¡Ayuda al bombero a correr por el bosque en llamas y salvar el día!</p>
        <ul className="list-disc list-inside mb-4">
          <li>Presiona ↑ para saltar los obstaculos</li>
          <li>Presiona la barra espaciadora para tirar agua y apagar los fuegos</li>
          <li>Esquiva los fuegos!</li>
        </ul>
        <div className="flex flex-col space-y-4">
          <Button onClick={onStartGame} className="w-full">
            Iniciar Juego
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/fire-info">Información sobre Incendios</Link>
          </Button>
        </div>
      </div>
      {showDisclaimer && <OrientationDisclaimer onDisclaimerEnd={() => setShowDisclaimer(false)} />}
    </div>
  )
}

export default StartScreen

