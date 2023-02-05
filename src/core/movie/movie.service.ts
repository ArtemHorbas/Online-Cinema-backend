import { Injectable, NotFoundException } from '@nestjs/common'
import { Movie } from '@prisma/client'
import { AppError } from 'src/utils/enums/errors'
import { PrismaService } from '../database/prisma.service'
import { ViewsService } from '../views/views.service'
import { CreateMovieDto } from './dto/create-movie.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'

@Injectable()
export class MovieService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly viewsService: ViewsService
  ) { }

  async create(dto: CreateMovieDto): Promise<Movie> {
    const movie = await this.prisma.movie.create({
      data: {
        name: dto.name,
        rating: dto.rating,
        fees: dto.fees,
        poster: dto.poster
      },
      include: {
        reviews: true,
        views: true
      }
    })

    await this.viewsService.updateViews(movie.id)

    return await this.findMovie(movie.id)
  }

  async findMovie(id: string): Promise<Movie> {
    return await this.prisma.movie.findUnique({
      where: { id },
      include: {
        reviews: true,
        views: true
      }
    })
  }

  async findAll(searchTerm?: string): Promise<Movie[]> {
    return await this.prisma.movie.findMany({
      where: {
        name: {
          contains: searchTerm
        }
      },
      include: {
        reviews: true,
        views: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.findMovie(id)
    if (!movie) throw new NotFoundException(AppError.MOVIE_NOT_FOUND)

    await this.viewsService.updateViews(id)

    return await this.findMovie(id)
  }

  async update(id: string, dto: UpdateMovieDto): Promise<Movie> {
    return await this.prisma.movie.update({
      where: { id },
      data: dto
    })
  }

  async remove(id: string): Promise<Movie> {
    return await this.prisma.movie.delete({
      where: { id }
    })
  }
}
