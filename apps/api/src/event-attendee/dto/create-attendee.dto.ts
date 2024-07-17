import { ATTENDEE_ROLE } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateAttendeeRoleDto {
  @IsEnum(ATTENDEE_ROLE, {
    message: 'Invalid attendee role',
  })
  role: ATTENDEE_ROLE;
}

export class CreateAttendeeDto {
  @IsString()
  eventId: string;

  @IsString()
  userId: string;

  role: CreateAttendeeRoleDto['role'];
}
