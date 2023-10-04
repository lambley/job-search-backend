import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class JobProcessorService {
  async processJobDescription(jobDescription: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        Logger.log(`JobProcessorService: ${jobDescription}`);
        resolve();
      }, 5000);
    });
  }
}