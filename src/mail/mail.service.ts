import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth } from 'src/auth/entities/auth.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerificationEmail(correo: string, token: string) {
    const domain = this.configService.get('HOST_URL');
    // const url = `${domain}/auth/verify_email?token=${token}`; 

    await this.mailerService.sendMail({
      to: correo,
      template: './verify-email.hbs',
      subject: 'Verifica tu correo electrónico',
      context: {
        name: correo,
        token,
      },
    });
  }

  async sendPasswordReset(user: Auth, token: string) {
    const domain = this.configService.get('FRONTEND_URL');
    const url = `${domain}/app-reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.correo,
      template: './reset-password.hbs',
      subject: 'Restablece tu contraseña',
      context: {
        name: user.nombre,
        url,
      },
    });
  }
}
