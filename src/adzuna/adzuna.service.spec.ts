import { Test, TestingModule } from '@nestjs/testing';
import { AdzunaService } from './adzuna.service';

describe('AdzunaService', () => {
  let service: AdzunaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdzunaService],
    }).compile();

    service = module.get<AdzunaService>(AdzunaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
