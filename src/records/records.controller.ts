import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { CreateMultipleRecordDto } from './dto/create-multiple-record.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  create(
    @Body()
    createRecordDto: CreateRecordDto,
  ) {
    return this.recordsService.create(createRecordDto);
  }

  @Post('create-many')
  async createManyRecord(
    @Body()
    createMultipleRecordDto: CreateMultipleRecordDto,
  ) {
    return await this.recordsService.createMany(createMultipleRecordDto);
  }

  @Post('upload-json')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
      },
      fileFilter: (req, file, callback) => {
        if (!file.originalname.toLowerCase().endsWith('.json')) {
          return callback(
            new BadRequestException('Only .json files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadJsonFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    let raw: any;
    try {
      raw = JSON.parse(file.buffer.toString());
    } catch (err) {
      throw new BadRequestException('Invalid JSON structure');
    }

    const dto = new CreateMultipleRecordDto();
    dto.records = raw.records;

    const createMultipleRecordDto = plainToInstance(
      CreateMultipleRecordDto,
      dto,
    );

    const errors = await validate(createMultipleRecordDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors.toString());
    }

    return this.recordsService.createMany(createMultipleRecordDto);
  }

  @Get()
  findAll() {
    return this.recordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
    return this.recordsService.update(+id, updateRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordsService.remove(+id);
  }
}
