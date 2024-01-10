import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobProcessorService } from './job-processor.service';
import { PrismaJobRepository } from '../repositories/prisma-job.repository';
import { PrismaKeywordJobRepository } from '../repositories/prisma-keyword-job.repository';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'jobQueue',
    }),
  ],
  providers: [
    JobProcessorService,
    PrismaJobRepository,
    PrismaKeywordJobRepository,
    PrismaService,
  ],
  exports: [JobProcessorService, BullModule],
})
export class JobProcessorModule {}
