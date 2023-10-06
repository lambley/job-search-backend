import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { JobProcessorService } from '../job-processor/job-processor.service';
import { ProcessJobData } from 'src/types/job-process-data';

@Injectable()
export class JobConsumerService {
  constructor(private readonly jobProcessorService: JobProcessorService) {}

  async processJob({ description, id, adzuna_id }: ProcessJobData) {
    Logger.log(
      `Processing job id #${id} | adzuna_id #${adzuna_id}`,
      'JobConsumerService',
    );
    await this.jobProcessorService.processJobDescription({
      description,
      id,
      adzuna_id,
    });
  }
}
