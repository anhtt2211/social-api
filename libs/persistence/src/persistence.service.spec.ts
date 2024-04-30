import { Test, TestingModule } from '@nestjs/testing';
import { PersistenceService } from './persistence.service';

describe('PersistenceService', () => {
  let service: PersistenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersistenceService],
    }).compile();

    service = module.get<PersistenceService>(PersistenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
