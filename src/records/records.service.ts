import { Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { PrismaService } from 'nestjs-prisma';
import { CreateMultipleRecordDto } from './dto/create-multiple-record.dto';

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

  findAll() {}

  findOne(id: number) {
    return `This action returns a #${id} record`;
  }

  update(id: number, updateRecordDto: UpdateRecordDto) {
    return `This action updates a #${id} record`;
  }

  remove(id: number) {
    return `This action removes a #${id} record`;
  }
}
