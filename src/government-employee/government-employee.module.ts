import { Module } from '@nestjs/common';
import { GovernmentEmployeeService } from './government-employee.service';
import { GovernmentEmployeeController } from './government-employee.controller';
import { GovernmentEmployee } from './entities/government-employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaModule } from 'src/area/area.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GovernmentEmployee]),
    AreaModule,
  ],
  controllers: [GovernmentEmployeeController],
  providers: [GovernmentEmployeeService]
})
export class GovernmentEmployeeModule {}
