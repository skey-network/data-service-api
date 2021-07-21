import { Module } from '@nestjs/common'
import { GraphQLModule as RawGraphQLModule } from '@nestjs/graphql'
import { join } from 'path'

const path = join(process.cwd(), './src/graphql/schema.gql')

@Module({
  imports: [
    RawGraphQLModule.forRoot({
      autoSchemaFile: path,
      installSubscriptionHandlers: true
    })
  ]
})
export class GraphQLModule {}
