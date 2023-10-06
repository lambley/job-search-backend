import { Processor, Process } from '@nestjs/bull';
import { JobProcessorService } from '../job-processor/job-processor.service';
import { Logger } from '@nestjs/common';

// redis queue job data interface
interface QueueJobData {
  name: string;
  data: {
    description: string;
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
    const name = data.name || '';
    const shortName = name.slice(0, 10) || '';
    const description = data.data.description || '';
    const shortDescription = description.slice(0, 20) || '';

    Logger.log(
      `Processing job ${shortName} - ${shortDescription}`,
      'JobConsumerProcessor',
    );
    await this.jobProcessorService.processJobDescription(description);
  }
}
