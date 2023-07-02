import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { GovernmentEmployee } from 'src/government-employee/entities/government-employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Area, GovernmentEmployee]),
  ],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [TypeOrmModule]
})
export class AreaModule {}
