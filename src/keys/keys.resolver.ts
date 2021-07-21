import { Args, Query, Resolver } from '@nestjs/graphql'
import { KeysArgs, KeyArgs } from './keys.args'
import { Key } from './keys.schema'
import { KeysService } from './keys.service'

@Resolver(() => Key)
export class KeysResolver {
  constructor(private keysService: KeysService) {}

  @Query(() => [Key])
  async keys(@Args() args: KeysArgs) {
    return await this.keysService.findAll(args)
  }

  @Query(() => Key)
  async key(@Args() args: KeyArgs) {
    return await this.keysService.findOne(args)
  }
}
