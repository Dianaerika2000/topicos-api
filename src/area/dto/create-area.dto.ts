import { IsInt, IsString } from "class-validator";

export class CreateAreaDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsString()
  cellphone: string;
}
