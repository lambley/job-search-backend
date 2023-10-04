import { Module } from '@nestjs/common';
import { JobProcessorService } from './job-processor.service';

@Module({})
export class JobProcessorModule {
  providers: [JobProcessorService];
  exports: [JobProcessorService];
}
