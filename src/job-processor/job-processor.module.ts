import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobProcessorService } from './job-processor.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'jobQueue',
    }),
  ],
  providers: [JobProcessorService],
  exports: [JobProcessorService, BullModule],
})
export class JobProcessorModule {}
