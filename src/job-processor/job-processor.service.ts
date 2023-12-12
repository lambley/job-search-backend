import { Injectable } from '@nestjs/common';
import { WordTokenizer } from 'natural/lib/natural/tokenizers';
import { words as StopWords } from 'natural/lib/natural/util/stopwords';
import { Logger } from '@nestjs/common';
import { ProcessJobData } from 'src/types/job-process-data';
import { PrismaJobRepository } from '../job/prisma-job.repository';
import {
  softwareEngineeringKeywords,
  generalSoftSkillsKeywords,
} from '../utils/constants';

@Injectable()
export class JobProcessorService {
  constructor(private readonly jobRepository: PrismaJobRepository) {}

  async processJobDescription({
    description,
    id,
    adzuna_id,
  }: ProcessJobData): Promise<string[]> {
    Logger.log(
      `Processing job id #${id} | adzuna_id #${adzuna_id}`,
      'JobProcessorService',
    );
    try {
      const processed_keywords =
        this.processJobDescriptionWithNatural(description);
      Logger.log(
        `Processed ${processed_keywords.length} keywords for id #${id} | adzuna_id #${adzuna_id}`,
        'JobProcessorService',
      );
      return processed_keywords;
    } catch (error) {
      Logger.error(`~ ${error.message}`, 'JobProcessorService');
      return [];
    }
  }

  processJobDescriptionWithNatural(jobDescription: string): string[] {
    const wordTokenizer = new WordTokenizer();
    const uniqueWordsSet = new Set<string>();

    const words = wordTokenizer.tokenize(jobDescription);

    for (const word of words) {
      const lowercaseWord = word.toLowerCase();
      if (!StopWords.includes(lowercaseWord)) {
        if (
          softwareEngineeringKeywords.includes(lowercaseWord) ||
          generalSoftSkillsKeywords.includes(lowercaseWord)
        ) {
          uniqueWordsSet.add(lowercaseWord);
        }
      }
    }

    return Array.from(uniqueWordsSet);
  }

  async saveKeywordsToDatabase(id: string, keywords: string[]): Promise<void> {
    Logger.log(
      `Saving ${keywords.length} keywords to database`,
      'JobProcessorService',
    );
    try {
      await this.jobRepository.saveKeywords(id, keywords);
      Logger.log(
        `Saved ${keywords.length} keywords to database for id #${id}`,
        'JobProcessorService',
      );
    } catch (error) {
      Logger.error(`~ ${error.message}`, 'JobProcessorService');
    }
  }
}
