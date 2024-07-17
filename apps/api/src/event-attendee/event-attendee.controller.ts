import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../guards/auth/auth.guard';
import {
  CreateAttendeeDto,
  CreateAttendeeRoleDto,
} from './dto/create-attendee.dto';
import { EventAttendeeService } from './event-attendee.service';

@Controller('event-attendee')
@UseGuards(AuthGuard)
export class EventAttendeeController {
  constructor(private readonly eventAttendeeService: EventAttendeeService) {}

  @Post()
  createAttendee(
    @Req() req: Request,
    @Body()
    newAttendee: {
      eventId: string;
      userId: string;
      role: CreateAttendeeDto;
    },
  ) {
    if (req.user.sub !== newAttendee.userId) {
      throw new Error('Unauthorized');
    }

    return this.eventAttendeeService.createAttendee(
      newAttendee.eventId,
      newAttendee.userId,
      newAttendee.role,
    );
  }

  @Put(':eventId/:userId')
  async updateAttendee(
    @Req() req: Request,
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
    @Body() updateAttendee: CreateAttendeeRoleDto['role'],
  ) {
    if (req.user.sub !== userId) {
      throw new Error('Unauthorized');
    }

    const attendee = await this.eventAttendeeService.findAttendee(
      eventId,
      userId,
    );
    if (attendee.role !== 'ORGANIZER') {
      throw new Error('Only organizers can update attendees');
    }

    return this.eventAttendeeService.updateAttendee(
      eventId,
      userId,
      updateAttendee,
    );
  }

  // TODO: change params with the @Query decorator
  @Delete(':eventId/:userId')
  async removeAttendee(
    @Req() req: Request,
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
  ) {
    if (req.user.sub !== userId) {
      throw new Error('Unauthorized');
    }

    const existingAttendee = await this.eventAttendeeService.findAttendee(
      eventId,
      userId,
    );

    if (existingAttendee.role === 'ORGANIZER') {
      throw new Error('Only organizers can remove attendees');
    }

    return this.eventAttendeeService.removeAttendee(eventId, userId);
  }
}
