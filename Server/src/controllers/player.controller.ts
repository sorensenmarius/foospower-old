import {service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  api,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {Player} from '../models';
import {PlayerRepository} from '../repositories';
import {PlayerService} from '../services';

@api({basePath: '/players'})
export class PlayerController {
  @repository(PlayerRepository)
  private playerRepo: PlayerRepository;
  @service(PlayerService)
  private playerService: PlayerService;

  @get('', {
    responses: {
      200: {description: 'All players', schema: getModelSchemaRef(Player)},
    },
  })
  async getAll(): Promise<Player[]> {
    const players = await this.playerRepo.find();
    return players;
  }

  @get('/{id}', {
    responses: {
      '200': {
        description: 'The requested player',
        content: {'application/json': {schema: getModelSchemaRef(Player)}},
      },
      '404': {
        description: 'Player not found',
      },
    },
  })
  async getOne(@param.path.string('id') id: string): Promise<Player> {
    const player = await this.playerRepo.findById(id);
    return player;
  }

  @post('', {
    responses: {
      '200': {
        description: 'Created player',
        content: {'application/json': {schema: getModelSchemaRef(Player)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Player, {exclude: ['id']}),
        },
      },
    })
    player: Omit<Player, 'id'>,
  ): Promise<Player> {
    const newPlayer = await this.playerRepo.create(player);
    return newPlayer;
  }
}
