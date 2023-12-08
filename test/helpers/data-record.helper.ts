import { EntityManager } from 'typeorm';
import { TestingModule } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { DataRecord } from '../../src/domain/entities';
import { fakeDataRecord } from '../factory';

export class DataRecordHelper {
  public readonly entityManager: EntityManager;

  public careId = uuidv4();

  public consumerId = uuidv4();

  constructor(module: TestingModule) {
    this.entityManager = module.get(getEntityManagerToken());
  }

  async createDataRecords(total: number): Promise<Partial<DataRecord>[]> {
    const records: Partial<DataRecord>[] = [];
    while (records.length < total) {
      records.push(new DataRecord(fakeDataRecord()));
    }

    await this.entityManager.getRepository(DataRecord).insert(records);

    return records;
  }

  async createDataRecord(
    override: Partial<DataRecord>,
  ): Promise<Partial<DataRecord>> {
    const record: Partial<DataRecord> = fakeDataRecord(override);

    await this.entityManager.getRepository(DataRecord).insert([record]);

    return record;
  }

  async getDataRecords(): Promise<DataRecord[]> {
    return this.entityManager.getRepository(DataRecord).find();
  }

  async clear(): Promise<void> {
    await this.entityManager.delete(DataRecord, {});
  }
}
