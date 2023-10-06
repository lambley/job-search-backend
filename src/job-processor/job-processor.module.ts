import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobProcessorService } from './job-processor.service';
import { PrismaJobRepository } from 'src/job/prisma-job.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'jobQueue',
    }),
  ],
  providers: [JobProcessorService, PrismaJobRepository, PrismaService],
  exports: [JobProcessorService, BullModule],
})
export class JobProcessorModule {}
