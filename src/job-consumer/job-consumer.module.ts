import { Module } from '@nestjs/common';
import { JobConsumerService } from './job-consumer.service';
import { Process, Processor } from '@nestjs/bull';
import { JobProcessorService } from '../job-processor/job-processor.service';
import { JobProcessorModule } from '../job-processor/job-processor.module';

@Module({
  imports: [JobProcessorModule],
  providers: [JobConsumerService],
})
// Processor for the job queue - running the job processor service
@Processor('jobQueue') // Specify the queue name
export class JobConsumerProcessor {
  constructor(private readonly jobProcessorService: JobProcessorService) {}

  @Process('processJob')
  async handleProcessJob(job: { data: any }) {
    const jobData = job.data;
    await this.jobProcessorService.processJobDescription(jobData.description);
  }
}

export class JobConsumerModule {}
