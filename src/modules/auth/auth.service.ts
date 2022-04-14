import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { Observable, throwError } from 'rxjs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../schemas/user'
import { LoginResponse } from './auth.controller'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private accountRepository: Repository<User>,
    private jwtService: JwtService // private configService: ConfigService
  ) {}

  async register(registerDto: RegisterDto): Promise<User | Observable<never>> {
    try {
      let password
      bcrypt.genSalt(10, (genSaltError, salt) => {
        if (genSaltError) {
          password = null
        }

        bcrypt.hash(registerDto.password, salt, (err, hash) => {
          if (err) {
            password = null
          }
          password = hash
        })
      })

      return this.accountRepository.save({
        username: registerDto.username,
        phoneNumber: registerDto.phoneNumber,
        email: registerDto.email,
        password
      })
    } catch (e) {
      Logger.error(`[${__filename}] ${e.getLineNumber ? e.getLineNumber() : '-1'}: ${e.message}`)

      return throwError(new InternalServerErrorException('Internal server error'))
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse | Observable<never>> {
    try {
      const account = await this.accountRepository.findOne({ email: loginDto.email })

      if (!account) {
        return throwError(new NotFoundException('User not found'))
      }

      const isPasswordMatching = await bcrypt.compare(loginDto.password, account.password)

      if (!isPasswordMatching) {
        return throwError(new UnauthorizedException('Password is invalid'))
      }

      const payload = { accountId: account.id }

      return {
        accessToken: this.jwtService.sign(payload)
      }
    } catch (e) {
      Logger.error(`[${__filename}] ${e.getLineNumber ? e.getLineNumber() : '-1'}: ${e.message}`)

      return throwError(new InternalServerErrorException('Internal server error'))
    }
  }

  async find(id: string): Promise<User | Observable<never>> {
    try {
      const account = await this.accountRepository.findOne(id)

      if (!account) {
        return throwError(new NotFoundException('User not found'))
      }

      return account
    } catch (e) {
      Logger.error(`[${__filename}] ${e.getLineNumber ? e.getLineNumber() : '-1'}: ${e.message}`)

      return throwError(new InternalServerErrorException('Internal server error'))
    }
  }
}
