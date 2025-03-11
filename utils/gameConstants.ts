// Dimensiones base (usadas como referencia para el escalado)
export const BASE_WIDTH = 1200
export const BASE_HEIGHT = 600

// Estas se establecerán dinámicamente según el tamaño de la pantalla
export let CANVAS_WIDTH = BASE_WIDTH
export let CANVAS_HEIGHT = BASE_HEIGHT

// Factores de escala
export let SCALE_X = 1
export let SCALE_Y = 1

// Dimensiones dinámicas (se actualizarán cuando se redimensione el canvas)
export let GROUND_HEIGHT = 100
export let FIREFIGHTER_WIDTH = 80
export let FIREFIGHTER_HEIGHT = 80
export let OBSTACLE_WIDTH = 60
export let OBSTACLE_HEIGHT = 90
export let FIRE_WIDTH = 360
export let FIRE_HEIGHT = 540
export let WATER_WIDTH = 15
export let WATER_HEIGHT = 15
export let POWERUP_WIDTH = 120
export let POWERUP_HEIGHT = 120
export let BURNED_TREE_WIDTH = 360
export let BURNED_TREE_HEIGHT = 540
export let GREEN_TREE_WIDTH = 360 // Nueva constante
export let GREEN_TREE_HEIGHT = 540 // Nueva constante

// Add new constants for the pixel art burned tree
export let PIXEL_BURNED_TREE_WIDTH = 360
export let PIXEL_BURNED_TREE_HEIGHT = 540

// Dimensiones de la barra de agua
export let WATER_BAR_WIDTH = 200
export const WATER_BAR_HEIGHT = 20

// Constantes que no necesitan escalado
export const JUMP_FORCE = -13
export let GRAVITY = 0.1
export let MAX_FALLING_SPEED = 10
export const MOVE_SPEED = 2.5
export const MAX_SHOOTS = 100
export const POWERUP_SHOOTS = 10
export const INITIAL_GAME_SPEED = 1.0 // Aumentado de 0.8 a 1.0
export const DIFFICULTY_INCREASE_INTERVAL = 20 // Reducido de 30 a 20
export let SPEED_INCREMENT = 0.06 // Aumentado de 0.04 a 0.06
export const OBSTACLE_GENERATION_BASE_RATE = 0.001 // Aumentado de 0.0008 a 0.001
export let OBSTACLE_GENERATION_INCREMENT = 0.0001 // Nueva constante

// Constantes específicas para móviles
export const MOBILE_GRAVITY = 0.05
export const MOBILE_MAX_FALLING_SPEED = 5
export const MOBILE_SPEED_INCREMENT = 0.03
export const MOBILE_OBSTACLE_GENERATION_INCREMENT = 0.00005

// Función para calcular la fuerza de salto dinámica
export function calculateJumpForce(firefighterY: number, firefighterHeight: number): number {
  const distanceToTop = firefighterY
  const maxJumpHeight = (CANVAS_HEIGHT - GROUND_HEIGHT) * 0.75 // 3/4 de la altura de la pantalla
  const desiredJumpHeight = Math.min(distanceToTop, maxJumpHeight)

  // Usamos la fórmula de la cinemática: v^2 = 2 * a * d
  // Donde v es la velocidad inicial (fuerza de salto), a es la gravedad, y d es la distancia
  const jumpForce = Math.sqrt(2 * GRAVITY * desiredJumpHeight)

  return -jumpForce // Negativo porque el eje Y está invertido en el canvas
}

// Función para actualizar las dimensiones basadas en la escala
export function updateDimensions(width: number, height: number) {
  CANVAS_WIDTH = width
  CANVAS_HEIGHT = height

  SCALE_X = width / BASE_WIDTH
  SCALE_Y = height / BASE_HEIGHT

  // Calcular un factor de escala común para mantener las proporciones
  const commonScale = Math.min(SCALE_X, SCALE_Y)

  // Actualizar las dimensiones usando el factor de escala común
  GROUND_HEIGHT = Math.round(100 * commonScale)
  FIREFIGHTER_WIDTH = Math.round(80 * commonScale)
  FIREFIGHTER_HEIGHT = Math.round(80 * commonScale)
  OBSTACLE_WIDTH = Math.round(60 * commonScale)
  OBSTACLE_HEIGHT = Math.round(90 * commonScale)
  FIRE_WIDTH = Math.round(360 * commonScale)
  FIRE_HEIGHT = Math.round(540 * commonScale)
  WATER_WIDTH = Math.round(15 * commonScale)
  WATER_HEIGHT = Math.round(15 * commonScale)
  POWERUP_WIDTH = Math.round(120 * commonScale)
  POWERUP_HEIGHT = Math.round(120 * commonScale)
  BURNED_TREE_WIDTH = Math.round(360 * commonScale)
  BURNED_TREE_HEIGHT = Math.round(540 * commonScale)
  GREEN_TREE_WIDTH = Math.round(360 * commonScale)
  GREEN_TREE_HEIGHT = Math.round(540 * commonScale)
  PIXEL_BURNED_TREE_WIDTH = Math.round(360 * commonScale)
  PIXEL_BURNED_TREE_HEIGHT = Math.round(540 * commonScale)

  // Actualizar el ancho de la barra de agua basado en el ancho del canvas
  WATER_BAR_WIDTH = Math.round(200 * SCALE_X)

  // Establecer constantes específicas para móviles si el ancho es menor o igual a 768px
  if (width <= 768) {
    GRAVITY = MOBILE_GRAVITY
    MAX_FALLING_SPEED = MOBILE_MAX_FALLING_SPEED
    SPEED_INCREMENT = MOBILE_SPEED_INCREMENT
    OBSTACLE_GENERATION_INCREMENT = MOBILE_OBSTACLE_GENERATION_INCREMENT
  } else {
    // Restablecer a valores predeterminados para desktop
    GRAVITY = 0.1
    MAX_FALLING_SPEED = 10
    SPEED_INCREMENT = 0.06
    OBSTACLE_GENERATION_INCREMENT = 0.0001
  }
}

// Tipos de objetos del juego
export type GameObject = {
  x: number
  y: number
  width: number
  height: number
  type: "obstacle" | "fire" | "water" | "powerup" | "burned_tree" | "green_tree" | "pixel_burned_tree"
}

// Estado del juego
export type GameState = {
  firefighter: {
    x: number
    y: number
    vy: number
    isJumping: boolean
    movingLeft: boolean
    movingRight: boolean
  }
  obstacles: GameObject[]
  fires: GameObject[]
  waterJets: GameObject[]
  score: number
  fireDanger: number
  gameOver: boolean
  elapsedTime: number
  remainingShoots: number
  powerups: GameObject[]
}

