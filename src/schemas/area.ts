import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { ApiProperty } from '@nestjs/swagger'
import moment from 'moment'
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

  @ApiProperty({ type: String })
  @Prop({ required: true })
  ownerId: Types.ObjectId

  @ApiProperty()
  @Prop()
  createdAt: number

  @ApiProperty()
  @Prop()
  updatedAt: number | null
}

export const AreaSchema = SchemaFactory.createForClass(Area)

RequestLogSchema.pre<RequestLog>(/(save|update)/i, function (next) {
  const document = this

  if (document.isNew) {
    document.set({ createdAt: moment().valueOf() })
    document.set({ updatedAt: null })
  } else {
    document.set({ updatedAt: moment().valueOf() })
  }

  return next()
})
