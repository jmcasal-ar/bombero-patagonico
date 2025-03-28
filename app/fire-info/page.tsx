"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Flame, Shield, TreePine, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

const MotionCard = motion(Card)

export default function FireInfoPage() {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-red-100 text-gray-900">
      <main className="container mx-auto py-12 px-4">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Juego
        </Link>
        <motion.h1
          className="text-4xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Incendios Forestales en Argentina
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MotionCard variants={cardVariants} initial="hidden" animate="visible">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Flame className="mr-2 text-red-500" />
                Causas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                <li>95% actividades humanas</li>
                <li>5% causas naturales</li>
                <li>Quemas agropecuarias</li>
                <li>Negligencia recreativa</li>
              </ul>
            </CardContent>
          </MotionCard>

          <MotionCard variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 text-blue-500" />
                Prevención
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                <li>Leyes de protección</li>
                <li>Brigadas especializadas</li>
                <li>Monitoreo satelital</li>
                <li>Campañas educativas</li>
              </ul>
            </CardContent>
          </MotionCard>

          <MotionCard variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TreePine className="mr-2 text-green-500" />
                Áreas Afectadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                <li>Corrientes: 934.000 ha</li>
                <li>Patagonia: 25.000 ha</li>
                <li>Delta del Paraná</li>
                <li>Bosques andinos</li>
              </ul>
            </CardContent>
          </MotionCard>

          <MotionCard variants={cardVariants} initial="hidden" animate="visible" transition={{ delay: 0.6 }}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 text-yellow-500" />
                Impacto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                <li>Pérdida de biodiversidad</li>
                <li>Emisiones de CO2</li>
                <li>Daño a ecosistemas</li>
                <li>Riesgo para comunidades</li>
              </ul>
            </CardContent>
          </MotionCard>
        </div>

        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-4">¿Cómo puedes ayudar?</h2>
          <ul className="list-disc list-inside">
            <li>Respeta las prohibiciones de hacer fuego en áreas de riesgo</li>
            <li>Apaga completamente las fogatas con agua y tierra</li>
            <li>No arrojes colillas de cigarrillos ni fósforos encendidos</li>
            <li>Reporta inmediatamente cualquier señal de incendio a las autoridades</li>
            <li>Participa en campañas de reforestación y restauración de áreas afectadas</li>
          </ul>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Button asChild>
              <Link href="/">Volver al Juego</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="text-center mt-8 text-sm text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <p>
            Este es un juego creado por Erika Umfier, en el marco de la Licenciatura de Ciencia Política de la
            Universidad de Ciencias Sociales - UBA, dentro del seminario Gestión del Desarrollo Tecnológico, con
            intervención del CECOT.
          </p>
          <p className="mt-2">
            Contacto:{" "}
            <a href="mailto:erikaumfier@gmail.com" className="text-blue-600 hover:underline">
              erikaumfier@gmail.com
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  )
}

