import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeDenunciationDto } from './create-type-denunciation.dto';

export class UpdateTypeDenunciationDto extends PartialType(CreateTypeDenunciationDto) {}
