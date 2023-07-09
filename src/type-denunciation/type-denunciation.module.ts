import { Module } from '@nestjs/common';
import { TypeDenunciationService } from './type-denunciation.service';
import { TypeDenunciationController } from './type-denunciation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeDenunciation } from './entities/type-denunciation.entity';
import { AreaModule } from 'src/area/area.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeDenunciation]),
    AreaModule
  ],
  controllers: [TypeDenunciationController],
  providers: [TypeDenunciationService],
  exports: [TypeOrmModule]
})
export class TypeDenunciationModule {}
