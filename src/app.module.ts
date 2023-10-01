import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from '../config/configuration';
import { JobModule } from './job/job.module';
import { PrismaService } from './prisma.service';
import { JobService } from './job/job.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [config],
      isGlobal: true,
    }),
    JobModule,
  ],
  providers: [JobService, PrismaService],
})
export class AppModule {}
