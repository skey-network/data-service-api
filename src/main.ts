import { config as configure } from 'dotenv'
configure()

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import config from './config'
import { ValidationPipe } from '@nestjs/common'
import { AuthGuard } from './auth/auth.guard'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)

  app.enableCors({ allowedHeaders: '*' })

  app.useGlobalPipes(new ValidationPipe())

  config().app.requireApiKey && app.useGlobalGuards(new AuthGuard())

  await app.listen(config().app.port)
}

bootstrap()
