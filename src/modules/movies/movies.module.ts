import { Module } from '@nestjs/common';
import { MovieService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaModule, PrismaService } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule],
  controllers: [MoviesController],
  providers: [MovieService, PrismaService],
})
export class MoviesModule {}
