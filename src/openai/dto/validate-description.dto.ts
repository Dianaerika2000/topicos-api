import { IsOptional, IsString } from "class-validator";

export class ValidateDescriptionDto {
    @IsString()
    prompt: string;
    
    @IsOptional() 
    model?: string = 'text-davinci-003';
}