import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CSVFileUploadCommand } from './commands';
import { UploadedRecordListDto, UploadedRecordListResDto } from './dto';
import { GetUploadedRecordListQuery } from './queries';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/')
export class DataRecordController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('uploaded-records')
  async getUploadedRecords(
    @Query() query: UploadedRecordListDto,
  ): Promise<UploadedRecordListResDto> {
    return this.queryBus.execute(new GetUploadedRecordListQuery(query));
  }

  @Post('csv-file')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file', {}))
  async handleUploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    if (!file) {
      throw new BadRequestException();
    }
    return this.commandBus.execute(
      new CSVFileUploadCommand(file.buffer.toString('base64')),
    );
  }
}
