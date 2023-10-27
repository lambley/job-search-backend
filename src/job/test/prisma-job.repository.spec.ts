import { Test, TestingModule } from '@nestjs/testing';
import { PrismaJobRepository } from '../prisma-job.repository';
import { PrismaService } from '../../prisma.service';

describe('PrismaJobRepository', () => {
  let service: PrismaJobRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaJobRepository, PrismaService],
    }).compile();

    service = module.get<PrismaJobRepository>(PrismaJobRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
