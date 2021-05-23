import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator'

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'First name cannot be empty' })
  firstName: string

  @ApiProperty()
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  lastName: string

  @ApiProperty()
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail(
    {},
    {
      message: 'Email is invalid'
    }
  )
  email: string

  @ApiProperty()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(6, { message: 'Password must be greater than 6 characters' })
  @Matches(/^[^\s\r\n\t]+$/, {
    message: 'Password contains invalid characters"'
  })
  password: string
}
