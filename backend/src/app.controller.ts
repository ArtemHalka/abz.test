import { Controller, Get, Req, Session } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('token')
  async getToken(
    @Req() request: Request,
    // @Session() session: Record<string, any>,
  ): Promise<{ token: string }> {
    const token = await this.appService.getToken();
    request.session.token = token;
    return { token };
  }
}
