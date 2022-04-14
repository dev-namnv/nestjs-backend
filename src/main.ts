import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Server } from 'http'
import { AppModule } from './modules/app.module'

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const httpAdapter = app.getHttpAdapter()
  const server: Server = httpAdapter.getHttpServer() as Server
  server.keepAliveTimeout = 65 * 1000
  server.headersTimeout = 70 * 1000

  const swaggerOptions = new DocumentBuilder()
    .setTitle('API Documents')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
    .setDescription('API ODC System')
    .build()
  const document = SwaggerModule.createDocument(app, swaggerOptions)
  const customCss =
    '.swagger-ui .model-box-control:focus, .swagger-ui .models-control:focus, .swagger-ui .opblock-summary-control:focus {outline:none;}' // + `.topbar-wrapper img { content:url('${iconPath}'); }`;
  SwaggerModule.setup('/gov-be/v1/documents', app, document, {
    customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.1/themes/3.x/theme-flattop.css',
    customCss,
    // customfavIcon: iconPath,
    customSiteTitle: 'Governance Tool BE  API'
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: {
        target: false
      }
    })
  )
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000']
  })

  const port = configService.get('APP_PORT', 3333)
  const host = configService.get('APP_HOST', '127.0.0.1')
  await app.listen(port)
  Logger.log(`Server is running on: http://${host}:${port}`, 'Bootstrap')
  Logger.log(`API docs on: http://${host}:${port}/gov-be/v1/documents`, 'API Docs')
}

bootstrap()
