import { IsNumber, IsString } from 'class-validator';
export class CreateTypeDenunciationDto {
  
  @IsString()
  name: string;
}
