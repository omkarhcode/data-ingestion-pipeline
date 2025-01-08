import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { RecordsModule } from './records/records.module';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    RecordsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
