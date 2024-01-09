import { Test, TestingModule } from '@nestjs/testing';
import { JobProcessorService } from '../job-processor.service';
import { WordTokenizer } from 'natural/lib/natural/tokenizers';
import { words as StopWords } from 'natural/lib/natural/util/stopwords';
import { PrismaJobRepository } from '../../repositories/prisma-job.repository';
import { PrismaService } from '../../prisma.service';
import {
  softwareEngineeringKeywords,
  generalSoftSkillsKeywords,
} from '../../utils/constants';
import { randomStringFromArray } from '../../utils/testFunctions';

describe('JobProcessorService', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [JobProcessorService, PrismaJobRepository, PrismaService],
    }).compile();
  });

  // helper function to filter stop words
  const filterStopWords = (words: string): string[] => {
    const wordTokenizer = new WordTokenizer();
    const uniqueWordsSet = new Set<string>();

    const tokenizedWords = wordTokenizer.tokenize(words);

    for (const word of tokenizedWords) {
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

    const uniqueWords = Array.from(uniqueWordsSet);

    return uniqueWords;
  };

  // example jobs for testing
  const shortJob = {
    description: 'This is a job description',
    id: '1',
    adzuna_id: '1',
  };

  const longJob = {
    description:
      'This is a longer job description with more words and more stop words',
    id: '2',
    adzuna_id: '2',
  };

  const stopWordsOnlyJob = {
    description: 'the and',
    id: '3',
    adzuna_id: '3',
  };

  const softwareEngineeringKeywordsOnlyJob = {
    description: randomStringFromArray(softwareEngineeringKeywords, 15),
    id: '4',
    adzuna_id: '4',
  };

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should process a job description', async () => {
    const jobProcessorService =
      module.get<JobProcessorService>(JobProcessorService);

    // simple description test
    let result = await jobProcessorService.processJobDescription(shortJob);
    let expectedResult = filterStopWords(shortJob.description);
    expect(result).toEqual(expectedResult);

    // longer description test
    result = await jobProcessorService.processJobDescription(longJob);
    expectedResult = filterStopWords(longJob.description);
    expect(result).toEqual(expectedResult);

    // description with stop words only
    result = await jobProcessorService.processJobDescription(stopWordsOnlyJob);
    expectedResult = filterStopWords(stopWordsOnlyJob.description);
    expect(result).toEqual(expectedResult);

    // description with software engineering keywords only
    result = await jobProcessorService.processJobDescription(
      softwareEngineeringKeywordsOnlyJob,
    );
    expectedResult = filterStopWords(
      softwareEngineeringKeywordsOnlyJob.description,
    );
    expect(result).toEqual(expectedResult);
  });
});
