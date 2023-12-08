import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataRecord } from '../../domain/entities';
import { Module } from '@nestjs/common';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { DataRecordController } from './data-record.controller';
import { CsvModule } from 'nest-csv-parser';

@Module({
  imports: [CqrsModule, CsvModule, TypeOrmModule.forFeature([DataRecord])],
  controllers: [DataRecordController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class DataRecordModule {}
