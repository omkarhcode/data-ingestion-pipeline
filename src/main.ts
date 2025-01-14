import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // enableDebugMessages: true, // If set to true, validator will print extra warning messages to the console when something is not right.
      // skipUndefinedProperties: true, // If set to true then validator will skip validation of all properties that are undefined in the validating object.
      // skipNullProperties: true, // If set to true then validator will skip validation of all properties that are null in the validating object.
      // skipMissingProperties: true, // If set to true then validator will skip validation of all properties that are null or undefined in the validating object.
      whitelist: true, // If set to true, validator will strip validated (returned) object of any properties that do not use any validation decorators.
      forbidNonWhitelisted: true, // If set to true, instead of stripping non-whitelisted properties validator will throw an exception.
      // forbidUnknownValues: true, // If set to true, attempts to validate unknown objects fail immediately.
      transform: true,
    }),
  );
  await app.listen(process.env.PORT);

  console.log('All environment variables:', process.env);

  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  console.info(`🚀 Backend server is running on port ${process.env.PORT}`);
}
bootstrap();
