import * as dotenv from 'dotenv';

process.env.NODE_ENV = 'test';
dotenv.config({ path: '.env.test' });
