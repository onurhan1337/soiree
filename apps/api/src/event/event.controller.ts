import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { AuthGuard } from '../guards/auth/auth.guard';
import { EventService } from './event.service';

@Controller('event')
@UseGuards(AuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  getAllEvents() {
    return this.eventService.findAllEvents();
  }

  @Get(':id')
  getEvent(@Param('id') id: string) {
    return this.eventService.findEvent(id);
  }

  @Post()
  createEvent(@Req() req: Request, @Body() newEvent: Prisma.EventCreateInput) {
    if (req.user.sub !== newEvent.organizer.connect.id) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.eventService.createEvent(newEvent);
  }

  @Put(':id')
  updateEvent(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateEvent: Prisma.EventUpdateInput,
  ) {
    if (req.user.sub !== updateEvent.organizer.connect.id) {
      throw new Error('Unauthorized');
    }
    return this.eventService.updateEvent(id, updateEvent);
  }

  @Delete(':id')
  async deleteEvent(@Req() req: Request, @Param('id') id: string) {
    const event = await this.eventService.findEvent(id);
    if (req.user.sub !== event.organizerId) {
      throw new Error('Unauthorized');
    }
    return this.eventService.deleteEvent(id);
  }
}
