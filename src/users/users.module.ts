import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Import PrismaModule

@Module({
  imports: [PrismaModule], // Add PrismaModule to imports
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export UsersService if it will be used by other modules (e.g., AuthModule)
})
export class UsersModule {}

