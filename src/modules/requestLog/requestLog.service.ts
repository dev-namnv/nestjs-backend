import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ObjectId } from 'mongoose'
import { RequestLog } from '../../schemas/requestLog'
import { CreateRequestLogDto } from './dto/createRequestLog.dto'
import { UpdateRequestLogDto } from './dto/updateRequestLog.dto'

@Injectable()
export class RequestLogService {
  constructor(
    @InjectModel(RequestLog.name) private requestLogModel: Model<RequestLog>
  ) {}

  async create(createRequestLogDto: CreateRequestLogDto): Promise<RequestLog> {
    const createdRequestLog = new this.requestLogModel(createRequestLogDto)

    return createdRequestLog.save()
  }

  async update(
    id: ObjectId,
    updateRequestDto: UpdateRequestLogDto
  ): Promise<RequestLog | null> {
    return this.requestLogModel.findByIdAndUpdate(id, updateRequestDto, {
      new: true
    })
  }
}
