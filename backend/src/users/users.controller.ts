import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
// import { Roles } from 'src/decorators/roles.decorator';

// @Roles('ADMIN', 'USER')
// @UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/paginate')
  findAllPaginate(@Req() req: Request, @Res() res: Response) {
    return this.usersService.findAllPaginate(req, res);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@Req() req: Request, @Res() res: Response) {
    return this.usersService.create(req, res);
  }

  @Get()
  findAll(@Req() req: Request, @Res() res: Response) {
    return this.usersService.findAll(req, res);
  }

  @Get(':id')
  findOne(@Req() req: Request, @Res() res: Response) {
    return this.usersService.findOne(req, res);
  }

  @Patch(':id')
  update(@Req() req: Request, @Res() res: Response) {
    return this.usersService.update(req, res);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Res() res: Response) {
    return this.usersService.remove(req, res);
  }
}
