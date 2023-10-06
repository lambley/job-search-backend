import { Module } from '@nestjs/common';
import { JobConsumerService } from './job-consumer.service';
import { JobProcessorModule } from '../job-processor/job-processor.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [JobProcessorModule, BullModule.registerQueue({ name: 'jobQueue' })],
  providers: [JobConsumerService],
})
export class JobConsumerModule {}
