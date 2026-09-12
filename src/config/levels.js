/**
 * LEVEL REGISTRY
 *
 * To add a new level:
 * 1. Create a new file in src/scenes/levels/LevelX.js
 * 2. Add an entry to this LEVELS array
 * 3. That's it!
 *
 * To remove a level:
 * 1. Remove its entry from this array
 * 2. Optionally delete the file
 */

export const LEVELS = [
  {
    id: 'level1',
    name: "Ember's Woods",
    description: 'A fox who burned too bright',
    module: () => import('../scenes/levels/Level1.js'),
    unlocked: true,
    music: 'embers_woods.mp3',
  },
  // Add more levels here!
  // {
  //   id: 'level2',
  //   name: "Moss's Mountain",
  //   description: 'A stone who stopped moving',
  //   module: () => import('../scenes/levels/Level2.js'),
  //   unlocked: false,
  //   music: 'lonely_mountain.mp3',
  // },
];

export function getLevelById(id) {
  return LEVELS.find(level => level.id === id);
}

export function getNextLevel(currentId) {
  const currentIndex = LEVELS.findIndex(level => level.id === currentId);
  if (currentIndex === -1 || currentIndex >= LEVELS.length - 1) {
    return null;
  }
  return LEVELS[currentIndex + 1];
}

export function unlockLevel(id) {
  const level = getLevelById(id);
  if (level) {
    level.unlocked = true;
  }
}
