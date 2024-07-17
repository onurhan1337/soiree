import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAttendeeDto,
  CreateAttendeeRoleDto,
} from './dto/create-attendee.dto';

@Injectable()
export class EventAttendeeService {
  constructor(private readonly prisma: PrismaService) {}

  async createAttendee(
    eventId: string,
    userId: string,
    role: CreateAttendeeDto,
  ) {
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingAttendee = await this.findAttendee(eventId, userId);

    if (existingAttendee.role !== 'ORGANIZER') {
      throw new Error('Only organizers can create attendees');
    }

    return await this.prisma.eventAttendee.create({
      data: {
        eventId,
        userId,
        role: role.role,
      },
    });
  }

  async updateAttendee(
    eventId: string,
    userId: string,
    role: CreateAttendeeRoleDto['role'],
  ) {
    return await this.prisma.eventAttendee.update({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      data: {
        role,
      },
    });
  }

  async removeAttendee(eventId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingAttendee = await this.findAttendee(eventId, userId);

    if (existingAttendee.role === 'ORGANIZER') {
      throw new Error('Only organizers can remove attendees');
    }

    return await this.prisma.eventAttendee.delete({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });
  }

  async findAttendee(eventId: string, userId: string) {
    const attendee = await this.prisma.eventAttendee.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (!attendee) {
      throw new NotFoundException('Attendee not found');
    }

    return attendee;
  }
}