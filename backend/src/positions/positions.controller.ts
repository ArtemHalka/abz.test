import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionService: PositionsService) {}

  @Get()
  async getAll() {
    const positions = await this.positionService.findAll();
    return { positions };
  }

  @Post()
  create(@Body() body: CreatePositionDto) {
    return this.positionService.create(body);
  }
}
