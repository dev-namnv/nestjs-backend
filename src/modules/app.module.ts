import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import * as path from 'path'
import { MongooseModule } from '@nestjs/mongoose'
import { I18nModule, I18nJsonParser } from 'nestjs-i18n'
import { HttpErrorFilter } from '../shared/httpError.filter'
import { TransformInterceptor } from '../shared/transform.interceptor'
import { AppController } from './app.controller'
import { RequestLogModule } from './requestLog/requestLog.module'
import { AppService } from './app.service'
import { AuthenticationModule } from './authentication/authentication.module'
import { AreaModule } from './area/area.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI', ''),
        useFindAndModify: false,
        useCreateIndex: true
      })
    }),
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        fallbackLanguage: configService.get('APP_LOCALE', 'vi'),
        parserOptions: {
          path: path.join(__dirname, '../i18n/')
        },
        watch: true
      }),
      parser: I18nJsonParser
    }),
    RequestLogModule,
    AuthenticationModule,
    AreaModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter
    },
    AppService
  ],
  controllers: [AppController]
})
export class AppModule {}
