import {Entity, model, property} from '@loopback/repository';

@model({settings: {mongodb: {collection: 'players'}}})
export class Player extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'},
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    default: 0,
  })
  wins: number;

  @property({
    type: 'string',
  })
  avatar?: string;

  @property({
    type: 'number',
    default: 0,
  })
  longestWinningStreak?: number;

  @property({
    type: 'number',
    default: 0,
  })
  longestLosingStreak?: number;

  @property({
    type: 'number',
    default: 1000,
  })
  offenseRating?: number;

  @property({
    type: 'number',
    default: 1000,
  })
  defenseRating?: number;

  @property({
    type: 'array',
    itemType: 'number',
    default: [1000],
  })
  offenseRatings?: number[];

  @property({
    type: 'array',
    itemType: 'number',
    default: [1000],
  })
  defenseRatings?: number[];

  constructor(data?: Partial<Player>) {
    super(data);
  }
}

export interface PlayerRelations {
  // describe navigational properties here
}

export type PlayerWithRelations = Player & PlayerRelations;
