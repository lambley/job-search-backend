import { JobProcessorService } from '../job-processor.service';
import { WordTokenizer } from 'natural/lib/natural/tokenizers';
import { words as StopWords } from 'natural/lib/natural/util/stopwords';

describe('JobProcessorService', () => {
  const filterStopWords = (words: string): string[] => {
    const wordTokenizer = new WordTokenizer();
    const uniqueWordsSet = new Set<string>();

    const tokenizedWords = wordTokenizer.tokenize(words);

    for (const word of tokenizedWords) {
      const lowercaseWord = word.toLowerCase();
      if (!StopWords.includes(lowercaseWord)) {
        uniqueWordsSet.add(lowercaseWord);
      }
    }

    const uniqueWords = Array.from(uniqueWordsSet);

    return uniqueWords;
  };

  it('should be defined', () => {
    expect(new JobProcessorService()).toBeDefined();
  });

  it('should process a job description', async () => {
    const jobProcessorService = new JobProcessorService();

    // simple description test
    let jobDescription = 'This is a job description';
    let result =
      await jobProcessorService.processJobDescription(jobDescription);
    let expectedResult = filterStopWords(jobDescription);
    expect(result).toEqual(expectedResult);

    // longer description test
    jobDescription =
      'This is a longer job description with more words and more stop words';
    result = await jobProcessorService.processJobDescription(jobDescription);
    expectedResult = filterStopWords(jobDescription);
    expect(result).toEqual(expectedResult);

    // description with stop words only
    jobDescription = 'the and';
    result = await jobProcessorService.processJobDescription(jobDescription);
    expectedResult = filterStopWords(jobDescription);
    expect(result).toEqual(expectedResult);
  });
});
