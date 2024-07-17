import { Body, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(@Body() createEvent: Prisma.EventCreateInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: createEvent.organizer.connect.id,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const event = await this.prisma.event.create({
      data: createEvent,
    });

    return await this.prisma.eventAttendee.create({
      data: {
        eventId: event.id,
        userId: user.id,
        role: 'ORGANIZER',
      },
    });
  }

  async updateEvent(id: string, @Body() updateEvent: Prisma.EventUpdateInput) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: updateEvent.organizer.connect.id,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return await this.prisma.event.update({
      where: {
        id,
      },
      data: updateEvent,
    });
  }

  async deleteEvent(id: string) {
    return await this.prisma.event.delete({
      where: {
        id,
      },
    });
  }

  async findAllEvents() {
    return await this.prisma.event.findMany();
  }

  async findEvent(id: string) {
    return await this.prisma.event.findUnique({
      where: {
        id,
      },
    });
  }
}
