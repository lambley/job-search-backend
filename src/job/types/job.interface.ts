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
  salary_min: number;
  longitude: number;
  location: JobLocation;
  salary_is_predicted: number;
  description: string;
  created: string;
  latitude: number;
  redirect_url: string;
  title: string;
  category: JobCategory;
  id: string;
  salary_max: number;
  company: JobCompany;
  contract_type: string;
}

// see https://developer.adzuna.com/docs/search for an example response
