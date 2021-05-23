import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { JwtAuthGuard } from '../../guards/jwtAuth.guard'
import { Account } from '../../schemas/account'
import { AuthenticationService } from './authentication.service'
import { LoginDto } from './dto/login.dto'
import { LoginSocialDto } from './dto/loginSocial.dto'
import { RegisterDto } from './dto/register.dto'
import { ChangePasswordDto } from './dto/changePassword.dto'

export class LoginResponse {
  @ApiProperty()
  accessToken: string
}

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/register')
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Account register' })
  @ApiResponse({ type: Account, status: 201 })
  async create(
    @Body() registerDto: RegisterDto
  ): Promise<Account | Observable<never>> {
    return this.authenticationService.register(registerDto)
  }

  @Post('/login')
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Account login' })
  @ApiResponse({ type: LoginResponse })
  async login(
    @Body() loginDto: LoginDto
  ): Promise<LoginResponse | Observable<never>> {
    return this.authenticationService.login(loginDto)
  }

  @Post('/login-google')
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Account login google' })
  async loginGoogle(
    @Body() loginSocialDto: LoginSocialDto
  ): Promise<LoginResponse | Observable<never>> {
    return this.authenticationService.loginGoogle(loginSocialDto)
  }

  @Post('/login-facebook')
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Account login facebook' })
  async loginFacebook(
    @Body() loginSocialDto: LoginSocialDto
  ): Promise<LoginResponse | Observable<never>> {
    return this.authenticationService.loginFacebook(loginSocialDto)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiTags('Auth')
  @Get('/profile')
  getProfile(@Req() req: Request): any {
    return req.user as Account
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @Patch('/change-password')
  @ApiTags('Auth')
  @ApiOperation({ summary: 'Change password' })
  async changePassword(
    @Req() req: Request,
    @Body() data: ChangePasswordDto
  ): Promise<object | Observable<never>> {
    const account = req.user as Account
    return this.authenticationService.changePassword(account._id, data)
  }
}
