import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.userService.findAll(paginationQuery);
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return { user };
  }

  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5242880 }),
          new FileTypeValidator({ fileType: /image\/[jpeg,png]/ }),
        ],
      }),
    )
    photo: Express.Multer.File,
    @Body() body: CreateUserDto,
    @Req() request: Request,
  ) {
    const created = await this.userService.create(body, photo);
    request.session.token = null;
    return { user_id: created.id, message: 'New user successfully registered' };
  }
}
