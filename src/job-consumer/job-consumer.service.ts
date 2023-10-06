import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { JobProcessorService } from '../job-processor/job-processor.service';
import { JobResponse } from 'src/job/types/job.interface';

@Injectable()
export class JobConsumerService {
  constructor(private readonly jobProcessorService: JobProcessorService) {}

  async processJob(job: { data: JobResponse }) {
    const jobData = job.data;
    Logger.log(`Processing job ${jobData.id}`);
    await this.jobProcessorService.processJobDescription(jobData.description);
  }
}
