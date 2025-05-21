import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, SubscriptionType } from '@prisma/client';

@Injectable()
export class MovieService {
  constructor(private readonly prisma: PrismaService) {}

  async getMovies(query: {
    page: number;
    limit: number;
    category?: string;
    search?: string;
    subscriptionType?: 'free' | 'premium';
  }) {
    const { page, limit, category, search, subscriptionType } = query;

    const where: Prisma.MovieWhereInput = {
      ...(category && {
        categories: {
          some: {
            category: {
              name: {
                equals: category,
                mode: 'insensitive',
              },
            },
          },
        },
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(subscriptionType && {
        subscriptionType:
          subscriptionType === 'free'
            ? SubscriptionType.FREE
            : SubscriptionType.PREMIUM,
      }),
    };

    const movies = await this.prisma.movie.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return {
      success: true,
      data: { movies },
      page,
      limit,
      total: await this.prisma.movie.count({ where }),
    };
  }
}
