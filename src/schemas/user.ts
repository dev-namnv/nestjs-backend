import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { UserRoles, UserStatus } from '../constants/user.constant'
import { BaseDate } from './base/basedate'

@Entity('users')
export class User extends BaseDate {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: string

  @ApiProperty()
  @Column('enum', {
    enum: UserRoles,
    name: 'role',
    default: UserRoles.PRE_VALIDATOR
  })
  role: UserRoles

  @ApiProperty()
  @Column('enum', {
    enum: UserStatus,
    name: 'status',
    default: UserStatus.CREATED
  })
  status: UserStatus

  @ApiProperty()
  @Column('varchar', { name: 'email' })
  email: string

  @ApiProperty()
  @Column('varchar', { name: 'username' })
  username: string

  @ApiProperty()
  @Column('varchar', { name: 'password', default: null })
  password: string

  @ApiProperty()
  @Column('varchar', { name: 'phone_number' })
  phoneNumber: string

  @ApiProperty()
  @Column('varchar', { name: 'company_name' })
  companyName: string

  @ApiProperty()
  @Column('varchar', { name: 'company_website' })
  companyWebsite: string

  @ApiProperty()
  @Column('int', { name: 'verified_at', default: null })
  verifiedAt: number

  @ApiProperty()
  @Column('varchar', { name: 'avatar', default: null })
  avatar: string
}
