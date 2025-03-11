import {
  type GameObject,
  type GameState,
  CANVAS_HEIGHT,
  GROUND_HEIGHT,
  FIREFIGHTER_HEIGHT,
  GRAVITY,
  CANVAS_WIDTH,
  OBSTACLE_HEIGHT,
  OBSTACLE_WIDTH,
  POWERUP_WIDTH,
  POWERUP_HEIGHT,
  POWERUP_SHOOTS,
  FIREFIGHTER_WIDTH,
  MAX_SHOOTS,
  FIRE_HEIGHT,
  FIRE_WIDTH,
  MOVE_SPEED,
  INITIAL_GAME_SPEED,
  DIFFICULTY_INCREASE_INTERVAL,
  SPEED_INCREMENT,
  OBSTACLE_GENERATION_BASE_RATE,
  OBSTACLE_GENERATION_INCREMENT,
  BURNED_TREE_HEIGHT,
  BURNED_TREE_WIDTH,
  GREEN_TREE_HEIGHT,
  GREEN_TREE_WIDTH,
  PIXEL_BURNED_TREE_HEIGHT,
  PIXEL_BURNED_TREE_WIDTH,
  calculateJumpForce,
} from "./gameConstants"

// Función principal para actualizar el estado del juego
export function updateGameState(gameState: GameState): GameState {
  const { firefighter, obstacles, fires, waterJets, score, fireDanger, elapsedTime, remainingShoots, powerups } =
    gameState

  // Calcular la velocidad actual del juego basada en el tiempo transcurrido
  const gameSpeed = INITIAL_GAME_SPEED + (elapsedTime / DIFFICULTY_INCREASE_INTERVAL) * SPEED_INCREMENT

  // Calcular la tasa actual de generación de obstáculos
  const obstacleGenerationRate =
    OBSTACLE_GENERATION_BASE_RATE + (gameSpeed - INITIAL_GAME_SPEED) * OBSTACLE_GENERATION_INCREMENT

  // Actualizar la posición del bombero
  let newFirefighterY = firefighter.y + firefighter.vy
  let newVy = firefighter.vy + GRAVITY
  let newFirefighterX = firefighter.x

  // Añadir movimiento horizontal
  if (firefighter.movingLeft) {
    newFirefighterX -= MOVE_SPEED
  }
  if (firefighter.movingRight) {
    newFirefighterX += MOVE_SPEED
  }

  // Asegurar que el bombero se mantenga dentro de los límites del canvas
  newFirefighterX = Math.max(0, Math.min(newFirefighterX, CANVAS_WIDTH - FIREFIGHTER_WIDTH))

  if (newFirefighterY > CANVAS_HEIGHT - GROUND_HEIGHT - FIREFIGHTER_HEIGHT) {
    newFirefighterY = CANVAS_HEIGHT - GROUND_HEIGHT - FIREFIGHTER_HEIGHT
    newVy = 0
  }

  // Añadir una velocidad máxima de caída para evitar que el bombero caiga demasiado rápido
  const MAX_FALLING_SPEED = 10 // Reducido de 15 a 10 para una caída más lenta
  if (newVy > MAX_FALLING_SPEED) {
    newVy = MAX_FALLING_SPEED
  }

  // Actualizar obstáculos y fuegos con la velocidad aumentada
  const updatedObstacles = obstacles
    .map((obj) => ({ ...obj, x: obj.x - gameSpeed * 0.8 })) // Reducido a 0.8 para compensar la velocidad más lenta del jugador
    .filter((obj) => obj.x > -obj.width)
  const updatedFires = fires
    .map((obj) => ({ ...obj, x: obj.x - gameSpeed * 0.8 })) // Reducido a 0.8 para compensar la velocidad más lenta del jugador
    .filter((obj) => obj.x > -obj.width)

  // Actualizar chorros de agua
  const updatedWaterJets = waterJets
    .map((obj) => ({ ...obj, x: obj.x + gameSpeed * 5 }))
    .filter((obj) => obj.x < CANVAS_WIDTH)

  // Actualizar power-ups
  const updatedPowerups = powerups
    .map((obj) => ({ ...obj, x: obj.x - gameSpeed * 0.8 })) // Reducido a 0.8 para compensar la velocidad más lenta del jugador
    .filter((obj) => obj.x > -obj.width)

  // Comprobar colisiones
  const collidedWithObstacle = checkCollision(firefighter, updatedObstacles)
  const { extinguishedFires, usedWaterJets } = checkFireExtinguished(updatedWaterJets, updatedObstacles)
  const collectedPowerup = checkCollision(firefighter, updatedPowerups)

  // Actualizar puntuación y peligro de fuego
  const newScore = score + 1 + extinguishedFires.length * 15
  const newFireDanger = Math.max(0, fireDanger - extinguishedFires.length * 3)

  // Actualizar tiempo transcurrido
  const newElapsedTime = elapsedTime + 1 / 60 // Asumiendo 60 FPS

  // Comprobar condiciones de fin de juego
  const gameOver = collidedWithObstacle

  const newRemainingShoots = collectedPowerup ? Math.min(remainingShoots + POWERUP_SHOOTS, MAX_SHOOTS) : remainingShoots

  // Generar nuevos obstáculos basados en la tasa actual
  const newObstacles = [...updatedObstacles]
  if (Math.random() < obstacleGenerationRate) {
    newObstacles.push(generateObstacle())
  }

  // Generar nuevos fuegos (árboles) y árboles quemados
  const newFires = [...updatedFires]
  if (Math.random() < 0.0015) {
    // Alternar aleatoriamente entre los dos tipos de árboles quemados
    if (Math.random() < 0.5) {
      newFires.push(generateBurnedTree())
    } else {
      newFires.push(generatePixelBurnedTree())
    }
  }
  if (Math.random() < 0.003) {
    newFires.push(generateGreenTree())
  }

  // Generar nuevos power-ups (aumentar ligeramente la tasa)
  const newPowerups = [...updatedPowerups]
  if (Math.random() < 0.0006) {
    // Aumentado de 0.0005 a 0.0006
    newPowerups.push(generatePowerup())
  }

  // Filtrar los obstáculos y fuegos extinguidos
  const remainingObstacles = newObstacles.filter((obstacle) => !extinguishedFires.includes(obstacle))

  return {
    ...gameState,
    firefighter: {
      ...firefighter,
      x: newFirefighterX,
      y: newFirefighterY,
      vy: newVy,
      isJumping: newFirefighterY < CANVAS_HEIGHT - GROUND_HEIGHT - FIREFIGHTER_HEIGHT,
    },
    obstacles: remainingObstacles,
    fires: newFires,
    waterJets: updatedWaterJets.filter((jet) => !usedWaterJets.includes(jet)),
    powerups: newPowerups.filter((powerup) => !collectedPowerup || powerup !== collectedPowerup),
    score: newScore,
    fireDanger: newFireDanger,
    elapsedTime: newElapsedTime,
    gameOver,
    remainingShoots: newRemainingShoots,
  }
}

// Función para comprobar colisiones entre el bombero y otros objetos
export function checkCollision(firefighter: GameState["firefighter"], objects: GameObject[]): GameObject | null {
  for (const obj of objects) {
    if (
      firefighter.x < obj.x + obj.width &&
      firefighter.x + FIREFIGHTER_WIDTH > obj.x &&
      firefighter.y < obj.y + obj.height &&
      firefighter.y + FIREFIGHTER_HEIGHT > obj.y
    ) {
      return obj
    }
  }
  return null
}

// Función para comprobar si los chorros de agua han extinguido algún fuego
export function checkFireExtinguished(
  waterJets: GameObject[],
  fires: GameObject[],
): { extinguishedFires: GameObject[]; usedWaterJets: GameObject[] } {
  const extinguishedFires: GameObject[] = []
  const usedWaterJets: GameObject[] = []

  for (const water of waterJets) {
    if (usedWaterJets.includes(water)) continue

    for (const fire of fires) {
      if (extinguishedFires.includes(fire)) continue

      if (
        fire.type === "obstacle" &&
        water.x < fire.x + fire.width &&
        water.x + water.width > fire.x &&
        water.y < fire.y + fire.height &&
        water.y + water.height > fire.y
      ) {
        extinguishedFires.push(fire)
        usedWaterJets.push(water)
        break // Salir del bucle interno después de apagar un fuego
      }
    }
  }

  return { extinguishedFires, usedWaterJets }
}

// Función para hacer saltar al bombero
export function jump(gameState: GameState): GameState {
  if (
    !gameState.firefighter.isJumping ||
    gameState.firefighter.y > CANVAS_HEIGHT - GROUND_HEIGHT - FIREFIGHTER_HEIGHT - 10
  ) {
    const jumpForce = calculateJumpForce(gameState.firefighter.y, FIREFIGHTER_HEIGHT)
    return {
      ...gameState,
      firefighter: {
        ...gameState.firefighter,
        vy: jumpForce,
        isJumping: true,
      },
    }
  }
  return gameState
}

// Función para mover al bombero a la izquierda
export function moveLeft(gameState: GameState): GameState {
  return {
    ...gameState,
    firefighter: {
      ...gameState.firefighter,
      movingLeft: true,
    },
  }
}

// Función para mover al bombero a la derecha
export function moveRight(gameState: GameState): GameState {
  return {
    ...gameState,
    firefighter: {
      ...gameState.firefighter,
      movingRight: true,
    },
  }
}

// Función para detener el movimiento del bombero
export function stopMoving(gameState: GameState): GameState {
  return {
    ...gameState,
    firefighter: {
      ...gameState.firefighter,
      movingLeft: false,
      movingRight: false,
    },
  }
}

// Función para rociar agua
export function sprayWater(gameState: GameState): GameState {
  if (gameState.remainingShoots <= 0) return gameState

  const newWaterJet: GameObject = {
    x: gameState.firefighter.x + FIREFIGHTER_WIDTH,
    y: gameState.firefighter.y + FIREFIGHTER_HEIGHT / 2 - 15, // Ajustado para centrar mejor el proyectil
    width: 40, // Nuevo ancho del proyectil
    height: 30, // Nueva altura del proyectil
    type: "water",
  }

  return {
    ...gameState,
    waterJets: [...gameState.waterJets, newWaterJet],
    remainingShoots: gameState.remainingShoots - 1,
  }
}

// Función para eliminar el obstáculo más cercano
export function removeNearestObstacle(gameState: GameState): GameState {
  if (gameState.obstacles.length === 0 || gameState.remainingShoots <= 0) return gameState

  const firefighterX = gameState.firefighter.x
  let nearestObstacleIndex = 0
  let shortestDistance = Number.POSITIVE_INFINITY

  gameState.obstacles.forEach((obstacle, index) => {
    const distance = obstacle.x - firefighterX
    if (distance > 0 && distance < shortestDistance) {
      shortestDistance = distance
      nearestObstacleIndex = index
    }
  })

  const updatedObstacles = [...gameState.obstacles]
  updatedObstacles.splice(nearestObstacleIndex, 1)

  return {
    ...gameState,
    obstacles: updatedObstacles,
    remainingShoots: gameState.remainingShoots - 1,
  }
}

// Función para generar un nuevo obstáculo
export function generateObstacle(): GameObject {
  return {
    x: CANVAS_WIDTH,
    y: CANVAS_HEIGHT - GROUND_HEIGHT - OBSTACLE_HEIGHT, // Ahora siempre al nivel del suelo
    width: OBSTACLE_WIDTH,
    height: OBSTACLE_HEIGHT,
    type: "obstacle",
  }
}

// Función para generar un nuevo fuego
export function generateFire(): GameObject {
  return {
    x: CANVAS_WIDTH,
    y: CANVAS_HEIGHT - GROUND_HEIGHT - FIRE_HEIGHT, // Ajustado para que esté en la línea del suelo
    width: FIRE_WIDTH,
    height: FIRE_HEIGHT,
    type: "fire",
  }
}

// Función para generar un nuevo power-up
export function generatePowerup(): GameObject {
  const minY = CANVAS_HEIGHT / 2 // La mitad de la altura del canvas
  const maxY = CANVAS_HEIGHT - GROUND_HEIGHT - POWERUP_HEIGHT // Justo encima del suelo
  const randomY = Math.random() * (maxY - minY) + minY

  return {
    x: CANVAS_WIDTH,
    y: randomY,
    width: POWERUP_WIDTH,
    height: POWERUP_HEIGHT,
    type: "powerup",
  }
}

// Función para generar un nuevo árbol quemado
export function generateBurnedTree(): GameObject {
  return {
    x: CANVAS_WIDTH,
    y: CANVAS_HEIGHT - GROUND_HEIGHT - BURNED_TREE_HEIGHT, // Ajustado para que esté en la línea del suelo
    width: BURNED_TREE_WIDTH,
    height: BURNED_TREE_HEIGHT,
    type: "burned_tree",
  }
}

// Añadir la función para generar un árbol verde
export function generateGreenTree(): GameObject {
  return {
    x: CANVAS_WIDTH,
    y: CANVAS_HEIGHT - GROUND_HEIGHT - GREEN_TREE_HEIGHT,
    width: GREEN_TREE_WIDTH,
    height: GREEN_TREE_HEIGHT,
    type: "green_tree",
  }
}

// Add new function to generate pixel art burned tree
export function generatePixelBurnedTree(): GameObject {
  return {
    x: CANVAS_WIDTH,
    y: CANVAS_HEIGHT - GROUND_HEIGHT - PIXEL_BURNED_TREE_HEIGHT,
    width: PIXEL_BURNED_TREE_WIDTH,
    height: PIXEL_BURNED_TREE_HEIGHT,
    type: "pixel_burned_tree",
  }
}

