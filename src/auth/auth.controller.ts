import { Controller, Get, Post, Body, HttpCode, UseGuards, Req, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ValidateEmailDto } from './dto/validate-email-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
    
  // return Http 200 status code
  @HttpCode(200)
  @Post('register')
  create(@Body() RegisterAuthDto: RegisterAuthDto) {
    return this.authService.createUser(RegisterAuthDto);
  }
  
  @Post('login')
  login(@Body() LoginAuthDto: LoginAuthDto) {
    return this.authService.login(LoginAuthDto);
  }

  @Post('loginActualizado')
  loginActualizado(@Body() LoginAuthDto: LoginAuthDto) {
    return this.authService.loginActualizado(LoginAuthDto);
  }



  @UseGuards(AuthGuard())
  @Get('test')
  test (@Req() req: Express.Request) {
    return {
      ok: true,
      message: 'test',
      user: req.user
    };
  }

  @Get(':email')
  validateEmail(@Param() email: ValidateEmailDto) {
    return this.authService.validateEmail(email);
  }
  
}
