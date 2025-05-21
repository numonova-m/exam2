import { Controller, Get, Query } from '@nestjs/common';
import { MovieService } from './movies.service';
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MovieService) {}
  @Get()
  async getMovies(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('subscriptionType') subscriptionType?: 'free' | 'premium',
  ) {
    return this.moviesService.getMovies({
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
      category,
      search,
      subscriptionType,
    });
  }
}
