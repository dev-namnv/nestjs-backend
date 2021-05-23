import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './modules/app.module'

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const options = new DocumentBuilder()
    .setTitle('API Documents')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT'
    )
    .setDescription('API Microservice System')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api-docs', app, document)
  app.setGlobalPrefix(configService.get('API_VERSION', ''))
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://localhost:3000',
      'https://console.microservice.asia'
    ]
  })

  const port = configService.get('APP_PORT', 3333)
  const host = configService.get('APP_HOST', '127.0.0.1')
  await app.listen(port)
  Logger.log(`Server is running on: http://${host}:${port}`, 'Bootstrap')
  Logger.log(`API docs on: http://${host}:${port}/api-docs/`, 'API Docs')
}

bootstrap()
