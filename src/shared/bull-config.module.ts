import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

@Module({})
export class BullConfigModule {
  static forRoot() {
    return BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    });
  }
}
