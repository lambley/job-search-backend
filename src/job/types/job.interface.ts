interface JobLocation {
  area: string[];
  display_name: string;
}

interface JobCategory {
  label: string;
  tag: string;
}

interface JobCompany {
  display_name: string;
}

export interface Job {
  id: number;
  title: string;
  location: JobLocation;
  description: string;
  created: string;
  company: JobCompany;
  salary_min: number;
  salary_max: number;
  contract_type: string;
  category: JobCategory;
}

// see https://developer.adzuna.com/docs/search for an example response
