import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'nestjs-prisma';
import slugify from 'slugify';
@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createcategoryDto: CreateCategoryDto) {
    const { name, description } = createcategoryDto;
    const slug = slugify(name, { lower: true });

    const category = await this.prisma.category.create({
      data: {
        name,
        slug,
        description,
      },
    });
    console.log(category);
    return {
      success: true,
      message: 'Kategoriya yaratildi',
      data: { ...category },
    };
  }
  async findAll() {
    const categories = await this.prisma.category.findMany();
    return {
      success: true,
      data: {
        categories,
      },
    };
  }

  async remove(id: string) {
    await this.prisma.category.delete({
      where: { id },
    });
    return {
      success: true,
      message: "Kategoriya o'chirildi",
    };
  }
}
