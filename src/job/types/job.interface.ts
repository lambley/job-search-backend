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

export interface JobResponse {
  id: string;
  title: string;
  location: JobLocation;
  description: string;
  created: string;
  company: JobCompany;
  salary_min: number;
  salary_max: number;
  contract_type?: string;
  category: JobCategory;
}

export interface JobDBCreateRequest {
  adzuna_id: string;
  title: string;
  location: string[];
  description: string;
  created: string;
  company: string;
  salary_min: number;
  salary_max: number;
  contract_type?: string;
  category: string;
}

export interface JobDbResponse {
  id: number;
  adzuna_id: string;
  title: string;
  // area[] array of JobResponse.location.area
  location: string[];
  description: string;
  created: string;
  // display_name string of JobResponse.company.display_name
  company: string;
  salary_min: number;
  salary_max: number;
  contract_type?: string;
  // label string of JobResponse.category.label
  category: string;
  message?: string;
}

// see https://developer.adzuna.com/docs/search for an example response
