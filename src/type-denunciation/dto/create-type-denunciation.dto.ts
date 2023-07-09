import { IsNumber, IsString } from 'class-validator';
export class CreateTypeDenunciationDto {
  
  @IsString()
  name: string;

  @IsNumber()
  area_id: number;
}
