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
  
  async validateDescriptionGPT3(validateDescription : ValidateDescriptionDto) {
    const { prompt } = validateDescription;
    return this.generateText(prompt)
  };

  async generateText(prompt : string) {
    console.log(prompt)
    const condition = `Tengo una pregunta y quiero que con un si,  en caso de que el siguiente comentario [${prompt}] puede dañar a las personas o hacer sentir mal o triste. Si el comentario no es ofensivo, responde con un no.`;
    // const condition = `Responde con un si, solo si el siguiente comentario es ofensivo o obsceno o de mal gusto y con un no, si el comentario no es ofensivo: ${prompt}`;
    console.log(condition)
    try {
      const response = await axios.post<ChatGptResponse>(
        'https://api.openai.com/v1/completions',
        {
          model: this.configService.get('OPENAI_MODEL'),
          prompt: condition,
          temperature: 0.3,
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
