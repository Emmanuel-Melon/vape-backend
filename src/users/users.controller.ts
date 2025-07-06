import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, Req } from '@nestjs/common'; // Added Req
import { Request } from 'express'; // Added for Request type
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserSchema } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserSchema } from './dto/update-user.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './entities/user.entity'; // Added for User type

@Controller('/api/users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  getProfile(@Req() req: Request): Omit<User, 'password'> {
    // req.user is populated by JwtAuthGuard using JwtStrategy.
    // The JwtStrategy currently returns the full User object from Prisma.
    const authenticatedUser = req.user as User; // Type assertion
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = authenticatedUser;
    return result;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateUserSchema))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
