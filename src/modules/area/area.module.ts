import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AreaController } from './area.controller'
import { AreaService } from './area.service'
import { Area, AreaSchema } from '../../schemas/area'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }])
  ],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService]
})
export class AreaModule {}
