# Backend app to retrieve and process Adzuna job listings

Backend app built with NestJS to retrieve and process Adzuna job listings. Recent job listing(s) can be retrieved.

Keywords can be generated based on historical job listings for a given job title or language set, with the aim to help job seekers to improve their CVs and cover letters with relevant keywords.

## Technologies

- NestJS - a Node.js framework for building efficient, reliable and scalable server-side applications
- Redis - an open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker
- Bull - a Node library that implements a fast and robust queue system based on Redis
- Adzuna API - a search engine for job ads used by over 10 million visitors per month that aims to list every job, everywhere
- [Natural](https://naturalnode.github.io/natural/) - a general natural language facility for nodejs. Tokenizing, stemming, classification, phonetics, tf-idf, WordNet, string similarity, and some inflections are currently supported
- Jest - a delightful JavaScript Testing Framework with a focus on simplicity

## Installation

To run the app locally, you will need to install NestJS:

```zsh
npm install -g @nestjs/cli
```

Install Redis:

```zsh
sudo apt install redis-server
```


## Running the app

Start the redis server and monitor:
```zsh
sudo service redis-server start
redis-cli monitor
```

Start the app (development mode):
```zsh
npm run start:dev

# or

nest start --watch

```


## Endpoints

### GET /jobs

`url`: /api/v1/jobs?results_per_page=[NUMBER]&what=[STRING]&where=[STRING]

`returns`: a list of jobs based on the query parameters:

```json
[
  {
    "id": "1",
    "title": "Software Engineer",
    "location": {
      "area": ["London"],
      "display_name": "London"
    },
    "description": "We are looking for a Software Engineer to join our team.",
    "created": "2021-01-01T00:00:00Z",
    "company": {
      "display_name": "Company A"
    },
    "salary_max": 100000,
    "salary_min": 80000,
    "contract_type?": "permanent",
    "category": {
      "tag": "IT Jobs",
      "label": "IT Jobs"
    },
    {
      ...
    }
  }
]
```

### GET /jobs/:id

`url`: /api/v1/jobs/:id
`returns`: a single job based on the id parameter from the database (simpler structure than Adzuna job listing)

```json
{
  "id": "1",
  "adzuna_id": "1",
  "title": "Software Engineer",
  "location": ["London"],
  "description": "We are looking for a Software Engineer to join our team.",
  "created": "2021-01-01T00:00:00Z",
  "company": "Company A",
  "salary_min": 80000,
  "salary_max": 100000,
  "contract_type": "permanent",
  "category": "IT Jobs",
  "message?": "error messages displayed here",
  "processed_keywords?": ["keyword1", "keyword2", "keyword3"]
}
```

### GET /generate_keywords

`url`: /jobs/:id/keywords
`returns`: an array of keywords processed using [`natural`](https://naturalnode.github.io/natural/) library

```json
["keyword1", "keyword2", "keyword3"]
```

NB: may be removed as a separate endpoint as keyword processing is handled as a background job.

## Background jobs

Uses NestJS's Bull module to handle background jobs. The job queue is stored in Redis.

See below for how the job queue is set up (job consumer and job processor).

# Features

1. **Job Feature**:

   - This feature would handle getting job listings and potentially other related functionality.
   - It includes components like controllers, services, and modules for managing and retrieving job listings from APIs or databases.

2. **Job Processor**:

   - This component would be responsible for processing job descriptions, extracting keywords, or performing other tasks related to job processing.
   - It includes a service (e.g., `JobProcessorService`) that contains the logic for processing job descriptions.

3. **Job Consumer**:

   - This component is responsible for processing jobs asynchronously from a job queue.
   - It includes a separate module (e.g., `JobConsumerModule`) that registers the job queue and specifies how to process jobs from that queue.

Here's how these components interact:

- In the Job Feature, when you receive job descriptions (e.g., from an API), you enqueue these descriptions as jobs into the job queue. This is typically done using a library like Bull or the `@nestjs/bull` module.

- The Job Consumer, specifically the module you create for it (e.g., `JobConsumerModule`), listens to the job queue and defines how jobs should be processed. It often injects the `JobProcessorService` to execute the processing logic.

- The Job Processor Service (`JobProcessorService`) contains the actual logic for processing job descriptions, such as extracting keywords, and is used by the Job Consumer to perform this work.
