import { DirectionCodes } from './enums'

function getRandomDirection() {
  return Math.floor(
    Math.random() * (DirectionCodes.Down - DirectionCodes.Left + 1) + DirectionCodes.Left
  )
}

function getId() {
  return Math.floor(Math.random() * 100000000)
}

function generateCombo() {
  return {
    id: getId(),
    direction: getRandomDirection(),
    active: false
  }
}

function generateComboSet() {
  return Array(5)
    .fill(null)
    .map(() => generateCombo())
}

export { generateComboSet }
