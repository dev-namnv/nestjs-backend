import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { Account, AccountSchema } from '../../schemas/account'
import { AuthenticationController } from './authentication.controller'
import { AuthenticationService } from './authentication.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { AreaModule } from '../area/area.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY', ''),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRES')}s`
        }
      })
    }),
    AreaModule
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtStrategy],
  exports: [AuthenticationService]
})
export class AuthenticationModule {}
