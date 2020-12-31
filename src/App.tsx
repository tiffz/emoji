import React, {useState} from 'react';

import {useMovementKeys} from './useMovementKeys';
import styles from './App.css';

type Dungeon = {[index:string]: boolean};
type Dimensions = {width: number, height: number};
type Coordinates = {x: number, y: number};

const DEBUG = false;

const SAMPLE_DUNGEON: Dungeon = {
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

export default function App() {
  const [player, setPlayer] = useState(SAMPLE_PLAYER_LOCATION);
  const [floor, setFloor] = useState(1);
  const dungeon = SAMPLE_DUNGEON;
  const ladder = SAMPLE_LADDER_LOCATION;

  const moveUpFloor = () => {
    setPlayer(SAMPLE_PLAYER_LOCATION);
    setFloor(floor + 1);
  };

  const movePlayerByDelta = (delta: Coordinates) => {
    const location = {
      x: player.x + delta.x,
      y: player.y + delta.y,
    };

    // Check to make sure the new location is not a wall.
    const key = `${location.x},${location.y}`;
    if (key in dungeon && dungeon[key]) {
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
        dungeon={dungeon} 
        player={player}
        ladder={ladder}
        viewport={DEFAULT_VIEWPORT}
        tileSize={TILE_SIZE}
      />
    </div>
  );
}

/**
 * Component to render the segment of the dungeon the player sees on their
 * screen. The player is at the center of the viewport.
 */
function DungeonView({dungeon, player, viewport, tileSize, ladder}: 
    {dungeon: Dungeon, player: Coordinates, viewport: Dimensions,
      tileSize: Dimensions, ladder: Coordinates}) {

  const tiles = [];

  const startX = player.x - Math.floor(viewport.width / 2);
  const startY = player.y - Math.floor(viewport.height / 2);

  for (let i = 0; i < viewport.height; i++) {
    for (let j = 0; j < viewport.width; j++) {
      const x = startX + j;
      const y = startY + i;

      const tile = {x, y};

      const key = `${x},${y}`;
      const isPath = key in dungeon && dungeon[key];

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
            width: tileSize.width,
            height: tileSize.height,
            backgroundColor: isPath ? '#f5f5f5' : 'none',
          }}
        >
          {DEBUG ? <span className={styles.debugCoordinates}>{key}</span> : ''}
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

/**
 * Component to render a single interactable symbol.
 */
function Emoji({symbol, className = ''}: {symbol: string, className?: string}) {
  return (
    <div 
      className={`${styles.tileContent} ${className}`} 
      style={{
        fontSize: EMOJI_SIZE.height * 0.8,
        height: EMOJI_SIZE.width,
        width: EMOJI_SIZE.width,
      }}>{symbol}</div>
  );
}
