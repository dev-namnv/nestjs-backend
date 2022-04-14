import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { map } from 'rxjs/operators'

interface Response<T> {
  statusCode: number
  content: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<Response<T>>> {
    const ctx = context.switchToHttp()
    const { statusCode } = ctx.getResponse()

    return next.handle().pipe(
      map((data) => {
        return { statusCode, content: data }
      })
    )
  }
}
