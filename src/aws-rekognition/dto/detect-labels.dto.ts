import { IsString } from "class-validator";

export class DetectLabelsDto{
  @IsString()
  image: string;
}
