import { Injectable } from '@nestjs/common';
import { WordTokenizer } from 'natural/lib/natural/tokenizers';
import { words as StopWords } from 'natural/lib/natural/util/stopwords';
import { Logger } from '@nestjs/common';

@Injectable()
export class JobProcessorService {
  async processJobDescription(jobDescription: string): Promise<string[]> {
    const shortDescription = jobDescription.slice(0, 20) || '';

    Logger.log(`Processing job ${shortDescription}`, 'JobProcessorService');
    try {
      const processed_keywords =
        this.processJobDescriptionWithNatural(jobDescription);
      Logger.log(
        `Processed ${processed_keywords.length} keywords`,
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
        uniqueWordsSet.add(lowercaseWord);
      }
    }

    const uniqueWords = Array.from(uniqueWordsSet);
    return uniqueWords;
  }
}
