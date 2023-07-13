import { IsString, IsEmail, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateGovernmentEmployeeDto {
  @IsString()
  name: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  cellphone: string;
  
  @IsString()
  photo: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsNumber()
  area_id: number;
}
