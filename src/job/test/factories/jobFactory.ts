import { JobResponse } from 'src/job/types/job.interface';

export const jobResultsFactory = (count: number): JobResponse[] => {
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
      id: '1234567890',
      salary_max: 100000,
      company: {
        display_name: 'Company Name',
      },
      contract_type: 'full-time',
    });
  }

  return results;
};
