# Backend app to retrieve and process Adzuna job listings

Backend app built with NestJS to retrieve and process Adzuna job listings. Recent job listing(s) can be retrieved.

Keywords can be generated based on historical job listings for a given job title or language set, with the aim to help job seekers to improve their CVs and cover letters with relevant keywords.

## Installation

To run the app locally, you will need to install NestJS:

```bash
$ npm install -g @nestjs/cli
```

## Running the app

```bash
# development
$ npm run start

# running tests
$ npm run test --watch
```

## Endpoints

### GET /jobs

`url`: /api/v1/jobs?results_per_page=[NUMBER]&what=[STRING]&where=[STRING]

`returns`: a list of jobs based on the query parameters:

```json
// Need to add example response
```

### GET /jobs/:id

`url`: /api/v1/jobs/:id
`returns`: a single job based on the id parameter:
TO BE IMPLEMENTED

```json

```

### GET /generate_keywords

`url`: /api/v1/generate_keywords
`returns`: a list of keywords based historical job listings for a given job title or language set:
TO BE IMPLEMENTED

```json

```

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
