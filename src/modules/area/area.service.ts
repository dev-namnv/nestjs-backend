import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ObjectId } from 'mongoose'
import { Area } from '../../schemas/area'
import { CreateAreaDto } from './dto/createArea.dto'

@Injectable()
export class AreaService {
  constructor(@InjectModel(Area.name) private areaModel: Model<Area>) {}

  async create(
    accountId: ObjectId,
    createAreaDto: CreateAreaDto
  ): Promise<Area> {
    const area = new this.areaModel({ ...createAreaDto, ownerId: accountId })
    return area.save()
  }
}
