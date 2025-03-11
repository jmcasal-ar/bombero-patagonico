"use client"

import Link from "next/link"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const menuItems = [
  {
    title: "Formación y Capacitación",
    href: "/fire-info/formacion",
    subItems: [
      { title: "Cursos y niveles de formación", href: "/fire-info/formacion/cursos" },
      { title: "Módulos de aprendizaje", href: "/fire-info/formacion/modulos" },
      { title: "Descarga de material educativo", href: "/fire-info/formacion/material" },
    ],
  },
  {
    title: "Equipamiento y Técnicas",
    href: "/fire-info/equipamiento",
    subItems: [
      { title: "Agentes extintores y métodos de extinción", href: "/fire-info/equipamiento/agentes" },
      { title: "Herramientas y equipos esenciales", href: "/fire-info/equipamiento/herramientas" },
      { title: "Procedimientos operativos", href: "/fire-info/equipamiento/procedimientos" },
    ],
  },
  {
    title: "Normativas y Legislación",
    href: "/fire-info/normativas",
    subItems: [
      { title: "Ley 25054 y Ley 10917", href: "/fire-info/normativas/leyes" },
      { title: "Reglamentos internos", href: "/fire-info/normativas/reglamentos" },
      { title: "Seguridad y prevención", href: "/fire-info/normativas/seguridad" },
    ],
  },
  {
    title: "Noticias y Eventos",
    href: "/fire-info/noticias",
    subItems: [
      { title: "Simulacros y entrenamientos", href: "/fire-info/noticias/simulacros" },
      { title: "Reconocimientos y casos destacados", href: "/fire-info/noticias/reconocimientos" },
      { title: "Actualizaciones sobre el sistema bomberil", href: "/fire-info/noticias/actualizaciones" },
    ],
  },
  {
    title: "Únete y Contacto",
    href: "/fire-info/unete",
    subItems: [
      { title: "Información para nuevos voluntarios", href: "/fire-info/unete/informacion" },
      { title: "Formulario de inscripción", href: "/fire-info/unete/inscripcion" },
      { title: "Contacto con estaciones de bomberos", href: "/fire-info/unete/contacto" },
    ],
  },
]

const Navigation = () => {
  const [openMenus, setOpenMenus] = useState<number[]>([])

  const toggleMenu = (index: number) => {
    setOpenMenus((prevOpenMenus) =>
      prevOpenMenus.includes(index) ? prevOpenMenus.filter((i) => i !== index) : [...prevOpenMenus, index],
    )
  }

  return (
    <nav className="bg-red-600 text-white">
      <ul className="container mx-auto flex flex-wrap justify-between py-4">
        {menuItems.map((item, index) => (
          <li key={index} className="relative group px-2 py-2">
            <Link href={item.href} className="hover:text-yellow-300 flex items-center">
              {item.title}
              {item.subItems && (
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform ${openMenus.includes(index) ? "rotate-180" : ""}`}
                  onClick={(e) => {
                    e.preventDefault()
                    toggleMenu(index)
                  }}
                />
              )}
            </Link>
            {item.subItems && (
              <ul
                className={`absolute left-0 mt-2 w-48 bg-red-700 rounded-md shadow-lg ${
                  openMenus.includes(index) ? "block" : "hidden"
                }`}
              >
                {item.subItems.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link
                      href={subItem.href}
                      className="block px-4 py-2 text-sm hover:bg-red-800 hover:text-yellow-300"
                    >
                      {subItem.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation

