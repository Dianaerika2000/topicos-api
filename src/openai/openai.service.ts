import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ValidateDescriptionDto } from './dto/validate-description.dto';
import { ChatGptResponse } from './dto/response-chatgpt.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenaiService {
  constructor(
    private readonly configService: ConfigService,
  ){}
  
  // async validateDescriptionGPT3(validateDescription : ValidateDescriptionDto) {
  //   const { prompt } = validateDescription;
  //   return this.generateText(prompt)
  // };
  
  async validateDescriptionGPT3(prompt : string) {
    return this.generateText(prompt)
  };

  async generateText(prompt : string) {
    const condition = `¿El siguiente texto tiene lenguaje ofensivo, odio, acoso o violencia? Si contiene la respuesta será 'true', si no contiene será 'false', solo quiero una palabra como respuesta. "${prompt}"`;
    
    try {
      const response = await axios.post<ChatGptResponse>(
        'https://api.openai.com/v1/completions',
        {
          model: this.configService.get('OPENAI_MODEL'),
          prompt: condition,
          temperature: 0.6,
          max_tokens: 100,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${this.configService.get('OPENAI_API_KEY')}`,
          },
        },
      );
      console.log(response.data.choices[0].text.trim());
      return response.data.choices[0].text.trim();
    } catch (error: any) {
      throw new HttpException('OpenIA doesn`t response', error.response.status);
    }
  }
}
