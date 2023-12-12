import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import * as cors from 'cors';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { config } from '../config/configuration';
import { JobModule } from './job/job.module';
import { PrismaService } from './prisma.service';
import { JobService } from './job/job.service';
import { PrismaJobRepository } from './job/prisma-job.repository';
import { JobProcessorModule } from './job-processor/job-processor.module';
import { JobConsumerModule } from './job-consumer/job-consumer.module';

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
    JobProcessorModule,
    JobConsumerModule,
  ],
  providers: [JobService, PrismaService, PrismaJobRepository],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cors({
          origin: 'http://localhost:3001',
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          credentials: true,
        }),
      )
      .forRoutes('/api/*');
  }
}
