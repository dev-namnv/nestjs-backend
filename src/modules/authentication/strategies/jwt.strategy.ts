import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Observable, throwError } from 'rxjs'
import { Account } from '../../../schemas/account'
import { AuthenticationService } from '../authentication.service'

interface JwtPayload {
  accountId?: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private authenticationService: AuthenticationService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY', '')
    })
  }

  async validate(payload: JwtPayload): Promise<Account | Observable<never>> {
    if (payload.accountId) {
      return this.authenticationService.find(payload.accountId)
    }
    return throwError(new InternalServerErrorException('Unauthenticated'))
  }
}
