import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    JobModule,
  ],
  providers: [JobService, PrismaService, PrismaJobRepository],
})
export class AppModule {}
