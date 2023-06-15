import { IsDate, IsOptional } from "class-validator";

export class DateRangeDto {
    @IsOptional()
    @IsDate()
    startDate: string;
    @IsOptional()
    @IsDate()
    endDate: string;
}