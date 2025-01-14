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
  Query,
  DefaultValuePipe,
  ParseEnumPipe,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { CreateMultipleRecordDto } from './dto/create-multiple-record.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import * as xlsx from 'xlsx';

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

  @Post('upload-sheet')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
      },
      fileFilter: (req, file, callback) => {
        console.log(
          '🚀 ~ RecordsController ~ file.originalname:',
          file.originalname,
        );
        if (
          !file.originalname.toLowerCase().endsWith('.xlsx') &&
          !file.originalname.toLowerCase().endsWith('.xls')
        ) {
          return callback(
            new BadRequestException('Only .xlsx or .xls files are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadXlsxFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    let raw: any[];
    try {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      raw = xlsx.utils.sheet_to_json(worksheet);
    } catch (err) {
      throw new BadRequestException(
        `Failed to parse XLSX file: ${err.message}`,
      );
    }

    const dto = new CreateMultipleRecordDto();
    dto.records = raw;

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

  @Get('find-all')
  findAll(
    @Query(
      'createdAt',
      new DefaultValuePipe('desc'),
      new ParseEnumPipe(['asc', 'desc'], {
        optional: true,
        exceptionFactory: (errors) => {
          return new BadRequestException(
            `Invalid createdAt value: It must be one of the following: 'asc', 'desc'`,
          );
        },
      }),
    )
    createdAt?: 'asc' | 'desc',
    @Query('limit', new DefaultValuePipe(100)) limit?: number,
    @Query('offset', new DefaultValuePipe(0)) offset?: number,
    @Query('search') search?: string,
  ) {
    return this.recordsService.findAll(createdAt, limit, offset, search);
  }

  @Get('find-one/:id')
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(id);
  }

  @Patch('update-one/:id')
  update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
    return this.recordsService.update(id, updateRecordDto);
  }

  @Delete('delete-one/:id')
  remove(@Param('id') id: string) {
    return this.recordsService.remove(id);
  }
}
