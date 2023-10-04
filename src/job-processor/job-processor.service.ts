import { Injectable } from '@nestjs/common';

@Injectable()
export class JobProcessorService {
  async processJobDescription(jobDescription: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`JobProcessorService: ${jobDescription}`);
        resolve();
      }, 5000);
    });
  }
}
