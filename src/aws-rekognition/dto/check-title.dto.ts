import { IsString } from "class-validator";

export class CheckTitleDto {
  @IsString()
  title: string;

  @IsString()
  image: string;
}
