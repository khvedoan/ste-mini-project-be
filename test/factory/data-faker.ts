import * as faker from 'faker';
import { UploadedRecord } from '../../src/modules/upload-record/dto';
import { DataRecord } from '../../src/domain/entities';

export const fakeDataRecord = (
  override?: Partial<DataRecord>,
): UploadedRecord => {
  return {
    id: faker.datatype.uuid(),
    postId: faker.datatype.number(),
    recordId: faker.datatype.number(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    email: faker.internet.email(),
    body: faker.datatype.string(),
    ...override,
  };
};
