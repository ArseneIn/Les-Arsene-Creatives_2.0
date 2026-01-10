import { Test, TestingModule } from '@nestjs/testing';
import { BatchesController } from './batches.controller';

describe('BatchesController', () => {
  let controller: BatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchesController],
    }).compile();

    controller = module.get<BatchesController>(BatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
