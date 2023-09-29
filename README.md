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
