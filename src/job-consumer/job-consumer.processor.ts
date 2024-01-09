import { Processor, Process } from '@nestjs/bull';
import { JobProcessorService } from '../job-processor/job-processor.service';
import { PrismaKeywordJobRepository } from '../repositories/prisma-keyword-job.repository';
import { Logger } from '@nestjs/common';
import { QueueJobData } from '../types/job-process-data';

@Processor('jobQueue')
export class JobConsumerProcessor {
  constructor(
    private readonly jobProcessorService: JobProcessorService,
    private readonly keywordJobRepository: PrismaKeywordJobRepository,
  ) {}

  @Process('processJob')
  async handleProcessJob(job: QueueJobData) {
    const { description, id, adzuna_id } = job.data;
    try {
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
        // If Redis is down, save the job to the database for later processing
        Logger.error('Redis server is not running', 'JobConsumerProcessor');
        await this.saveKeywordJobToDatabaseForLaterProcessing(
          description,
          adzuna_id,
        );
      } else {
        Logger.error(`~ ${error.message}`, 'JobConsumerProcessor');
      }
    }
  }

  private async saveKeywordJobToDatabaseForLaterProcessing(
    description: string,
    adzuna_id: string,
  ): Promise<void> {
    // Save the job to the database for later processing with PENDING status
    try {
      await this.keywordJobRepository.create({
        description,
        adzuna_id,
      });
      Logger.log(
        `Saved job id #${adzuna_id} to database for later processing`,
        'JobConsumerProcessor',
      );
    } catch (error) {
      Logger.error(`~ ${error.message}`, 'JobConsumerProcessor');
    }
  }
}
