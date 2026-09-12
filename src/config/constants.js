export const GAME = {
  WIDTH: 1280,
  HEIGHT: 720,
  BACKGROUND_COLOR: 0x0a0a12,
};

export const PHYSICS = {
  GRAVITY: 980,
  PLAYER_SPEED: 220,
  PLAYER_ACCEL: 15, // Acceleration - how fast we reach max speed
  PLAYER_JUMP: 420,
  FRICTION: 0.88, // How quickly we slow down (higher = slower stop)
};

export const LIGHTING = {
  AMBIENT_COLOR: 0x1a1a2e,
  AMBIENT_BRIGHTNESS: 0.3,
};

export const CAMERA = {
  LERP: 0.1,
  DEAD_ZONE: { x: 100, y: 50 },
};
