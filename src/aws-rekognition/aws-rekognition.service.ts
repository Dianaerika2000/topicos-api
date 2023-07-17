import { Injectable } from '@nestjs/common';
import { RekognitionClient, DetectLabelsCommand} from '@aws-sdk/client-rekognition';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsRekognitionService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  async detectLabels(photo: string) {
    // Connects to AWS Rekognition service
    const rekognitionClient = new RekognitionClient({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    // Transforms the image represented as base64 into a bytes buffer
    const photoBuffer = Buffer.from(
      photo.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );

    // Create an instance of the DetectLabelsImageProperties class
    const command = new DetectLabelsCommand({
      Image: {
        Bytes: photoBuffer,
      },
      MaxLabels: 10,
    });

    try {
      // Send the command to Amazon Rekognition
      const results = await rekognitionClient.send(command);
      return results.Labels.map((label) => label.Name);
    } catch (error) {
      console.error(error);
    }
  }

  async translateText(array: string[], language: string){
    const { Translate } = require('@google-cloud/translate').v2;

    // Instantiates a client
    const translate = new Translate({
      projectId: this.configService.get('GOOGLE_PROJECT_ID'),
      key: this.configService.get('GOOGLE_API_KEY'),
    });

    // The text to translate
    const text = array.toString();
    const [translation] = await translate.translate(text, language);
    return translation.split(',');
  }

  async checkTitle(title: string, image:string){
    const labels = await this.detectLabels(image);
    const translatedLabels = await this.translateText(
      labels,
      'es',
    );
    
    for (const label of translatedLabels) {
      if (title.toLowerCase().includes(label.toLowerCase())) {
        return true;
      }
    }
    return false;
  }
}
