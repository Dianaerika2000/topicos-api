import { Module } from '@nestjs/common';
import { TypeDenunciationService } from './type-denunciation.service';
import { TypeDenunciationController } from './type-denunciation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeDenunciation } from './entities/type-denunciation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeDenunciation]),
  ],
  controllers: [TypeDenunciationController],
  providers: [TypeDenunciationService],
  exports: [TypeOrmModule]
})
export class TypeDenunciationModule {}
