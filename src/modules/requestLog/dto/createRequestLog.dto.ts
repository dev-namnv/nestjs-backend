export class CreateRequestLogDto {
  statusCode: number

  route: string

  method: string

  remoteAddress: string

  requestBody: string

  responseData: string | null
}
