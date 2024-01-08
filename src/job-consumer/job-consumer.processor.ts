import { Processor, Process } from '@nestjs/bull';
import { JobProcessorService } from '../job-processor/job-processor.service';
import { Logger } from '@nestjs/common';
import { QueueJobData } from '../types/job-process-data';

@Processor('jobQueue')
export class JobConsumerProcessor {
  constructor(private readonly jobProcessorService: JobProcessorService) {}

  @Process('processJob')
  async handleProcessJob(job: QueueJobData) {
    try {
      const { description, id, adzuna_id } = job.data;
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
    } catch (error) {
      if (error.message.includes('Redis server is not available')) {
        // Handle the Redis server not running error here
        Logger.error('Redis server is not running', 'JobConsumerProcessor');
      } else {
        Logger.error(`~ ${error.message}`, 'JobConsumerProcessor');
      }
    }
  }
}
