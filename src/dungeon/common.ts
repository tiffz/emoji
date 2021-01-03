export type Dimensions = {width: number, height: number};
export type Coordinates = {x: number, y: number};

/**
 * Checks to see if two sets of coordinates refer to the same spot.
 * @param a 
 * @param b
 * @returns Whether a and b are the same location.
 */
export function coordinatesEqual(a: Coordinates, b: Coordinates): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Generates a canonical tilemap key for a given coordinate.
 * @param c Coordinates to get a key for.
 * @returns The key for the coordinates. 
 * 
 */
export function tileKey(c: Coordinates): string {
  return `${c.x},${c.y}`;
}