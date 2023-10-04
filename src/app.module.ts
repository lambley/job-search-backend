import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { config } from '../config/configuration';
import { JobModule } from './job/job.module';
import { PrismaService } from './prisma.service';
import { JobService } from './job/job.service';
import { PrismaJobRepository } from './job/prisma-job.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [config],
      isGlobal: true,
    }),
    BullModule.forRoot({
      // local config - change later
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    JobModule,
  ],
  providers: [JobService, PrismaService, PrismaJobRepository],
})
export class AppModule {}
