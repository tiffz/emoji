/**
 * Generates a random number between a max and minimum.
 * @param max Highest possible number that can be generated, inclusive.
 * @param min Optional minimum number, inclusive. 
 */
export function randomInt(max: number, min = 0): number {
  return min + Math.floor(Math.random() * (max + 1 - min));
}

/**
 * Returns true or false randomly.
 * @returns true if heads, false if tails.
 */
export function coinFlip(): boolean {
  return Math.random() > 0.5;
}
