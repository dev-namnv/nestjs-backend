import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import moment from 'moment'
import { Document } from 'mongoose'

@Schema({ collection: 'request_logs' })
export class RequestLog extends Document {
  @Prop()
  route: string

  @Prop()
  method: string

  @Prop()
  remoteAddress: string

  @Prop()
  statusCode: number

  @Prop()
  requestBody: string

  @Prop()
  responseData: string

  @Prop({ default: moment().valueOf() })
  createdAt: number

  @Prop({ default: null })
  updatedAt: number
}

export const RequestLogSchema = SchemaFactory.createForClass(RequestLog)

RequestLogSchema.pre<RequestLog>(/(save|update)/i, function (next) {
  const document = this

  if (!document.isNew) {
    document.updatedAt = moment().valueOf()
  }

  return next()
})

// RequestLogSchema.pre<RequestLog>(/(save|update)/i, function (next) {
//   const document = this
//
//   document.set({ updatedAt: moment().valueOf() })
//
//   return next()
// })

// RequestLogSchema.methods.toJSON = function() {
//   const document = this.toObject()
//
//   return document
// }
