interface AdzunaLocation {
  area: string[];
  display_name: string;
}

interface AdzunaCategory {
  label: string;
  tag: string;
}

interface AdzunaCompany {
  display_name: string;
}

export interface AdzunaJob {
  salary_min: number;
  longitude: number;
  location: AdzunaLocation;
  salary_is_predicted: number;
  description: string;
  created: string;
  latitude: number;
  redirect_url: string;
  title: string;
  category: AdzunaCategory;
  id: string;
  salary_max: number;
  company: AdzunaCompany;
  contract_type: string;
}

// see https://developer.adzuna.com/docs/search for an example response
