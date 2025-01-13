import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { RecordsModule } from './records/records.module';
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
export class AppModule {}
