import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from '../config/configuration';
import { AdzunaService } from './adzuna/adzuna.service';
import { AdzunaModule } from './adzuna/adzuna.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [config],
      isGlobal: true,
    }),
    AdzunaModule,
  ],
  providers: [AdzunaService],
})
export class AppModule {}
