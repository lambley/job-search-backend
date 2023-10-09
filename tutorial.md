# Creating a NestJS app (TypeScript) with React frontend and PostgreSQL database

Technologies used:
- NestJS
- React
- PostgreSQL & Prisma
- Docker/Docker (optional)
- Heroku (optional)

# Why NestJS?

NestJS is a relatively new framework that is built on top of Express and uses TypeScript. As with any framework, NestJS is opinionated and has its own way of doing things.

Some things that come out of the box with NestJS:
- Dependency injection
  - NestJS uses dependency injection to manage the application's components
  - Read more about dependency injection [here](https://docs.nestjs.com/fundamentals/injection-scopes)
- Decorators
  - NestJS uses decorators to define the application's components
- Modules
  - NestJS uses modules to organise the application's components and encapsulate their functionality
- Technologies:
  - Express as the underlying web server framework
  - TypeScript as the programming language
  - Jest as the testing framework
  - TypeORM as the ORM (optional)

# Pre-requisites

You need to install the following with whatever package manager you use (e.g. `npm` or `yarn` or even `bun`):
- Node.js
- NestJS CLI

# Creating a NestJS app

To create a NestJS app, run the following command:
```zsh
nest new <app-name> --package-manager <package-manager>
```

This will create a new NestJS app with the following structure:
```
<app-name>
├── README.md
├── nest-cli.json
├── package.json
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock (or package-lock.json)
```

## A little about Modules, Controllers and Services

Nest uses three main building blocks to organise the application's components:
- Modules
  - Modules are used to encapsulate the application's components
  - Here, you can import other modules and export components to be used by other modules
  - Modules are decorated with `@Module()`
- Controllers
  - Controllers are used to define the application's routes and handle requests
  - Controllers are decorated with `@Controller()` and HTTP methods are decorated with `@Get()`, `@Post()`, `@Put()`, `@Delete()`, etc.
  - Controllers can be injected with services
- Services
  - Services are used to handle the business logic of the application
  - A good example of a service is a database service that handles the database queries or an API service that handles the API requests
  - Services are decorated with `@Injectable()` and can be injected into controllers
