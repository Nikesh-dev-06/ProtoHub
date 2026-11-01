import { IsInt, IsUUID, Min } from 'class-validator';

export class MoveTaskDto {
  @IsUUID('4')
  columnId!: string;

  /** Zero-based target index within the destination column's task list. */
  @IsInt()
  @Min(0)
  position!: number;
}
