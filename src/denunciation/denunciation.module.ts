import { Module } from '@nestjs/common';
import { DenunciationService } from './denunciation.service';
import { DenunciationController } from './denunciation.controller';
import { Denunciation } from './entities/denunciation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeDenunciationModule } from 'src/type-denunciation/type-denunciation.module';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Denunciation]),
    TypeDenunciationModule,
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [DenunciationController],
  providers: [DenunciationService],
  exports: [TypeOrmModule]
})
export class DenunciationModule {}
