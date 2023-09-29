import { Module } from '@nestjs/common';
import { AdzunaController } from './adzuna.controller';
import { AdzunaService } from './adzuna.service';

@Module({
  imports: [],
  controllers: [AdzunaController],
  providers: [AdzunaService],
  exports: [AdzunaService],
})
export class AdzunaModule {}
