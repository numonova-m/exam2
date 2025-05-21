import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { Roles } from 'src/decorators/roles-decorators';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  create(@Body() CreateCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(CreateCategoryDto);
  }
  @Get('/allcategories')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  findAll() {
    return this.categoriesService.findAll();
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
