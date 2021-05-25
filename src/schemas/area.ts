import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import moment from 'moment'
import { Exclude } from 'class-transformer'
import { RequestLog, RequestLogSchema } from './requestLog'

export const AreaCollection = 'areas'

@Schema({ collection: AreaCollection })
export class Area extends Document {
  @ApiProperty()
  @Prop({ required: true })
  name: string

  @ApiProperty()
  @Prop({ default: '' })
  description: string

  @ApiProperty()
  @Prop({ default: '' })
  image: string

  @Exclude()
  @ApiProperty({ type: String })
  @Prop({ required: true })
  ownerId: Types.ObjectId

  @ApiProperty()
  @Prop()
  createdAt: number

  @ApiProperty()
  @Prop({ default: null })
  updatedAt: number

  constructor(area: Area, partial: Partial<Area>) {
    super(Object.assign(area, partial))
  }
}

export const AreaSchema = SchemaFactory.createForClass(Area)

RequestLogSchema.pre<RequestLog>(/(save|update)/i, function (next) {
  const document = this

  if (document.isNew) {
    document.set({ createdAt: moment().valueOf() })
  } else {
    document.set({ updatedAt: moment().valueOf() })
  }

  return next()
})
