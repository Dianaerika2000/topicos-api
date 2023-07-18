import { Module } from '@nestjs/common';
import { DenunciationService } from './denunciation.service';
import { DenunciationController } from './denunciation.controller';
import { Denunciation } from './entities/denunciation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeDenunciationModule } from 'src/type-denunciation/type-denunciation.module';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Images } from './entities/images.entity';
import { HttpModule } from '@nestjs/axios';
import { OpenaiModule } from 'src/openai/openai.module';
import { Notification } from './entities/notification.entity';
import { AwsRekognitionModule } from 'src/aws-rekognition/aws-rekognition.module';
import { GovernmentEmployeeModule } from 'src/government-employee/government-employee.module';
import { AreaModule } from 'src/area/area.module';
// import { DenuciationGateway } from './denunciation.gateway';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Denunciation, Images, Notification]),
    TypeDenunciationModule,
    AreaModule,
    AuthModule,
    CloudinaryModule,
    HttpModule,
    OpenaiModule,
    AwsRekognitionModule,
    GovernmentEmployeeModule
  ],
  controllers: [DenunciationController],
  providers: [DenunciationService,],
  exports: [TypeOrmModule]
})
export class DenunciationModule {}
