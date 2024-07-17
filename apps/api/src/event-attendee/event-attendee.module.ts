import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventAttendeeController } from './event-attendee.controller';
import { EventAttendeeService } from './event-attendee.service';

@Module({
  controllers: [EventAttendeeController],
  providers: [EventAttendeeService, PrismaService],
})
export class EventAttendeeModule {}
