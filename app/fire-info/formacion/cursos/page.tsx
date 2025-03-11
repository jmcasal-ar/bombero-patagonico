import Navigation from "@/components/Navigation"

export default function CursosPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />
      <main className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8">Cursos y niveles de formación</h1>
        <p className="mb-8">
          Nuestros cursos están diseñados para proporcionar una formación integral a los bomberos voluntarios, abarcando
          desde los conocimientos básicos hasta las técnicas más avanzadas.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Nivel Básico</h2>
            <p>Fundamentos de la lucha contra incendios y primeros auxilios.</p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Nivel Intermedio</h2>
            <p>Técnicas avanzadas de extinción y rescate en diferentes escenarios.</p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Nivel Avanzado</h2>
            <p>Especialización en áreas como materiales peligrosos y rescate en estructuras colapsadas.</p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Formación Continua</h2>
            <p>Actualización constante en nuevas técnicas y tecnologías.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

