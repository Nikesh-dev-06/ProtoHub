import { IsIn } from 'class-validator';

export class RespondMentorshipRequestDto {
  @IsIn(['ACCEPTED', 'REJECTED'], { message: 'status must be ACCEPTED or REJECTED' })
  status!: 'ACCEPTED' | 'REJECTED';
}
