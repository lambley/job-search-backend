import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { PrismaService } from '../prisma.service';
import { PrismaJobRepository } from './prisma-job.repository';
import { JobProcessorModule } from '../job-processor/job-processor.module';
import { JobProcessorService } from '../job-processor/job-processor.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    JobProcessorModule,
    BullModule.registerQueue({
      name: 'jobQueue',
    }),
  ],
  controllers: [JobController],
  providers: [
    JobService,
    JobProcessorService,
    PrismaService,
    PrismaJobRepository,
  ],
  exports: [JobService],
})
export class JobModule {}
