import { IsString, IsEmail, MinLength, MaxLength } from "class-validator";

export class LoginAuthDto{
    @IsString()
    @IsEmail()
    correo: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    contrasenia: string;
}