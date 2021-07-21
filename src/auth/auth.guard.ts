import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Request } from 'express'
import config from '../config'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext()
    return this.validate(ctx.req)
  }

  validate(request: Request): boolean {
    return request.headers['x-api-key'] === config().app.apiKey
  }
}
