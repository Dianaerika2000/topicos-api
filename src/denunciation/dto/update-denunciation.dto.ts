import { PartialType } from '@nestjs/mapped-types';
import { CreateDenunciationDto } from './create-denunciation.dto';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateDenunciationDto extends PartialType(CreateDenunciationDto) {
  @IsString()
  @MinLength(60)
  @MaxLength(512)
  description: string;

  @IsString()
  images: string;
}
