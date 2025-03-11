"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const fireMessages = [
  "¿Sabías que en Argentina el manejo del fuego está regulado por la Ley 26.815, que establece medidas de prevención y control de incendios?",
  "¿Sabías que está prohibido iniciar fuegos sin autorización, especialmente en áreas protegidas y forestales?",
  "¿Sabías que los incendios forestales afectan miles de hectáreas cada año, muchas veces por causas humanas?",
  "¿Sabías que existen brigadas de bomberos y voluntarios que trabajan en la prevención y combate del fuego?",
  "¿Sabías que la quema controlada es una técnica permitida solo bajo estricta regulación y supervisión?",
  "¿Sabías que es clave denunciar incendios al 911 o a las autoridades ambientales para una respuesta rápida?",
  "¿Sabías que los productores rurales deben cumplir con normativas para evitar incendios por prácticas agrícolas?",
  "¿Sabías que la Ley de Manejo del Fuego prohíbe cambiar el uso del suelo en áreas afectadas por incendios?",
  "¿Sabías que el cambio climático y la sequía aumentan el riesgo de incendios en Argentina?",
  "¿Sabías que la educación ambiental es fundamental para prevenir incendios y proteger los ecosistemas?",
]

interface GameOverScreenProps {
  score: number
  onRestart: () => void
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-700 to-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Game Over</h2>
        <p className="text-xl mb-4">Tu puntaje: {score}</p>
        <p className="text-xl font-bold text-red-600 mb-4">¡El fuego te alcanzó!</p>
        <p className="text-lg text-green-600 mb-4">{fireMessages[Math.floor(Math.random() * fireMessages.length)]}</p>
        <div className="flex flex-col space-y-4">
          <Button onClick={onRestart} className="w-full">
            Jugar de nuevo
          </Button>
          <Link href="/fire-info" passHref>
            <Button className="w-full bg-blue-500 hover:bg-blue-600">Más información sobre incendios</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GameOverScreen

