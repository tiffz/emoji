import React, {useState} from 'react';

import {useMovementKeys} from './useMovementKeys';
import {DungeonFloor, generateLevel} from './dungeon/generateLevel';
import {Dimensions, Coordinates, coordinatesEqual,
  tileKey} from './dungeon/common';
import styles from './App.css';

const DEBUG = false;

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
 * Function to check if a given coordinate is walkable or not.
 * @param c The location to check.
 * @param floor The dungeon map to check against.
 * @returns Whether the player can walk in this location or not.
 */
function isWalkable(c: Coordinates, floor: DungeonFloor): boolean {
  const key = tileKey(c);
  return key in floor && floor[key];
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
