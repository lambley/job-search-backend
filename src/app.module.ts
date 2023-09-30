import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from '../config/configuration';
import { JobService } from './job/job.service';
import { JobModule } from './job/job.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [config],
      isGlobal: true,
    }),
    JobModule,
  ],
  providers: [JobService],
})
export class AppModule {}
