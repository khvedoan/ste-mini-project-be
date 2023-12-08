import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import { DataSource } from 'typeorm';
import { CsvParser } from 'nest-csv-parser';
import { CSVRecordDto } from '../dto';
import { DataRecord } from '../../../domain/entities';
import { BadRequestException } from '@nestjs/common';

export class CSVFileUploadCommand {
  constructor(public readonly base64FileBuffer: string) {}
}

@CommandHandler(CSVFileUploadCommand)
export class CSVFileUploadCommandHandler
  implements ICommandHandler<CSVFileUploadCommand>
{
  constructor(
    private readonly csvParser: CsvParser,
    private dataSource: DataSource,
  ) {}

  async execute(command: CSVFileUploadCommand): Promise<void> {
    const buffer = Buffer.from(command.base64FileBuffer, 'base64');
    const dataStream = Readable.from(buffer);
    const parsedResult = await this.csvParser.parse(
      dataStream,
      CSVRecordDto,
      null,
      null,
      { strict: false, separator: ',' },
    );

    if (!parsedResult || !parsedResult.list.length) {
      throw new BadRequestException();
    }

    const newRecords = parsedResult.list.map(
      (record) =>
        new DataRecord({
          id: uuidv4(),
          recordId: parseInt(record.id, 10),
          postId: parseInt(record[Object.keys(record)[0]], 10),
          name: record.name,
          email: record.email,
          body: record.body,
        }),
    );

    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(DataRecord)
      .values(newRecords)
      .execute();
  }
}
