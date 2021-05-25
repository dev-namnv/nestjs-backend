import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import * as bcrypt from 'bcryptjs'
import { Document, LeanDocument } from 'mongoose'
import moment from 'moment'

export const ACCOUNT_COLLECTION = 'accounts'

export const ACCOUNT_STATUS = {
  DISABLE: 0,
  ACTIVATED: 1
}

export const ACCOUNT_GENDER = {
  MALE: 1,
  FEMALE: 2,
  OTHER: 3
}

@Schema({ collection: ACCOUNT_COLLECTION })
export class Account extends Document {
  @Prop({ unique: true, default: null })
  @ApiProperty({ description: 'Google ID' })
  googleId: string

  @Prop({ unique: true, default: null })
  @ApiProperty({ description: 'Facebook ID' })
  facebookId: string

  @Prop({ required: true, unique: true })
  @ApiProperty({ description: 'Email' })
  email: string

  @Prop()
  password: string

  @Prop({ unique: true, default: null })
  @ApiProperty({ description: 'Phone' })
  phone: string

  @Prop()
  @ApiProperty({ description: 'First name' })
  firstName: string

  @Prop()
  @ApiProperty({ description: 'Last name' })
  lastName: string

  @Prop({ default: null })
  @ApiProperty({ description: 'Avatar', default: null })
  avatar: string

  @Prop({ default: null })
  @ApiProperty({
    description: 'Birthday (YYYY-MM-DD)',
    default: null
  })
  birthday: string

  @Prop({ default: null })
  @ApiProperty({
    description: 'Gender (1: Male, 2: Female, 3: Other)',
    default: null
  })
  gender: number

  @Prop({ default: ACCOUNT_STATUS.ACTIVATED })
  @ApiProperty({
    description: 'Status (0: Disabled, 1: Activated)',
    default: ACCOUNT_STATUS.ACTIVATED
  })
  status: number

  @Prop({ default: false })
  @ApiProperty({ default: false })
  isVerified: boolean

  @Prop()
  @ApiProperty({
    description: 'Created at (time millis)',
    default: moment().valueOf()
  })
  createdAt: number

  @Prop({ default: null })
  @ApiProperty({
    description: 'Updated at (time millis)',
    default: null
  })
  updatedAt: number
}

export const AccountSchema = SchemaFactory.createForClass(Account)

AccountSchema.pre<Account>(/(save|update)/i, function (next) {
  const document = this

  if (document.isNew) {
    document.set({ created: moment().valueOf() })
  } else {
    document.set({ updatedAt: moment().valueOf() })
  }

  if (!document.password || !document.isModified('password')) {
    return next()
  }

  bcrypt.genSalt(10, (genSaltError, salt) => {
    if (genSaltError) {
      return next(genSaltError)
    }

    bcrypt.hash(document.password, salt, (err, hash) => {
      if (err) {
        return next(err)
      }
      document.password = hash
      next()
    })
  })
})

AccountSchema.methods.toJSON = function (): LeanDocument<Account> {
  const account = this.toObject()
  delete account.password
  return account
}

AccountSchema.index({ email: 'text', firstName: 'text', lastName: 'text' })
