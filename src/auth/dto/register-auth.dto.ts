import { IsEmail, IsNotEmpty, IsString } from "class-validator";
export class RegisterAuthDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;
    
    @IsString()
    @IsNotEmpty()
    apellido: string;

    @IsString()
    @IsNotEmpty()
    ci: string;

    @IsString()
    @IsNotEmpty()
    direccion: string;

    @IsString()
    @IsNotEmpty()
    telefono: string;

    @IsEmail()
    correo: string;
    
    @IsString()
    @IsNotEmpty()
    contrasenia: string;

    @IsString()
    foto: string;
}