import { Processor, Process } from '@nestjs/bull';
import { JobProcessorService } from '../job-processor/job-processor.service';
import { JobResponse } from 'src/job/types/job.interface';

@Processor('jobQueue')
export class JobConsumerProcessor {
  constructor(private readonly jobProcessorService: JobProcessorService) {}

  @Process('processJob')
  async handleProcessJob(job: { data: JobResponse }) {
    const jobData = job.data;
    await this.jobProcessorService.processJobDescription(jobData.description);
  }
}
