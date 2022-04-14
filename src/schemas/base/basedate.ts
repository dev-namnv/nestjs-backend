import { Column, Index } from 'typeorm'

export abstract class BaseDate {
  @Index()
  @Column('int', { name: 'created_at' })
  createdAt: number

  @Column('int', { name: 'updated_at' })
  updatedAt: number
}
