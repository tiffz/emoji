import { GridOff } from '@material-ui/icons';
import React, { useState } from 'react';

import styles from './App.css';

const SAMPLE_DUNGEON: {[index:string]: boolean} = {
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
  const paths = SAMPLE_DUNGEON;
  const dungeon = [];
  for (let i = 0; i < VIEWPORT.height; i++) {
    for (let j = 0; j < VIEWPORT.width; j++) {
      const key = `${i}-${j}`;
      const isPath = key in paths && paths[key];
      dungeon.push(
        <div className={styles.tile} style={{ 
          width: TILE_SIZE.width,
          height: TILE_SIZE.height,
          backgroundColor: isPath ? '#fff' : '#222',
        }}>
          {isPath ?
            <span className={styles.tileContent} style={{
              fontSize: EMOJI_SIZE.height,
              width: EMOJI_SIZE.width,
            }}>🐱</span>
          : ''}
        </div>
      );
    }
  }
  return (
    <div className={styles.container}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${VIEWPORT.width}, ${TILE_SIZE.width}px)`,
      }}>
        {dungeon}
      </div>
    </div>
  );
}
