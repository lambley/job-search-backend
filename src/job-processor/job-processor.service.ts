import { Injectable } from '@nestjs/common';
import { WordTokenizer } from 'natural/lib/natural/tokenizers';
import { words as StopWords } from 'natural/lib/natural/util/stopwords';

@Injectable()
export class JobProcessorService {
  async processJobDescription(jobDescription: string): Promise<string[]> {
    return this.processJobDescriptionWithNatural(jobDescription);
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
