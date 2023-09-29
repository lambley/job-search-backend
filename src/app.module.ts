import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdzunaService } from './adzuna/adzuna.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AdzunaService],
})
export class AppModule {}
