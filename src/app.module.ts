import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { RecordsModule } from './records/records.module';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { TimeLoggingMiddleware } from './middleware/time-logger.middleware';
// import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    // MulterModule.register({
    //   limits: {
    //     fileSize: 10 * 1024 * 1024, // 10 MB
    //   },
    // }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    RecordsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
    consumer.apply(TimeLoggingMiddleware).forRoutes('*');
  }
}
