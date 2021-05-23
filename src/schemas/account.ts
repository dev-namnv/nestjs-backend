import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import * as bcrypt from 'bcryptjs'
import moment from 'moment'
import { Document, LeanDocument } from 'mongoose'

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

  @Prop({ unique: true })
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

  @Prop()
  @ApiProperty({ description: 'Avatar', default: null })
  avatar: string

  @Prop({ default: null })
  @ApiProperty({
    description: 'Birthday (YYYY-MM-DD)'
  })
  birthday: string

  @Prop({ default: null })
  @ApiProperty({ description: 'Gender (1: Male, 2: Female, 3: Other)' })
  gender: number

  @Prop({ default: ACCOUNT_STATUS.ACTIVATED })
  @ApiProperty({
    description: 'Status (0: Disabled, 1: Activated)'
  })
  status: number

  @Prop({ default: false })
  @ApiProperty()
  isVerified: boolean

  @Prop({ default: moment(new Date()).valueOf() })
  @ApiProperty({
    description: 'Created at (time millis)'
  })
  createdAt: number

  @Prop()
  @ApiProperty({
    description: 'Updated at (time millis)'
  })
  updatedAt: number | null
}

export const AccountSchema = SchemaFactory.createForClass(Account)

AccountSchema.pre<Account>(/(save|update)/i, function (next) {
  const document = this

  if (document.isNew) {
    document.updatedAt = null
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
