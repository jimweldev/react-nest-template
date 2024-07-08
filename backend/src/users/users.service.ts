import { Injectable, Req, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { QueryBuilderHelper } from '../helpers/query-builder.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(req: Request, res: Response) {
    try {
      const { username }: CreateUserDto = req.body;

      if (!username) {
        return res.status(400).json({ message: 'Username is required' });
      }

      // Generate a random password
      const password = Math.random().toString(36).substring(2, 10);
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = this.usersRepository.create({
        username,
        password: hashedPassword,
      });

      // Save the new user to the database
      await this.usersRepository.save(newUser);

      return res.status(201).json({ user: newUser });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async findAll(@Req() req: Request, @Res() res: Response) {
    try {
      const queryBuilder = this.usersRepository.createQueryBuilder('user');

      // Apply Filters
      QueryBuilderHelper.applyFilters(queryBuilder, req.query);

      const users = await queryBuilder.getMany();

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async findOne(@Req() req: Request, @Res() res: Response) {
    const user = await this.usersRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  }

  async update(@Req() req: Request, @Res() res: Response) {
    const userId = parseInt(req.params.id);

    // Check if the user exists
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Merge the existing user with the new data
    const updatedUser = this.usersRepository.merge(user, req.body);

    // Save the updated user
    await this.usersRepository.save(updatedUser);

    return res.status(200).json(updatedUser);
  }

  async remove(@Req() req: Request, @Res() res: Response) {
    const user = await this.usersRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    this.usersRepository.remove(user);

    return res.status(200).json(user);
  }

  async findAllPaginate(@Req() req: Request, @Res() res: Response) {
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    const { page = 1, limit = 10, search = '' } = req.query;

    QueryBuilderHelper.applyFilters(queryBuilder, req.query, 'paginate');

    // Search
    if (search) {
      // queryBuilder.andWhere('user.username LIKE :search', {
      //   search: `%${search}%`,
      // });

      queryBuilder.andWhere(
        'user.username LIKE :search OR user.password LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    const total = await queryBuilder.getCount();

    // Limit and Page
    queryBuilder.take(parseInt(limit.toString(), 10));
    queryBuilder.skip(
      (parseInt(page.toString(), 10) - 1) * parseInt(limit.toString(), 10),
    );

    try {
      const users = await queryBuilder.getMany();
      return res.status(200).json({
        records: users,
        info: {
          total,
          pages: Math.ceil(Number(total) / Number(limit)),
        },
        user: req.user,
      });
    } catch (error) {
      // Handle any errors
      return res.status(400).json({ message: error.message });
    }
  }
}
