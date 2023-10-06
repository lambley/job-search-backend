import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { JobProcessorService } from '../job-processor/job-processor.service';

@Injectable()
export class JobConsumerService {
  constructor(private readonly jobProcessorService: JobProcessorService) {}

  async processJob(description: string) {
    Logger.log(`Processing job ${description}`, 'JobConsumerService');
    await this.jobProcessorService.processJobDescription(description);
  }
}
