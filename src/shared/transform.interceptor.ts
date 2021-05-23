import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common'
import { Observable } from 'rxjs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { map } from 'rxjs/operators'
import { RequestLogService } from '../modules/requestLog/requestLog.service'

interface Response<T> {
  statusCode: number
  wsResponse: T
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private requestLogService: RequestLogService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<Response<T>>> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest()
    const { statusCode } = ctx.getResponse()
    const { method, body, url: route } = request

    const log = await this.requestLogService.create({
      statusCode,
      route,
      method,
      requestBody: JSON.stringify(body),
      responseData: null,
      remoteAddress:
        request.headers['x-forwarded-for'] || request.connection.remoteAddress
    })

    return next.handle().pipe(
      map((data) => {
        const responseData = { statusCode, wsResponse: data }

        this.requestLogService.update(log._id.toString(), {
          statusCode,
          responseData: JSON.stringify(responseData)
        })

        return responseData
      })
    )
  }
}
