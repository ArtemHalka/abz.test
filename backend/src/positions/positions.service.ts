import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePositionDto } from './dto/create-position.dto';
import { Position } from './position.entity';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  findAll() {
    return this.positionRepository.find();
  }

  create(dto: CreatePositionDto) {
    const created = this.positionRepository.create({
      ...dto,
    });
    return this.positionRepository.save(created);
  }
}
