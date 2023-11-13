import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';

describe('AppModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', async () => {
    expect(module).toBeDefined();
  });

  describe('AppModule imports', () => {});

  describe('AppModule providers', () => {});
});
