import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { JobConsumerService } from './job-consumer.service';
import { Process, Processor } from '@nestjs/bull';
import { JobProcessorService } from '../job-processor/job-processor.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'jobQueue' })],
  providers: [JobConsumerService],
})

// Processor for the job queue - running the job processor service
@Processor('jobQueue') // Specify the queue name
export class JobConsumerProcessor {
  constructor(private readonly jobProcessorService: JobProcessorService) {}

  @Process('processJob') // Specify the job name
  async handleProcessJob(job: { data: any }) {
    const jobData = job.data;
    await this.jobProcessorService.processJobDescription(jobData.description);
  }
}

export class JobConsumerModule {}
