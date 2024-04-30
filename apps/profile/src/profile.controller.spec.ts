import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

describe('ProfileController', () => {
  let profileController: ProfileController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [ProfileService],
    }).compile();

    profileController = app.get<ProfileController>(ProfileController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(profileController.getHello()).toBe('Hello World!');
    });
  });
});
