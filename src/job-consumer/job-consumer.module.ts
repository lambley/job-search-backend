import { Module } from '@nestjs/common';
import { JobConsumerService } from './job-consumer.service';
import { JobProcessorModule } from '../job-processor/job-processor.module';
import { PrismaKeywordJobRepository } from '../repositories/prisma-keyword-job.repository';
import { PrismaService } from '../prisma.service';
import { JobConsumerProcessor } from './job-consumer.processor';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [JobProcessorModule, BullModule.registerQueue({ name: 'jobQueue' })],
  providers: [
    JobConsumerService,
    JobConsumerProcessor,
    PrismaKeywordJobRepository,
    PrismaService,
  ],
})
export class JobConsumerModule {}
