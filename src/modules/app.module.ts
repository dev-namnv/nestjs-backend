import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import * as path from 'path'
import { I18nModule, I18nJsonParser } from 'nestjs-i18n'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Connection } from 'typeorm'
import { HttpErrorFilter } from '../shared/httpError.filter'
import { TransformInterceptor } from '../shared/transform.interceptor'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { User } from '../schemas/user'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        return {
          type: configService.get('DB_TYPE') as 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'), // @ts-ignore
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          extra: {
            connectionLimit: configService.get('DB_CONNECTION_LIMIT')
          },
          cache: false,
          dateStrings: false,
          logging: 'all',
          entities: [User]
        }
      }
    }),
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        fallbackLanguage: configService.get('APP_LOCALE', 'en'),
        parserOptions: {
          path: path.join(__dirname, '../i18n/')
        },
        watch: true
      }),
      parser: I18nJsonParser
    }),
    AuthModule
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
export class AppModule {
  // @ts-ignore
  constructor(private connection: Connection) {}
}
