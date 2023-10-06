import { JobResponse, JobDbResponse } from 'src/job/types/job.interface';

// for getJobs - returns an array of job responses
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

export { jobResultArrayFactory, jobResultFactory };
