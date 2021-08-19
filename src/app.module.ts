import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { GraphQLModule } from './graphql/graphql.module'
import { DatabaseModule } from './database/database.module'
import { SuppliersModule } from './suppliers/suppliers.module'
import { OrganisationsModule } from './organisations/organisations.module'
import { DevicesModule } from './devices/devices.module'
import { KeysModule } from './keys/keys.module'
import { EventsModule } from './events/events.module'
import { UtilsModule } from './utils/utils.module'
import { SearchModule } from './search/search.module'

@Module({
  imports: [
    AuthModule,
    GraphQLModule,
    DatabaseModule,
    SuppliersModule,
    OrganisationsModule,
    DevicesModule,
    KeysModule,
    EventsModule,
    UtilsModule,
    SearchModule
  ]
})
export class AppModule {}
