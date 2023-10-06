import { Processor, Process } from '@nestjs/bull';
import { JobProcessorService } from '../job-processor/job-processor.service';
import { Logger } from '@nestjs/common';
import { ProcessJobData } from 'src/types/job-process-data';

// redis queue job data interface
interface QueueJobData {
  name: string;
  data: {
    description: string;
    id: string;
    adzuna_id: string;
  };
  opts: {
    attempts: number;
    delay: number;
    timestamp: number;
  };
  timestamp: number;
  delay: number;
  priority: number;
}

@Processor('jobQueue')
export class JobConsumerProcessor {
  constructor(private readonly jobProcessorService: JobProcessorService) {}

  @Process('processJob')
  async handleProcessJob(data: QueueJobData) {
    const { description, id, adzuna_id } = data.data;
    Logger.log(
      `Processing job id #${id} | adzuna_id #${adzuna_id}`,
      'JobConsumerProcessor',
    );
    const keywords = await this.jobProcessorService.processJobDescription({
      description,
      id,
      adzuna_id,
    });
    this.jobProcessorService.saveKeywordsToDatabase(id, keywords);
  }
}
