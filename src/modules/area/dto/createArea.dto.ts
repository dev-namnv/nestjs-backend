import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateAreaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name cant be empty' })
  name: string

  @ApiProperty({ required: false })
  @IsOptional()
  description?: string

  @ApiProperty({ required: false })
  @IsOptional()
  image?: string
}
