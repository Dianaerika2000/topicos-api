import { PartialType } from '@nestjs/mapped-types';
import { CreateGovernmentEmployeeDto } from './create-government-employee.dto';

export class UpdateGovernmentEmployeeDto extends PartialType(CreateGovernmentEmployeeDto) {}
