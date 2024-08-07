enum DirectionCodes {
  Left = 37,
  Up = 38,
  Right = 39,
  Down = 40
}

enum KeyCodes {
  Left = DirectionCodes.Left,
  Up = DirectionCodes.Up,
  Right = DirectionCodes.Right,
  Down = DirectionCodes.Down,
  Space = 32,
  Return = 13
}

export { DirectionCodes, KeyCodes }
