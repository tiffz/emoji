import {Coordinates} from './common';

export enum EntityType {
  YarnBall,
};

export type Entity = {type: EntityType, location: Coordinates};
export type EntityInfo = {
  emoji: string,
};

export const entityDex: {[index:number]: EntityInfo} = {
  [EntityType.YarnBall]: {
    emoji: '🧶',
  },
};
