import React, {useState} from 'react';

import {useMovementKeys} from './useMovementKeys';
import styles from './App.css';

type DungeonFloor = {[index:string]: boolean};
type Dimensions = {width: number, height: number};
type Coordinates = {x: number, y: number};
type LevelPlan = {floor: DungeonFloor, player: Coordinates,
  ladder: Coordinates};

const DEBUG = false;

const SAMPLE_FLOOR: DungeonFloor = {
  '0,0': true,
  '0,1': true,
  '0,2': true,
  '0,3': true,
  '0,4': true,
  '0,5': true,
  '1,0': true,
  '1,1': true,
  '1,2': true,
  '1,3': true,
  '1,4': true,
  '1,5': true,
  '2,5': true,
  '3,5': true,
  '4,5': true,
  '5,5': true,
};

const SAMPLE_PLAYER_LOCATION: Coordinates = {x: 0, y: 0};
const SAMPLE_LADDER_LOCATION: Coordinates = {x: 5, y: 5};

const DEFAULT_VIEWPORT: Dimensions = {
  width: 15,
  height: 15,
};

const TILE_SIZE: Dimensions = {
  width: 100,
  height: 70,
};

const EMOJI_SIZE: Dimensions = {
  width: 100,
  height: 100,
};

/**
 * Checks to see if two sets of coordinates refer to the same spot.
 * @param a 
 * @param b
 * @returns Whether a and b are the same location.
 */
function coordinatesEqual(a: Coordinates, b: Coordinates): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Generates a canonical tilemap key for a given coordinate.
 * @param c Coordinates to get a key for.
 * @returns The key for the coordinates. 
 * 
 */
function tileKey(c: Coordinates): string {
  return `${c.x},${c.y}`;
}

/**
 * Function to check if a given coordinate is walkable or not.
 * @param c The location to check.
 * @param floor The dungeon map to check against.
 * @returns Whether the player can walk in this location or not.
 */
function isWalkable(c: Coordinates, floor: DungeonFloor): boolean {
  const key = tileKey(c);
  return key in floor && floor[key];
}

/**
 * Generates a random number between a max and minimum.
 * @param max Highest possible number that can be generated, inclusive.
 * @param min Optional minimum number, inclusive. 
 */
function randomInt(max: number, min = 0): number {
  return min + Math.floor(Math.random() * (max + 1 - min));
}

/**
 * Returns true or false randomly.
 * @returns true if heads, false if tails.
 */
function coinFlip(): boolean {
  return Math.random() > 0.5;
}

const cachedLevels: {[index:number]: LevelPlan} = {};
/**
 * Generates a single floor of the dungeon.
 * @param num What floor number the player is on.
 * @returns Data for the level the player can interact with.
 */
function generateLevel(num: number): LevelPlan {
  // Avoid regenerating a level if we've already done it.
  if (num in cachedLevels) return cachedLevels[num];

  const floor: DungeonFloor = {};
  let player: Coordinates = {x: 0, y: 0};
  let ladder: Coordinates = {x: 0, y: 0};

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
  return {floor, player, ladder};
}

export default function App() {
  const level = generateLevel(1);
  const [player, setPlayer] = useState(level.player);
  const [levelNum, setLevelNum] = useState(1);
  const [floor, setFloor] = useState(level.floor);
  const [ladder, setLadder] = useState(level.ladder);

  const moveUpFloor = () => {
    const nextLevelNum = levelNum + 1; 
    const level = generateLevel(nextLevelNum);
    setPlayer(level.player);
    setFloor(level.floor);
    setLadder(level.ladder);

    setLevelNum(nextLevelNum);
  };

  const movePlayerByDelta = (delta: Coordinates) => {
    const location = {
      x: player.x + delta.x,
      y: player.y + delta.y,
    };

    // Check to make sure the new location is not a wall.
    if (isWalkable(location, floor)) {
      setPlayer(location);
    }

    // Logic that happens after moving the player.
    if (coordinatesEqual(location, ladder)) {
      // Move the player to another floor if they found the ladder.
      moveUpFloor();
    }
  };
  
  useMovementKeys(movePlayerByDelta);

  return (
    <div className={styles.container}>
      <DungeonView 
        floor={floor} 
        player={player}
        ladder={ladder}
        viewport={DEFAULT_VIEWPORT}
        tileSize={TILE_SIZE}
      />
    </div>
  );
}

/**
 * Component to render the segment of the floor the player sees on their
 * screen. The player is at the center of the viewport.
 */
function DungeonView({floor, player, viewport, tileSize, ladder}: 
    {floor: DungeonFloor, player: Coordinates, viewport: Dimensions,
      tileSize: Dimensions, ladder: Coordinates}) {

  const tiles = [];

  const startX = player.x - Math.floor(viewport.width / 2);
  const startY = player.y - Math.floor(viewport.height / 2);

  for (let i = 0; i < viewport.height; i++) {
    for (let j = 0; j < viewport.width; j++) {
      const x = startX + j;
      const y = startY + i;

      const tile = {x, y};

      const key = tileKey(tile);
      const isPath = isWalkable(tile, floor);

      let character = <></>;
      const isPlayer = coordinatesEqual(tile, player);
      const isLadder = coordinatesEqual(tile, ladder);
  
      if (isPlayer) {
        character = <Emoji symbol={'🐱'} className={styles.bounce} />;
      } else if (isLadder) {
        character = <Emoji symbol={'🪜'} />;
      }
      tiles.push(
        <div 
          className={styles.tile}
          key={key}
          style={{ 
            borderRadius: tileBorderRadius(tile, floor),
            width: tileSize.width,
            height: tileSize.height,
            backgroundColor: isPath ? '#eee' : 'transparent',
          }}
        >
          {DEBUG ? <span className={styles.debugCoordinates}>{key} : {isPath.toString()}</span> : ''}
          {character}
        </div>
      );
    }
  }

  return (
    <div className={styles.dungeonView} style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${viewport.width}, ${tileSize.width}px)`,
      gridTemplateRows: `repeat(${viewport.height}, ${tileSize.height}px)`,
    }}>
      {tiles}
    </div>
  );
}


const TILE_CORNER_ROUNDING = 8;

/**
 * Smooths the corners for a tile in the dungeon based on its neighbors.
 * @param tile The tile to style. 
 * @param floor Floorplan to check the tile's neighbors.
 * @returns CSS string border radius delcaration.
 */
function tileBorderRadius(tile: Coordinates, floor: DungeonFloor): string {
  if (!isWalkable(tile, floor)) {
    return '0px';
  }

  const left = isWalkable({
    x: tile.x - 1,
    y: tile.y,
  }, floor);
  const right = isWalkable({
    x: tile.x + 1,
    y: tile.y,
  }, floor);
  const up = isWalkable({
    x: tile.x,
    y: tile.y - 1,
  }, floor);
  const down = isWalkable({
    x: tile.x,
    y: tile.y + 1,
  }, floor);

  // Border radius order: Top left, top right, bottom right, bottom left
  return `
    ${up || left ? 0 : TILE_CORNER_ROUNDING}px
    ${up || right ? 0 : TILE_CORNER_ROUNDING}px
    ${down || right ? 0 : TILE_CORNER_ROUNDING}px
    ${down || left ? 0 : TILE_CORNER_ROUNDING}px
  `;
}

/**
 * Component to render a single interactable symbol.
 */
function Emoji({symbol, className = ''}: {symbol: string, className?: string}) {
  return (
    <div 
      className={`${styles.tileContent} ${className}`} 
      style={{
        // Shrink emoji, so that it's thinner than its container.
        fontSize: EMOJI_SIZE.height * 0.8,
        height: EMOJI_SIZE.width,
        width: EMOJI_SIZE.width,
      }}>{symbol}</div>
  );
}
