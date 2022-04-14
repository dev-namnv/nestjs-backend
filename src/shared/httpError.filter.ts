import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'

import { I18nService } from 'nestjs-i18n'

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  constructor(private i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const statusCode = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    let { message } = exception
    let error: string = exception.message

    if (exception.getResponse) {
      const eResponse = exception.getResponse() as {
        message: string[] | string
        error: string
      }
      message = Array.isArray(eResponse.message) ? eResponse.message[0] : eResponse.message
      error = eResponse.error
    }

    const errorResponse = {
      statusCode,
      content: {
        message: await this.i18n.translate(`language.${Array.isArray(message) ? message[0] : message}`),
        error: error || message
      }
    }

    response.status(statusCode).json(errorResponse)
  }
}
