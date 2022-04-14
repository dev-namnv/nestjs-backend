import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { JwtAuthGuard } from '../../guards/jwtAuth.guard'
import { User } from '../../schemas/user'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

export class LoginResponse {
  @ApiProperty()
  accessToken: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticationService: AuthService) {}

  @Post('/register')
  @ApiTags('Auth')
  @ApiOperation({ summary: 'User register' })
  @ApiResponse({ type: User, status: 201 })
  async create(@Body() registerDto: RegisterDto): Promise<User | Observable<never>> {
    return this.authenticationService.register(registerDto)
  }

  @Post('/login')
  @ApiTags('Auth')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ type: LoginResponse })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse | Observable<never>> {
    return this.authenticationService.login(loginDto)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiTags('Auth')
  @Get('/profile')
  @ApiResponse({ type: User })
  async getProfile(@Req() req: Request): Promise<User | null> {
    return req.user as User
  }
}
