import { ForbiddenException, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Observable, throwError } from 'rxjs'
import { Model } from 'mongoose'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Account } from '../../schemas/account'

export interface JwtPayload {
  accountId?: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectModel(Account.name) private accountModel: Model<Account>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY', '')
    })
  }

  async validate(payload: JwtPayload): Promise<Account | Observable<never>> {
    if (payload.accountId) {
      const account = await this.accountModel.findById(payload.accountId)
      if (account) return account
    }
    return throwError(new ForbiddenException('Unauthenticated'))
  }
}
