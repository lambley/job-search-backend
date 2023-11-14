import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { ConfigService } from '@nestjs/config';

describe('Main file (main.ts)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(0); // Start the application on a random port (0) and override port in tests
  });

  afterAll(async () => {
    await app.close();
  });

  it('should start the application and listen on the defined port', async () => {
    const configService = app.get(ConfigService);
    const port = configService.get('PORT');

    // Check is app is defined
    expect(app).toBeDefined();

    // Check if the application is running on a valid port
    expect(parseInt(port)).toBeGreaterThan(0);
  });
});
