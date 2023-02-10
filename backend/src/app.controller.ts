import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('token')
  async getToken(@Req() request: Request): Promise<{ token: string }> {
    const token = await this.appService.getToken();
    request.session.token = token;
    return { token };
  }
}
