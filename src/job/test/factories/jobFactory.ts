import { JobResponse, JobDbResponse } from 'src/job/types/job.interface';

// for refreshJobs - returns an array of job responses mocked from API
const jobResultArrayFactory = (count: number): JobResponse[] => {
  const results: JobResponse[] = [];

  for (let i = 0; i < count; i++) {
    results.push({
      salary_min: 10000,
      location: {
        area: ['London'],
        display_name: 'London',
      },
      description: 'A job description',
      created: '2021-01-01T00:00:00Z',
      title: 'Job Title',
      category: {
        label: 'IT Jobs',
        tag: 'it-jobs',
      },
      id: (1234567890 + i).toString(),
      salary_max: 100000,
      company: {
        display_name: 'Company Name',
      },
      contract_type: 'full-time',
    });
  }

  return results;
};

// for getJob - returns a single job response
const jobResultFactory = (): JobDbResponse => {
  return {
    id: 1,
    adzuna_id: '1234567890',
    title: 'Job Title',
    location: ['London'],
    description: 'A job description',
    created: '2021-01-01T00:00:00Z',
    company: 'Company Name',
    salary_min: 10000,
    salary_max: 100000,
    contract_type: 'full-time',
    category: 'IT Jobs',
    processed_keywords: ['keyword1', 'keyword2'],
  };
};

// for getJobs - mocks results from DB
const jobDbResultsFactory = (count: number): JobDbResponse[] => {
  const results: JobDbResponse[] = [];

  for (let i = 0; i < count; i++) {
    results.push({
      id: i + 1,
      adzuna_id: (1234567890 + i).toString(),
      title: 'Job Title',
      location: ['London'],
      description: 'A job description',
      created: '2021-01-01T00:00:00Z',
      company: 'Company Name',
      salary_min: 10000,
      salary_max: 100000,
      contract_type: 'full-time',
      category: 'IT Jobs',
      processed_keywords: ['keyword1', `keyword${i}`, `keyword${i + 1}`],
    });
  }

  return results;
};

export { jobResultArrayFactory, jobResultFactory, jobDbResultsFactory };
