interface ProcessJobData {
  description: string;
  id: string;
  adzuna_id: string;
}

// redis queue job data interface
interface QueueJobData {
  name: string;
  data: {
    description: string;
    id: string;
    adzuna_id: string;
  };
  opts: {
    attempts: number;
    delay: number;
    timestamp: number;
  };
  timestamp: number;
  delay: number;
  priority: number;
}

export { ProcessJobData, QueueJobData };
