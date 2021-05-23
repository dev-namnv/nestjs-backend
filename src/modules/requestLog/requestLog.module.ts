import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { RequestLog, RequestLogSchema } from '../../schemas/requestLog'
import { RequestLogService } from './requestLog.service'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RequestLog.name, schema: RequestLogSchema }
    ])
  ],
  providers: [RequestLogService],
  exports: [RequestLogService]
})
export class RequestLogModule {}
