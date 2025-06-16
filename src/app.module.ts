import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { VaporizerModule } from './vaporizer/vaporizer.module';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [AuthModule, VaporizerModule, QuizModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
