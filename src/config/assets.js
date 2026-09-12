/**
 * Asset manifest - paths to all game assets.
 * Update this when adding new sprites, sounds, etc.
 */

export const SPRITES = {
  penguin: '/assets/sprites/penguin.png',
  penguin_normal: '/assets/sprites/penguin_n.png',
  ember: '/assets/sprites/ember.png',
  ember_normal: '/assets/sprites/ember_n.png',
  memory_spark: '/assets/sprites/memory_spark.png',
};

export const BACKGROUNDS = {
  level1_far: '/assets/backgrounds/level1_far.png',
  level1_mid: '/assets/backgrounds/level1_mid.png',
  level1_near: '/assets/backgrounds/level1_near.png',
};

export const TILEMAPS = {
  level1: '/assets/tilemaps/level1.json',
};

export const AUDIO = {
  music: {
    menu: '/assets/audio/music/menu.mp3',
    embers_woods: '/assets/audio/music/embers_woods.mp3',
  },
  sfx: {
    jump: '/assets/audio/sfx/jump.wav',
    collect: '/assets/audio/sfx/collect.wav',
    dialog: '/assets/audio/sfx/dialog.wav',
  },
};
