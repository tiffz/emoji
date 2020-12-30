import {useEffect, useState} from 'react';

const MOVEMENT_TIMEOUT_MS = 100;

type KeySet = Set<string>;

/**
 * Checks if any keys in a particular list of keys are currently being pressed
 * and moves the player accordingly.
 */
export function useMovementKeys(movePlayer: Function): void {
  const [cycles, setCycles] = useState(0);
  const keysPressed = useKeys(['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft',
    'ArrowDown', 'ArrowRight']);

  const movePlayerHandler = () => {
    const delta = {x: 0, y: 0};
    if (keysPressed.has('w') || keysPressed.has('ArrowUp')) {
      delta.y -= 1;
    }
    if (keysPressed.has('a') || keysPressed.has('ArrowLeft')) {
      delta.x -= 1;
    }
    if (keysPressed.has('s') || keysPressed.has('ArrowDown')) {
      delta.y += 1;
    }
    if (keysPressed.has('d') || keysPressed.has('ArrowRight')) {
      delta.x += 1;
    }

    if (delta.x || delta.y) {
      movePlayer(delta);
    }
    setCycles(cycles + 1);
  };

  useEffect(() => {
    const interval = setInterval(movePlayerHandler, MOVEMENT_TIMEOUT_MS);  
    return () => clearInterval(interval);
  }, [cycles]);
}

/**
 * @url https://usehooks.com/useKeyPress/
 */
function useKeys(keys: Array<string>): KeySet {
  const [keysPressed, setKeysPressed] = useState(new Set<string>());

  const targetKeys = new Set<string>(keys);

  const downHandler = ({ key }: KeyboardEvent) => {
    if (targetKeys.has(key)) {
      const newSet = new Set<string>(keysPressed);
      newSet.add(key);
      setKeysPressed(newSet);
    }
  }

  const upHandler = ({ key }: KeyboardEvent) => {
    if (targetKeys.has(key)) {
      const newSet = new Set<string>(keysPressed);
      newSet.delete(key);
      setKeysPressed(newSet);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return keysPressed;
}