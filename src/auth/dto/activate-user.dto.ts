import { IsNotEmpty, IsString } from "class-validator";

export class ActivateUserDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}