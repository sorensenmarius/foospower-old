import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {PlayerRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class PlayerService {
  @repository(PlayerRepository)
  private playerRepo: PlayerRepository;
}
