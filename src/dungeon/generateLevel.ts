import {randomInt, coinFlip} from '../utils/random';
import {Entity} from './entity';
import {Dimensions, Coordinates, tileKey} from './common';

/**
 * A map of which tiles in the dungeon are walkable.
 */
export type DungeonFloor = {[index:string]: boolean};

/**
 * The non-terrain items present in the dungeon, indexed by coorinates.
 */
export type EntityMap = {[index:string]: Entity};

/**
 * Wrapper object for all data created when generating a dungeon.
 */
export type LevelPlan = {floor: DungeonFloor, player: Coordinates,
  ladder: Coordinates, entities: Array<Entity>};

const cachedLevels: {[index:number]: LevelPlan} = {};
/**
 * Generates a single floor of the dungeon.
 * @param num What floor number the player is on.
 * @returns Data for the level the player can interact with.
 */
export function generateLevel(num: number): LevelPlan {
  // Avoid regenerating a level if we've already done it.
  if (num in cachedLevels) return cachedLevels[num];

  const floor: DungeonFloor = {};
  let player: Coordinates = {x: 0, y: 0};
  let ladder: Coordinates = {x: 0, y: 0};
  let entities: Array<Entity> = [];

  const center: Coordinates = {x: 0, y: 0};
  let leftEntrance: boolean = true;

  // Generate one room for each level the player is on.
  for (let i = 0; i < num; i++) {
    const roomSize: Dimensions = {
      height: randomInt(10, 4),
      width: randomInt(10, 4),
    };

    const relativeCenter: Coordinates = {
      x: Math.floor(roomSize.width / 2),
      y: Math.floor(roomSize.height / 2),
    };

    if (leftEntrance) {
      center.x += relativeCenter.x;
    } else {
      center.y += relativeCenter.y;
    }

    // Draw the room.
    const xStart = center.x - relativeCenter.x;
    const xEnd = xStart + roomSize.width;
    const yStart = center.y - relativeCenter.y;
    const yEnd = yStart + roomSize.height;
    
    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        // Add walkable path.
        floor[tileKey({x, y})] = true;
      }
    }

    // Add additional room features.
    if (i === 0) {
      // Place the player at the beginning of the path.
      player = {...center};
    }
    if (i === num - 1) {
      // Place the ladder at the end of the path. 
      ladder = {
        // Make the ladder not collide with the player when there's one room.
        x: center.x + 1,
        y: center.y,
      };
    } else {
      // Add a corridor only if we're not at the end.
      const corridorLength = randomInt(5, 2);

      leftEntrance = coinFlip();

      if (leftEntrance) {
        // Go right if heads.
        const xOffset = center.x + (roomSize.width - relativeCenter.x);
        const y = center.y;

        let x;
        for (x = xOffset; x < xOffset + corridorLength; x++) {
          floor[tileKey({x, y})] = true;
        }

        center.x = x;
      } else {
        // Otherwise go down.
        const yOffset = center.y + (roomSize.height - relativeCenter.y);
        const x = center.x;

        let y;
        for (y = yOffset; y < yOffset + corridorLength; y++) {
          floor[tileKey({x, y})] = true;
        }

        center.y = y;
      }
    }

  }
  return {floor, player, ladder, entities};
}
