import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  controllers: [JobController],
  providers: [JobService, PrismaService],
  exports: [JobService],
})
export class JobModule {}
