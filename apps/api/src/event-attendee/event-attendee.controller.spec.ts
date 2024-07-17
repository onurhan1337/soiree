import { Test, TestingModule } from '@nestjs/testing';
import { EventAttendeeController } from './event-attendee.controller';
import { EventAttendeeService } from './event-attendee.service';

describe('EventAttendeeController', () => {
  let controller: EventAttendeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventAttendeeController],
      providers: [EventAttendeeService],
    }).compile();

    controller = module.get<EventAttendeeController>(EventAttendeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
