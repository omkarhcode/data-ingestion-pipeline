import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { PrismaService } from 'nestjs-prisma';
import { CreateMultipleRecordDto } from './dto/create-multiple-record.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RecordsService {
  constructor(private prisma: PrismaService) {}

  async create(createRecordDto: CreateRecordDto) {
    return this.prisma.ingestedData.create({
      data: createRecordDto,
    });
  }

  async createMany(createMultipleRecordDto: CreateMultipleRecordDto) {
    return await this.prisma.ingestedData.createMany({
      data: createMultipleRecordDto.records,
    });
  }

  async findAll(
    createdAt: 'asc' | 'desc',
    limit: number,
    offset: number,
    search: string,
  ) {
    console.log('In findAll');

    const whereClause: Prisma.IngestedDataWhereInput = {};
    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }
    const orderBy: Prisma.Enumerable<Prisma.IngestedDataOrderByWithRelationInput> =
      [];

    if (createdAt) {
      orderBy.push({ timestamp: createdAt });
    }

    try {
      const recordsCount = await this.prisma.ingestedData.count({
        where: whereClause,
      });

      const records = await this.prisma.ingestedData.findMany({
        skip: offset,
        take: limit,
        orderBy,
        where: whereClause,
      });
      return { recordsCount, records };
    } catch (error) {
      console.log('🚀 ~ RecordsService findALl ~ error:', error);
      if (error.meta?.cause) {
        throw new ForbiddenException(error.meta.cause);
      }
      throw new ForbiddenException(error.message);
    }
  }

  async findOne(id) {
    try {
      return await this.prisma.ingestedData.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.log('🚀 ~ RecordsService FindOne ~ error:', error);
      if (error.meta?.cause) {
        throw new ForbiddenException(error.meta.cause);
      }
      throw new ForbiddenException(error.message);
    }
  }

  async update(id, updateRecordDto: UpdateRecordDto) {
    try {
      return await this.prisma.ingestedData.update({
        where: {
          id,
        },
        data: updateRecordDto,
      });
    } catch (error) {
      console.log('🚀 ~ RecordsService Update one ~ error:', error);
      if (error.meta?.cause) {
        throw new ForbiddenException(error.meta.cause);
      }
      throw new ForbiddenException(error.message);
    }
  }

  async remove(id) {
    try {
      return await this.prisma.ingestedData.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      console.log('🚀 ~ RecordsService Delete one ~ error:', error);
      if (error.meta?.cause) {
        throw new ForbiddenException(error.meta.cause);
      }
      throw new ForbiddenException(error.message);
    }
  }
}
