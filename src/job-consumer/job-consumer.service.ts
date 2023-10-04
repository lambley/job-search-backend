import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class JobConsumerService {
  async processJobDescription(jobDescription: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        Logger.log(`JobConsumerService: ${jobDescription}`);
        resolve();
      }, 5000);
    });
  }
}
