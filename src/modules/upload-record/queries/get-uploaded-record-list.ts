import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { UploadedRecordListDto, UploadedRecordListResDto } from '../dto';
import { DataRecord } from '../../../domain/entities';

export class GetUploadedRecordListQuery {
  constructor(public readonly filter: UploadedRecordListDto) {}
}

@QueryHandler(GetUploadedRecordListQuery)
export class GetUploadedRecordListQueryHandler
  implements IQueryHandler<GetUploadedRecordListQuery>
{
  constructor(private dataSource: DataSource) {}

  async execute(
    query: GetUploadedRecordListQuery,
  ): Promise<UploadedRecordListResDto> {
    const { page, limit, search } = query.filter;
    const recordQuery = this.dataSource.createQueryBuilder(
      DataRecord,
      'record',
    );

    if (search) {
      recordQuery.where(
        `(LOWER(record.name) LIKE LOWER(:search) OR LOWER(record.email) LIKE LOWER(:search))`,
        { search: `%${search}%` },
      );
    }

    const [records, total] = await recordQuery
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('record.createdAt', 'DESC')
      .getManyAndCount();

    return {
      page,
      pageSize: limit,
      pageCount: Math.ceil(total / limit),
      data: records,
    };
  }
}
