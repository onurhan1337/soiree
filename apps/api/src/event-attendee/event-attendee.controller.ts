import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../guards/auth/auth.guard';
import { CreateAttendeeRoleDto } from './dto/create-attendee.dto';
import { EventAttendeeService } from './event-attendee.service';

@Controller('event-attendee')
@UseGuards(AuthGuard)
export class EventAttendeeController {
  constructor(private readonly eventAttendeeService: EventAttendeeService) {}

  @Get()
  async getAttendees(@Query('eventId') eventId: string) {
    return this.eventAttendeeService.findAttendees(eventId);
  }

  @Post()
  async createAttendee(
    @Req() req: Request,
    @Body()
    newAttendee: {
      eventId: string;
      userId: string;
    },
  ) {
    if (req.user.sub !== newAttendee.userId) {
      throw new Error('Unauthorized');
    }

    return this.eventAttendeeService.createAttendee(
      newAttendee.eventId,
      newAttendee.userId,
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

  @Delete()
  async removeAttendee(
    @Req() req: Request,
    @Query('eventId') eventId: string,
    @Query('userId') userId: string,
  ) {
    const attendee = await this.eventAttendeeService.findAttendee(
      eventId,
      req.user.sub,
    );

    if (attendee.role !== 'ORGANIZER' && req.user.sub !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.eventAttendeeService.removeAttendee(eventId, userId);
  }
}
