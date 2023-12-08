import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';

export interface ITestContext {
  app: INestApplication;
  module: TestingModule;
  mockMPQueue: any;
  dataSource: DataSource;
}
beforeAll(async () => {
  const mockMPQueue = {
    add: jest.fn(),
    process: jest.fn(),
  };
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const testApp: INestApplication = moduleFixture.createNestApplication();
  testApp.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await testApp.init();
  await testApp.listen(0);
  const testDataSource: DataSource = await testApp.get(DataSource);
  global.testContext = {
    app: testApp,
    module: moduleFixture,
    mockMPQueue,
    dataSource: testDataSource,
  };
});
afterAll(async () => {
  if (global.testContext) {
    await global.testContext.app.close();
  }
});
beforeEach(() => {});
afterEach(() => {
  jest.restoreAllMocks();
});
