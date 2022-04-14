import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator'

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string

  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @Matches(/^[^\s\r\n\t]+$/, {
    message: 'Password contains invalid characters"'
  })
  @MinLength(6, { message: 'Password must be greater than 6 characters' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string

  @ApiProperty()
  @IsNotEmpty()
  passwordConfirm: string
}
