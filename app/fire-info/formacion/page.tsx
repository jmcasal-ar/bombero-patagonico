import Navigation from "@/components/Navigation"
import Link from "next/link"

export default function FormacionPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />
      <main className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8">Formación y Capacitación</h1>
        <p className="mb-8">
          La formación continua es esencial para mantener a nuestros bomberos voluntarios preparados para cualquier
          emergencia. Explora nuestros programas de capacitación y recursos educativos.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/fire-info/formacion/cursos"
            className="bg-red-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">Cursos y niveles de formación</h2>
            <p>Descubre nuestros programas de formación estructurados para bomberos voluntarios.</p>
          </Link>
          <Link
            href="/fire-info/formacion/modulos"
            className="bg-red-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">Módulos de aprendizaje</h2>
            <p>Explora nuestros módulos especializados en teoría del fuego, primeros auxilios, y más.</p>
          </Link>
          <Link
            href="/fire-info/formacion/material"
            className="bg-red-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">Descarga de material educativo</h2>
            <p>Accede a recursos educativos para complementar tu formación como bombero voluntario.</p>
          </Link>
        </div>
      </main>
    </div>
  )
}

