import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'node:fs';

async function bootstrap() {
  let app;
  let httpsOptions = {};
  try {
    httpsOptions = {
      key: fs.readFileSync('./secrets/key.pem'),
      cert: fs.readFileSync('./secrets/cert.pem'),
    };
    app = await NestFactory.create(AppModule, {
      httpsOptions,
    });
  } catch (e) {
    console.error(e);
    app = await NestFactory.create(AppModule);
  } finally {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('PrivacyEnhancedPrizes')
      .setDescription('The PrivacyEnhancedPrizes API description')
      .setVersion('1.0')
      .addTag('PrivacyEnhancedPrizes')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
    app.enableCors();
    await app.listen(3000);
  }
}
bootstrap();
