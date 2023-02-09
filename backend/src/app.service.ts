import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppService {
  constructor(private readonly jwtService: JwtService) {}

  async getToken(): Promise<string> {
    const token = await this.generateToken();
    return token;
  }

  private async generateToken() {
    const payload = {};
    return this.jwtService.sign(payload);
  }
}
