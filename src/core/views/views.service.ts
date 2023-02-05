import { Injectable } from '@nestjs/common'
import { MovieViews } from '@prisma/client'
import { PrismaService } from '../database/prisma.service'
import * as dayjs from 'dayjs'

@Injectable()
export class ViewsService {
  constructor(private readonly prisma: PrismaService) { }

  async updateViews(movieId: string): Promise<MovieViews> {
    const row = await this.findViewsRow(movieId)
    if (row) return await this.incrementViewsInRow(row.id)

    return await this.createViewsRow(movieId)
  }

  async createViewsRow(movieId: string) {
    return await this.prisma.movieViews.create({
      data: {
        movieId
      }
    })
  }

  async findViewsRow(movieId: string) {
    return await this.prisma.movieViews.findFirst({
      where: {
        movieId,
        createdAt: {
          lte: new Date(
            `${dayjs().get('year')}-${dayjs().get('month') + 1}-31`
          ).toISOString(),
          gte: new Date(
            `${dayjs().get('year')}-${dayjs().get('month') + 1}-01`
          ).toISOString()
        }
      }
    })
  }

  async incrementViewsInRow(rowId: string) {
    return await this.prisma.movieViews.update({
      where: {
        id: rowId
      },
      data: {
        count: { increment: 1 }
      }
    })
  }
}
