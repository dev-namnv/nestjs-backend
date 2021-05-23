import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { google } from 'googleapis'
import * as bcrypt from 'bcryptjs'
import { Model, Types } from 'mongoose'
import { Observable, throwError } from 'rxjs'
// @ts-ignore
import { Facebook } from 'fb'
import { Account } from '../../schemas/account'
import { LoginResponse } from './authentication.controller'
import { LoginDto } from './dto/login.dto'
import { LoginSocialDto } from './dto/loginSocial.dto'
import { RegisterDto } from './dto/register.dto'
import { ChangePasswordDto } from './dto/changePassword.dto'
import { AreaService } from '../area/area.service'

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private areaService: AreaService
  ) {}

  async register(
    registerDto: RegisterDto
  ): Promise<Account | Observable<never>> {
    try {
      const registeredAccount = new this.accountModel(registerDto)
      const account = await registeredAccount.save()
      await this.areaService.create(account._id, {
        name: 'Area default'
      })
      return account
    } catch (e) {
      Logger.error(
        `[${__filename}] ${e.getLineNumber ? e.getLineNumber() : '-1'}: ${
          e.message
        }`
      )

      return throwError(
        new InternalServerErrorException('Internal server error')
      )
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse | Observable<never>> {
    try {
      const account = await this.accountModel.findOne({ email: loginDto.email })

      if (!account) {
        return throwError(new NotFoundException('Account not found'))
      }

      const isPasswordMatching = await bcrypt.compare(
        loginDto.password,
        account.password
      )

      if (!isPasswordMatching) {
        return throwError(new UnauthorizedException('Password is invalid'))
      }

      const payload = { accountId: account._id.toString() }

      return {
        accessToken: this.jwtService.sign(payload)
      }
    } catch (e) {
      Logger.error(
        `[${__filename}] ${e.getLineNumber ? e.getLineNumber() : '-1'}: ${
          e.message
        }`
      )

      return throwError(
        new InternalServerErrorException('Internal server error')
      )
    }
  }

  async loginGoogle(
    loginSocialDto: LoginSocialDto
  ): Promise<LoginResponse | Observable<never>> {
    try {
      const oauth2Client = new google.auth.OAuth2(
        this.configService.get('GOOGLE_CLIENT_ID', ''),
        this.configService.get('GOOGLE_CLIENT_SECRET', '')
      )
      try {
        await oauth2Client.getTokenInfo(loginSocialDto.accessToken)
      } catch (e) {
        Logger.error(
          `[${__filename}] ${e.getLineNumber ? e.getLineNumber() : '-1'}: ${
            e.message
          }`
        )
        return throwError(new UnauthorizedException())
      }
      oauth2Client.setCredentials({
        // eslint-disable-next-line @typescript-eslint/camelcase
        access_token: loginSocialDto.accessToken
      })
      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
      })
      const userInfo = await oauth2.userinfo.get()
      const {
        id: googleId,
        email,
        given_name: firstName,
        family_name: lastName
      } = userInfo.data
      let account = await this.accountModel.findOne({
        $or: [{ googleId: googleId || '' }, { email: email || '' }]
      })
      if (!account) {
        const registeredAccount = new this.accountModel({
          googleId,
          email,
          firstName,
          lastName,
          isVerified: true
        })
        account = await registeredAccount.save()
        await this.areaService.create(account._id, {
          name: 'Area default'
        })
      } else if (!account.googleId) {
        account.googleId = googleId || ''
        await account.save()
      }
      const payload = { accountId: account._id.toString() }

      return {
        accessToken: this.jwtService.sign(payload)
      }
    } catch (e) {
      Logger.error(
        `[${__filename}] ${e.getLineNumber ? e.getLineNumber() : '-1'}: ${
          e.message
        }`
      )

      return throwError(
        new InternalServerErrorException('Internal server error')
      )
    }
  }

  async loginFacebook(
    loginSocialDto: LoginSocialDto
  ): Promise<LoginResponse | Observable<never>> {
    try {
      const fb = new Facebook({
        version: 'v8.0',
        appId: this.configService.get('FACEBOOK_APP_ID', ''),
        appSecret: this.configService.get('FACEBOOK_APP_SECRET', ''),
        accessToken: loginSocialDto.accessToken,
        timeout: 30000
      })
      const userInfo = await fb.api('/me', {
        fields: 'id, email, first_name, last_name, middle_name, picture'
      })
      const {
        id: facebookId,
        email,
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName
      } = userInfo
      let account = await this.accountModel.findOne({
        $or: [{ facebookId: facebookId || '' }, { email: email || '' }]
      })
      if (!account) {
        const registeredAccount = new this.accountModel({
          facebookId,
          email,
          firstName,
          lastName: lastName + (middleName ? `${middleName} ` : ''),
          isVerified: true
        })
        account = await registeredAccount.save()
        await this.areaService.create(account._id, {
          name: 'Area default'
        })
      } else if (!account.facebookId) {
        account.facebookId = facebookId || ''
        await account.save()
      }
      const payload = { accountId: account._id.toString() }
      return {
        accessToken: this.jwtService.sign(payload)
      }
    } catch (e) {
      Logger.error(
        `[${__filename}] ${e.getLineNumber ? e.getLineNumber() : '-1'}: ${
          e.message
        }`
      )

      return throwError(
        new InternalServerErrorException('Internal server error')
      )
    }
  }

  async find(id: string): Promise<Account | Observable<never>> {
    try {
      const account = await this.accountModel.findById(id)

      if (!account) {
        return throwError(new NotFoundException('Account not found'))
      }

      return account
    } catch (e) {
      Logger.error(
        `[${__filename}] ${e.getLineNumber ? e.getLineNumber() : '-1'}: ${
          e.message
        }`
      )

      return throwError(
        new InternalServerErrorException('Internal server error')
      )
    }
  }

  async changePassword(
    id: Types.ObjectId,
    data: ChangePasswordDto
  ): Promise<object | Observable<never>> {
    try {
      if (data.newPassword !== data.newPasswordConfirm) {
        return throwError(
          new BadRequestException('Password confirm is invalid')
        )
      }

      const account = await this.accountModel.findById(id)
      if (!account) {
        return throwError(new NotFoundException('Account not found'))
      }
      const isPasswordMatching = await bcrypt.compare(
        data.password,
        account.password
      )

      if (!isPasswordMatching) {
        return throwError(new UnauthorizedException('Password is invalid'))
      }

      bcrypt.genSalt(10, (genSaltError, salt): any => {
        if (genSaltError) {
          return throwError(
            new InternalServerErrorException('Internal server error')
          )
        }

        bcrypt.hash(data.newPassword, salt, async (err, hash): Promise<any> => {
          if (err) {
            return throwError(
              new InternalServerErrorException('Internal server error')
            )
          }
          await this.accountModel.findByIdAndUpdate(
            id,
            { password: hash },
            { new: true }
          )
        })
      })

      return { message: 'Password changed successfully' }
    } catch (e) {
      Logger.error(
        `[${__filename}] ${e.getLineNumber ? e.getLineNumber() : '-1'}: ${
          e.message
        }`
      )

      return throwError(
        new InternalServerErrorException('Internal server error')
      )
    }
  }
}
