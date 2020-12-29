import React from 'react';

import styles from './App.css';

type Dungeon = {[index:string]: boolean};

const SAMPLE_DUNGEON: Dungeon = {
  '0-0': true,
  '0-1': true,
  '0-2': true,
  '0-3': true,
  '0-4': true,
  '0-5': true,
  '1-0': true,
  '1-1': true,
  '1-2': true,
  '1-3': true,
  '1-4': true,
  '1-5': true,
  '2-5': true,
  '3-5': true,
  '4-5': true,
  '5-5': true,
};

const VIEWPORT = {
  width: 8,
  height: 8,
};

const TILE_SIZE = {
  width: 100,
  height: 70,
};

const EMOJI_SIZE = {
  width: 100,
  height: 100,
};

export default function App() {
  return (
    <div className={styles.container}>
      <DungeonView dungeon={SAMPLE_DUNGEON} />
    </div>
  );
}

function DungeonView({dungeon}: {dungeon: Dungeon}) {
  const tiles = [];
  for (let i = 0; i < VIEWPORT.height; i++) {
    for (let j = 0; j < VIEWPORT.width; j++) {
      const key = `${i}-${j}`;
      const isPath = key in dungeon && dungeon[key];
      tiles.push(
        <div className={styles.tile} style={{ 
          width: TILE_SIZE.width,
          height: TILE_SIZE.height,
          backgroundColor: isPath ? '#e0e0e0' : 'none',
        }}>
          {isPath ? <Emoji symbol={'🐱'} /> : ''}
        </div>
      );
    }
  }

  return (
    <div className={styles.dungeonView} style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${VIEWPORT.width}, ${TILE_SIZE.width}px)`,
      gridTemplateRows: `repeat(${VIEWPORT.height}, ${TILE_SIZE.height}px)`,
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