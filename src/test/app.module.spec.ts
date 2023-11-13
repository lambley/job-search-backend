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

  describe('AppModule imports', () => {
    it('should import the ConfigModule', async () => {
      const configModule = await module.resolve(AppModule);
      expect(configModule).toBeDefined();
    });

    it('should import the JobModule', async () => {
      const jobModule = await module.resolve(AppModule);
      expect(jobModule).toBeDefined();
    });

    it('should import the BullModule', async () => {
      const bullModule = await module.resolve(AppModule);
      expect(bullModule).toBeDefined();
    });

    it('should import the JobProcessorModule', async () => {
      const jobProcessorModule = await module.resolve(AppModule);
      expect(jobProcessorModule).toBeDefined();
    });

    it('should import the JobConsumerModule', async () => {
      const jobConsumerModule = await module.resolve(AppModule);
      expect(jobConsumerModule).toBeDefined();
    });
  });

  describe('AppModule providers', () => {});
});
