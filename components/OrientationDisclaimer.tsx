"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface OrientationDisclaimerProps {
  onDisclaimerEnd: () => void
}

const OrientationDisclaimer: React.FC<OrientationDisclaimerProps> = ({ onDisclaimerEnd }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onDisclaimerEnd()
    }, 4000)

    return () => clearTimeout(timer)
  }, [onDisclaimerEnd])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="text-white text-center p-4">
        <h2 className="text-2xl font-bold mb-4">¡Atención!</h2>
        <p className="text-lg">Por favor, gira tu dispositivo a la posición horizontal.</p>
        <p className="text-lg mt-2">El juego no funciona correctamente en modo vertical.</p>
      </div>
    </div>
  )
}

export default OrientationDisclaimer

