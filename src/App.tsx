import React from 'react';

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

export default function App() {
  return (
    <div className={styles.container}>
      <DungeonView 
        dungeon={SAMPLE_DUNGEON} 
        player={SAMPLE_PLAYER_LOCATION}
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
function DungeonView({dungeon, player, viewport, tileSize}: 
    {dungeon: Dungeon, player: Coordinates, viewport: Dimensions,
      tileSize: Dimensions}) {

  const tiles = [];

  const startX = player.x - Math.floor(viewport.width / 2);
  const startY = player.y - Math.floor(viewport.height / 2);

  for (let i = 0; i < viewport.height; i++) {
    for (let j = 0; j < viewport.width; j++) {
      const x = startX + i;
      const y = startY + j;

      const key = `${x},${y}`;
      const isPath = key in dungeon && dungeon[key];
      const isPlayer = x === player.x && y === player.y;
      tiles.push(
        <div 
          className={styles.tile}
          key={key}
          style={{ 
            width: tileSize.width,
            height: tileSize.height,
            backgroundColor: isPath ? '#e0e0e0' : 'none',
          }}
        >
          {DEBUG ? <span className={styles.debugCoordinates}>{key}</span> : ''}
          {isPlayer? <Emoji symbol={'🐱'} /> : ''}
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

function Emoji({symbol}: {symbol: string}) {
  return (
    <span className={styles.tileContent} style={{
      fontSize: EMOJI_SIZE.height,
      width: EMOJI_SIZE.width,
    }}>{symbol}</span>
  );
}