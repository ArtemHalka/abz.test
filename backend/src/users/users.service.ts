import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as sharp from 'sharp';
import tinify from 'tinify';
import { Position } from '../positions/position.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const take = paginationQuery.count || 5;
    const page = paginationQuery.page || 1;
    const offset = (page - 1) * take;

    const [result, total] = await this.userRepository.findAndCount({
      take: take,
      skip: offset,
      relations: ['position'],
    });
    return {
      users: result,
      total_users: total,
      total_pages: Math.ceil(total / take),
      page,
      count: take,
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: +id },
      relations: ['position'],
    });
    if (!user) {
      throw new NotFoundException({ message: `User #${id} not found.` });
    }
    return user;
  }

  async create(dto: CreateUserDto, photo: Express.Multer.File) {
    const candidate = await this.getUserByContacts(dto.email, dto.phone);
    if (candidate) {
      throw new HttpException(
        { message: 'User with this phone or email already exist' },
        HttpStatus.CONFLICT,
      );
    }
    const position = await this.positionRepository.findOne({
      where: { id: dto.positionId },
    });
    const photoPath = photo ? await this.createFile(photo) : '';
    const created = this.userRepository.create({
      ...dto,
      position,
      photo: photoPath,
    });
    const user = await this.userRepository.save(created);
    return user;
  }

  async getUserByContacts(email: string, phone: string): Promise<User> {
    return await this.userRepository.findOne({
      where: [{ email }, { phone }],
    });
  }

  async createFile(file: Express.Multer.File): Promise<string> {
    try {
      const buffer = await this.cropImage(file.buffer, 70, 70);

      const fileName = uuid.v4() + '.jpg';
      const filePath = path.resolve(__dirname, '..', 'static');

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.resolve(filePath, fileName), buffer);
      return fileName;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async cropImage(
    imgBuffer: Buffer,
    width: number,
    height: number,
  ): Promise<Buffer> {
    tinify.key = process.env.TINIFY_API_KEY;
    const image = sharp(imgBuffer);
    const metadata = await image.metadata();
    const top = Math.round(metadata.height / 2) - height / 2;
    const left = Math.round(metadata.width / 2) - width / 2;
    const buffer = await image
      .extract({ width, height, left, top })
      .toFormat('jpg')
      .toBuffer();

    const optimizedBuffer = await tinify.fromBuffer(buffer).toBuffer();

    return Buffer.from(optimizedBuffer);
  }
}
