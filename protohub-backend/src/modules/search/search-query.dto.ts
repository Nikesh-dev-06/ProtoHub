import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class SearchQueryDto {
  @IsString()
  @MinLength(2, { message: 'Search query must be at least 2 characters' })
  q!: string;

  @IsOptional()
  @IsIn(['all', 'projects', 'people'])
  type: 'all' | 'projects' | 'people' = 'all';
}
