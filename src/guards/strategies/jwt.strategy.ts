import { ForbiddenException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Observable, throwError } from 'rxjs'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../schemas/user'

export interface JwtPayload {
  accountId?: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, @InjectRepository(User) private accountRepository: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY', '')
    })
  }

  async validate(payload: JwtPayload): Promise<User | Observable<never>> {
    if (payload.accountId) {
      const account = await this.accountRepository.findOne(payload.accountId)
      if (account) return account
    }
    return throwError(new ForbiddenException('Unauthenticated'))
  }
}
