import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNumberString, Min } from 'class-validator';

export class FindCommentsByPostQuery {
  @ApiProperty()
  @Transform(({ value }) => Number.parseInt(value))
  skip!: number;

  @ApiProperty()
  @Transform(({ value }) => Number.parseInt(value))
  take!: number;

  @ApiProperty()
  @Transform(({ value }) => Number.parseInt(value))
  postId!: number;
}
