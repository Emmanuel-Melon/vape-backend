import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole } from '@prisma/client'; // Prisma generated types
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { email, username, password } = createUserDto;

    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      throw new ConflictException('User with this email already exists');
    }

    const existingUserByUsername = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUserByUsername) {
      throw new ConflictException('User with this username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        // role is not part of CreateUserDto, defaults to USER in schema
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...result } = user; // Exclude password from the returned object
    return result;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany();
    return users.map(user => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    });
  }

  async findOne(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const { password: newPassword, ...dataToUpdate } = updateUserDto;
    let hashedPassword: string | undefined = undefined;

    if (newPassword) {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...dataToUpdate,
          ...(hashedPassword && { password: hashedPassword }),
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = updatedUser;
      return result;
    } catch (error) {
      // Check for Prisma's record not found error code
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
      // Check for unique constraint violation (e.g., email or username already taken)
      if (error.code === 'P2002' && error.meta?.target) {
         const targetField = error.meta.target.join(', ');
         throw new ConflictException(`User with this ${targetField} already exists.`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID "${id}" not found`);
      }
      throw error;
    }
  }
}
