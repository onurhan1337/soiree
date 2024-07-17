import { Test, TestingModule } from '@nestjs/testing';
import { EventAttendeeService } from './event-attendee.service';

describe('EventAttendeeService', () => {
  let service: EventAttendeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventAttendeeService],
    }).compile();

    service = module.get<EventAttendeeService>(EventAttendeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
