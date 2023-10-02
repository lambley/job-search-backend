import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { PrismaService } from '../prisma.service';
import { PrismaJobRepository } from './prisma-job.repository';

@Module({
  imports: [],
  controllers: [JobController],
  providers: [JobService, PrismaService, PrismaJobRepository],
  exports: [JobService],
})
export class JobModule {}
